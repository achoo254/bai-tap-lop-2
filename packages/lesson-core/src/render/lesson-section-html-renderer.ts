import { Marked } from 'marked';
import { ILLUSTRATION_CATALOG, isIllustrationName } from '../illustration-catalog';
import type { LessonBlock } from '../lesson-markdown-parser';

/**
 * Render các khối của một phần bài ra HTML. Dùng chung cho web của bé và khung xem trước
 * của trang Soạn bài để hai nơi hiển thị giống hệt nhau (cùng class CSS).
 */
export interface LessonRenderOptions {
  /** Đổi tên file media trong bài thành URL phục vụ được. */
  resolveMediaUrl: (fileName: string) => string;
  /** URL của file SVG OpenMoji theo mã hex. */
  resolveIllustrationUrl: (openmojiCode: string) => string;
}

// HTML thô trong Markdown bị hiển thị thành chữ, không được chèn vào trang.
const markdown = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
  },
});

export function renderLessonBlocksToHtml(blocks: LessonBlock[], options: LessonRenderOptions): string {
  return blocks.map((block) => renderBlock(block, options)).join('\n');
}

function renderBlock(block: LessonBlock, options: LessonRenderOptions): string {
  switch (block.kind) {
    case 'text':
      return `<div class="lesson-text">${markdown.parse(block.markdown, { async: false })}</div>`;
    case 'image': {
      const url = escapeAttribute(resolveSource(block.src, options));
      const alt = escapeAttribute(block.alt);
      const caption = block.alt ? `<figcaption>${escapeHtml(block.alt)}</figcaption>` : '';
      return (
        `<figure class="lesson-image comic-frame">` +
        `<button type="button" class="zoomable" data-zoom-src="${url}" data-zoom-alt="${alt}" aria-label="Phóng to ảnh">` +
        `<img src="${url}" alt="${alt}" loading="lazy" decoding="async"></button>${caption}</figure>`
      );
    }
    case 'video': {
      const url = escapeAttribute(resolveSource(block.src, options));
      const caption = block.alt && block.alt.toLowerCase() !== 'video' ? `<figcaption>${escapeHtml(block.alt)}</figcaption>` : '';
      return (
        `<figure class="lesson-video comic-frame">` +
        `<video src="${url}" controls playsinline preload="metadata"></video>${caption}</figure>`
      );
    }
    case 'youtube':
      return (
        `<figure class="lesson-youtube comic-frame"><div class="youtube-frame">` +
        `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(block.videoId)}" ` +
        `title="Video YouTube" loading="lazy" allowfullscreen ` +
        `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>` +
        `</div></figure>`
      );
    case 'illustration': {
      if (!isIllustrationName(block.name) || !Number.isInteger(block.count) || block.count < 1) return '';
      const entry = ILLUSTRATION_CATALOG[block.name];
      const url = escapeAttribute(options.resolveIllustrationUrl(entry.openmoji));
      const items = Array.from(
        { length: block.count },
        () => `<img src="${url}" alt="" aria-hidden="true" draggable="false">`,
      ).join('');
      return `<div class="lesson-illustration" role="img" aria-label="${block.count} ${escapeAttribute(entry.label)}">${items}</div>`;
    }
  }
}

function resolveSource(src: string, options: LessonRenderOptions): string {
  return /^https:\/\//i.test(src) ? src : options.resolveMediaUrl(src);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const escapeAttribute = escapeHtml;
