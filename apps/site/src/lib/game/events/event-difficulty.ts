/**
 * apps/site/src/lib/game/events/event-difficulty.ts
 *
 * Tính toán bậc độ khó (difficulty level 1–5) của nhiệm vụ trong sự kiện:
 * Bậc khó = min(5, max(1, mastery[skill].level + difficultyBoost)).
 * Ví dụ: TIMO nâng độ khó thêm +1 bậc so với tiến độ hiện tại của bé ở môn Toán Base.
 */
import { MAX_DIFFICULTY, MIN_DIFFICULTY, type DifficultyLevel } from '../skills/skill-types';

export function calculateEventDifficulty(
  baseMasteryLevel: number,
  difficultyBoost: number = 0,
): DifficultyLevel {
  const target = baseMasteryLevel + difficultyBoost;
  const clamped = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, target));
  return clamped as DifficultyLevel;
}
