import path from 'node:path';
import {
  LESSON_SUBJECT_LABELS,
  splitLessonSource,
  type LessonFrontmatter,
  type LessonSubject,
} from 'lesson-core';
import { readAllLessonFolders, type LessonFolder } from 'lesson-core/node';
import { renderLessonBlocksToHtml, type LessonRenderOptions } from 'lesson-core/render';

/** Bài đã sẵn sàng hiển thị trên web. */
export interface SiteLesson {
  id: string;
  frontmatter: LessonFrontmatter;
  subjectLabel: string;
  deBaiHtml: string;
  loiGiaiHtml: string | null;
}

export interface LessonCatalog {
  /** Bài đã đăng, sắp theo ngày tăng dần. */
  published: SiteLesson[];
  /** Mọi bài hợp lệ (cả nháp), dùng cho trang xem trước. */
  all: SiteLesson[];
}

export function contentDirectory(): string {
  return path.resolve(process.env.CONTENT_DIR ?? path.join(process.cwd(), '../../content'));
}

let catalogPromise: Promise<LessonCatalog> | null = null;

/** Đọc và kiểm tra toàn bộ bài một lần cho mỗi lần build. */
export function loadLessonCatalog(): Promise<LessonCatalog> {
  catalogPromise ??= buildCatalog();
  return catalogPromise;
}

async function buildCatalog(): Promise<LessonCatalog> {
  const folders = await readAllLessonFolders(contentDirectory());
  const all: SiteLesson[] = [];
  const brokenPublished: string[] = [];

  for (const folder of folders) {
    const { validation } = folder;
    for (const warning of validation.warnings) {
      console.warn(
        `[bai] ${folder.id}${warning.line ? `:${warning.line}` : ''} cảnh báo: ${warning.message}`,
      );
    }
    if (!validation.ok || !validation.lesson) {
      const details = validation.errors
        .map((e) => `  - dòng ${e.line ?? '?'}: ${e.message}`)
        .join('\n');
      if (isDraftSource(folder)) {
        console.warn(`[bai] Bỏ qua bài nháp có lỗi ${folder.id}:\n${details}`);
      } else {
        brokenPublished.push(`${folder.id}\n${details}`);
      }
      continue;
    }
    all.push(toSiteLesson(folder));
  }

  if (brokenPublished.length > 0) {
    throw new Error(
      `Có bài đã đăng nhưng còn lỗi, không thể build:\n${brokenPublished.join('\n')}`,
    );
  }
  all.sort(compareLessons);
  return { all, published: all.filter((lesson) => !lesson.frontmatter.nhap) };
}

/**
 * Chỉ bỏ qua bài có `nhap: true` hợp lệ. Bài không đọc được thông tin đầu bài bị coi là đã đăng
 * (làm dừng build) để không lặng lẽ biến mất khỏi web của bé.
 */
function isDraftSource(folder: LessonFolder): boolean {
  const raw = splitLessonSource(folder.source).rawFrontmatter as { nhap?: unknown } | undefined;
  return raw?.nhap === true;
}

function toSiteLesson(folder: LessonFolder): SiteLesson {
  const lesson = folder.validation.lesson!;
  const options: LessonRenderOptions = {
    resolveMediaUrl: (file) => `/media/${folder.id}/${encodeURIComponent(file)}`,
    resolveIllustrationUrl: (code) => `/illustrations/${code}.svg`,
  };
  const loiGiaiHtml = lesson.loiGiai?.blocks.length
    ? renderLessonBlocksToHtml(lesson.loiGiai.blocks, options)
    : null;
  return {
    id: folder.id,
    frontmatter: lesson.frontmatter,
    subjectLabel: LESSON_SUBJECT_LABELS[lesson.frontmatter.mon as LessonSubject],
    deBaiHtml: renderLessonBlocksToHtml(lesson.deBai.blocks, options),
    loiGiaiHtml,
  };
}

function compareLessons(a: SiteLesson, b: SiteLesson): number {
  return a.frontmatter.ngay.localeCompare(b.frontmatter.ngay) || a.id.localeCompare(b.id);
}

const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

/** "2026-09-28" → "Thứ Hai, 28/09/2026". */
export function formatVietnameseDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  const weekday = WEEKDAYS[new Date(`${isoDate}T00:00:00Z`).getUTCDay()];
  return `${weekday}, ${day}/${month}/${year}`;
}
