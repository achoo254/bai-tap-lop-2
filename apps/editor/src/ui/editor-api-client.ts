import type { LessonIssue } from 'lesson-core';

/** Gọi API của server trang Soạn bài; lỗi được đổi thành EditorApiError có thông điệp tiếng Việt. */

export interface LessonSummary {
  id: string;
  tieu_de: string;
  ngay: string;
  mon: string;
  nhap: boolean;
  soLoi: number;
}

export interface LessonDetail {
  id: string;
  frontmatter: { tieu_de?: string; ngay?: string; mon?: string; nhap?: boolean; ma_xem_truoc?: string };
  deBai: string;
  loiGiai: string;
  files: { name: string; size: number }[];
  version: string;
}

export interface SaveLessonRequest {
  originalId: string | null;
  baseVersion: string | null;
  draftKey: string;
  tieu_de: string;
  ngay: string;
  mon: string;
  nhap: boolean;
  deBai: string;
  loiGiai: string;
}

export interface GitCommitResult {
  committed: boolean;
  pushed: boolean;
  message: string;
}

export interface SaveLessonResponse {
  id: string;
  frontmatter: { ma_xem_truoc: string; nhap: boolean };
  warnings: LessonIssue[];
  git: GitCommitResult;
  linkXemTruoc: string | null;
}

export class EditorApiError extends Error {
  constructor(
    message: string,
    readonly issues: LessonIssue[] = [],
  ) {
    super(message);
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new EditorApiError(body.loi ?? `Lỗi ${response.status}`, body.chiTiet ?? []);
  return body as T;
}

const json = (method: string, data: unknown): RequestInit => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(data),
});

export const editorApi = {
  status: () => request<{ coGithub: boolean; siteUrl: string | null }>('/api/trang-thai'),
  sync: () => request<{ ok: boolean; message: string }>('/api/dong-bo', { method: 'POST' }),
  list: () => request<LessonSummary[]>('/api/bai'),
  get: (id: string) => request<LessonDetail>(`/api/bai/${encodeURIComponent(id)}`),
  save: (data: SaveLessonRequest) => request<SaveLessonResponse>('/api/bai', json('PUT', data)),
  remove: (id: string) => request<{ git: GitCommitResult }>(`/api/bai/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  upload(file: File, draftKey: string, lessonId: string | null) {
    const form = new FormData();
    form.set('file', file);
    form.set('draftKey', draftKey);
    if (lessonId) form.set('lessonId', lessonId);
    return request<{ fileName: string }>('/api/tai-len', { method: 'POST', body: form });
  },
};
