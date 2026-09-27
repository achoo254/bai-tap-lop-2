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
}

/** Giao diện tối thiểu mà lớp nghiệp vụ cần; test dùng bản giả trong bộ nhớ. */
export interface LessonFileStore {
  /** Mã bài → danh sách tên file trong thư mục bài. */
  listLessonFiles(): Promise<Map<string, string[]>>;
  readText(path: string): Promise<string | null>;
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
    const response = await this.request(`contents/${encodePath(path)}?ref=${encodeURIComponent(this.config.branch)}`, {
      headers: { accept: 'application/vnd.github.raw+json' },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw await toApiError(response);
    return response.text();
  }

  async commit(request: CommitRequest): Promise<void> {
    // Tạo blob một lần; nếu nhánh vừa có commit khác (vd. trang Soạn bài) thì dựng lại tree trên commit mới.
    const blobs = await Promise.all(
      request.upserts.map(async (file) => ({ path: file.path, sha: await this.createBlob(file.content) })),
    );
    for (let attempt = 1; ; attempt++) {
      const parentSha = await this.headCommitSha();
      const parent = await this.api<{ tree: { sha: string } }>(`git/commits/${parentSha}`);
      const tree = await this.api<{ sha: string }>('git/trees', {
        method: 'POST',
        body: {
          base_tree: parent.tree.sha,
          tree: [
            ...blobs.map((blob) => ({ path: blob.path, mode: '100644', type: 'blob', sha: blob.sha })),
            ...request.deletes.map((path) => ({ path, mode: '100644', type: 'blob', sha: null })),
          ],
        },
      });
      const commit = await this.api<{ sha: string }>('git/commits', {
        method: 'POST',
        body: { message: request.message, tree: tree.sha, parents: [parentSha] },
      });
      const update = await this.request(`git/refs/heads/${encodeURIComponent(this.config.branch)}`, {
        method: 'PATCH',
        body: { sha: commit.sha, force: false },
      });
      if (update.ok) return;
      if (update.status !== 422 || attempt >= MAX_COMMIT_ATTEMPTS) throw await toApiError(update);
    }
  }

  private async headCommitSha(): Promise<string> {
    const response = await this.request(`git/ref/heads/${encodeURIComponent(this.config.branch)}`);
    if (response.status === 404 || response.status === 409) {
      throw new GitHubApiError(response.status, 'Repo GitHub chưa có nhánh chính. Hãy đẩy mã nguồn lên repo trước.');
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

  private request(path: string, init: { method?: string; body?: unknown; headers?: Record<string, string> } = {}) {
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
  return new GitHubApiError(response.status, `GitHub trả lỗi ${response.status}: ${message.slice(0, 200)}${hint}`);
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
