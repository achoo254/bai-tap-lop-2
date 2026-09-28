import { describe, expect, it } from 'vitest';
import {
  CORRUPT_STATE_KEY,
  GAME_STATE_KEY,
  createInitialState,
  loadGameState,
  migrateGameState,
  saveGameState,
  type KeyValueStorage,
} from '../../../src/lib/game/state/game-state';
import { SKILL_IDS } from '../../../src/lib/game/skills/skill-types';

function memoryStorage(
  initial: Record<string, string> = {},
): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  };
}

const TODAY = '2026-09-28';

describe('createInitialState', () => {
  it('có đủ mọi kỹ năng ở bậc 1, chưa có xu/XP, chưa tạo nhân vật', () => {
    const state = createInitialState(TODAY, 'Miu');
    expect(Object.keys(state.mastery).sort()).toEqual([...SKILL_IDS].sort());
    expect(Object.values(state.mastery).every((mastery) => mastery.level === 1)).toBe(true);
    expect(state.coins).toBe(0);
    expect(state.xp).toBe(0);
    expect(state.avatar).toMatchObject({ name: 'Miu', createdOn: null });
  });
});

describe('lưu và đọc tiến độ', () => {
  it('đọc lại đúng những gì đã lưu', () => {
    const storage = memoryStorage();
    const state = { ...createInitialState(TODAY, 'Miu'), coins: 42, xp: 130 };
    expect(saveGameState(storage, state)).toBe(true);
    expect(loadGameState(storage, '2026-10-01', 'Miu')).toEqual(state);
  });

  it('máy chưa có tiến độ thì bắt đầu mới', () => {
    expect(loadGameState(memoryStorage(), TODAY, 'Miu')).toEqual(createInitialState(TODAY, 'Miu'));
  });

  it('dữ liệu hỏng thì bắt đầu mới và cất bản hỏng sang khoá riêng', () => {
    const storage = memoryStorage({ [GAME_STATE_KEY]: '{"schemaVersion":1,"coins":-5' });
    const state = loadGameState(storage, TODAY, 'Miu');
    expect(state).toEqual(createInitialState(TODAY, 'Miu'));
    expect(storage.data.get(CORRUPT_STATE_KEY)).toBe('{"schemaVersion":1,"coins":-5');
  });

  it('dữ liệu sai kiểu (xu âm) bị coi là hỏng', () => {
    const bad = { ...createInitialState(TODAY, 'Miu'), coins: -1 };
    expect(migrateGameState(bad)).toBeNull();
  });

  it('bộ nhớ ném lỗi khi đọc thì vẫn chơi được với tiến độ mới', () => {
    const storage: KeyValueStorage = {
      getItem: () => {
        throw new Error('bị chặn');
      },
      setItem: () => undefined,
    };
    expect(loadGameState(storage, TODAY, 'Miu')).toEqual(createInitialState(TODAY, 'Miu'));
  });

  it('bản lưu thiếu kỹ năng (game thêm kỹ năng mới) được bổ sung kỹ năng đó ở bậc 1', () => {
    const state = createInitialState(TODAY, 'Miu');
    const rest: Partial<typeof state.mastery> = { ...state.mastery };
    delete rest['lop-2/khoi-3d'];
    const migrated = migrateGameState({ ...state, mastery: rest });
    expect(migrated?.mastery['lop-2/khoi-3d']?.level).toBe(1);
  });
});
