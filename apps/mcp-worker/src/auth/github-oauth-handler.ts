import type { AuthRequest, OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import { Hono } from 'hono';
import type { McpUserProps } from '../mcp/lesson-mcp-agent';
import {
  addApprovedClient,
  bindStateToSession,
  createOAuthState,
  generateCSRFProtection,
  isClientApproved,
  OAuthError,
  renderApprovalDialog,
  validateCSRFToken,
  validateOAuthState,
} from './workers-oauth-utils';

/**
 * Đăng nhập bằng GitHub cho connector MCP của Claude (phỏng theo mẫu remote-mcp-github-oauth của
 * Cloudflare, giấy phép MIT). Khác mẫu: chỉ cho phép đúng một tài khoản GitHub (ALLOWED_GITHUB_LOGIN)
 * và không lưu token GitHub của người dùng — việc ghi bài dùng token riêng chỉ có quyền trên repo bài tập.
 */
type Bindings = Env & { OAUTH_PROVIDER: OAuthHelpers };

const app = new Hono<{ Bindings: Bindings }>();

app.get('/authorize', async (c) => {
  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);
  if (!oauthReqInfo.clientId) return c.text('Yêu cầu không hợp lệ', 400);

  if (await isClientApproved(c.req.raw, oauthReqInfo.clientId, c.env.COOKIE_ENCRYPTION_KEY)) {
    const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);
    const { setCookie } = await bindStateToSession(stateToken);
    return redirectToGithub(c.req.raw, c.env, stateToken, { 'Set-Cookie': setCookie });
  }

  const { token: csrfToken, setCookie } = generateCSRFProtection();
  return renderApprovalDialog(c.req.raw, {
    client: await c.env.OAUTH_PROVIDER.lookupClient(oauthReqInfo.clientId),
    csrfToken,
    server: {
      name: 'Góc học tập của bé',
      description:
        'Cho phép AI soạn, xem trước và đăng bài tập lên web của bé. Chỉ tài khoản của phụ huynh được đăng nhập.',
    },
    setCookie,
    state: { oauthReqInfo },
  });
});

app.post('/authorize', async (c) => {
  try {
    const formData = await c.req.raw.formData();
    validateCSRFToken(formData, c.req.raw);
    const encodedState = formData.get('state');
    if (typeof encodedState !== 'string') return c.text('Thiếu dữ liệu state', 400);
    let state: { oauthReqInfo?: AuthRequest };
    try {
      state = JSON.parse(atob(encodedState));
    } catch {
      return c.text('Dữ liệu state không hợp lệ', 400);
    }
    if (!state.oauthReqInfo?.clientId) return c.text('Yêu cầu không hợp lệ', 400);

    const approvedCookie = await addApprovedClient(
      c.req.raw,
      state.oauthReqInfo.clientId,
      c.env.COOKIE_ENCRYPTION_KEY,
    );
    const { stateToken } = await createOAuthState(state.oauthReqInfo, c.env.OAUTH_KV);
    const { setCookie: sessionCookie } = await bindStateToSession(stateToken);
    const headers = new Headers();
    headers.append('Set-Cookie', approvedCookie);
    headers.append('Set-Cookie', sessionCookie);
    return redirectToGithub(c.req.raw, c.env, stateToken, headers);
  } catch (error) {
    if (error instanceof OAuthError) return error.toResponse();
    console.error('[oauth] POST /authorize', error);
    return c.text('Lỗi máy chủ', 500);
  }
});

app.get('/callback', async (c) => {
  let oauthReqInfo: AuthRequest;
  let clearSessionCookie: string;
  try {
    const result = await validateOAuthState(c.req.raw, c.env.OAUTH_KV);
    oauthReqInfo = result.oauthReqInfo;
    clearSessionCookie = result.clearCookie;
  } catch (error) {
    if (error instanceof OAuthError) return error.toResponse();
    return c.text('Lỗi máy chủ', 500);
  }
  if (!oauthReqInfo.clientId) return c.text('Yêu cầu không hợp lệ', 400);

  const accessToken = await exchangeCodeForToken(
    c.env,
    c.req.query('code'),
    new URL('/callback', c.req.url).href,
  );
  if (!accessToken) return c.text('Không đăng nhập được GitHub', 400);
  const login = await fetchGithubLogin(accessToken);
  if (!login || login.toLowerCase() !== c.env.ALLOWED_GITHUB_LOGIN.toLowerCase()) {
    return c.text('Tài khoản GitHub này không có quyền soạn bài cho bé.', 403);
  }

  const props: McpUserProps = { login: c.env.ALLOWED_GITHUB_LOGIN };
  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    request: oauthReqInfo,
    userId: login,
    metadata: { label: login },
    scope: oauthReqInfo.scope,
    props,
  });
  const headers = new Headers({ Location: redirectTo });
  if (clearSessionCookie) headers.set('Set-Cookie', clearSessionCookie);
  return new Response(null, { status: 302, headers });
});

function redirectToGithub(
  request: Request,
  env: Env,
  stateToken: string,
  headers: HeadersInit = {},
): Response {
  const upstream = new URL('https://github.com/login/oauth/authorize');
  upstream.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  upstream.searchParams.set('redirect_uri', new URL('/callback', request.url).href);
  upstream.searchParams.set('scope', 'read:user');
  upstream.searchParams.set('state', stateToken);
  upstream.searchParams.set('response_type', 'code');
  const responseHeaders = new Headers(headers);
  responseHeaders.set('location', upstream.href);
  return new Response(null, { status: 302, headers: responseHeaders });
}

async function exchangeCodeForToken(
  env: Env,
  code: string | undefined,
  redirectUri: string,
): Promise<string | null> {
  if (!code) return null;
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }).toString(),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { access_token?: string };
  return body.access_token ?? null;
}

async function fetchGithubLogin(accessToken: string): Promise<string | null> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: 'application/vnd.github+json',
      'user-agent': 'bai-tap-lop-2-mcp',
    },
  });
  if (!response.ok) return null;
  return ((await response.json()) as { login?: string }).login ?? null;
}

export { app as GitHubOAuthHandler };
