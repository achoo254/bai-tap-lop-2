/**
 * apps/site/tests/unit/game/world.test.ts
 *
 * Kiểm tra các yêu cầu của Phase 3 - Kiến trúc Thế giới học tập:
 * 1. Cấu trúc Thế giới Lớp 2 (World, Region, Chapter, Lesson, Quest).
 * 2. Quy tắc mở khoá nhiệm vụ (always, quest-completed, stars-required, chapter-completed).
 * 3. Lịch mở thế giới theo năm học (world-calendar).
 * 4. Khả năng cắm thêm Thế giới mới (lop-3) độc lập mà không chạm hay làm hỏng Thế giới Lớp 2.
 */
import { describe, expect, it } from 'vitest';
import { createInitialState } from '../../../src/lib/game/state/game-state';
import {
  findQuest,
  findRegion,
  getAllWorlds,
  getWorld,
  registerWorld,
} from '../../../src/lib/game/world/world-registry';
import {
  getChapterProgress,
  getQuestStars,
  getRegionProgress,
  getTotalStars,
  isQuestCompleted,
  isQuestUnlocked,
} from '../../../src/lib/game/world/unlock-rules';
import { getWorldOpeningStatus, isWorldOpen } from '../../../src/lib/game/world/world-calendar';
import { WORLD_LOP_2 } from '../../../src/worlds/lop-2/world';
import type { World, Quest } from '../../../src/lib/game/world/world-types';

describe('Kiến trúc Thế giới học tập (Phase 3 World Shell)', () => {
  const dummyState = createInitialState('2026-09-28', 'Miu');

  describe('Cấu hình Thế giới Lớp 2 (WORLD_LOP_2)', () => {
    it('chứa đầy đủ thông tin nhận diện thế giới', () => {
      expect(WORLD_LOP_2.grade).toBe('lop-2');
      expect(WORLD_LOP_2.name).toBe('Thế giới Lớp 2');
      expect(WORLD_LOP_2.schoolYear).toBe('2026–2027');
      expect(WORLD_LOP_2.opensOn).toBe('2026-09-05');
      expect(WORLD_LOP_2.regions.length).toBe(3);
    });

    it('có 3 vùng môn học (Toán, Tiếng Việt, Tiếng Anh)', () => {
      const regionIds = WORLD_LOP_2.regions.map((r) => r.id);
      expect(regionIds).toContain('toan');
      expect(regionIds).toContain('tieng-viet');
      expect(regionIds).toContain('tieng-anh');

      const toan = WORLD_LOP_2.regions.find((r) => r.id === 'toan')!;
      expect(toan.status).toBe('open');
      expect(toan.guideNpc).toBe('bac-cu');
      expect(toan.chapters.length).toBeGreaterThan(0);
    });

    it('có điểm neo sự kiện (TIMO)', () => {
      expect(WORLD_LOP_2.eventAnchors).toBeDefined();
      const timoAnchor = WORLD_LOP_2.eventAnchors?.find((a) => a.id === 'su-kien-timo');
      expect(timoAnchor).toBeDefined();
      expect(timoAnchor?.name).toBe('Quần Đảo TIMO');
    });
  });

  describe('Sổ đăng ký thế giới (world-registry)', () => {
    it('tìm được thế giới Lớp 2 và các vùng', () => {
      expect(getAllWorlds().length).toBeGreaterThanOrEqual(1);
      expect(getWorld('lop-2')).toBeDefined();
      expect(findRegion('lop-2', 'toan')?.name).toBe('Vùng Toán');
    });

    it('tìm được nhiệm vụ bằng ID toàn cầu', () => {
      const q1Id = 'lop-2/toan/ch1/q1-dem-so';
      const result = findQuest(q1Id);
      expect(result).toBeDefined();
      expect(result?.quest.title).toBe('Thu Thập Kẹo Ngọt');
      expect(result?.world.grade).toBe('lop-2');
      expect(result?.region.id).toBe('toan');
      expect(result?.chapter.id).toBe('ch1-thung-lung-so');
    });

    it('cho phép cắm thêm Thế giới Lớp 3 mà không sửa đổi Thế giới Lớp 2 (Hard Invariant #5)', () => {
      const mockLop3World: World = {
        grade: 'lop-3' as unknown as import('../../../src/lib/game/skills/skill-types').GradeId,
        name: 'Thế giới Lớp 3',
        schoolYear: '2027–2028',
        opensOn: '2027-09-05',
        description: 'Thế giới Lớp 3 thử nghiệm',
        regions: [],
      };

      registerWorld(mockLop3World);
      expect(getWorld('lop-3')).toBeDefined();
      expect(getWorld('lop-3')?.name).toBe('Thế giới Lớp 3');

      // Thế giới Lớp 2 hoàn toàn giữ nguyên
      const lop2 = getWorld('lop-2')!;
      expect(lop2.regions.length).toBe(3);
      expect(lop2.grade).toBe('lop-2');
    });
  });

  describe('Quy tắc mở khoá nhiệm vụ (unlock-rules)', () => {
    it('nhiệm vụ đầu tiên luôn mở (always)', () => {
      const quest1 = WORLD_LOP_2.regions[0].chapters[0].lessons[0].quests[0];
      expect(isQuestUnlocked(quest1, dummyState)).toBe(true);
    });

    it('nhiệm vụ tiếp theo bị khoá khi chưa làm nhiệm vụ trước', () => {
      const quest2 = WORLD_LOP_2.regions[0].chapters[0].lessons[0].quests[1];
      expect(isQuestUnlocked(quest2, dummyState)).toBe(false);
    });

    it('mở khoá nhiệm vụ khi nhiệm vụ trước đã hoàn thành', () => {
      const quest2 = WORLD_LOP_2.regions[0].chapters[0].lessons[0].quests[1];
      const stateWithQ1Completed = {
        ...dummyState,
        quests: {
          'lop-2/toan/ch1/q1-dem-so': { stars: 3, completedOn: '2026-09-28' },
        },
      };

      expect(isQuestUnlocked(quest2, stateWithQ1Completed)).toBe(true);
      expect(isQuestCompleted('lop-2/toan/ch1/q1-dem-so', stateWithQ1Completed)).toBe(true);
      expect(getQuestStars('lop-2/toan/ch1/q1-dem-so', stateWithQ1Completed)).toBe(3);
    });

    it('hỗ trợ điều kiện mở khoá theo tổng số sao (stars-required)', () => {
      const starQuest: Quest = {
        id: 'test-star-quest',
        title: 'Nhiệm vụ cần sao',
        npc: 'bac-cu',
        intro: '',
        minigame: 'demo',
        skill: 'lop-2/chan-le',
        questions: 3,
        unlock: { type: 'stars-required', count: 5 },
        mapCoordinates: { x: 50, y: 50 },
      };

      expect(isQuestUnlocked(starQuest, dummyState)).toBe(false);

      const stateWith5Stars = {
        ...dummyState,
        quests: {
          q1: { stars: 3, completedOn: '2026-09-28' },
          q2: { stars: 2, completedOn: '2026-09-28' },
        },
      };
      expect(getTotalStars(stateWith5Stars)).toBe(5);
      expect(isQuestUnlocked(starQuest, stateWith5Stars)).toBe(true);
    });

    it('tính đúng tiến độ chương và vùng', () => {
      const ch1 = WORLD_LOP_2.regions[0].chapters[0];
      const state = {
        ...dummyState,
        quests: {
          'lop-2/toan/ch1/q1-dem-so': { stars: 3, completedOn: '2026-09-28' },
          'lop-2/toan/ch1/q2-chan-le': { stars: 2, completedOn: '2026-09-28' },
        },
      };

      const chProg = getChapterProgress(ch1, state);
      expect(chProg.totalQuests).toBe(3);
      expect(chProg.completedQuests).toBe(2);
      expect(chProg.starsEarned).toBe(5);

      const regProg = getRegionProgress(WORLD_LOP_2.regions[0], state);
      expect(regProg.completedQuests).toBe(2);
      expect(regProg.starsEarned).toBe(5);
    });
  });

  describe('Lịch mở thế giới (world-calendar)', () => {
    it('Thế giới Lớp 2 mở vào ngày 2026-09-05', () => {
      expect(isWorldOpen('lop-2', '2026-09-28')).toBe(true);
      expect(isWorldOpen('lop-2', '2026-09-01')).toBe(false);
    });

    it('Thế giới Lớp 3 mở năm học 2027-2028', () => {
      const lop3 = { schoolYear: '2027–2028', opensOn: '2027-09-05' };
      const status2026 = getWorldOpeningStatus(lop3, '2026-09-28');
      expect(status2026.isOpen).toBe(false);
      expect(status2026.statusLabel).toContain('2027–2028');

      const status2027 = getWorldOpeningStatus(lop3, '2027-09-10');
      expect(status2027.isOpen).toBe(true);
      expect(status2027.statusLabel).toBe('Đang mở');
    });
  });
});
