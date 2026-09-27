/**
 * Chuẩn hoá chữ tiếng Việt:
 * - Unicode NFC (dấu dựng sẵn) để font vẽ dấu đúng vị trí.
 * - Kiểu đặt dấu thanh "mới" theo SGK hiện hành với vần mở oa, oe, uy: hoà, khoẻ, thuỷ
 *   (kiểu cũ: hòa, khỏe, thủy). Vần có âm cuối (hoàng, thuyền) không bị ảnh hưởng.
 */

/** Dấu thanh dạng tổ hợp: huyền, sắc, hỏi, ngã, nặng. */
const TONE_MARKS = '̣̀́̉̃';

// Làm việc trên dạng NFD: nguyên âm + dấu thanh tách rời.
// Kiểu cũ: dấu nằm trên o/u, vd. "hòa". Không áp dụng sau "q" (quý luôn đặt dấu trên y).
const OLD_STYLE_PATTERN = new RegExp(
  `(?<![qQ])(?:([oO])([${TONE_MARKS}])([aAeE])|([uU])([${TONE_MARKS}])([yY]))(?![\\p{L}\\p{M}])`,
  'gu',
);
// Kiểu mới: dấu nằm trên a/e/y, vd. "hoà".
const NEW_STYLE_PATTERN = new RegExp(
  `(?<![qQ])(?:[oO][aAeE]|[uU][yY])[${TONE_MARKS}](?![\\p{L}\\p{M}])`,
  'gu',
);

export function isNfc(text: string): boolean {
  return text === text.normalize('NFC');
}

export function toNfc(text: string): string {
  return text.normalize('NFC');
}

export interface ToneStyleUsage {
  oldStyleWords: string[];
  newStyleCount: number;
}

/** Liệt kê các từ viết theo kiểu dấu cũ và đếm số chỗ viết kiểu mới. */
export function detectToneStyleUsage(text: string): ToneStyleUsage {
  const decomposed = text.normalize('NFD');
  const oldStyleWords = new Set<string>();
  for (const match of decomposed.matchAll(OLD_STYLE_PATTERN)) {
    oldStyleWords.add(extractWordAround(decomposed, match.index).normalize('NFC'));
  }
  const newStyleCount = [...decomposed.matchAll(NEW_STYLE_PATTERN)].length;
  return { oldStyleWords: [...oldStyleWords], newStyleCount };
}

/** Chuyển dấu thanh kiểu cũ sang kiểu mới rồi trả về dạng NFC. */
export function toNewToneStyle(text: string): string {
  return text
    .normalize('NFD')
    .replace(
      OLD_STYLE_PATTERN,
      (_match, o?: string, oTone?: string, ae?: string, u?: string, uTone?: string, y?: string) =>
        o !== undefined ? `${o}${ae}${oTone}` : `${u}${y}${uTone}`,
    )
    .normalize('NFC');
}

/** Sửa tự động mọi vấn đề chuẩn hoá có thể sửa an toàn. */
export function autoFixVietnameseText(text: string): string {
  return toNewToneStyle(text.replace(/\r\n?/g, '\n'));
}

function extractWordAround(text: string, index: number): string {
  let start = index;
  let end = index;
  while (start > 0 && /[\p{L}\p{M}]/u.test(text[start - 1] ?? '')) start--;
  while (end < text.length && /[\p{L}\p{M}]/u.test(text[end] ?? '')) end++;
  return text.slice(start, end);
}
