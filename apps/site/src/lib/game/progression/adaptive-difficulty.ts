/**
 * Độ khó tự điều chỉnh cho từng kỹ năng:
 * - Đúng ngay lần đầu 3 câu liên tiếp → lên một bậc.
 * - Sai (cần gợi ý) ≥ 2 trong 3 câu gần nhất → xuống một bậc và bật cờ "cần mẹo".
 * Chỉ xét các câu từ lần đổi bậc gần nhất, để một chuỗi đúng không đẩy bé lên nhiều bậc một lúc.
 */
import { MASTERY_HISTORY_SIZE, type SkillMastery } from '../state/game-state';
import { MAX_DIFFICULTY, MIN_DIFFICULTY, type DifficultyLevel } from '../skills/skill-types';

export const LEVEL_UP_STREAK = 3;
export const LEVEL_DOWN_WINDOW = 3;
export const LEVEL_DOWN_MISSES = 2;

export function recordAnswer(
  mastery: SkillMastery,
  correctFirstTry: boolean,
  today: string,
): SkillMastery {
  const history = [...mastery.history, correctFirstTry].slice(-MASTERY_HISTORY_SIZE);
  const sinceLevelChange = mastery.sinceLevelChange + 1;
  const recent = history.slice(-Math.min(sinceLevelChange, LEVEL_DOWN_WINDOW));
  const base = { ...mastery, history, lastPlayed: today };

  const streakReady =
    sinceLevelChange >= LEVEL_UP_STREAK && history.slice(-LEVEL_UP_STREAK).every(Boolean);
  if (streakReady && mastery.level < MAX_DIFFICULTY) {
    return {
      ...base,
      level: (mastery.level + 1) as DifficultyLevel,
      sinceLevelChange: 0,
      needsTip: false,
    };
  }

  const misses = recent.filter((correct) => !correct).length;
  if (misses >= LEVEL_DOWN_MISSES && mastery.level > MIN_DIFFICULTY) {
    return {
      ...base,
      level: (mastery.level - 1) as DifficultyLevel,
      sinceLevelChange: 0,
      needsTip: true,
    };
  }

  return { ...base, sinceLevelChange, needsTip: correctFirstTry ? false : mastery.needsTip };
}
