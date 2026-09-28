import { describe, expect, it } from 'vitest';
import { pickLessonsForToday, todayInVietnam } from '../../src/lib/today-lesson-picker';

const lessons = [
  { id: '2026-09-25-a', ngay: '2026-09-25' },
  { id: '2026-09-26-b', ngay: '2026-09-26' },
  { id: '2026-09-26-c', ngay: '2026-09-26' },
  { id: '2026-10-01-d', ngay: '2026-10-01' },
];

describe('pickLessonsForToday', () => {
  it('trả mọi bài của hôm nay', () => {
    expect(pickLessonsForToday(lessons, '2026-09-26')).toEqual({
      mode: 'hom-nay',
      ngay: '2026-09-26',
      ids: ['2026-09-26-b', '2026-09-26-c'],
    });
  });

  it('không có bài hôm nay thì lấy ngày gần nhất đã qua', () => {
    expect(pickLessonsForToday(lessons, '2026-09-28').ids).toEqual([
      '2026-09-26-b',
      '2026-09-26-c',
    ]);
  });

  it('chưa có bài nào đã qua thì lấy bài sắp tới', () => {
    expect(pickLessonsForToday(lessons, '2026-09-01')).toMatchObject({
      mode: 'sap-toi',
      ngay: '2026-09-25',
    });
  });

  it('không có bài', () => {
    expect(pickLessonsForToday([], '2026-09-01').mode).toBe('trong');
  });
});

describe('todayInVietnam', () => {
  it('dùng giờ Việt Nam (UTC+7)', () => {
    expect(todayInVietnam(new Date('2026-09-26T18:30:00Z'))).toBe('2026-09-27');
    expect(todayInVietnam(new Date('2026-09-26T16:59:00Z'))).toBe('2026-09-26');
  });
});
