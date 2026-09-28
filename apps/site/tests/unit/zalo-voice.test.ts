import { describe, expect, it } from 'vitest';
import {
  findZaloVoice,
  splitForSpeech,
  toZaloSpeed,
  zaloAudioUrl,
} from '../../src/lib/game/media/zalo-voice';

describe('giọng Zalo phía trình duyệt', () => {
  it('nhận ra tên giọng Zalo, bỏ qua giọng của máy', () => {
    expect(findZaloVoice('zalo:1')?.speaker).toBe(1);
    expect(findZaloVoice('Linh')).toBeUndefined();
    expect(findZaloVoice(null)).toBeUndefined();
  });

  it('câu ngắn giữ nguyên một đoạn', () => {
    expect(splitForSpeech('  Chào   Miu!  ')).toEqual(['Chào Miu!']);
  });

  it('đoạn dài chia theo câu, không đoạn nào vượt giới hạn', () => {
    const text = 'Gấu con rất muốn chơi. '.repeat(30);
    const chunks = splitForSpeech(text, 100);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(100);
    expect(chunks.join(' ').replace(/\s+/g, ' ')).toBe(text.trim().replace(/\s+/g, ' '));
  });

  it('câu quá dài không có dấu chấm vẫn được cắt theo từ', () => {
    const chunks = splitForSpeech('một hai ba bốn năm sáu bảy tám chín mười '.repeat(20), 60);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(60);
  });

  it('tốc độ quy về thang 0,8–1,2 của Zalo', () => {
    expect(toZaloSpeed(0.9)).toBe(1);
    expect(toZaloSpeed(0.3)).toBe(0.8);
    expect(toZaloSpeed(2)).toBe(1.2);
  });

  it('tạo đường dẫn tới Worker', () => {
    expect(zaloAudioUrl(3, 1, 'Bé ơi')).toBe(
      '/api/doc?giong=3&toc-do=1.0&noi-dung=B%C3%A9+%C6%A1i',
    );
  });
});
