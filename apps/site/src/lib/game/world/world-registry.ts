/**
 * apps/site/src/lib/game/world/world-registry.ts
 *
 * Sổ đăng ký các Thế giới học tập (World Registry).
 * Cho phép đăng ký thế giới mới theo năm học mà không chạm vào mã các thế giới cũ.
 */
import type { GradeId, SubjectId } from '../skills/skill-types';
import type { Chapter, Lesson, Quest, Region, World } from './world-types';
import { WORLD_LOP_2 } from '../../../worlds/lop-2/world';

const worldRegistry = new Map<string, World>();

// Đăng ký Thế giới Lớp 2 mặc định
worldRegistry.set(WORLD_LOP_2.grade, WORLD_LOP_2);

/** Đăng ký thêm một thế giới (dùng cho các năm học tiếp theo hoặc thế giới thử nghiệm). */
export function registerWorld(world: World): void {
  worldRegistry.set(world.grade, world);
}

/** Lấy danh sách toàn bộ các thế giới đã đăng ký. */
export function getAllWorlds(): World[] {
  return Array.from(worldRegistry.values());
}

/** Tìm thế giới theo mã lớp (`lop-2`, `lop-3`...). */
export function getWorld(grade: GradeId | string): World | undefined {
  return worldRegistry.get(grade);
}

/** Tìm một vùng môn học cụ thể trong thế giới. */
export function findRegion(grade: GradeId | string, subject: SubjectId): Region | undefined {
  const world = getWorld(grade);
  if (!world) return undefined;
  return world.regions.find((r) => r.id === subject);
}

export interface QuestLookupResult {
  quest: Quest;
  lesson: Lesson;
  chapter: Chapter;
  region: Region;
  world: World;
}

/**
 * Tìm kiếm nhanh một nhiệm vụ theo mã nhiệm vụ toàn cầu (`questId`)
 * Duyệt qua tất cả thế giới và các vùng để trả về thông tin đầy đủ.
 */
export function findQuest(questId: string): QuestLookupResult | undefined {
  for (const world of worldRegistry.values()) {
    for (const region of world.regions) {
      for (const chapter of region.chapters) {
        for (const lesson of chapter.lessons) {
          const quest = lesson.quests.find((q) => q.id === questId);
          if (quest) {
            return { quest, lesson, chapter, region, world };
          }
        }
      }
    }
  }
  return undefined;
}
