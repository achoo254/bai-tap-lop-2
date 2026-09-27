import OAuthProvider from '@cloudflare/workers-oauth-provider';
import { GitHubOAuthHandler } from './auth/github-oauth-handler';
import { LessonMcpAgent } from './mcp/lesson-mcp-agent';

/**
 * Điểm vào Worker: `/mcp` yêu cầu token OAuth hợp lệ (Claude connector tự lấy qua /authorize).
 * Các đường dẫn khác do trang đăng nhập GitHub xử lý.
 */
export { LessonMcpAgent };

const MCP_PATH = '/mcp';
let provider: OAuthProvider<Env> | null = null;

/** Tạo provider ở request đầu tiên để lấy đúng địa chỉ công khai của Worker (dev hoặc production). */
function oauthProvider(request: Request): OAuthProvider<Env> {
  provider ??= new OAuthProvider<Env>({
    apiRoute: MCP_PATH,
    apiHandler: LessonMcpAgent.serve(MCP_PATH),
    defaultHandler: GitHubOAuthHandler as unknown as ExportedHandler<Env>,
    authorizeEndpoint: '/authorize',
    tokenEndpoint: '/token',
    clientRegistrationEndpoint: '/register',
    resourceMetadata: {
      resource: new URL(MCP_PATH, request.url).href,
      resource_name: 'Góc học tập của bé',
    },
  });
  return provider;
}

export default {
  fetch(request, env, ctx) {
    return oauthProvider(request).fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
