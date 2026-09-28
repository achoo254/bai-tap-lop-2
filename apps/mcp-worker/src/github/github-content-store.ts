import { isValidLessonId } from 'lesson-core';

/**
 * Đọc/ghi thư mục `content/` trong GitHub repo qua REST API.
 * Mọi thay đổi của một thao tác (bài + file media) nằm trong đúng một commit.
 */

export interface FileUpsert {
  path: string;
  content: string | Uint8Array;
}

export interface CommitRequest {
  message: string;
  upserts: FileUpsert[];
  deletes: string[];
  /** Commit mà nội dung đã đọc dựa trên; dùng để phát hiện nơi khác vừa sửa cùng bài. */
  baseSha?: string;
  /** Thư mục/file không được phép thay đổi kể từ `baseSha` (vd. `content/<mã-bài>/`). */
  guardPaths?: string[];
}

/** Nơi khác (trang Soạn bài, lần gọi trước) vừa sửa đúng bài đang ghi. */
export class ContentConflictError extends Error {
  constructor(readonly paths: string[]) {
    super(
      'Bài vừa được sửa ở nơi khác (trang Soạn bài hoặc một lần sửa khác). Hãy đọc lại bài bằng get_lesson rồi làm lại.',
    );
  }
}

/** Giao diện tối thiểu mà lớp nghiệp vụ cần; test dùng bản giả trong bộ nhớ. */
export interface LessonFileStore {
  /** Commit mới nhất của nhánh; lấy TRƯỚC khi đọc để ghi có thể phát hiện xung đột. */
  headSha(): Promise<string>;
  /** Mã bài → danh sách tên file trong thư mục bài. */
  listLessonFiles(): Promise<Map<string, string[]>>;
  readText(path: string): Promise<string | null>;
  /** Đọc nhiều file chữ trong một lần gọi. */
  readTexts(paths: string[]): Promise<Map<string, string | null>>;
  commit(request: CommitRequest): Promise<void>;
}

export interface GitHubStoreConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  /** Cho phép test thay fetch. */
  fetchImpl?: typeof fetch;
}

export class GitHubApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const MAX_COMMIT_ATTEMPTS = 3;

export class GitHubContentStore implements LessonFileStore {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: GitHubStoreConfig) {
    this.fetchImpl = config.fetchImpl ?? fetch.bind(globalThis);
  }

  headSha(): Promise<string> {
    return this.headCommitSha();
  }

  async listLessonFiles(): Promise<Map<string, string[]>> {
    const headSha = await this.headCommitSha();
    const tree = await this.api<{ tree: { path: string; type: string }[]; truncated: boolean }>(
      `git/trees/${headSha}?recursive=1`,
    );
    const lessons = new Map<string, string[]>();
    for (const entry of tree.tree) {
      if (entry.type !== 'blob' || !entry.path.startsWith('content/')) continue;
      const [, id, fileName, ...rest] = entry.path.split('/');
      if (!id || !fileName || rest.length > 0 || !isValidLessonId(id)) continue;
      const files = lessons.get(id) ?? [];
      files.push(fileName);
      lessons.set(id, files);
    }
    return lessons;
  }

  async readText(path: string): Promise<string | null> {
    const response = await this.request(
      `contents/${encodePath(path)}?ref=${encodeURIComponent(this.config.branch)}`,
      {
        headers: { accept: 'application/vnd.github.raw+json' },
      },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw await toApiError(response);
    return response.text();
  }

  /** Đọc nhiều file bằng một truy vấn GraphQL (tránh gọi API từng file). */
  async readTexts(paths: string[]): Promise<Map<string, string | null>> {
    const result = new Map<string, string | null>();
    if (paths.length === 0) return result;
    const { owner, repo, branch, token } = this.config;
    const fields = paths
      .map(
        (path, index) =>
          `f${index}: object(expression: ${JSON.stringify(`${branch}:${path}`)}) { ... on Blob { text } }`,
      )
      .join(' ');
    const response = await this.fetchImpl('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        'user-agent': 'bai-tap-lop-2-mcp',
      },
      body: JSON.stringify({
        query: `query($owner: String!, $name: String!) { repository(owner: $owner, name: $name) { ${fields} } }`,
        variables: { owner, name: repo },
      }),
    });
    if (!response.ok) throw await toApiError(response);
    const body = (await response.json()) as {
      data?: { repository?: Record<string, { text?: string | null } | null> };
      errors?: { message: string }[];
    };
    if (!body.data?.repository) {
      throw new GitHubApiError(
        502,
        `GitHub GraphQL lỗi: ${body.errors?.map((e) => e.message).join('; ') ?? 'không rõ'}`,
      );
    }
    paths.forEach((path, index) =>
      result.set(path, body.data!.repository![`f${index}`]?.text ?? null),
    );
    return result;
  }

  async commit(request: CommitRequest): Promise<void> {
    // Tạo blob một lần; nếu nhánh vừa có commit khác (vd. trang Soạn bài) thì dựng lại tree trên commit mới.
    const blobs = await Promise.all(
      request.upserts.map(async (file) => ({
        path: file.path,
        sha: await this.createBlob(file.content),
      })),
    );
    let checkedSha = request.baseSha;
    for (let attempt = 1; ; attempt++) {
      const parentSha = await this.headCommitSha();
      if (checkedSha && checkedSha !== parentSha && request.guardPaths?.length) {
        await this.assertUntouched(checkedSha, parentSha, request.guardPaths);
        checkedSha = parentSha;
      }
      const parent = await this.api<{ tree: { sha: string } }>(`git/commits/${parentSha}`);
      const tree = await this.api<{ sha: string }>('git/trees', {
        method: 'POST',
        body: {
          base_tree: parent.tree.sha,
          tree: [
            ...blobs.map((blob) => ({
              path: blob.path,
              mode: '100644',
              type: 'blob',
              sha: blob.sha,
            })),
            ...request.deletes.map((path) => ({ path, mode: '100644', type: 'blob', sha: null })),
          ],
        },
      });
      const commit = await this.api<{ sha: string }>('git/commits', {
        method: 'POST',
        body: { message: request.message, tree: tree.sha, parents: [parentSha] },
      });
      const update = await this.request(
        `git/refs/heads/${encodeURIComponent(this.config.branch)}`,
        {
          method: 'PATCH',
          body: { sha: commit.sha, force: false },
        },
      );
      if (update.ok) return;
      if (update.status !== 422 || attempt >= MAX_COMMIT_ATTEMPTS) throw await toApiError(update);
    }
  }

  /** Ném ContentConflictError nếu giữa hai commit có file nằm trong `guardPaths` bị đổi. */
  private async assertUntouched(
    fromSha: string,
    toSha: string,
    guardPaths: string[],
  ): Promise<void> {
    const comparison = await this.api<{
      files?: { filename: string; previous_filename?: string }[];
    }>(`compare/${fromSha}...${toSha}`);
    const touched = (comparison.files ?? [])
      .flatMap((file) => [file.filename, file.previous_filename ?? ''])
      .filter(
        (name) => name && guardPaths.some((guard) => name === guard || name.startsWith(guard)),
      );
    if (touched.length > 0) throw new ContentConflictError(touched);
  }

  private async headCommitSha(): Promise<string> {
    const response = await this.request(`git/ref/heads/${encodeURIComponent(this.config.branch)}`);
    if (response.status === 404 || response.status === 409) {
      throw new GitHubApiError(
        response.status,
        'Repo GitHub chưa có nhánh chính. Hãy đẩy mã nguồn lên repo trước.',
      );
    }
    if (!response.ok) throw await toApiError(response);
    return ((await response.json()) as { object: { sha: string } }).object.sha;
  }

  private async createBlob(content: string | Uint8Array): Promise<string> {
    const body =
      typeof content === 'string'
        ? { content, encoding: 'utf-8' }
        : { content: bytesToBase64(content), encoding: 'base64' };
    return (await this.api<{ sha: string }>('git/blobs', { method: 'POST', body })).sha;
  }

  private async api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
    const response = await this.request(path, init);
    if (!response.ok) throw await toApiError(response);
    return (await response.json()) as T;
  }

  private request(
    path: string,
    init: { method?: string; body?: unknown; headers?: Record<string, string> } = {},
  ) {
    const { owner, repo, token } = this.config;
    return this.fetchImpl(`https://api.github.com/repos/${owner}/${repo}/${path}`, {
      method: init.method ?? 'GET',
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'user-agent': 'bai-tap-lop-2-mcp',
        'x-github-api-version': '2022-11-28',
        ...(init.body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...init.headers,
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  }
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

async function toApiError(response: Response): Promise<GitHubApiError> {
  const text = await response.text().catch(() => '');
  let message = text;
  try {
    message = (JSON.parse(text) as { message?: string }).message ?? text;
  } catch {
    // Giữ nguyên văn bản.
  }
  const hint =
    response.status === 401 || response.status === 403
      ? ' (token GitHub hết hạn hoặc thiếu quyền Contents: read/write)'
      : '';
  return new GitHubApiError(
    response.status,
    `GitHub trả lỗi ${response.status}: ${message.slice(0, 200)}${hint}`,
  );
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64.replace(/^data:[^;]+;base64,/, '').replace(/\s+/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return bytes;
}
