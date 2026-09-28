import {
  autoFixVietnameseText,
  buildLessonId,
  generatePreviewCode,
  isValidLessonId,
  LESSON_SUBJECT_LABELS,
  lessonFrontmatterSchema,
  markdownForMedia,
  MCP_MAX_MEDIA_BYTES,
  serializeLesson,
  splitLessonSource,
  toSafeMediaFileName,
  uniqueFileName,
  validateLessonSource,
  type LessonFrontmatter,
  type LessonIssue,
  type LessonSubject,
} from 'lesson-core';
import type { LessonFileStore } from '../github/github-content-store';

/**
 * Nghiệp vụ bài học cho MCP. Không phụ thuộc MCP hay GitHub cụ thể để test được bằng store giả.
 * Quy tắc: AI chỉ tạo bài nháp; đăng là bước riêng và bị chặn nếu bài còn lỗi.
 */

const LESSON_FILE = 'bai.md';
const pathOf = (id: string, file: string) => `content/${id}/${file}`;

export class LessonServiceError extends Error {
  constructor(
    message: string,
    readonly issues: LessonIssue[] = [],
  ) {
    super(message);
  }
}

export interface LessonRecord {
  id: string;
  frontmatter: LessonFrontmatter;
  deBai: string;
  loiGiai: string;
  files: string[];
  warnings: LessonIssue[];
  links: { xemTruoc: string; bai: string | null };
}

export interface LessonContentInput {
  tieu_de: string;
  ngay: string;
  mon: LessonSubject;
  de_bai: string;
  loi_giai?: string;
}

export interface LessonListFilter {
  tu_ngay?: string;
  den_ngay?: string;
  mon?: LessonSubject;
  nhap?: boolean;
}

export interface MediaInput {
  bytes: Uint8Array;
  fileName: string;
  moTa?: string;
  chenVao?: 'de-bai' | 'loi-giai';
}

const MAX_LISTED_LESSONS = 40;

export class LessonService {
  constructor(
    private readonly store: LessonFileStore,
    private readonly siteUrl: string,
  ) {}

  async create(rawInput: LessonContentInput): Promise<LessonRecord> {
    const input = normalizeText(rawInput);
    const baseSha = await this.store.headSha();
    const lessons = await this.store.listLessonFiles();
    const id = uniqueId(buildLessonId(input.ngay, input.tieu_de), lessons);
    const frontmatter = this.parseFrontmatter({
      ...input,
      nhap: true,
      ma_xem_truoc: generatePreviewCode(),
    });
    const source = serializeLesson({
      frontmatter,
      deBai: input.de_bai,
      loiGiai: input.loi_giai ?? '',
    });
    const warnings = this.assertValid(source, []);
    await this.store.commit({
      message: `content: Claude tạo bài nháp ${id}`,
      upserts: [{ path: pathOf(id, LESSON_FILE), content: source }],
      deletes: [],
      ...guard(baseSha, id),
    });
    return this.record(id, frontmatter, input.de_bai, input.loi_giai ?? '', [], warnings);
  }

  async get(id: string): Promise<LessonRecord> {
    const { files, source } = await this.load(id);
    return this.fromSource(id, files, source);
  }

  private fromSource(id: string, files: string[], source: string): LessonRecord {
    const split = splitLessonSource(source);
    const validation = validateLessonSource(source, { availableFiles: files });
    const frontmatter = lessonFrontmatterSchema.safeParse(split.rawFrontmatter);
    if (!frontmatter.success)
      throw new LessonServiceError(`Bài ${id} có thông tin đầu bài bị hỏng.`, validation.errors);
    return this.record(
      id,
      frontmatter.data,
      split.sections['de-bai']?.markdown ?? '',
      split.sections['loi-giai']?.markdown ?? '',
      files,
      [...validation.errors, ...validation.warnings],
    );
  }

  /** Danh sách bài: 1 lần đọc cây thư mục + 1 lần đọc hàng loạt nội dung. Bài hỏng được báo, không bị bỏ qua. */
  async list(
    filter: LessonListFilter = {},
  ): Promise<{ lessons: LessonRecord[]; broken: string[] }> {
    const lessonFiles = await this.store.listLessonFiles();
    const ids = [...lessonFiles.keys()].filter((id) => lessonFiles.get(id)?.includes(LESSON_FILE));
    const sources = await this.store.readTexts(ids.map((id) => pathOf(id, LESSON_FILE)));
    const lessons: LessonRecord[] = [];
    const broken: string[] = [];
    for (const id of ids) {
      const source = sources.get(pathOf(id, LESSON_FILE));
      try {
        if (source == null) throw new Error('không đọc được');
        const files = (lessonFiles.get(id) ?? []).filter((file) => file !== LESSON_FILE);
        lessons.push(this.fromSource(id, files, source));
      } catch {
        broken.push(id);
      }
    }
    const matches = lessons.filter(
      ({ frontmatter }) =>
        (!filter.tu_ngay || frontmatter.ngay >= filter.tu_ngay) &&
        (!filter.den_ngay || frontmatter.ngay <= filter.den_ngay) &&
        (filter.mon === undefined || frontmatter.mon === filter.mon) &&
        (filter.nhap === undefined || frontmatter.nhap === filter.nhap),
    );
    matches.sort(
      (a, b) => b.frontmatter.ngay.localeCompare(a.frontmatter.ngay) || b.id.localeCompare(a.id),
    );
    return { lessons: matches.slice(0, MAX_LISTED_LESSONS), broken };
  }

  /** Kiểm tra nội dung chưa lưu (không ghi gì). */
  validateDraft(input: LessonContentInput, availableFiles: string[] = []) {
    const frontmatter = this.parseFrontmatter({ ...input, nhap: true, ma_xem_truoc: 'kiemtra000' });
    const source = serializeLesson({
      frontmatter,
      deBai: input.de_bai,
      loiGiai: input.loi_giai ?? '',
    });
    return validateLessonSource(source, { availableFiles });
  }

  async update(id: string, rawChanges: Partial<LessonContentInput>): Promise<LessonRecord> {
    const changes = normalizeText(rawChanges);
    const baseSha = await this.store.headSha();
    const current = await this.get(id);
    const frontmatter = this.parseFrontmatter({
      ...current.frontmatter,
      ...(changes.tieu_de !== undefined ? { tieu_de: changes.tieu_de } : {}),
      ...(changes.ngay !== undefined ? { ngay: changes.ngay } : {}),
      ...(changes.mon !== undefined ? { mon: changes.mon } : {}),
    });
    const deBai = changes.de_bai ?? current.deBai;
    const loiGiai = changes.loi_giai ?? current.loiGiai;
    const source = serializeLesson({ frontmatter, deBai, loiGiai });
    const warnings = this.assertValid(source, current.files);
    await this.store.commit({
      message: `content: Claude sửa bài ${frontmatter.nhap ? 'nháp' : 'đã đăng'} ${id}`,
      upserts: [{ path: pathOf(id, LESSON_FILE), content: source }],
      deletes: [],
      ...guard(baseSha, id),
    });
    return this.record(id, frontmatter, deBai, loiGiai, current.files, warnings);
  }

  async publish(id: string): Promise<LessonRecord> {
    const baseSha = await this.store.headSha();
    const current = await this.get(id);
    const frontmatter = { ...current.frontmatter, nhap: false };
    const source = serializeLesson({ frontmatter, deBai: current.deBai, loiGiai: current.loiGiai });
    const warnings = this.assertValid(
      source,
      current.files,
      'Bài còn lỗi nên chưa đăng được. Hãy sửa rồi đăng lại.',
    );
    if (!current.frontmatter.nhap)
      return this.record(id, frontmatter, current.deBai, current.loiGiai, current.files, warnings);
    await this.store.commit({
      message: `content: đăng bài ${id}`,
      upserts: [{ path: pathOf(id, LESSON_FILE), content: source }],
      deletes: [],
      ...guard(baseSha, id),
    });
    return this.record(id, frontmatter, current.deBai, current.loiGiai, current.files, warnings);
  }

  /** Mô tả việc xoá (khi chưa xác nhận) hoặc xoá thật. */
  async remove(id: string, confirmed: boolean): Promise<{ deleted: boolean; summary: string }> {
    const baseSha = await this.store.headSha();
    const current = await this.get(id);
    const summary = `Bài "${current.frontmatter.tieu_de}" (${current.frontmatter.ngay}, ${
      current.frontmatter.nhap ? 'nháp' : 'ĐÃ ĐĂNG — bé đang thấy bài này'
    }) cùng ${current.files.length} file đính kèm.`;
    if (!confirmed) return { deleted: false, summary };
    await this.store.commit({
      message: `content: Claude xoá bài ${id}`,
      upserts: [],
      deletes: [LESSON_FILE, ...current.files].map((file) => pathOf(id, file)),
      ...guard(baseSha, id),
    });
    return { deleted: true, summary };
  }

  async addMedia(
    id: string,
    media: MediaInput,
  ): Promise<{ record: LessonRecord; fileName: string; markdown: string }> {
    if (media.bytes.byteLength > MCP_MAX_MEDIA_BYTES) {
      throw new LessonServiceError(
        'File lớn hơn 10MB. Video dài hãy đưa lên YouTube rồi chèn link.',
      );
    }
    const safeName = toSafeMediaFileName(media.fileName);
    if (!safeName)
      throw new LessonServiceError('Chỉ nhận ảnh (jpg, png, webp, gif) hoặc video (mp4, webm).');
    const baseSha = await this.store.headSha();
    const current = await this.get(id);
    const fileName = uniqueFileName(safeName, current.files);
    const markdown = markdownForMedia(fileName, media.moTa);

    const upserts: { path: string; content: string | Uint8Array }[] = [
      { path: pathOf(id, fileName), content: media.bytes },
    ];
    let record: LessonRecord = { ...current, files: [...current.files, fileName] };
    if (media.chenVao) {
      const deBai =
        media.chenVao === 'de-bai' ? appendBlock(current.deBai, markdown) : current.deBai;
      const loiGiai =
        media.chenVao === 'loi-giai' ? appendBlock(current.loiGiai, markdown) : current.loiGiai;
      const source = serializeLesson({ frontmatter: current.frontmatter, deBai, loiGiai });
      const warnings = this.assertValid(source, record.files);
      upserts.push({ path: pathOf(id, LESSON_FILE), content: source });
      record = this.record(id, current.frontmatter, deBai, loiGiai, record.files, warnings);
    }
    await this.store.commit({
      message: `content: Claude thêm ${fileName} vào bài ${id}`,
      upserts,
      deletes: [],
      ...guard(baseSha, id),
    });
    return { record, fileName, markdown };
  }

  private async load(id: string): Promise<{ files: string[]; source: string }> {
    if (!isValidLessonId(id)) throw new LessonServiceError(`Mã bài "${id}" không hợp lệ.`);
    const files = (await this.store.listLessonFiles()).get(id);
    const source = files?.includes(LESSON_FILE)
      ? await this.store.readText(pathOf(id, LESSON_FILE))
      : null;
    if (!files || source === null)
      throw new LessonServiceError(`Không tìm thấy bài "${id}". Dùng list_lessons để xem mã bài.`);
    return { files: files.filter((file) => file !== LESSON_FILE), source };
  }

  private parseFrontmatter(value: Record<string, unknown>): LessonFrontmatter {
    const parsed = lessonFrontmatterSchema.safeParse(value);
    if (parsed.success) return parsed.data;
    const issues = parsed.error.issues.map((issue) => ({
      severity: 'loi' as const,
      code: 'thong-tin-dau-bai',
      message: `${issue.path.join('.')}: ${issue.message}`,
    }));
    throw new LessonServiceError('Thông tin bài chưa đúng.', issues);
  }

  private assertValid(
    source: string,
    files: string[],
    message = 'Bài còn lỗi, chưa lưu. Hãy sửa theo danh sách lỗi rồi gọi lại.',
  ) {
    const result = validateLessonSource(source, { availableFiles: files });
    if (!result.ok) throw new LessonServiceError(message, result.errors);
    return result.warnings;
  }

  private record(
    id: string,
    frontmatter: LessonFrontmatter,
    deBai: string,
    loiGiai: string,
    files: string[],
    warnings: LessonIssue[],
  ): LessonRecord {
    return {
      id,
      frontmatter,
      deBai,
      loiGiai,
      files,
      warnings,
      links: {
        xemTruoc: `${this.siteUrl}/xem-truoc/${frontmatter.ma_xem_truoc}/`,
        bai: frontmatter.nhap ? null : `${this.siteUrl}/bai/${id}/`,
      },
    };
  }
}

export function subjectLabel(subject: LessonSubject): string {
  return LESSON_SUBJECT_LABELS[subject];
}

/** Chặn ghi nếu thư mục bài đã bị sửa ở nơi khác kể từ lúc đọc (`baseSha`). */
function guard(baseSha: string, id: string) {
  return { baseSha, guardPaths: [`content/${id}/`] };
}

function uniqueId(baseId: string, lessons: Map<string, string[]>): string {
  if (!lessons.has(baseId)) return baseId;
  for (let counter = 2; ; counter++) {
    if (!lessons.has(`${baseId}-${counter}`)) return `${baseId}-${counter}`;
  }
}

/** Chuẩn hoá NFC và kiểu đặt dấu mới cho các ô chữ AI gửi lên. */
function normalizeText<T extends Partial<LessonContentInput>>(input: T): T {
  const fix = (value: string | undefined) =>
    value === undefined ? undefined : autoFixVietnameseText(value);
  return {
    ...input,
    tieu_de: fix(input.tieu_de),
    de_bai: fix(input.de_bai),
    loi_giai: fix(input.loi_giai),
  };
}

function appendBlock(markdown: string, block: string): string {
  return markdown.trim() ? `${markdown.trim()}\n\n${block}` : block;
}
