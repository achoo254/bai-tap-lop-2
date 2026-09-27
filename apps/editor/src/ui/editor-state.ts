import { generatePreviewCode } from 'lesson-core';

/** Trạng thái của bài đang soạn trên trang. */
export interface EditorState {
  /** Mã bài đang sửa; null nếu là bài mới chưa lưu. */
  originalId: string | null;
  /** Phiên bản bai.md lúc mở, để server phát hiện bài bị sửa ở nơi khác. */
  baseVersion: string | null;
  /** Mã phiên soạn: file tải lên được giữ tạm dưới mã này tới khi lưu. */
  draftKey: string;
  /** File vừa tải lên, chưa lưu vào bài. */
  stagedFiles: Set<string>;
  /** File đã có trong thư mục bài. */
  lessonFiles: Set<string>;
  /** Ô soạn được chọn gần nhất, nơi các nút chèn sẽ chèn vào. */
  activeTextarea: HTMLTextAreaElement | null;
  dirty: boolean;
}

export function createEditorState(): EditorState {
  return {
    originalId: null,
    baseVersion: null,
    draftKey: generatePreviewCode(16),
    stagedFiles: new Set(),
    lessonFiles: new Set(),
    activeTextarea: null,
    dirty: false,
  };
}

/** URL xem file trong khung xem trước: file vừa tải lên nằm ở thư mục tạm. */
export function mediaUrlFor(state: EditorState, fileName: string): string {
  if (state.stagedFiles.has(fileName)) {
    return `/media-tam/${state.draftKey}/${encodeURIComponent(fileName)}`;
  }
  return state.originalId ? `/media/${state.originalId}/${encodeURIComponent(fileName)}` : '';
}

/** Chèn một khối (ảnh, video, hình đếm...) thành dòng riêng tại vị trí con trỏ. */
export function insertBlockAtCursor(textarea: HTMLTextAreaElement, block: string): void {
  const { selectionStart, selectionEnd, value } = textarea;
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const prefix = before === '' || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
  const suffix = after.startsWith('\n') ? '\n' : '\n\n';
  const inserted = `${prefix}${block}${suffix}`;
  textarea.value = before + inserted + after;
  const caret = before.length + inserted.length;
  textarea.setSelectionRange(caret, caret);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  textarea.focus();
}

export function tomorrowIsoDate(now = new Date()): string {
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(tomorrow);
}
