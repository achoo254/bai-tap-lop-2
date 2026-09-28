/**
 * apps/site/src/lib/game/media/zalo-voice.ts
 *
 * Giọng đọc Zalo AI (qua Worker /api/doc): có giọng miền Nam mà iPad không cài sẵn.
 * Tên giọng lưu trong tuỳ chọn "Người đọc" có dạng `zalo:<mã giọng>`.
 */

export interface ZaloVoice {
  id: string;
  speaker: number;
  label: string;
}

export const ZALO_VOICES: ZaloVoice[] = [
  { id: 'zalo:1', speaker: 1, label: 'Zalo · Nữ miền Nam' },
  { id: 'zalo:3', speaker: 3, label: 'Zalo · Nam miền Nam' },
  { id: 'zalo:2', speaker: 2, label: 'Zalo · Nữ miền Bắc' },
  { id: 'zalo:4', speaker: 4, label: 'Zalo · Nam miền Bắc' },
];

/** Worker chỉ nhận tối đa 500 ký tự; chia ngắn hơn để câu đầu phát nhanh. */
export const ZALO_CHUNK_LENGTH = 220;
const ZALO_SPEED = { min: 0.8, max: 1.2 } as const;

export function findZaloVoice(voiceName: string | null | undefined): ZaloVoice | undefined {
  return ZALO_VOICES.find((v) => v.id === voiceName);
}

/** Chia đoạn dài theo câu (rồi theo dấu phẩy, khoảng trắng) để mỗi phần không quá `max` ký tự. */
export function splitForSpeech(text: string, max = ZALO_CHUNK_LENGTH): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const sentences = clean.match(/[^.!?…]+[.!?…]*\s*/g) ?? [clean];
  const chunks: string[] = [];
  let current = '';

  const pushPiece = (piece: string) => {
    if ((current + piece).length <= max) {
      current += piece;
      return;
    }
    if (current.trim()) chunks.push(current.trim());
    current = '';
    if (piece.length <= max) {
      current = piece;
      return;
    }
    // Câu quá dài: cắt theo dấu phẩy, cuối cùng theo từ
    for (const part of piece.split(/(?<=[,;:])\s*/)) {
      if (part.length <= max) {
        if ((current + ' ' + part).trim().length > max && current.trim()) {
          chunks.push(current.trim());
          current = '';
        }
        current = `${current} ${part}`.trim();
      } else {
        for (const word of part.split(' ')) {
          if ((current + ' ' + word).trim().length > max && current.trim()) {
            chunks.push(current.trim());
            current = '';
          }
          current = `${current} ${word}`.trim();
        }
      }
    }
  };

  for (const sentence of sentences) pushPiece(sentence);
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** Đổi tốc độ giọng máy (khoảng 0,5–1,4) sang thang của Zalo (0,8–1,2). */
export function toZaloSpeed(rate: number): number {
  const scaled = rate / 0.9;
  return Math.round(Math.min(ZALO_SPEED.max, Math.max(ZALO_SPEED.min, scaled)) * 10) / 10;
}

export function zaloAudioUrl(speaker: number, speed: number, text: string): string {
  const params = new URLSearchParams({ giong: String(speaker), 'toc-do': speed.toFixed(1), 'noi-dung': text });
  return `/api/doc?${params.toString()}`;
}
