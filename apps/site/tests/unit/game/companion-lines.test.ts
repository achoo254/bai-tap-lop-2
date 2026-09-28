import { describe, expect, it } from 'vitest';
import {
  CONTEXT_LINES,
  detectCompanionContext,
  linesForContext,
  personalize,
  pickLine,
  REACTION_LINES,
  timeOfDayLines,
} from '../../../src/lib/game/companion/companion-lines';

describe('lời nói nhân vật đồng hành', () => {
  it.each([
    ['/', undefined, 'trang-chu'],
    ['/cac-bai/', undefined, 'danh-sach-bai'],
    ['/bai/2026-09-25-cong-co-nho/', 'toan', 'bai-toan'],
    ['/bai/2026-09-28-cau-thu-du-bi/', 'tieng-viet', 'bai-tieng-viet'],
    ['/bai/x/', 'khac', 'bai-khac'],
    ['/the-gioi/', undefined, 'cong-the-gioi'],
    ['/the-gioi/tao-nhan-vat/', undefined, 'tao-nhan-vat'],
    ['/the-gioi/choi/', undefined, 'nhiem-vu'],
    ['/the-gioi/lop-2/', undefined, 'ban-do'],
    ['/the-gioi/lop-2/toan/', undefined, 'vung-toan'],
    ['/the-gioi/lop-2/tieng-viet', undefined, 'vung-tieng-viet'],
    ['/the-gioi/lop-2/su-kien/timo/', undefined, 'su-kien'],
    ['/luyen-timo/keo-chan-le/', undefined, 'luyen-timo'],
    ['/trang-la/', undefined, 'chung'],
  ])('nhận ra màn %s', (path, subject, expected) => {
    expect(detectCompanionContext(path, subject)).toBe(expected);
  });

  it('mỗi màn có ít nhất 2 câu để nói', () => {
    for (const lines of Object.values(CONTEXT_LINES))
      expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  it('câu riêng của màn chiếm nhiều hơn câu chung', () => {
    const lines = linesForContext('vung-toan', 9);
    const own = lines.filter((l) => CONTEXT_LINES['vung-toan'].includes(l)).length;
    expect(own).toBeGreaterThan(lines.length / 2);
  });

  it('có câu theo buổi trong ngày', () => {
    expect(timeOfDayLines(8).length).toBeGreaterThan(0);
    expect(timeOfDayLines(22)[0].pose).toBe('buon');
  });

  it('thay tên nhân vật bé đặt vào câu nói', () => {
    expect(personalize({ pose: 'vui', text: 'Chào {ten}! {ten} giỏi quá' }, 'Bơ').text).toBe(
      'Chào Bơ! Bơ giỏi quá',
    );
  });

  it('không lặp lại câu vừa nói', () => {
    const lines = REACTION_LINES.correct;
    const first = lines[0];
    for (let i = 0; i < 20; i++) {
      expect(pickLine(lines, first.text, () => 0).text).not.toBe(first.text);
    }
  });
});
