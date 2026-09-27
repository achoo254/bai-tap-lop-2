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

describe('prompt mẫu và tách câu trả lời AI', () => {
  it('prompt có danh sách hình minh hoạ', async () => {
    const { buildLessonAuthoringPrompt } = await import('../src/index');
    const prompt = buildLessonAuthoringPrompt('bảng nhân 2');
    expect(prompt).toContain('bảng nhân 2');
    expect(prompt).toContain('tao (quả táo)');
  });

  it('tách tiêu đề, môn và hai phần', async () => {
    const { parseAiLessonReply } = await import('../src/index');
    const reply = [
      'Dưới đây là bài tập:',
      '```markdown',
      '**TIÊU ĐỀ:** Bảng nhân 2',
      'MÔN: toán',
      '',
      '## Đề bài',
      '',
      'Tính: 2 x 3 = ?',
      '',
      '## Lời giải',
      '',
      '2 x 3 = 6.',
      '```',
    ].join('\n');
    expect(parseAiLessonReply(reply)).toEqual({
      tieuDe: 'Bảng nhân 2',
      mon: 'toan',
      deBai: 'Tính: 2 x 3 = ?',
      loiGiai: '2 x 3 = 6.',
    });
  });

  it('không có tiêu đề phần thì coi toàn bộ là đề bài', async () => {
    const { parseAiLessonReply } = await import('../src/index');
    expect(parseAiLessonReply('Tính nhẩm: 5 + 5.')).toMatchObject({ deBai: 'Tính nhẩm: 5 + 5.', loiGiai: '', tieuDe: null });
  });
});

describe('chống chèn mã độc qua Markdown', () => {
  const options = {
    resolveMediaUrl: (file: string) => `/media/bai/${file}`,
    resolveIllustrationUrl: (code: string) => `/illustrations/${code}.svg`,
  };
  const render = (markdown: string) => {
    const { lesson } = validateLessonSource(
      serializeLesson({
        frontmatter: { tieu_de: 'A', ngay: '2026-09-28', mon: 'khac', nhap: true, ma_xem_truoc: 'abc123xyz9' },
        deBai: markdown,
        loiGiai: '',
      }),
    );
    return renderLessonBlocksToHtml(lesson!.deBai.blocks, options);
  };

  it('link javascript: chỉ hiện thành chữ, link https giữ nguyên', () => {
    const html = render('Bé [bấm](javascript:alert(1)) hoặc [xem](https://vi.wikipedia.org).');
    expect(html).not.toContain('javascript:');
    expect(html).toContain('bấm');
    expect(html).toContain('href="https://vi.wikipedia.org"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('ảnh giữa câu chỉ nhận file trong bài hoặc https', () => {
    expect(render('Hình ![mèo](meo.png) nè.')).toContain('src="/media/bai/meo.png"');
    expect(render('Hình ![x](javascript:alert(1)) nè.')).not.toContain('javascript:');
  });

  it('validator chặn link không phải http(s)', () => {
    const source = serializeLesson({
      frontmatter: { tieu_de: 'A', ngay: '2026-09-28', mon: 'khac', nhap: true, ma_xem_truoc: 'abc123xyz9' },
      deBai: 'Bé [bấm](javascript:alert(1)) nhé.',
      loiGiai: '',
    });
    expect(validateLessonSource(source).errors.map((issue) => issue.code)).toContain('link-khong-an-toan');
  });
});

describe('hồ sơ của bé', () => {
  it('nhận ra ngày sinh nhật và gợi ý tên người thân trong prompt', async () => {
    const { CHILD_PROFILE, isBirthdayOn, buildLessonAuthoringPrompt } = await import('../src/index');
    expect(isBirthdayOn('2026-12-15', CHILD_PROFILE.birthday)).toBe(true);
    expect(isBirthdayOn('2026-12-16', CHILD_PROFILE.birthday)).toBe(false);
    expect(isBirthdayOn('2027-03-19', CHILD_PROFILE.sibling.birthday)).toBe(true);
    expect(buildLessonAuthoringPrompt()).toContain('bé Miu');
  });
});

describe('đặt tính theo cột', () => {
  const options = {
    resolveMediaUrl: (file: string) => file,
    resolveIllustrationUrl: (code: string) => code,
  };
  const parse = (deBai: string) =>
    validateLessonSource(
      serializeLesson({
        frontmatter: { tieu_de: 'A', ngay: '2026-09-28', mon: 'toan', nhap: true, ma_xem_truoc: 'abc123xyz9' },
        deBai,
        loiGiai: '',
      }),
    );

  it('gom các phép liền nhau thành một hàng và render đúng', () => {
    const result = parse('::dat-tinh{so-1=45 phep=+ so-2=54 ket-qua=99}\n\n::dat-tinh{so-1=72 phep=- so-2=11}');
    expect(result.errors).toEqual([]);
    const blocks = result.lesson!.deBai.blocks;
    expect(blocks).toHaveLength(1);
    const html = renderLessonBlocksToHtml(blocks, options);
    expect(html.match(/class="dat-tinh"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="45 cộng 54 bằng 99"');
    expect(html).toContain('aria-label="72 trừ 11"');
    expect(html).toContain('>–</span>');
  });

  it('báo lỗi cú pháp và kết quả sai', () => {
    expect(parse('::dat-tinh{so-1=45 phep=x so-2=54}').errors.map((e) => e.code)).toContain('dat-tinh-sai');
    expect(parse('::dat-tinh{so-1=45 phep=+ so-2=54 ket-qua=98}').errors.map((e) => e.code)).toContain('dat-tinh-sai-ket-qua');
  });
});
