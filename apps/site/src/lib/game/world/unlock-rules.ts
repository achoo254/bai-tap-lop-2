/**
 * apps/site/src/lib/game/world/unlock-rules.ts
 *
 * Kiểm tra các điều kiện mở khoá nhiệm vụ và chương trong thế giới game.
 */
import type { GameState } from '../state/game-state';
import type { Chapter, Quest, Region, World } from './world-types';

/** Kiểm tra xem một nhiệm vụ đã hoàn thành hay chưa. */
export function isQuestCompleted(questId: string, state: GameState): boolean {
  return Boolean(state.quests[questId]?.completedOn);
}

/** Lấy số sao cao nhất của một nhiệm vụ (0 nếu chưa làm). */
export function getQuestStars(questId: string, state: GameState): number {
  return state.quests[questId]?.stars ?? 0;
}

/** Tính tổng số sao đã đạt được trong toàn bộ trò chơi. */
export function getTotalStars(state: GameState): number {
  return Object.values(state.quests).reduce((total, q) => total + (q.stars || 0), 0);
}

/** Kiểm tra xem nhiệm vụ cụ thể có đủ điều kiện mở khoá hay không. */
export function isQuestUnlocked(quest: Quest, state: GameState, world?: World): boolean {
  const rule = quest.unlock;

  switch (rule.type) {
    case 'always':
      return true;

    case 'quest-completed':
      return isQuestCompleted(rule.questId, state);

    case 'stars-required':
      return getTotalStars(state) >= rule.count;

    case 'chapter-completed': {
      if (!world) return false;
      // Tìm chương cần hoàn thành trong thế giới
      for (const region of world.regions) {
        const chapter = region.chapters.find((c) => c.id === rule.chapterId);
        if (chapter) {
          const allQuests = chapter.lessons.flatMap((l) => l.quests);
          return allQuests.every((q) => isQuestCompleted(q.id, state));
        }
      }
      return false;
    }

    default:
      return true;
  }
}

/** Tính tiến độ của một chương (số nhiệm vụ hoàn thành, số sao). */
export function getChapterProgress(
  chapter: Chapter,
  state: GameState,
): { completedQuests: number; totalQuests: number; starsEarned: number; maxStars: number } {
  const quests = chapter.lessons.flatMap((l) => l.quests);
  const totalQuests = quests.length;
  let completedQuests = 0;
  let starsEarned = 0;

  for (const q of quests) {
    const stars = getQuestStars(q.id, state);
    if (stars > 0) {
      completedQuests++;
      starsEarned += stars;
    }
  }

  return {
    completedQuests,
    totalQuests,
    starsEarned,
    maxStars: totalQuests * 3,
  };
}

/** Tính tiến độ tổng quan của một vùng môn học. */
export function getRegionProgress(
  region: Region,
  state: GameState,
): { completedQuests: number; totalQuests: number; starsEarned: number } {
  let completedQuests = 0;
  let totalQuests = 0;
  let starsEarned = 0;

  for (const chapter of region.chapters) {
    const prog = getChapterProgress(chapter, state);
    completedQuests += prog.completedQuests;
    totalQuests += prog.totalQuests;
    starsEarned += prog.starsEarned;
  }

  return { completedQuests, totalQuests, starsEarned };
}
