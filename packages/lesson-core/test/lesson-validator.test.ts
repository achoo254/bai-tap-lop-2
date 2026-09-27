import { describe, expect, it } from 'vitest';
import { validateLessonSource } from '../src/lesson-validator';

const header = `---
tieu_de: Cộng có nhớ
ngay: 2026-09-28
mon: toan
nhap: true
ma_xem_truoc: abc123xyz9
---`;

function lesson(deBai: string, loiGiai = 'Đáp số: 62.'): string {
  return `${header}\n\n## Đề bài\n\n${deBai}\n\n## Lời giải\n\n${loiGiai}\n`;
}

function errorCodes(source: string, files?: string[]) {
  return validateLessonSource(source, { availableFiles: files }).errors.map((issue) => issue.code);
}

describe('validateLessonSource', () => {
  it('chấp nhận bài hợp lệ có đủ loại khối', () => {
    const source = lesson(
      [
        'Bài 1. Đặt tính rồi tính: 37 + 25.',
        '',
        '::hinh{loai=tao so-luong=5}',
        '',
        '![Phiếu bài tập](phieu.jpg)',
        '',
        '![video](clip.mp4)',
        '',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ].join('\n'),
    );
    const result = validateLessonSource(source, { availableFiles: ['phieu.jpg', 'clip.mp4'] });
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.lesson?.deBai.blocks.map((block) => block.kind)).toEqual([
      'text',
      'illustration',
      'image',
      'video',
      'youtube',
    ]);
  });

  it('báo lỗi khi đầu dòng viết thường', () => {
    expect(errorCodes(lesson('đặt tính rồi tính.'))).toContain('dau-cau-chu-thuong');
  });

  it('báo lỗi khi chữ sau dấu chấm viết thường', () => {
    expect(errorCodes(lesson('Bài 1. đặt tính rồi tính.'))).toContain('dau-cau-chu-thuong');
  });

  it('không báo lỗi với tên riêng giữa câu, dòng bắt đầu bằng số, a) và chỗ trống ...', () => {
    const source = lesson(
      [
        'Bạn Nam ở Hà Nội, bạn Lan ở Huế.',
        '37 + 25 = ?',
        'a) điền vần an hay ang.',
        '... ăn quả nhớ kẻ trồng cây.',
        'Con mèo ... con chuột.',
        '`x` là số cần tìm.',
      ].join('\n'),
    );
    expect(errorCodes(source)).toEqual([]);
  });

  it('báo lỗi chuỗi không ở dạng NFC', () => {
    const decomposed = lesson('Hòa bình.').normalize('NFD');
    expect(errorCodes(decomposed)).toContain('khong-nfc');
  });

  it('cảnh báo kiểu dấu cũ nhưng không chặn', () => {
    const result = validateLessonSource(lesson('Bạn Hòa rất khỏe.'));
    expect(result.ok).toBe(true);
    expect(result.warnings.map((issue) => issue.code)).toContain('kieu-dau-cu');
  });

  it('báo lỗi file media không có trong bài và đường dẫn nguy hiểm', () => {
    expect(errorCodes(lesson('![Ảnh](mat-tich.png)'), [])).toContain('thieu-file');
    expect(errorCodes(lesson('![Ảnh](../bi-mat.png)'), [])).toContain('ten-file-sai');
    expect(errorCodes(lesson('![Ảnh](http://example.com/a.png)'))).toContain('media-khong-an-toan');
  });

  it('báo lỗi hình minh hoạ không có hoặc số lượng sai', () => {
    expect(errorCodes(lesson('::hinh{loai=khung-long so-luong=3}'))).toContain('minh-hoa-khong-co');
    expect(errorCodes(lesson('::hinh{loai=tao so-luong=50}'))).toContain('minh-hoa-so-luong');
  });

  it('báo lỗi thiếu Đề bài và sai thông tin đầu bài', () => {
    expect(errorCodes(`${header}\n\n## Lời giải\n\nĐáp số.`)).toContain('thieu-de-bai');
    const badDate = lesson('Bài tập.').replace('2026-09-28', '2026-02-30');
    expect(errorCodes(badDate)).toContain('thong-tin-dau-bai');
    expect(errorCodes('## Đề bài\n\nBài.')).toContain('thong-tin-dau-bai');
  });

  it('báo lỗi nội dung nằm ngoài các phần', () => {
    expect(errorCodes(`${header}\nLạc chỗ.\n\n## Đề bài\n\nBài.`)).toContain('noi-dung-ngoai-phan');
  });

  it('cảnh báo câu thiếu dấu chấm cuối', () => {
    const result = validateLessonSource(lesson('Em hãy đọc bài thơ sau'));
    expect(result.warnings.map((issue) => issue.code)).toContain('thieu-dau-cau');
  });

  it('cho phép bỏ trống phần Lời giải', () => {
    const source = `${header}\n\n## Đề bài\n\nTính nhẩm.\n`;
    const result = validateLessonSource(source);
    expect(result.ok).toBe(true);
    expect(result.lesson?.loiGiai).toBeNull();
  });
});
