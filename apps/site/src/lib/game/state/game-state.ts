/**
 * Toàn bộ tiến độ của Miu trong Thế giới học tập (mọi môn và mọi sự kiện), lưu trên máy
 * (localStorage) dưới một khoá có phiên bản. Dữ liệu đọc lên luôn đi qua schema: hỏng thì khởi tạo
 * lại và cất bản hỏng sang khoá riêng để bố mẹ còn khôi phục được; thiếu kỹ năng mới (khi game thêm
 * kỹ năng/môn) thì tự bổ sung. Trường mới thêm về sau phải có `.default()` để bản lưu cũ vẫn đọc được.
 */
import { z } from 'zod';
import {
  MAX_DIFFICULTY,
  MIN_DIFFICULTY,
  SKILL_IDS,
  type DifficultyLevel,
  type SkillId,
} from '../skills/skill-types';

export const GAME_STATE_KEY = 'the-gioi:v1';
export const CORRUPT_STATE_KEY = 'the-gioi:hong';
export const SCHEMA_VERSION = 1;
/** Số lần trả lời gần nhất giữ lại cho mỗi kỹ năng (để tính độ khó và cho trang bố mẹ). */
export const MASTERY_HISTORY_SIZE = 20;

const isoDay = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const difficulty = z
  .number()
  .int()
  .min(MIN_DIFFICULTY)
  .max(MAX_DIFFICULTY)
  .transform((value) => value as DifficultyLevel);

const skillMasterySchema = z.object({
  level: difficulty,
  /** true = đúng ngay lần đầu, không cần gợi ý. Mới nhất ở cuối. */
  history: z.array(z.boolean()).max(MASTERY_HISTORY_SIZE),
  /** Số câu đã trả lời kể từ lần đổi bậc gần nhất (tránh lên/xuống bậc liên tục). */
  sinceLevelChange: z.number().int().min(0),
  /** Mèo con cần chiếu lại mẹo ở lần chơi tới (vừa bị xuống bậc). */
  needsTip: z.boolean(),
  lastPlayed: isoDay.nullable(),
});

const questProgressSchema = z.object({
  stars: z.number().int().min(1).max(3),
  completedOn: isoDay,
});

const eventProgressSchema = z.object({
  completedQuests: z
    .record(
      z.string(),
      z.object({
        stars: z.number().int().min(1).max(3),
        completedOn: isoDay,
      }),
    )
    .default({}),
  completedChallenges: z.array(z.string()).default([]),
  unlockedBadges: z.array(z.string()).default([]),
  personalBest: z
    .object({
      score: z.number().int().min(0).default(0),
      fastestSeconds: z.number().int().min(0).optional(),
      achievedOn: isoDay.optional(),
    })
    .default({ score: 0 }),
  hasSeenIntro: z.boolean().default(false),
  lastVisited: isoDay.nullable().default(null),
});

const gameStateSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  createdOn: isoDay,
  coins: z.number().int().min(0),
  xp: z.number().int().min(0),
  /** Nhân vật của bé; createdOn = null nghĩa là chưa qua màn tạo nhân vật. */
  avatar: z.object({
    name: z.string().trim().min(1).max(20),
    furColor: z.string(),
    accessories: z.array(z.string()),
    createdOn: isoDay.nullable(),
  }),
  mastery: z.record(z.string(), skillMasterySchema),
  /** Sao tốt nhất của từng nhiệm vụ, khoá là "<lớp>/<vùng hoặc sự kiện>/<nhiệm vụ>". */
  quests: z.record(z.string(), questProgressSchema),
  /** Tiến độ sự kiện, khoá là "<lớp>/<eventId>", ví dụ "lop-2/timo". */
  events: z.record(z.string(), eventProgressSchema).default({}),
  inventory: z.array(z.string()),
  achievements: z.array(z.string()),
  streak: z.object({
    current: z.number().int().min(0),
    best: z.number().int().min(0),
    lastDay: isoDay.nullable(),
  }),
});

export type SkillMastery = z.infer<typeof skillMasterySchema>;
export type QuestProgress = z.infer<typeof questProgressSchema>;
export type EventProgress = z.infer<typeof eventProgressSchema>;
export type GameState = Omit<z.infer<typeof gameStateSchema>, 'mastery'> & {
  mastery: Record<SkillId, SkillMastery>;
};

/** Phần của Storage mà game cần; test truyền bộ nhớ giả. */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const DEFAULT_FUR_COLOR = '#ffb45c';

export function createInitialMastery(): SkillMastery {
  return {
    level: MIN_DIFFICULTY,
    history: [],
    sinceLevelChange: 0,
    needsTip: false,
    lastPlayed: null,
  };
}

export function createInitialState(today: string, avatarName: string): GameState {
  const mastery = Object.fromEntries(SKILL_IDS.map((id) => [id, createInitialMastery()])) as Record<
    SkillId,
    SkillMastery
  >;
  return {
    schemaVersion: SCHEMA_VERSION,
    createdOn: today,
    coins: 0,
    xp: 0,
    avatar: {
      name: avatarName,
      furColor: DEFAULT_FUR_COLOR,
      accessories: ['no-hong'],
      createdOn: null,
    },
    mastery,
    quests: {},
    events: {},
    inventory: [],
    achievements: [],
    streak: { current: 0, best: 0, lastDay: null },
  };
}

export function createInitialEventProgress(): EventProgress {
  return {
    completedQuests: {},
    completedChallenges: [],
    unlockedBadges: [],
    personalBest: { score: 0 },
    hasSeenIntro: false,
    lastVisited: null,
  };
}

export function ensureEventProgress(state: GameState, eventFullId: string): EventProgress {
  return (
    state.events[eventFullId] ?? {
      completedQuests: {},
      completedChallenges: [],
      unlockedBadges: [],
      personalBest: { score: 0 },
      hasSeenIntro: false,
      lastVisited: null,
    }
  );
}

export function recordEventQuestCompletion(
  state: GameState,
  eventFullId: string,
  questId: string,
  stars: number,
  today: string,
): GameState {
  const currentEvent = ensureEventProgress(state, eventFullId);
  const prevQuest = currentEvent.completedQuests[questId];
  const bestStars = Math.max(prevQuest?.stars ?? 0, Math.min(3, Math.max(1, stars)));

  return {
    ...state,
    events: {
      ...state.events,
      [eventFullId]: {
        ...currentEvent,
        completedQuests: {
          ...currentEvent.completedQuests,
          [questId]: {
            stars: bestStars,
            completedOn: today,
          },
        },
        lastVisited: today,
      },
    },
  };
}

export function markEventIntroSeen(
  state: GameState,
  eventFullId: string,
  today: string,
): GameState {
  const currentEvent = ensureEventProgress(state, eventFullId);
  return {
    ...state,
    events: {
      ...state.events,
      [eventFullId]: {
        ...currentEvent,
        hasSeenIntro: true,
        lastVisited: today,
      },
    },
  };
}

/**
 * Đưa dữ liệu đọc từ bộ nhớ về dạng hiện hành. Trả null nếu không hợp lệ.
 * Khi nâng SCHEMA_VERSION: thêm bước chuyển từ bản cũ ở đây trước khi parse.
 */
export function migrateGameState(raw: unknown): GameState | null {
  const parsed = gameStateSchema.safeParse(raw);
  if (!parsed.success) return null;
  const mastery = { ...parsed.data.mastery };
  for (const id of SKILL_IDS) mastery[id] ??= createInitialMastery();
  return { ...parsed.data, mastery: mastery as Record<SkillId, SkillMastery> };
}

function readStoredText(storage: KeyValueStorage): string | null {
  try {
    return storage.getItem(GAME_STATE_KEY);
  } catch {
    return null;
  }
}

function parseStoredText(text: string): GameState | null {
  try {
    return migrateGameState(JSON.parse(text));
  } catch {
    return null;
  }
}

export function loadGameState(
  storage: KeyValueStorage,
  today: string,
  avatarName: string,
): GameState {
  const text = readStoredText(storage);
  if (text === null) return createInitialState(today, avatarName);
  const state = parseStoredText(text);
  if (state) return state;
  try {
    storage.setItem(CORRUPT_STATE_KEY, text);
  } catch {
    // Không cất được bản hỏng: vẫn chơi tiếp với tiến độ mới.
  }
  return createInitialState(today, avatarName);
}

export function saveGameState(storage: KeyValueStorage, state: GameState): boolean {
  try {
    storage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
