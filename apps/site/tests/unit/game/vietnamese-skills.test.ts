import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateLessonSource } from '../../../../../packages/lesson-core/src/lesson-validator';
import { SKILLS, skillsOf } from '../../../src/lib/game/skills/skill-types';
import { VIETNAMESE_SKILLS } from '../../../src/lib/game/skills/lop-2/vietnamese-skills';
import { findQuest, findRegion } from '../../../src/lib/game/world/world-registry';
import {
  CHALLENGES_DOC_HIEU,
  CHALLENGES_LUYEN_TAP,
  STORY_CAU_THU_DU_BI,
} from '../../../src/minigames/doc-hieu-cau-thu-du-bi';

describe('Vùng Tiếng Việt Lớp 2 & Bài Đọc Cầu Thủ Dự Bị', () => {
  describe('Danh mục kỹ năng Tiếng Việt', () => {
    it('đăng ký đầy đủ kỹ năng Tiếng Việt với tiền tố lop-2/', () => {
      const tvSkills = skillsOf('lop-2', 'tieng-viet');
      expect(tvSkills.length).toBe(Object.keys(VIETNAMESE_SKILLS).length);
      expect(tvSkills).toContain('lop-2/doc-hieu');
      expect(tvSkills).toContain('lop-2/tu-chi-dac-diem');

      for (const id of tvSkills) {
        expect(SKILLS[id].grade).toBe('lop-2');
        expect(SKILLS[id].subject).toBe('tieng-viet');
      }
    });
  });

  describe('Cấu hình Vùng Tiếng Việt trong Thế giới Lớp 2', () => {
    it('Vùng Tiếng Việt đang mở và có Sóc Nâu dẫn đường', () => {
      const region = findRegion('lop-2', 'tieng-viet');
      expect(region).toBeDefined();
      expect(region?.status).toBe('open');
      expect(region?.guideNpc).toBe('soc-nau');
      expect(region?.chapters.length).toBeGreaterThan(0);
    });

    it('tìm được 2 nhiệm vụ của bài Cầu thủ dự bị bằng ID toàn cầu', () => {
      const q1 = findQuest('lop-2/tieng-viet/ch1/q1-doc-hieu');
      expect(q1).toBeDefined();
      expect(q1?.quest.title).toBe('Đọc hiểu: Cầu thủ dự bị');
      expect(q1?.quest.minigame).toBe('doc-hieu');
      expect(q1?.quest.skill).toBe('lop-2/doc-hieu');
      expect(q1?.quest.questions).toBe(4);

      const q2 = findQuest('lop-2/tieng-viet/ch1/q2-luyen-tap');
      expect(q2).toBeDefined();
      expect(q2?.quest.title).toBe('Luyện tập: Lời khen & Chúc mừng');
      expect(q2?.quest.minigame).toBe('doc-hieu');
      expect(q2?.quest.questions).toBe(2);
    });
  });

  describe('Bộ câu hỏi tương tác & đáp án bài Cầu thủ dự bị', () => {
    it('bài đọc có nội dung và từ ngữ giải thích chuẩn SGK', () => {
      expect(STORY_CAU_THU_DU_BI.title).toBe('CẦU THỦ DỰ BỊ');
      expect(STORY_CAU_THU_DU_BI.paragraphs.length).toBeGreaterThan(3);
      expect(STORY_CAU_THU_DU_BI.vocabulary.word).toBe('Dự bị');
    });

    it('bộ câu hỏi Đọc hiểu (4 câu) có đáp án đúng, gợi ý 3 bậc và mẫu viết vở', () => {
      expect(CHALLENGES_DOC_HIEU.length).toBe(4);
      for (const ch of CHALLENGES_DOC_HIEU) {
        expect(ch.options.some((opt) => opt.id === ch.expectedAnswer)).toBe(true);
        expect(ch.notebookAnswer).toBeTruthy();
        expect(ch.explanation).toBeTruthy();
        expect(ch.hintText[1]).toBeTruthy();
        expect(ch.hintText[2]).toBeTruthy();
        expect(ch.hintText[3]).toBeTruthy();
      }
    });

    it('bộ câu hỏi Luyện tập (2 câu) có đáp án đúng, gợi ý và mẫu viết vở', () => {
      expect(CHALLENGES_LUYEN_TAP.length).toBe(2);
      for (const ch of CHALLENGES_LUYEN_TAP) {
        expect(ch.options.some((opt) => opt.id === ch.expectedAnswer)).toBe(true);
        expect(ch.notebookAnswer).toBeTruthy();
        expect(ch.hintText[1]).toBeTruthy();
      }
    });
  });

  describe('Bài học hàng ngày trên trang chủ (content/2026-09-28-cau-thu-du-bi/bai.md)', () => {
    it('vượt qua bộ kiểm tra định dạng bài học (validateLessonSource)', () => {
      const filePath = resolve(__dirname, '../../../../../content/2026-09-28-cau-thu-du-bi/bai.md');
      const source = readFileSync(filePath, 'utf-8');
      const result = validateLessonSource(source);

      if (!result.ok) {
        console.error('Lỗi định dạng bài học:', result.errors);
      }
      expect(result.errors).toEqual([]);
      expect(result.ok).toBe(true);
      expect(result.lesson?.frontmatter.tieu_de).toContain('Cầu thủ dự bị');
      expect(result.lesson?.frontmatter.mon).toBe('tieng-viet');
      expect(result.lesson?.frontmatter.ngay).toBe('2026-09-28');
      expect(result.lesson?.loiGiai).toBeDefined();
    });
  });
});
