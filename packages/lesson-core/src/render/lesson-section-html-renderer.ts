import { Marked } from 'marked';
import { ILLUSTRATION_CATALOG, isIllustrationName, MAX_ILLUSTRATION_COUNT } from '../illustration-catalog';
import type { ColumnArithmetic, LessonBlock } from '../lesson-markdown-parser';

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

/** Link chỉ được trỏ tới trang web thường; mọi scheme khác (javascript:, data:...) hiện thành chữ. */
export function isSafeLinkHref(href: string): boolean {
  return /^https?:\/\//i.test(href.trim());
}

/** Tạo bộ chuyển Markdown cho một lần render: chặn HTML thô, link nguy hiểm và ảnh chèn giữa câu. */
function createMarkdown(options: LessonRenderOptions): Marked {
  return new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      html({ text }) {
        return escapeHtml(text);
      },
      link({ href, tokens }) {
        const text = this.parser.parseInline(tokens);
        if (!isSafeLinkHref(href)) return text;
        return `<a href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      },
      image({ href, text }) {
        // Ảnh chèn giữa đoạn chữ: chỉ nhận file trong bài hoặc link https; còn lại hiện mô tả.
        const src = /^https:\/\//i.test(href) ? href : /^[\p{L}\p{N}][\p{L}\p{N}._-]*$/u.test(href) ? options.resolveMediaUrl(href) : '';
        if (!src) return escapeHtml(text);
        return `<img class="lesson-inline-image" src="${escapeAttribute(src)}" alt="${escapeAttribute(text)}" loading="lazy">`;
      },
    },
  });
}

export function renderLessonBlocksToHtml(blocks: LessonBlock[], options: LessonRenderOptions): string {
  const markdown = createMarkdown(options);
  // Đoạn chữ và phép đặt tính liền nhau nằm chung một trang vở để dòng kẻ liền mạch.
  const parts: string[] = [];
  let notebook: string[] = [];
  const closeNotebook = () => {
    if (notebook.length) parts.push(`<div class="lesson-text">${notebook.join('')}</div>`);
    notebook = [];
  };
  for (const block of blocks) {
    if (block.kind === 'text') notebook.push(markdown.parse(block.markdown, { async: false }));
    else if (block.kind === 'column-arithmetic') notebook.push(renderColumnArithmetic(block.items));
    else {
      closeNotebook();
      parts.push(renderBlock(block, options, markdown));
    }
  }
  closeNotebook();
  return parts.join('\n');
}

function renderColumnArithmetic(items: ColumnArithmetic[]): string {
  const html = items
    .map((item) => {
      const operatorName = item.operator === '+' ? 'cộng' : 'trừ';
      const label = `${item.first} ${operatorName} ${item.second}${item.result === null ? '' : ` bằng ${item.result}`}`;
      return (
        `<div class="dat-tinh" role="img" aria-label="${escapeAttribute(label)}">` +
        `<span class="dat-tinh__op" aria-hidden="true">${escapeHtml(item.operator)}</span>` +
        `<span class="dat-tinh__so" aria-hidden="true">${escapeHtml(item.first)}</span>` +
        `<span class="dat-tinh__so dat-tinh__so--gach" aria-hidden="true">${escapeHtml(item.second)}</span>` +
        `<span class="dat-tinh__so" aria-hidden="true">${escapeHtml(item.result ?? '')}</span>` +
        `</div>`
      );
    })
    .join('');
  return `<div class="lesson-dat-tinh">${html}</div>`;
}

function renderBlock(block: LessonBlock, options: LessonRenderOptions, markdown: Marked): string {
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
    case 'column-arithmetic':
      return `<div class="lesson-text">${renderColumnArithmetic(block.items)}</div>`;
    case 'illustration': {
      if (!isIllustrationName(block.name) || !Number.isInteger(block.count) || block.count < 1 || block.count > MAX_ILLUSTRATION_COUNT) return '';
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
