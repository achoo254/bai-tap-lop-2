/** Mã thư mục bài: `<YYYY-MM-DD>-<slug>`, chỉ chữ thường không dấu, số và gạch nối. */
export const LESSON_ID_PATTERN = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const MAX_SLUG_LENGTH = 60;

/** Bỏ dấu tiếng Việt và chuyển sang dạng kebab-case, vd. "Cộng có nhớ" → "cong-co-nho". */
export function slugifyVietnamese(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '');
  return slug || 'bai';
}

export function buildLessonId(ngay: string, tieuDe: string): string {
  return `${ngay}-${slugifyVietnamese(tieuDe)}`;
}

export function isValidLessonId(id: string): boolean {
  return LESSON_ID_PATTERN.test(id);
}

/** Mã ngẫu nhiên cho link xem trước bài nháp; đủ dài để không đoán được. */
export function generatePreviewCode(length = 12): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
}
