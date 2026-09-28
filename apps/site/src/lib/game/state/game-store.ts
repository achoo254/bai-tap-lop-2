/**
 * Kho tiến độ dùng chung trong một trang: đọc một lần, báo cho HUD/bản đồ mỗi khi đổi,
 * ghi xuống bộ nhớ sau một nhịp ngắn (gộp nhiều thay đổi liền nhau) và ghi ngay khi rời trang.
 */
import { loadGameState, saveGameState, type GameState, type KeyValueStorage } from './game-state';

export type GameStateListener = (state: GameState) => void;

export interface GameStore {
  getState(): GameState;
  update(change: (state: GameState) => GameState): GameState;
  subscribe(listener: GameStateListener): () => void;
  /** Ghi ngay những thay đổi đang chờ. */
  flush(): void;
}

export const SAVE_DELAY_MS = 300;

export function createGameStore(
  storage: KeyValueStorage,
  today: string,
  avatarName: string,
): GameStore {
  let state = loadGameState(storage, today, avatarName);
  const listeners = new Set<GameStateListener>();
  let pendingSave: ReturnType<typeof setTimeout> | null = null;

  function flush(): void {
    if (pendingSave === null) return;
    clearTimeout(pendingSave);
    pendingSave = null;
    saveGameState(storage, state);
  }

  return {
    getState: () => state,
    update(change) {
      state = change(state);
      for (const listener of listeners) listener(state);
      if (pendingSave !== null) clearTimeout(pendingSave);
      pendingSave = setTimeout(() => {
        pendingSave = null;
        saveGameState(storage, state);
      }, SAVE_DELAY_MS);
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    flush,
  };
}

let browserStore: GameStore | null = null;

/** Kho của trang hiện tại trên trình duyệt (tạo lần đầu gọi, ghi ngay khi trang bị ẩn/đóng). */
export function getBrowserGameStore(today: string, avatarName: string): GameStore {
  if (browserStore) return browserStore;
  let storage: KeyValueStorage;
  try {
    storage = window.localStorage;
  } catch {
    // Trình duyệt chặn bộ nhớ: tiến độ chỉ sống trong phiên này.
    const memory = new Map<string, string>();
    storage = {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => void memory.set(key, value),
    };
  }
  const store = createGameStore(storage, today, avatarName);
  window.addEventListener('pagehide', () => store.flush());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') store.flush();
  });
  browserStore = store;
  return store;
}
