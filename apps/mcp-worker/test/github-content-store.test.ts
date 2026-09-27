import { describe, expect, it } from 'vitest';
import { base64ToBytes, bytesToBase64, ContentConflictError, GitHubContentStore } from '../src/github/github-content-store';

interface Call {
  method: string;
  url: string;
  body: unknown;
}

/** GitHub API giả: trả lời theo bảng tuyến đường và ghi lại mọi lời gọi. */
function fakeGitHub(routes: Record<string, (call: Call) => Response>) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input).replace('https://api.github.com/repos/me/bai/', '');
    const call = { method: init?.method ?? 'GET', url, body: init?.body ? JSON.parse(String(init.body)) : undefined };
    calls.push(call);
    const key = Object.keys(routes).find((route) => `${call.method} ${url}`.startsWith(route));
    if (!key) return new Response('{"message":"not found"}', { status: 404 });
    return routes[key]!(call);
  }) as typeof fetch;
  return { calls, store: new GitHubContentStore({ token: 't', owner: 'me', repo: 'bai', branch: 'main', fetchImpl }) };
}

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });

describe('GitHubContentStore', () => {
  it('liệt kê bài từ cây thư mục content/', async () => {
    const { store } = fakeGitHub({
      'GET git/ref/heads/main': () => json({ object: { sha: 'head' } }),
      'GET git/trees/head': () =>
        json({
          truncated: false,
          tree: [
            { path: 'content/2026-09-28-a/bai.md', type: 'blob' },
            { path: 'content/2026-09-28-a/anh.png', type: 'blob' },
            { path: 'content/.gitkeep', type: 'blob' },
            { path: 'content/khong-hop-le/bai.md', type: 'blob' },
            { path: 'apps/site/x.ts', type: 'blob' },
          ],
        }),
    });
    expect([...(await store.listLessonFiles()).entries()]).toEqual([['2026-09-28-a', ['bai.md', 'anh.png']]]);
  });

  it('commit: tạo blob, tree, commit rồi cập nhật nhánh; ảnh gửi dạng base64, xoá bằng sha null', async () => {
    const { calls, store } = fakeGitHub({
      'POST git/blobs': (call) => json({ sha: `blob-${(call.body as { encoding: string }).encoding}` }),
      'GET git/ref/heads/main': () => json({ object: { sha: 'head' } }),
      'GET git/commits/head': () => json({ tree: { sha: 'tree0' } }),
      'POST git/trees': () => json({ sha: 'tree1' }),
      'POST git/commits': () => json({ sha: 'commit1' }),
      'PATCH git/refs/heads/main': () => json({}),
    });
    await store.commit({
      message: 'thêm bài',
      upserts: [
        { path: 'content/x/bai.md', content: 'Xin chào' },
        { path: 'content/x/a.png', content: new Uint8Array([137, 80]) },
      ],
      deletes: ['content/x/cu.png'],
    });
    const tree = calls.find((call) => call.url === 'git/trees')!.body as { base_tree: string; tree: unknown[] };
    expect(tree.base_tree).toBe('tree0');
    expect(tree.tree).toEqual([
      { path: 'content/x/bai.md', mode: '100644', type: 'blob', sha: 'blob-utf-8' },
      { path: 'content/x/a.png', mode: '100644', type: 'blob', sha: 'blob-base64' },
      { path: 'content/x/cu.png', mode: '100644', type: 'blob', sha: null },
    ]);
    expect(calls.find((call) => call.method === 'PATCH')!.body).toEqual({ sha: 'commit1', force: false });
  });

  it('nhánh vừa bị người khác cập nhật thì dựng lại commit trên đầu mới', async () => {
    let refPatches = 0;
    const heads = ['head1', 'head2'];
    const { calls, store } = fakeGitHub({
      'POST git/blobs': () => json({ sha: 'blob' }),
      'GET git/ref/heads/main': () => json({ object: { sha: heads[Math.min(refPatches, 1)] } }),
      'GET git/commits/': () => json({ tree: { sha: 'tree' } }),
      'POST git/trees': () => json({ sha: 'tree1' }),
      'POST git/commits': () => json({ sha: 'c' }),
      'PATCH git/refs/heads/main': () => (++refPatches === 1 ? json({ message: 'not fast forward' }, 422) : json({})),
    });
    await store.commit({ message: 'm', upserts: [{ path: 'content/x/bai.md', content: 'a' }], deletes: [] });
    expect(refPatches).toBe(2);
    const parents = calls.filter((call) => call.url === 'git/commits').map((call) => (call.body as { parents: string[] }).parents[0]);
    expect(parents).toEqual(['head1', 'head2']);
  });

  it('đọc file trả null khi không có; báo lỗi rõ khi token thiếu quyền', async () => {
    const { store } = fakeGitHub({ 'GET contents/content/a/bai.md': () => json({ message: 'Bad credentials' }, 401) });
    await expect(store.readText('content/a/bai.md')).rejects.toThrow('thiếu quyền');
    expect(await store.readText('content/khong/bai.md')).toBeNull();
  });

  it('nhánh đã có commit đụng tới bài đang ghi thì báo xung đột, không ghi', async () => {
    const { calls, store } = fakeGitHub({
      'POST git/blobs': () => json({ sha: 'blob' }),
      'GET git/ref/heads/main': () => json({ object: { sha: 'head2' } }),
      'GET compare/head1...head2': () => json({ files: [{ filename: 'content/x/bai.md' }] }),
    });
    await expect(
      store.commit({
        message: 'm',
        upserts: [{ path: 'content/x/bai.md', content: 'a' }],
        deletes: [],
        baseSha: 'head1',
        guardPaths: ['content/x/'],
      }),
    ).rejects.toBeInstanceOf(ContentConflictError);
    expect(calls.some((call) => call.method === 'PATCH')).toBe(false);
  });

  it('đọc nhiều file bằng một truy vấn GraphQL', async () => {
    let body: { query: string; variables: unknown } | undefined;
    const fetchImpl = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      body = JSON.parse(String(init?.body));
      return json({ data: { repository: { f0: { text: 'bài A' }, f1: null } } });
    }) as typeof fetch;
    const store = new GitHubContentStore({ token: 't', owner: 'me', repo: 'bai', branch: 'main', fetchImpl });
    const result = await store.readTexts(['content/a/bai.md', 'content/b/bai.md']);
    expect([...result.entries()]).toEqual([
      ['content/a/bai.md', 'bài A'],
      ['content/b/bai.md', null],
    ]);
    expect(body?.query).toContain('"main:content/a/bai.md"');
    expect(body?.variables).toEqual({ owner: 'me', name: 'bai' });
  });

  it('mã hoá base64 hai chiều', () => {
    const bytes = new Uint8Array(70_000).map((_, index) => index % 256);
    expect(base64ToBytes(bytesToBase64(bytes))).toEqual(bytes);
    expect(base64ToBytes('data:image/png;base64,iVBO')).toEqual(new Uint8Array([137, 80, 78]));
  });
});
