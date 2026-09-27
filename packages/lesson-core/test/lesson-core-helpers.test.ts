import { describe, expect, it } from 'vitest';
import {
  autoFixVietnameseText,
  buildLessonId,
  detectToneStyleUsage,
  generatePreviewCode,
  isValidLessonId,
  markdownForMedia,
  serializeLesson,
  slugifyVietnamese,
  splitLessonSource,
  toNewToneStyle,
  toSafeMediaFileName,
  uniqueFileName,
  validateLessonSource,
} from '../src/index';
import { renderLessonBlocksToHtml } from '../src/render/lesson-section-html-renderer';

describe('chuẩn hoá tiếng Việt', () => {
  it('chuyển dấu kiểu cũ sang kiểu mới với vần mở oa/oe/uy', () => {
    expect(toNewToneStyle('hòa khỏe thủy Hòa HÒA')).toBe('hoà khoẻ thuỷ Hoà HOÀ');
  });

  it('không đổi vần có âm cuối, quý và chữ đã đúng', () => {
    const text = 'hoàng thuyền quý hoạt khuya hoặc hoà';
    expect(toNewToneStyle(text)).toBe(text);
  });

  it('phát hiện từ viết kiểu cũ', () => {
    expect(detectToneStyleUsage('Bạn Hòa và bạn Thuỷ').oldStyleWords).toEqual(['Hòa']);
  });

  it('sửa tự động đưa về NFC', () => {
    const fixed = autoFixVietnameseText('Hòa\r\n'.normalize('NFD'));
    expect(fixed).toBe('Hoà\n');
    expect(fixed).toBe(fixed.normalize('NFC'));
  });
});

describe('slug và mã bài', () => {
  it('bỏ dấu và tạo mã bài hợp lệ', () => {
    expect(slugifyVietnamese('Cộng có nhớ – Đề số 1!')).toBe('cong-co-nho-de-so-1');
    const id = buildLessonId('2026-09-28', 'Điền vần ăn, ăng');
    expect(id).toBe('2026-09-28-dien-van-an-ang');
    expect(isValidLessonId(id)).toBe(true);
    expect(isValidLessonId('../etc')).toBe(false);
  });

  it('mã xem trước đủ dài và khác nhau', () => {
    const a = generatePreviewCode();
    expect(a).toMatch(/^[a-z0-9]{12}$/);
    expect(generatePreviewCode()).not.toBe(a);
  });
});

describe('tên file media', () => {
  it('làm sạch tên và chặn đuôi không cho phép', () => {
    expect(toSafeMediaFileName('Ảnh Bài 1.JPG')).toBe('anh-bai-1.jpg');
    expect(toSafeMediaFileName('virus.exe')).toBeNull();
    expect(uniqueFileName('anh.jpg', ['anh.jpg', 'anh-2.jpg'])).toBe('anh-3.jpg');
    expect(markdownForMedia('clip.mp4')).toBe('![video](clip.mp4)');
  });
});

describe('ghi và đọc bài', () => {
  it('round-trip giữ nguyên nội dung', () => {
    const content = {
      frontmatter: {
        tieu_de: 'Bài: cộng "có nhớ"',
        ngay: '2026-09-28',
        mon: 'toan' as const,
        nhap: true,
        ma_xem_truoc: 'abc123xyz9',
      },
      deBai: 'Bài 1. Tính.\n\n::hinh{loai=tao so-luong=3}',
      loiGiai: 'Đáp số: 3.',
    };
    const source = serializeLesson(content);
    const result = validateLessonSource(source);
    expect(result.errors).toEqual([]);
    expect(result.lesson?.frontmatter).toEqual(content.frontmatter);
    expect(result.lesson?.deBai.markdown).toBe(content.deBai);
    expect(result.lesson?.loiGiai?.markdown).toBe(content.loiGiai);
    expect(serializeLesson({ ...content })).toBe(source);
  });

  it('không coi "## Đề bài" trong khối code là tiêu đề phần', () => {
    const split = splitLessonSource(
      '---\ntieu_de: a\n---\n## Đề bài\n\n```\n## Lời giải\n```\n',
    );
    expect(split.sections['loi-giai']).toBeUndefined();
  });
});

describe('render HTML', () => {
  const options = {
    resolveMediaUrl: (file: string) => `/media/bai/${file}`,
    resolveIllustrationUrl: (code: string) => `/illustrations/${code}.svg`,
  };

  it('render đủ loại khối và thoát HTML thô', () => {
    const { lesson } = validateLessonSource(
      serializeLesson({
        frontmatter: { tieu_de: 'A', ngay: '2026-09-28', mon: 'khac', nhap: false, ma_xem_truoc: 'abc123xyz9' },
        deBai: [
          'Chữ <script>alert(1)</script> **đậm**.',
          '',
          '![Hình "mèo"](meo.png)',
          '',
          '![video](clip.mp4)',
          '',
          'https://youtu.be/dQw4w9WgXcQ',
          '',
          '::hinh{loai=sao so-luong=3}',
        ].join('\n'),
        loiGiai: '',
      }),
    );
    const html = renderLessonBlocksToHtml(lesson!.deBai.blocks, options);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<strong>đậm</strong>');
    expect(html).toContain('src="/media/bai/meo.png"');
    expect(html).toContain('alt="Hình &quot;mèo&quot;"');
    expect(html).toContain('<video src="/media/bai/clip.mp4"');
    expect(html).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(html.match(/illustrations\/2B50\.svg/g)).toHaveLength(3);
    expect(html).toContain('aria-label="3 ngôi sao"');
  });
});
