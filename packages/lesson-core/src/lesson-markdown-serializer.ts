import { stringify as stringifyYaml } from 'yaml';
import type { LessonFrontmatter } from './lesson-frontmatter-schema';
import { SECTION_HEADINGS } from './lesson-markdown-parser';

export interface LessonDraftContent {
  frontmatter: LessonFrontmatter;
  /** Markdown phần Đề bài (không gồm dòng tiêu đề `## Đề bài`). */
  deBai: string;
  /** Markdown phần Lời giải; rỗng thì bỏ hẳn phần này. */
  loiGiai: string;
}

/** Ghi bài ra nội dung `bai.md` theo thứ tự trường cố định để diff git gọn. */
export function serializeLesson(content: LessonDraftContent): string {
  const { tieu_de, ngay, mon, nhap, ma_xem_truoc } = content.frontmatter;
  const yaml = stringifyYaml({ tieu_de, ngay, mon, nhap, ma_xem_truoc }, { lineWidth: 0 }).trimEnd();
  const parts = [`---\n${yaml}\n---`, `## ${SECTION_HEADINGS['de-bai']}\n\n${normalizeBody(content.deBai)}`];
  const loiGiai = normalizeBody(content.loiGiai);
  if (loiGiai) parts.push(`## ${SECTION_HEADINGS['loi-giai']}\n\n${loiGiai}`);
  return `${parts.join('\n\n')}\n`.normalize('NFC');
}

function normalizeBody(markdown: string): string {
  return markdown.replace(/\r\n?/g, '\n').trim();
}
