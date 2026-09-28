import {
  serializeLesson,
  validateLessonSource,
  type LessonIssue,
  type LessonSubject,
  type LessonValidationResult,
} from 'lesson-core';
import { renderLessonBlocksToHtml } from 'lesson-core/render';
import { mediaUrlFor, type EditorState } from './editor-state';

/** Giá trị các ô trong form soạn bài. */
export interface LessonFormValues {
  tieu_de: string;
  ngay: string;
  mon: string;
  deBai: string;
  loiGiai: string;
}

export interface PreviewElements {
  title: HTMLElement;
  deBai: HTMLElement;
  loiGiai: HTMLElement;
  validation: HTMLElement;
}

/** Kiểm tra bài bằng đúng bộ quy tắc của web, trên máy, không cần gọi server. */
export function validateForm(values: LessonFormValues, state: EditorState): LessonValidationResult {
  const source = serializeLesson({
    frontmatter: {
      tieu_de: values.tieu_de || 'Chưa có tiêu đề',
      ngay: values.ngay || '2000-01-01',
      mon: values.mon as LessonSubject,
      nhap: true,
      ma_xem_truoc: 'xemtruoc00',
    },
    deBai: values.deBai,
    loiGiai: values.loiGiai,
  });
  const result = validateLessonSource(source, {
    availableFiles: [...state.stagedFiles, ...state.lessonFiles],
  });
  const extraErrors: LessonIssue[] = [];
  if (!values.tieu_de.trim())
    extraErrors.push({ severity: 'loi', code: 'thieu-tieu-de', message: 'Chưa có tiêu đề.' });
  if (!values.ngay)
    extraErrors.push({ severity: 'loi', code: 'thieu-ngay', message: 'Chưa chọn ngày học.' });
  return {
    ...result,
    ok: result.ok && extraErrors.length === 0,
    errors: [...extraErrors, ...result.errors],
  };
}

export function renderPreview(
  values: LessonFormValues,
  state: EditorState,
  result: LessonValidationResult,
  elements: PreviewElements,
): void {
  const options = {
    resolveMediaUrl: (file: string) => mediaUrlFor(state, file),
    resolveIllustrationUrl: (code: string) => `/illustrations/${code}.svg`,
  };
  elements.title.textContent = values.tieu_de || 'Chưa có tiêu đề';
  const lesson = result.lesson;
  elements.deBai.innerHTML = lesson ? renderLessonBlocksToHtml(lesson.deBai.blocks, options) : '';
  elements.loiGiai.innerHTML = lesson?.loiGiai
    ? renderLessonBlocksToHtml(lesson.loiGiai.blocks, options)
    : '';
  renderValidation(result, elements.validation);
}

/** Đổi số dòng trong bai.md thành vị trí trong ô Đề bài / Lời giải để phụ huynh dễ tìm. */
function describeLocation(issue: LessonIssue, result: LessonValidationResult): string {
  const lesson = result.lesson;
  if (!issue.line || !lesson) return '';
  // serializeLesson luôn để một dòng trống sau tiêu đề phần.
  if (lesson.loiGiai && issue.line > lesson.loiGiai.line)
    return ` — Lời giải, dòng ${issue.line - lesson.loiGiai.line - 1}`;
  if (issue.line > lesson.deBai.line)
    return ` — Đề bài, dòng ${issue.line - lesson.deBai.line - 1}`;
  return '';
}

function renderValidation(result: LessonValidationResult, container: HTMLElement): void {
  container.replaceChildren();
  if (result.errors.length === 0 && result.warnings.length === 0) {
    container.append(createLine('ok', '✅ Bài trình bày đúng chuẩn.'));
    return;
  }
  for (const issue of result.errors)
    container.append(createLine('loi', `❌ ${issue.message}${describeLocation(issue, result)}`));
  for (const issue of result.warnings)
    container.append(
      createLine('canh-bao', `⚠️ ${issue.message}${describeLocation(issue, result)}`),
    );
}

function createLine(kind: string, text: string): HTMLElement {
  const line = document.createElement('p');
  line.className = `validation__line validation__line--${kind}`;
  line.textContent = text;
  return line;
}
