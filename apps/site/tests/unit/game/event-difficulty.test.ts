import { describe, expect, it } from 'vitest';
import { calculateEventDifficulty } from '../../../src/lib/game/events/event-difficulty';

describe('event-difficulty: Tính toán bậc khó từ mastery + boost', () => {
  it('nâng bậc theo đúng mức boost', () => {
    expect(calculateEventDifficulty(1, 1)).toBe(2);
    expect(calculateEventDifficulty(2, 1)).toBe(3);
    expect(calculateEventDifficulty(3, 2)).toBe(5);
  });

  it('không vượt quá bậc 5 (MAX_DIFFICULTY)', () => {
    expect(calculateEventDifficulty(4, 2)).toBe(5);
    expect(calculateEventDifficulty(5, 1)).toBe(5);
    expect(calculateEventDifficulty(5, 3)).toBe(5);
  });

  it('không thấp hơn bậc 1 (MIN_DIFFICULTY)', () => {
    expect(calculateEventDifficulty(1, 0)).toBe(1);
    expect(calculateEventDifficulty(1, -2)).toBe(1);
  });

  it('mặc định không có boost thì giữ nguyên bậc cơ sở', () => {
    expect(calculateEventDifficulty(3)).toBe(3);
    expect(calculateEventDifficulty(4)).toBe(4);
  });
});
