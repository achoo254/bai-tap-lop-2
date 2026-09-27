import { parse as parseYaml } from 'yaml';
import { slugifyVietnamese } from './lesson-slug-and-id';

/**
 * Định dạng `bai.md`:
 *   ---
 *   <frontmatter YAML>
 *   ---
 *   ## Đề bài
 *   ...khối nội dung...
 *   ## Lời giải
 *   ...khối nội dung...
 *
 * Mỗi phần là chuỗi các khối: đoạn chữ (Markdown), ảnh, video, YouTube, hình minh hoạ.
 * Ảnh/video/YouTube/minh hoạ phải đứng riêng một dòng.
 */

export type LessonSectionKey = 'de-bai' | 'loi-giai';

export const SECTION_HEADINGS: Record<LessonSectionKey, string> = {
  'de-bai': 'Đề bài',
  'loi-giai': 'Lời giải',
};

export interface SourceLine {
  /** Số dòng trong file, bắt đầu từ 1. */
  line: number;
  text: string;
}

export type LessonBlock =
  | { kind: 'text'; line: number; lines: SourceLine[]; markdown: string }
  | { kind: 'image'; line: number; src: string; alt: string }
  | { kind: 'video'; line: number; src: string; alt: string }
  | { kind: 'youtube'; line: number; videoId: string; url: string }
  | { kind: 'illustration'; line: number; name: string; count: number; raw: string };

export interface LessonSection {
  key: LessonSectionKey;
  /** Dòng tiêu đề `## ...` của phần. */
  line: number;
  markdown: string;
  blocks: LessonBlock[];
}

export interface SplitLessonSource {
  rawFrontmatter: unknown;
  frontmatterError?: string;
  sections: Partial<Record<LessonSectionKey, LessonSection>>;
  /** Dòng có nội dung nằm ngoài hai phần (trước `## Đề bài`). */
  strayContentLines: number[];
  duplicateSectionLines: number[];
}

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v'];
const MEDIA_LINE_PATTERN = /^!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)$/;
const YOUTUBE_LINE_PATTERN =
  /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:\S*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})\S*$/;
const ILLUSTRATION_LINE_PATTERN = /^::hinh\{(.*)\}$/;
const ATTRIBUTE_PATTERN = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+))/g;
const FENCE_PATTERN = /^(```|~~~)/;
const SECTION_HEADING_PATTERN = /^##\s+(.+?)\s*#*\s*$/;

export function isVideoFileName(src: string): boolean {
  const extension = src.split(/[?#]/)[0]?.split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXTENSIONS.includes(extension);
}

function sectionKeyFromHeading(headingText: string): LessonSectionKey | null {
  const slug = slugifyVietnamese(headingText);
  if (slug === 'de-bai') return 'de-bai';
  if (slug === 'loi-giai') return 'loi-giai';
  return null;
}

/** Tách frontmatter và hai phần của bài. Không ném lỗi; lỗi được trả về để validator báo. */
export function splitLessonSource(source: string): SplitLessonSource {
  const lines = source.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  const result: SplitLessonSource = {
    rawFrontmatter: undefined,
    sections: {},
    strayContentLines: [],
    duplicateSectionLines: [],
  };

  let index = 0;
  if (lines[0]?.trim() === '---') {
    const closing = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
    if (closing === -1) {
      result.frontmatterError = 'Phần thông tin đầu bài (---) chưa được đóng';
      index = lines.length;
    } else {
      try {
        result.rawFrontmatter = parseYaml(lines.slice(1, closing).join('\n')) ?? {};
      } catch (error) {
        result.frontmatterError = `Phần thông tin đầu bài sai cú pháp: ${(error as Error).message}`;
      }
      index = closing + 1;
    }
  } else {
    result.frontmatterError = 'Thiếu phần thông tin đầu bài (bắt đầu bằng ---)';
  }

  let current: { key: LessonSectionKey; line: number; body: SourceLine[] } | null = null;
  let inFence = false;
  const flush = () => {
    if (!current) return;
    if (result.sections[current.key]) {
      result.duplicateSectionLines.push(current.line);
    } else {
      result.sections[current.key] = buildSection(current.key, current.line, current.body);
    }
  };

  for (; index < lines.length; index++) {
    const text = lines[index] ?? '';
    const lineNumber = index + 1;
    if (FENCE_PATTERN.test(text.trim())) inFence = !inFence;
    const headingMatch = !inFence ? SECTION_HEADING_PATTERN.exec(text) : null;
    const key = headingMatch?.[1] ? sectionKeyFromHeading(headingMatch[1]) : null;
    if (key) {
      flush();
      current = { key, line: lineNumber, body: [] };
      continue;
    }
    if (current) current.body.push({ line: lineNumber, text });
    else if (text.trim() !== '') result.strayContentLines.push(lineNumber);
  }
  flush();
  return result;
}

function buildSection(key: LessonSectionKey, line: number, body: SourceLine[]): LessonSection {
  const markdown = trimBlankLines(body.map((l) => l.text)).join('\n');
  return { key, line, markdown, blocks: parseLessonBlocks(body) };
}

/** Chia nội dung một phần thành các khối. */
export function parseLessonBlocks(body: SourceLine[]): LessonBlock[] {
  const blocks: LessonBlock[] = [];
  let paragraph: SourceLine[] = [];
  let inFence = false;

  const flushParagraph = () => {
    const trimmed = trimBlankSourceLines(paragraph);
    if (trimmed.length > 0) {
      blocks.push({
        kind: 'text',
        line: trimmed[0]!.line,
        lines: trimmed,
        markdown: trimmed.map((l) => l.text).join('\n'),
      });
    }
    paragraph = [];
  };

  for (const sourceLine of body) {
    const trimmed = sourceLine.text.trim();
    if (FENCE_PATTERN.test(trimmed)) inFence = !inFence;
    const special = inFence ? null : parseSpecialLine(trimmed, sourceLine.line);
    if (special) {
      flushParagraph();
      blocks.push(special);
    } else {
      paragraph.push(sourceLine);
    }
  }
  flushParagraph();
  return blocks;
}

function parseSpecialLine(trimmed: string, line: number): LessonBlock | null {
  const media = MEDIA_LINE_PATTERN.exec(trimmed);
  if (media) {
    const alt = media[1]?.trim() ?? '';
    const src = media[2] ?? '';
    return isVideoFileName(src)
      ? { kind: 'video', line, src, alt }
      : { kind: 'image', line, src, alt };
  }
  const youtube = YOUTUBE_LINE_PATTERN.exec(trimmed);
  if (youtube?.[1]) return { kind: 'youtube', line, videoId: youtube[1], url: trimmed };

  const illustration = ILLUSTRATION_LINE_PATTERN.exec(trimmed);
  if (illustration) {
    const attributes = parseAttributes(illustration[1] ?? '');
    const countText = attributes['so-luong'] ?? attributes['so_luong'] ?? '1';
    return {
      kind: 'illustration',
      line,
      name: attributes['loai'] ?? '',
      count: /^\d+$/.test(countText) ? Number(countText) : Number.NaN,
      raw: trimmed,
    };
  }
  return null;
}

function parseAttributes(text: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const match of text.matchAll(ATTRIBUTE_PATTERN)) {
    attributes[match[1]!] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}

function trimBlankLines(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start]!.trim() === '') start++;
  while (end > start && lines[end - 1]!.trim() === '') end--;
  return lines.slice(start, end);
}

function trimBlankSourceLines(lines: SourceLine[]): SourceLine[] {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start]!.text.trim() === '') start++;
  while (end > start && lines[end - 1]!.text.trim() === '') end--;
  return lines.slice(start, end);
}
