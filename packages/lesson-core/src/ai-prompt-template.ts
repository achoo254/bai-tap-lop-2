import { familyNamesHint } from './child-profile';
import { ILLUSTRATION_CATALOG, ILLUSTRATION_NAMES, MAX_ILLUSTRATION_COUNT } from './illustration-catalog';

/**
 * Hướng dẫn định dạng nội dung bài cho AI. Dùng ở hai nơi:
 * - nút "Sao chép prompt mẫu" của trang Soạn bài (dán vào ChatGPT/Claude);
 * - mô tả tool của MCP để Claude tự soạn đúng định dạng.
 */
export const LESSON_FORMAT_GUIDE = [
  'Nội dung viết bằng Markdown, tiếng Việt chuẩn, dấu dựng sẵn (NFC), đặt dấu kiểu mới: hoà, khoẻ, thuỷ.',
  'Viết hoa chữ cái đầu mỗi câu và sau dấu chấm; kết thúc câu bằng dấu chấm, chấm hỏi hoặc chấm than.',
  'Ý nhỏ "a) ...", "b) ..." và dòng bắt đầu bằng "..." (chỗ trống cần điền) không bắt buộc viết hoa.',
  'Chữ cố ý viết thường (vd. vần cần điền) đặt trong dấu `...`.',
  'Ảnh hoặc video (mp4) đứng riêng một dòng: ![mô tả](ten-file.jpg).',
  'Video YouTube: dán link đứng riêng một dòng.',
  `Hình minh hoạ đếm được: dòng riêng ::hinh{loai=<tên> so-luong=<1-${MAX_ILLUSTRATION_COUNT}>}, vd. ::hinh{loai=tao so-luong=5}.`,
].join('\n');

export function illustrationListText(): string {
  return ILLUSTRATION_NAMES.map((name) => `${name} (${ILLUSTRATION_CATALOG[name].label})`).join(', ');
}

/** Prompt đầy đủ để phụ huynh dán vào ChatGPT/Claude rồi chép kết quả vào trang Soạn bài. */
export function buildLessonAuthoringPrompt(topic = '<chủ đề, vd. cộng có nhớ trong phạm vi 100>'): string {
  return `Bạn là giáo viên tiểu học. Hãy soạn một bài tập cho học sinh lớp 2 (chương trình GDPT 2018) về: ${topic}.
Bé sẽ nhìn bài trên màn hình rồi chép vào vở ô li, nên câu chữ ngắn gọn, rõ ràng, trình bày chuẩn chính tả.

Trả lời ĐÚNG định dạng sau, không thêm lời dẫn nào khác:

TIÊU ĐỀ: <tiêu đề ngắn>
MÔN: <toan | tieng-viet | khac>

## Đề bài

<nội dung đề>

## Lời giải

<lời giải từng bước, có đáp số>

Quy tắc trình bày:
${LESSON_FORMAT_GUIDE}

${familyNamesHint()}

Các loại hình minh hoạ có sẵn: ${illustrationListText()}.`;
}

export interface AiLessonReply {
  tieuDe: string | null;
  mon: 'toan' | 'tieng-viet' | 'khac' | null;
  deBai: string;
  loiGiai: string;
}

/**
 * Tách câu trả lời AI (theo prompt mẫu) thành các ô của trang Soạn bài.
 * Chịu được lời dẫn thừa, khối ```markdown bao ngoài và tiêu đề viết khác hoa/thường.
 */
export function parseAiLessonReply(reply: string): AiLessonReply {
  const text = reply.replace(/\r\n?/g, '\n').replace(/^```[\w-]*\n([\s\S]*?)\n```\s*$/m, '$1').normalize('NFC');
  const tieuDe = /^\s*\**TIÊU ĐỀ\s*:?\s*\**\s*:?\s*(.+)$/imu.exec(text)?.[1]?.trim().replace(/\*+$/, '').trim() ?? null;
  const monRaw = /^\s*\**MÔN\s*:?\s*\**\s*:?\s*(.+)$/imu.exec(text)?.[1]?.trim().toLowerCase() ?? '';
  const mon = monRaw.includes('toan') || monRaw.includes('toán')
    ? 'toan'
    : monRaw.includes('tieng') || monRaw.includes('tiếng')
      ? 'tieng-viet'
      : monRaw
        ? 'khac'
        : null;

  const headings = [...text.matchAll(/^#{1,3}\s*(Đề bài|Lời giải)\s*#*\s*$/gimu)];
  const sectionText = (name: string) => {
    const index = headings.findIndex((match) => match[1]!.toLowerCase() === name);
    if (index === -1) return '';
    const start = headings[index]!.index! + headings[index]![0].length;
    const end = headings[index + 1]?.index ?? text.length;
    return text.slice(start, end).trim();
  };
  const deBai = headings.length > 0 ? sectionText('đề bài') : text.trim();
  return { tieuDe, mon, deBai, loiGiai: sectionText('lời giải') };
}
