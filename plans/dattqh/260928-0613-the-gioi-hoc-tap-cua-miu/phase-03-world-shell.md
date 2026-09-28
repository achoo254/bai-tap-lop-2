---
phase: 3
title: "Cổng thế giới + Thế giới Lớp 2: tạo nhân vật, bản đồ, vùng, HUD, khung nhiệm vụ"
status: pending
priority: P1
effort: "L"
dependencies: [1, 2]
---

# Phase 3: Cổng thế giới + Thế giới Lớp 2 — tạo nhân vật, bản đồ, vùng, HUD, khung nhiệm vụ

## Overview
Dựng "vỏ" chung mà mọi thế giới (mỗi năm học một thế giới), vùng và sự kiện cắm vào: màn tạo nhân vật, **Cổng thế giới**, bản đồ **Thế giới Lớp 2** có 3 vùng môn học + chỗ trống cho sự kiện, bản đồ vùng (chương → nhiệm vụ), HUD, khung nhiệm vụ (gặp → giải → thưởng), màn thưởng/lên level. Chốt giao diện plugin mini-game và cấu trúc nội dung Base.

## Requirements
- **Tạo nhân vật** (lần đầu vào, `avatar.createdOn === null`): đặt tên (gợi ý "Miu"), chọn màu lông + phụ kiện ban đầu, mèo con chào; bấm "Lên đường" → bản đồ.
- **Cổng thế giới** `/the-gioi/`: các thế giới theo năm học — Lớp 2 (đang mở, năm 2026–2027), Lớp 3 (khoá, "mở năm học 2027–2028"), các lớp sau mờ dần; thế giới đã qua vẫn vào được để ôn và lấy nốt sao; lần đầu thế giới mới mở → hoạt hình "một thế giới mới xuất hiện". Thế giới đang mở tính từ `GRADES[...].opensOn` (bố mẹ chỉnh được ở phase 12). Vào thẳng thế giới hiện tại nếu chỉ có một thế giới mở.
- **Bản đồ thế giới** `/the-gioi/<lop>/`: tên thế giới hiện rõ ("Thế giới Lớp 2"), 3 vùng (Toán, Tiếng Việt, Tiếng Anh) + các "điểm neo" để sự kiện hiện lên (phase 4); vùng chưa làm hiện "sắp mở"; nhân vật đứng ở vùng gần nhất vừa chơi.
- **Bản đồ vùng** `/the-gioi/<lop>/<vung>/`: chương là khu vực, nhiệm vụ là điểm dừng nối bằng đường; điểm hiện tại sáng; chạm → nhân vật đi theo đường → vào nhiệm vụ. Mở khoá theo tiến độ (xong nhiệm vụ trước / đủ sao chương trước).
- **HUD**: tên thế giới đang ở, xu, thanh XP + Level (của nhân vật, chung mọi thế giới), chuỗi ngày 🔥, nút tắt tiếng, nút về bản đồ; trong nhiệm vụ thêm tim (lượt thử) + combo.
- **Khung nhiệm vụ** `/the-gioi/choi/?nv=<questId>` (trang tĩnh đọc tham số): đoạn dẫn NPC ≤ 2s bỏ qua được (đọc to) → vùng chơi mini-game → 🔊 đọc lại, 💡 gợi ý → màn thưởng (rương, sao, XP chạy, lên level, mở đường) → về bản đồ.
- Thang gợi ý 3 bậc do khung điều phối; bậc 3 lộ đáp án → câu song sinh bắt buộc tự làm.
- Mobile-first, iPad ngang + dọc; chạm ≥ 56px; reduced-motion; chữ ít (đọc to).

## Architecture
Cấu trúc Base khai báo bằng dữ liệu, mỗi thế giới một thư mục `src/worlds/<lop>/` (tài liệu sản phẩm §8: Chapter → Lesson → Quest → Mini Game):
```ts
interface World { grade: GradeId; name: string; schoolYear: string; opensOn: string; regions: Region[] }
interface Region { id: SubjectId; name: string; theme: RegionTheme; chapters: Chapter[] }
interface Chapter { id: string; name: string; lessons: Lesson[] }          // khu vực trên bản đồ vùng
interface Lesson { id: string; name: string; skills: SkillId[]; quests: Quest[] }
interface Quest { id: string; npc: NpcId; intro: string; minigame: MiniGameId;
                  skill: SkillId; questions: number; isBoss?: boolean; unlock: UnlockRule }
```
Mini-game plugin (dùng chung Base + Event, nạp động theo cơ chế):
```ts
interface MiniGame<C extends Challenge> {
  id: MiniGameId;
  mount(stage: HTMLElement, challenge: C, api: QuestApi): void;
  showHint(step: HintStepNumber): Promise<void>;
  playOutcome(correct: boolean): Promise<void>;   // hệ quả trong cảnh (cửa mở, cầu hiện…)
  unmount(): void;
}
interface QuestApi { submit(answer: unknown): void; speak(text: string, lang?: 'vi' | 'en'): void; sfx(name: SfxName): void }
```
Khung nhiệm vụ lấy bậc khó = `mastery[skill].level` (+ mức nâng khi nhiệm vụ thuộc sự kiện, phase 4).

## Related Code Files
- Create: `src/lib/game/world/{world-types,world-registry,world-calendar,unlock-rules}.ts`, `src/worlds/lop-2/world.ts`, `src/lib/game/ui/*`, `src/components/game/{hud,world-map,region-map,quest-frame,reward-screen,character-creator}.astro`, `src/pages/the-gioi/{index,[lop]/index,[lop]/[vung],choi,tao-nhan-vat}.astro`, `src/styles/game.css`, tests
- Modify: `src/pages/index.astro` (banner "Thế giới của Miu" thay banner "Luyện thi TIMO")

## Implementation Steps
1. Kiểu dữ liệu world + registry thế giới + lịch mở thế giới + quy tắc mở khoá + test (gồm thế giới mẫu `lop-3` chỉ trong test để chứng minh thêm lớp không sửa Lớp 2).
2. Màn tạo nhân vật (lưu `avatar`).
3. Cổng thế giới + bản đồ Thế giới Lớp 2 + bản đồ vùng (đường đi, nhân vật đi theo `getPointAtLength`, trạng thái từ GameState).
4. HUD + store subscription.
5. Khung nhiệm vụ: vòng đời MiniGame, gợi ý, song sinh, `applyQuestResult`, lưu tiến độ.
6. Màn thưởng + lên level + hoạt hình mở đường.
7. Mini-game giả `demo` để chạy thử end-to-end; xoá khi phase 5 xong.
8. E2E Playwright: tạo nhân vật → bản đồ → vùng → nhiệm vụ demo → thưởng → bản đồ cập nhật.

## Success Criteria
- [ ] Explore → Encounter → Solve → Reward → Unlock chạy trọn với mini-game demo trên iPad giả lập.
- [ ] Lần đầu vào bắt buộc qua tạo nhân vật; lần sau vào thẳng bản đồ thế giới hiện tại.
- [ ] Cổng hiện Lớp 2 mở, Lớp 3 khoá kèm "mở năm học 2027–2028"; thế giới mẫu trong test mở đúng theo `opensOn`.
- [ ] Tải lại trang tiến độ còn nguyên; Axe không lỗi nghiêm trọng.

## Risk Assessment
- Trang tĩnh + tham số query bị service worker cache sai → cache theo pathname, tham số chỉ đọc phía client.
- Nhân vật đi theo đường giật trên iPad cũ → transform (GPU), sprite nhỏ, không bóng đổ động.
