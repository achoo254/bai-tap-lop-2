import { slugifyVietnamese } from './lesson-slug-and-id';

/** Loại file media được phép đính kèm vào bài, theo đuôi file. */
export const ALLOWED_MEDIA_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  mp4: 'video/mp4',
  webm: 'video/webm',
} as const;

export type AllowedMediaExtension = keyof typeof ALLOWED_MEDIA_TYPES;

/** Giới hạn khi tải qua trang Soạn bài trên PC. */
export const EDITOR_MAX_MEDIA_BYTES = 50 * 1024 * 1024;
/** Giới hạn khi thêm qua MCP (Worker không nhận file lớn). */
export const MCP_MAX_MEDIA_BYTES = 10 * 1024 * 1024;

export function mediaExtensionOf(fileName: string): AllowedMediaExtension | null {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  return Object.hasOwn(ALLOWED_MEDIA_TYPES, extension)
    ? (extension as AllowedMediaExtension)
    : null;
}

export function extensionForMimeType(mimeType: string): AllowedMediaExtension | null {
  const normalized = mimeType.split(';')[0]?.trim().toLowerCase();
  const match = Object.entries(ALLOWED_MEDIA_TYPES).find(([, type]) => type === normalized);
  return match ? (match[0] as AllowedMediaExtension) : null;
}

/**
 * Tên file an toàn: không dấu, kebab-case, giữ đuôi hợp lệ.
 * Trả về null nếu đuôi file không được phép.
 */
export function toSafeMediaFileName(originalName: string): string | null {
  const extension = mediaExtensionOf(originalName);
  if (!extension) return null;
  const base = originalName.slice(0, originalName.length - extension.length - 1);
  return `${slugifyVietnamese(base).slice(0, 40) || 'tep'}.${extension}`;
}

/** Tránh trùng tên: anh.jpg → anh-2.jpg → anh-3.jpg. */
export function uniqueFileName(fileName: string, existing: Iterable<string>): string {
  const taken = new Set(existing);
  if (!taken.has(fileName)) return fileName;
  const dot = fileName.lastIndexOf('.');
  const base = fileName.slice(0, dot);
  const extension = fileName.slice(dot);
  for (let counter = 2; ; counter++) {
    const candidate = `${base}-${counter}${extension}`;
    if (!taken.has(candidate)) return candidate;
  }
}

/** Cú pháp Markdown để chèn file vào bài. */
export function markdownForMedia(fileName: string, description = ''): string {
  const isVideo = ALLOWED_MEDIA_TYPES[mediaExtensionOf(fileName) ?? 'jpg'].startsWith('video/');
  return `![${description || (isVideo ? 'video' : '')}](${fileName})`;
}
