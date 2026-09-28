---
phase: 1
title: 'Lõi game: state, kỹ năng theo môn, tiến trình'
status: completed
priority: P1
effort: 'L'
dependencies: []
---

# Phase 1: Lõi game — state, kỹ năng theo môn, tiến trình

## Overview

Thư viện TS thuần dùng chung cho mọi vùng và mọi sự kiện: hồ sơ nhân vật, kinh tế xu/XP/level, mastery theo kỹ năng (kỹ năng thuộc môn), giao diện bộ sinh câu + gợi ý, độ khó thích ứng, tính thưởng; media dùng chung (giọng đọc, tiếng động, kéo-thả).

## Đã làm (2026-09-28)

- [x] `skills/random.ts` (tách từ bộ sinh câu Kẹo chẵn lẻ; test cũ vẫn xanh).
- [x] `skills/skill-types.ts`: `GRADES` (mỗi năm học một thế giới, hiện có `lop-2`), `SUBJECTS` (toan, tieng-viet, tieng-anh), mã kỹ năng có tiền tố lớp (`lop-2/chan-le`), `skillsOf(grade, subject?)`, `SkillStrand` (`chuong-trinh` | `tu-duy`), `SKILLS` gộp từ danh mục từng lớp × môn, `Challenge`, `HintStep`, `SkillDefinition`.
- [x] `skills/lop-2/math-skills.ts`: 13 kỹ năng chương trình lớp 2 + 16 kỹ năng tư duy (dùng cho thử thách thêm và sự kiện cuộc thi).
- [x] `skills/skill-registry.ts`.
- [x] `state/game-state.ts`: khoá `the-gioi:v1`, `avatar {name, furColor, accessories, createdOn}` (createdOn null = chưa tạo nhân vật), `mastery` theo kỹ năng, `quests` (khoá `<lớp>/<vùng|sự kiện>/<nhiệm vụ>`), `inventory`, `achievements`, `streak`; dữ liệu hỏng → cất sang `the-gioi:hong`; thiếu kỹ năng mới → tự bổ sung.
- [x] `state/game-store.ts` (pub/sub, ghi gộp 300ms, ghi ngay khi rời trang).
- [x] `progression/adaptive-difficulty.ts`, `level-table.ts`, `rewards.ts` (`QuestResult`, `applyQuestResult`).
- [x] `media/audio.ts` (giọng đọc vi, tiếng động, tắt tiếng), `media/drag-and-place.ts` (kéo + chạm-đặt + bàn phím), `media/motion.ts`.
- [x] 39 unit test xanh, typecheck + eslint + prettier sạch.

## Còn lại

- [x] `media/audio.ts`: `speak(text, 'vi' | 'en')`, chọn giọng theo ngôn ngữ (`en-US` đọc chậm 0.8), `waitForVoice(lang)`.
- Quy ước `.default()` cho trường mới của `GameState` (đã ghi chú trong file) — thêm test mẫu khi phase 4 thêm `events`.
- Code review lõi (drag-and-place chưa có test tự động → kiểm bằng e2e ở phase 3).

## Related Code Files

- Đã tạo: `apps/site/src/lib/game/**`, `apps/site/tests/unit/game/**`
- Đã sửa: `apps/site/src/lib/timo/*` (dùng `random.ts`, `media/audio.ts`, `media/motion.ts` chung), `apps/site/package.json` (+ `zod` ^4.6.5, cùng bản với `lesson-core`)

## Success Criteria

- [x] Unit test state/thích ứng/thưởng/registry/store xanh.
- [x] Test cũ `even-odd-questions.test.ts` xanh.
- [ ] Giọng đọc tiếng Anh chọn đúng giọng `en-*` (kiểm trên iPad ở phase 10).

## Risk Assessment

- Schema đổi sau khi đã có người chơi → chỉ thêm trường có `.default()`; đổi cấu trúc thì nâng `SCHEMA_VERSION` + bước migrate + test.
- Hằng số thích ứng quá gắt → chỉnh sau buổi chơi thử phase 5 (một chỗ: `adaptive-difficulty.ts`).
