/**
 * Tính thưởng khi xong một nhiệm vụ (của một vùng môn học hoặc của một sự kiện) và ghi vào tiến độ.
 * - Sao đo mức thành thạo: 3 = đúng hết ngay lần đầu, 2 = tổng gợi ý ≤ 1, 1 = hoàn thành.
 * - Xu: câu đúng ngay 5 xu, câu phải gợi ý 2 xu; combo (đúng liên tiếp) cộng thêm tới +4 xu/câu.
 *   Sai chỉ làm mất combo, không bị trừ xu.
 * - XP: 10 mỗi câu + 10 mỗi sao; nhiệm vụ boss nhân đôi xu và thêm 50 XP.
 */
import { recordAnswer } from './adaptive-difficulty';
import { levelForXp } from './level-table';
import type { GameState } from '../state/game-state';
import type { SkillId } from '../skills/skill-types';

export interface AnswerRecord {
  skill: SkillId;
  correctFirstTry: boolean;
  /** Số bậc gợi ý đã mở (0–3). */
  hintsUsed: number;
}

export interface QuestResult {
  /** Khoá nhiệm vụ "<lớp>/<vùng hoặc sự kiện>/<nhiệm vụ>". */
  questId: string;
  isBoss: boolean;
  answers: AnswerRecord[];
}

export interface QuestReward {
  stars: 1 | 2 | 3;
  coins: number;
  xp: number;
  bestCombo: number;
  playerLevelBefore: number;
  playerLevelAfter: number;
  /** Lần đầu đạt số sao này trở lên ở nhiệm vụ này. */
  newBestStars: boolean;
}

export const COINS_FIRST_TRY = 5;
export const COINS_AFTER_HINT = 2;
export const MAX_COMBO_BONUS = 4;
export const XP_PER_ANSWER = 10;
export const XP_PER_STAR = 10;
export const BOSS_XP_BONUS = 50;

export function starsFor(answers: readonly AnswerRecord[]): 1 | 2 | 3 {
  const totalHints = answers.reduce((sum, answer) => sum + answer.hintsUsed, 0);
  if (answers.every((answer) => answer.correctFirstTry) && totalHints === 0) return 3;
  if (totalHints <= 1) return 2;
  return 1;
}

export function calculateReward(
  result: QuestResult,
): Omit<QuestReward, 'playerLevelBefore' | 'playerLevelAfter' | 'newBestStars'> {
  let combo = 0;
  let bestCombo = 0;
  let coins = 0;
  for (const answer of result.answers) {
    if (answer.correctFirstTry) {
      combo += 1;
      bestCombo = Math.max(bestCombo, combo);
      coins += COINS_FIRST_TRY + Math.min(combo - 1, MAX_COMBO_BONUS);
    } else {
      combo = 0;
      coins += COINS_AFTER_HINT;
    }
  }
  const stars = starsFor(result.answers);
  let xp = result.answers.length * XP_PER_ANSWER + stars * XP_PER_STAR;
  if (result.isBoss) {
    coins *= 2;
    xp += BOSS_XP_BONUS;
  }
  return { stars, coins, xp, bestCombo };
}

/** Ghi kết quả nhiệm vụ vào tiến độ (không đổi state cũ) và trả về phần thưởng để màn thưởng hiển thị. */
export function applyQuestResult(
  state: GameState,
  result: QuestResult,
  today: string,
): { state: GameState; reward: QuestReward } {
  const base = calculateReward(result);
  const mastery = { ...state.mastery };
  for (const answer of result.answers) {
    mastery[answer.skill] = recordAnswer(mastery[answer.skill], answer.correctFirstTry, today);
  }
  const previous = state.quests[result.questId];
  const newBestStars = !previous || base.stars > previous.stars;
  const quests = newBestStars
    ? { ...state.quests, [result.questId]: { stars: base.stars, completedOn: today } }
    : state.quests;
  const xp = state.xp + base.xp;
  return {
    state: { ...state, coins: state.coins + base.coins, xp, mastery, quests },
    reward: {
      ...base,
      playerLevelBefore: levelForXp(state.xp),
      playerLevelAfter: levelForXp(xp),
      newBestStars,
    },
  };
}
