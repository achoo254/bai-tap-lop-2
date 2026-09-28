import { afterEach, describe, expect, it, vi } from 'vitest';
import { createGameStore, SAVE_DELAY_MS } from '../../../src/lib/game/state/game-store';
import { GAME_STATE_KEY, type KeyValueStorage } from '../../../src/lib/game/state/game-state';
import {
  clearSkillRegistryForTest,
  getSkill,
  isSkillRegistered,
  registerSkill,
} from '../../../src/lib/game/skills/skill-registry';
import type { Challenge, SkillDefinition } from '../../../src/lib/game/skills/skill-types';

function memoryStorage(): KeyValueStorage & { writes: number; data: Map<string, string> } {
  const data = new Map<string, string>();
  const storage = {
    data,
    writes: 0,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.writes += 1;
      data.set(key, value);
    },
  };
  return storage;
}

describe('game store', () => {
  afterEach(() => vi.useRealTimers());

  it('báo cho người nghe ngay và gộp nhiều thay đổi thành một lần ghi', () => {
    vi.useFakeTimers();
    const storage = memoryStorage();
    const store = createGameStore(storage, '2026-09-28', 'Miu');
    const seen: number[] = [];
    store.subscribe((state) => seen.push(state.coins));
    store.update((state) => ({ ...state, coins: 1 }));
    store.update((state) => ({ ...state, coins: 2 }));
    expect(seen).toEqual([1, 2]);
    expect(storage.writes).toBe(0);
    vi.advanceTimersByTime(SAVE_DELAY_MS);
    expect(storage.writes).toBe(1);
    expect(JSON.parse(storage.data.get(GAME_STATE_KEY) ?? '{}').coins).toBe(2);
  });

  it('flush ghi ngay thay đổi đang chờ', () => {
    vi.useFakeTimers();
    const storage = memoryStorage();
    const store = createGameStore(storage, '2026-09-28', 'Miu');
    store.update((state) => ({ ...state, xp: 7 }));
    store.flush();
    expect(storage.writes).toBe(1);
    vi.advanceTimersByTime(SAVE_DELAY_MS * 2);
    expect(storage.writes).toBe(1);
  });

  it('huỷ đăng ký thì không nhận thông báo nữa', () => {
    const store = createGameStore(memoryStorage(), '2026-09-28', 'Miu');
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.update((state) => ({ ...state, coins: 3 }));
    expect(listener).not.toHaveBeenCalled();
    store.flush();
  });
});

describe('sổ đăng ký kỹ năng', () => {
  afterEach(() => clearSkillRegistryForTest());

  const fake: SkillDefinition<Challenge<null, number>> = {
    id: 'lop-2/chan-le',
    generate: (level) => ({
      skill: 'lop-2/chan-le',
      level,
      prompt: '',
      promptEn: '',
      data: null,
      answer: 1,
    }),
    isCorrect: (challenge, answer) => answer === challenge.answer,
    hints: () => [
      { step: 1, speech: 'a' },
      { step: 2, speech: 'b' },
      { step: 3, speech: 'c' },
    ],
  };

  it('đăng ký rồi lấy ra được, đăng ký trùng thì báo lỗi', () => {
    expect(isSkillRegistered('lop-2/chan-le')).toBe(false);
    registerSkill(fake);
    expect(getSkill('lop-2/chan-le').isCorrect(fake.generate(1, Math.random), 1)).toBe(true);
    expect(() => registerSkill(fake)).toThrow();
  });

  it('lấy kỹ năng chưa nạp thì báo lỗi rõ ràng', () => {
    expect(() => getSkill('lop-2/khoi-3d')).toThrow(/khoi-3d/);
  });
});

describe('danh mục kỹ năng theo thế giới', () => {
  it('mã kỹ năng có tiền tố lớp và lọc được theo lớp + môn', async () => {
    const { SKILL_IDS, SKILLS, skillsOf } =
      await import('../../../src/lib/game/skills/skill-types');
    expect(SKILL_IDS.every((id) => id.startsWith(`${SKILLS[id].grade}/`))).toBe(true);
    expect(skillsOf('lop-2', 'toan')).toContain('lop-2/cong-tru-100');
    expect(skillsOf('lop-2', 'tieng-viet')).toContain('lop-2/doc-hieu');
  });
});
