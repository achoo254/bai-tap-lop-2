import { lessonFrontmatterSchema, type LessonFrontmatter } from './lesson-frontmatter-schema';
import {
  splitLessonSource,
  type LessonBlock,
  type LessonSection,
  type SourceLine,
} from './lesson-markdown-parser';
import { isIllustrationName, MAX_ILLUSTRATION_COUNT } from './illustration-catalog';
import { detectToneStyleUsage, isNfc } from './vietnamese-text-normalizer';

export type LessonIssueSeverity = 'loi' | 'canh-bao';

export interface LessonIssue {
  severity: LessonIssueSeverity;
  code: string;
  message: string;
  line?: number;
}

export interface ParsedLesson {
  frontmatter: LessonFrontmatter;
  deBai: LessonSection;
  loiGiai: LessonSection | null;
}

export interface LessonValidationResult {
  /** true khi không có lỗi (cảnh báo không chặn). */
  ok: boolean;
  lesson: ParsedLesson | null;
  errors: LessonIssue[];
  warnings: LessonIssue[];
}

export interface LessonValidationOptions {
  /** Tên các file media có trong thư mục bài; bỏ qua kiểm tra file khi không truyền. */
  availableFiles?: Iterable<string>;
  /** Kích thước file (byte) để cảnh báo video quá nặng. */
  fileSizes?: Record<string, number>;
}

export const LARGE_VIDEO_WARNING_BYTES = 20 * 1024 * 1024;
const SAFE_FILE_NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}._ -]*$/u;

export function validateLessonSource(
  source: string,
  options: LessonValidationOptions = {},
): LessonValidationResult {
  const issues: LessonIssue[] = [];
  const add = (severity: LessonIssueSeverity, code: string, message: string, line?: number) =>
    issues.push({ severity, code, message, line });

  if (!isNfc(source)) {
    const line = source.split(/\r?\n/).findIndex((text) => !isNfc(text)) + 1;
    add('loi', 'khong-nfc', 'Chữ có dấu đang lưu sai dạng Unicode (không phải NFC). Bấm "Sửa tự động".', line || undefined);
  }

  const split = splitLessonSource(source);
  let frontmatter: LessonFrontmatter | null = null;
  if (split.frontmatterError) {
    add('loi', 'thong-tin-dau-bai', split.frontmatterError, 1);
  } else {
    const parsed = lessonFrontmatterSchema.safeParse(split.rawFrontmatter);
    if (parsed.success) frontmatter = parsed.data;
    else for (const issue of parsed.error.issues) {
      add('loi', 'thong-tin-dau-bai', `${issue.path.join('.') || 'thông tin'}: ${issue.message}`, 1);
    }
  }

  for (const line of split.strayContentLines.slice(0, 1)) {
    add('loi', 'noi-dung-ngoai-phan', 'Có nội dung nằm trước "## Đề bài". Hãy đưa vào phần Đề bài.', line);
  }
  for (const line of split.duplicateSectionLines) {
    add('loi', 'trung-phan', 'Phần này bị lặp lại hai lần.', line);
  }

  const deBai = split.sections['de-bai'];
  if (!deBai) add('loi', 'thieu-de-bai', 'Thiếu phần "## Đề bài".');
  else if (deBai.blocks.length === 0) add('loi', 'de-bai-rong', 'Phần Đề bài đang trống.', deBai.line);

  const availableFiles = options.availableFiles ? new Set(options.availableFiles) : null;
  for (const section of [deBai, split.sections['loi-giai']]) {
    if (!section) continue;
    for (const block of section.blocks) checkBlock(block, availableFiles, options.fileSizes, add);
  }

  const toneUsage = detectToneStyleUsage(source.normalize('NFC'));
  if (toneUsage.oldStyleWords.length > 0) {
    add(
      'canh-bao',
      'kieu-dau-cu',
      `Nên đặt dấu theo kiểu mới như sách giáo khoa (vd. "hoà", "khoẻ", "thuỷ"): ${toneUsage.oldStyleWords.slice(0, 5).join(', ')}. Bấm "Sửa tự động".`,
    );
  }

  const errors = issues.filter((issue) => issue.severity === 'loi');
  const warnings = issues.filter((issue) => issue.severity === 'canh-bao');
  const lesson =
    frontmatter && deBai ? { frontmatter, deBai, loiGiai: split.sections['loi-giai'] ?? null } : null;
  return { ok: errors.length === 0 && lesson !== null, lesson, errors, warnings };
}

type AddIssue = (severity: LessonIssueSeverity, code: string, message: string, line?: number) => void;

function checkBlock(
  block: LessonBlock,
  availableFiles: Set<string> | null,
  fileSizes: Record<string, number> | undefined,
  add: AddIssue,
): void {
  switch (block.kind) {
    case 'text':
      checkTextLines(block.lines, add);
      return;
    case 'image':
    case 'video': {
      const label = block.kind === 'image' ? 'Ảnh' : 'Video';
      checkMediaSource(block.src, label, block.line, availableFiles, add);
      if (block.kind === 'image' && !block.alt) {
        add('canh-bao', 'anh-thieu-mo-ta', 'Ảnh nên có mô tả ngắn trong ![...].', block.line);
      }
      const size = fileSizes?.[block.src];
      if (block.kind === 'video' && size !== undefined && size > LARGE_VIDEO_WARNING_BYTES) {
        add('canh-bao', 'video-nang', `Video "${block.src}" nặng hơn 20MB; nên đưa lên YouTube và dán link.`, block.line);
      }
      return;
    }
    case 'illustration':
      if (!isIllustrationName(block.name)) {
        add('loi', 'minh-hoa-khong-co', `Không có hình minh hoạ loại "${block.name}".`, block.line);
      }
      if (!Number.isInteger(block.count) || block.count < 1 || block.count > MAX_ILLUSTRATION_COUNT) {
        add('loi', 'minh-hoa-so-luong', `Số lượng hình phải từ 1 đến ${MAX_ILLUSTRATION_COUNT}.`, block.line);
      }
      return;
    case 'youtube':
      return;
  }
}

function checkMediaSource(
  src: string,
  label: string,
  line: number,
  availableFiles: Set<string> | null,
  add: AddIssue,
): void {
  if (/^https:\/\//i.test(src)) return;
  if (/^http:\/\//i.test(src)) {
    add('loi', 'media-khong-an-toan', `${label} phải dùng link https.`, line);
    return;
  }
  const fileName = decodeURISafely(src);
  if (!SAFE_FILE_NAME_PATTERN.test(fileName) || fileName.includes('..')) {
    add('loi', 'ten-file-sai', `${label} "${src}" phải là tên file nằm cùng thư mục bài.`, line);
    return;
  }
  if (availableFiles && !availableFiles.has(fileName)) {
    add('loi', 'thieu-file', `Không tìm thấy file ${label.toLowerCase()} "${fileName}" trong bài.`, line);
  }
}

function decodeURISafely(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// ---- Kiểm tra chính tả trình bày trong đoạn chữ ----

const LEADING_MARKERS = /^\s*(?:(?:#{1,6}\s+)|(?:>\s*)|(?:[-*+]\s+)|(?:\d+[.)]\s+))*/u;
/** Ý nhỏ "a) ...", "b) ..." thường là cụm từ/phép tính nên không bắt viết hoa. */
const OPTION_MARKER = /^[a-zđ]\)\s+/iu;
const LEADING_DECORATION = /^[\s*_"“”'‘’([{«]+/u;
const BLANK_MARKER_START = /^(?:\.{2,}|…|_{2,})/u;
/** Dấu kết thúc câu: một dấu chấm đơn (không phải "...") hoặc chuỗi ! ?. */
const SENTENCE_BOUNDARY = /(?:^|[^.])(?:\.|[!?]+)["”')\]]*\s+[*_"“(]*(\p{L})/gu;

function checkTextLines(lines: SourceLine[], add: AddIssue): void {
  let inFence = false;
  for (const { line, text } of lines) {
    if (/^\s*(```|~~~)/.test(text)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || text.trim() === '') continue;
    const cleaned = maskIgnoredSpans(text);

    const body = cleaned.replace(LEADING_MARKERS, '');
    const start = body.replace(LEADING_DECORATION, '');
    const firstChar = start[0] ?? '';
    const isOptionItem = OPTION_MARKER.test(body);
    if (!isOptionItem && !BLANK_MARKER_START.test(start) && isLowercaseLetter(firstChar)) {
      add('loi', 'dau-cau-chu-thuong', `Đầu câu phải viết hoa: "${previewText(start)}".`, line);
      continue;
    }
    for (const match of cleaned.matchAll(SENTENCE_BOUNDARY)) {
      if (isLowercaseLetter(match[1] ?? '')) {
        add('loi', 'dau-cau-chu-thuong', `Chữ sau dấu chấm câu phải viết hoa: "${previewText(cleaned.slice(match.index))}".`, line);
        break;
      }
    }

    const isHeading = /^\s*#{1,6}\s/.test(text);
    const words = start.trim().split(/\s+/).filter(Boolean);
    if (!isHeading && words.length >= 3 && /\p{Ll}$/u.test(start.trim().replace(/[*_]+$/, ''))) {
      add('canh-bao', 'thieu-dau-cau', `Câu có thể thiếu dấu chấm cuối: "${previewText(start)}".`, line);
    }
  }
}

/** Bỏ qua phần trong `code`, link và URL để không kiểm tra nhầm. */
function maskIgnoredSpans(text: string): string {
  return text
    .replace(/`[^`]*`/g, (span) => '0'.repeat(span.length))
    .replace(/https?:\/\/\S+/g, (span) => '0'.repeat(span.length))
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
}

function isLowercaseLetter(char: string): boolean {
  return /\p{Ll}/u.test(char);
}

function previewText(text: string): string {
  const trimmed = text.trim();
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed;
}
