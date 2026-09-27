import { createHash } from 'node:crypto';
import { mkdir, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  buildLessonId,
  EDITOR_MAX_MEDIA_BYTES,
  generatePreviewCode,
  isValidLessonId,
  lessonFrontmatterSchema,
  serializeLesson,
  splitLessonSource,
  toSafeMediaFileName,
  uniqueFileName,
  validateLessonSource,
  type LessonFrontmatter,
  type LessonIssue,
} from 'lesson-core';
import { LESSON_FILE_NAME, readAllLessonFolders, readLessonFolder } from 'lesson-core/node';

/** Đọc/ghi thư mục bài trên đĩa cho trang Soạn bài. */

export const DRAFT_KEY_PATTERN = /^[a-z0-9]{8,32}$/;

/** Bài trên đĩa đã khác bản phụ huynh mở (vd. Claude vừa sửa qua MCP). */
export class EditorConflictError extends Error {}

export class EditorInputError extends Error {
  constructor(
    message: string,
    readonly issues: LessonIssue[] = [],
  ) {
    super(message);
  }
}

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
  frontmatter: Partial<LessonFrontmatter>;
  deBai: string;
  loiGiai: string;
  files: { name: string; size: number }[];
  /** Dấu vân tay nội dung bai.md lúc mở, gửi lại khi lưu để phát hiện bài bị sửa ở nơi khác. */
  version: string;
}

export interface SaveLessonInput {
  /** Mã bài đang sửa; null khi tạo bài mới. */
  originalId: string | null;
  /** `version` nhận được lúc mở bài; bỏ trống với bài mới. */
  baseVersion?: string | null;
  /** Mã phiên soạn, trỏ tới thư mục tạm chứa file vừa tải lên. */
  draftKey: string;
  tieu_de: string;
  ngay: string;
  mon: string;
  nhap: boolean;
  deBai: string;
  loiGiai: string;
}

export interface SaveLessonResult {
  id: string;
  frontmatter: LessonFrontmatter;
  warnings: LessonIssue[];
}

export class LessonFileRepository {
  constructor(
    private readonly contentDir: string,
    private readonly stagingRoot: string,
  ) {}

  async list(): Promise<LessonSummary[]> {
    const folders = await readAllLessonFolders(this.contentDir);
    return folders
      .map((folder) => {
        const raw = (splitLessonSource(folder.source).rawFrontmatter ?? {}) as Record<string, unknown>;
        return {
          id: folder.id,
          tieu_de: String(raw.tieu_de ?? folder.id),
          ngay: String(raw.ngay ?? ''),
          mon: String(raw.mon ?? ''),
          nhap: raw.nhap !== false,
          soLoi: folder.validation.errors.length,
        };
      })
      .reverse();
  }

  async get(id: string): Promise<LessonDetail | null> {
    const folder = await readLessonFolder(this.contentDir, id);
    if (!folder) return null;
    const split = splitLessonSource(folder.source);
    const parsed = lessonFrontmatterSchema.partial().safeParse(split.rawFrontmatter ?? {});
    return {
      id,
      frontmatter: parsed.success ? parsed.data : {},
      deBai: split.sections['de-bai']?.markdown ?? '',
      loiGiai: split.sections['loi-giai']?.markdown ?? '',
      files: folder.files,
      version: contentVersion(folder.source),
    };
  }

  /** Lưu file tải lên vào thư mục tạm của phiên soạn; trả tên file an toàn đã dùng. */
  async stageUpload(draftKey: string, lessonId: string | null, originalName: string, bytes: Uint8Array): Promise<string> {
    const dir = this.stagingDir(draftKey);
    if (bytes.byteLength > EDITOR_MAX_MEDIA_BYTES) {
      throw new EditorInputError('File quá lớn (tối đa 50MB). Video dài nên đưa lên YouTube rồi dán link.');
    }
    const safeName = toSafeMediaFileName(originalName);
    if (!safeName) throw new EditorInputError('Chỉ nhận ảnh (jpg, png, webp, gif) hoặc video (mp4, webm).');
    const existing = [...(await listFileNames(dir))];
    if (lessonId && isValidLessonId(lessonId)) existing.push(...(await listFileNames(path.join(this.contentDir, lessonId))));
    const fileName = uniqueFileName(safeName, existing);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fileName), bytes);
    return fileName;
  }

  stagedFilePath(draftKey: string, fileName: string): string | null {
    if (!DRAFT_KEY_PATTERN.test(draftKey) || fileName !== path.basename(fileName)) return null;
    return path.join(this.stagingDir(draftKey), fileName);
  }

  async save(input: SaveLessonInput): Promise<SaveLessonResult> {
    const stagingDir = this.stagingDir(input.draftKey);
    let id: string;
    let previewCode: string;
    if (input.originalId) {
      const existing = await readLessonFolder(this.contentDir, input.originalId);
      if (!existing) throw new EditorInputError('Không tìm thấy bài đang sửa.');
      id = input.originalId;
      if (input.baseVersion && contentVersion(existing.source) !== input.baseVersion) {
        throw new EditorConflictError(
          'Bài này vừa được sửa ở nơi khác (có thể Claude qua MCP). Hãy mở lại bài để xem bản mới rồi sửa tiếp.',
        );
      }
      const raw = (splitLessonSource(existing.source).rawFrontmatter ?? {}) as Record<string, unknown>;
      previewCode = typeof raw.ma_xem_truoc === 'string' ? raw.ma_xem_truoc : generatePreviewCode();
    } else {
      id = await this.uniqueLessonId(buildLessonId(input.ngay, input.tieu_de));
      previewCode = generatePreviewCode();
    }

    const frontmatterResult = lessonFrontmatterSchema.safeParse({
      tieu_de: input.tieu_de,
      ngay: input.ngay,
      mon: input.mon,
      nhap: input.nhap,
      ma_xem_truoc: previewCode,
    });
    if (!frontmatterResult.success) {
      const issues = frontmatterResult.error.issues.map((issue) => ({
        severity: 'loi' as const,
        code: 'thong-tin-dau-bai',
        message: `${issue.path.join('.')}: ${issue.message}`,
      }));
      throw new EditorInputError('Thông tin bài chưa đúng.', issues);
    }
    const frontmatter = frontmatterResult.data;
    const source = serializeLesson({ frontmatter, deBai: input.deBai, loiGiai: input.loiGiai });

    const lessonDir = path.join(this.contentDir, id);
    const lessonFiles = await listFileNames(lessonDir, LESSON_FILE_NAME);
    const stagedFiles = await listFileNames(stagingDir);
    const validation = validateLessonSource(source, { availableFiles: [...lessonFiles, ...stagedFiles] });
    if (!validation.ok || !validation.lesson) {
      throw new EditorInputError('Bài còn lỗi, chưa lưu được.', validation.errors);
    }

    const referenced = new Set<string>();
    for (const section of [validation.lesson.deBai, validation.lesson.loiGiai]) {
      for (const block of section?.blocks ?? []) {
        if ((block.kind === 'image' || block.kind === 'video') && !/^https:\/\//i.test(block.src)) {
          referenced.add(decodeURIComponent(block.src));
        }
      }
    }

    await mkdir(lessonDir, { recursive: true });
    for (const name of stagedFiles) {
      if (referenced.has(name)) await rename(path.join(stagingDir, name), path.join(lessonDir, name));
    }
    // Không xoá file đính kèm cũ: có thể nơi khác (Claude qua MCP) vừa thêm và bài bản mới đang dùng.
    await writeFile(path.join(lessonDir, LESSON_FILE_NAME), source, 'utf8');
    await rm(stagingDir, { recursive: true, force: true });
    return { id, frontmatter, warnings: validation.warnings };
  }

  async remove(id: string): Promise<void> {
    if (!isValidLessonId(id)) throw new EditorInputError('Mã bài không hợp lệ.');
    const dir = path.join(this.contentDir, id);
    const exists = await stat(dir).then((s) => s.isDirectory()).catch(() => false);
    if (!exists) throw new EditorInputError('Không tìm thấy bài.');
    await rm(dir, { recursive: true, force: true });
  }

  private stagingDir(draftKey: string): string {
    if (!DRAFT_KEY_PATTERN.test(draftKey)) throw new EditorInputError('Mã phiên soạn không hợp lệ.');
    return path.join(this.stagingRoot, draftKey);
  }

  private async uniqueLessonId(baseId: string): Promise<string> {
    const taken = new Set(await readdir(this.contentDir).catch(() => [] as string[]));
    if (!taken.has(baseId)) return baseId;
    for (let counter = 2; ; counter++) {
      const candidate = `${baseId}-${counter}`;
      if (!taken.has(candidate)) return candidate;
    }
  }
}

export function contentVersion(source: string): string {
  return createHash('sha256').update(source).digest('hex').slice(0, 16);
}

async function listFileNames(dir: string, exclude?: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name !== exclude && !entry.name.startsWith('.'))
    .map((entry) => entry.name);
}
