---
phase: 4
title: "Event System tổng quát"
status: pending
priority: P1
effort: "M"
dependencies: [3]
---

# Phase 4: Event System tổng quát

## Overview
Hệ thống sự kiện dùng chung (tài liệu sản phẩm §6, §9): mỗi sự kiện là một thư mục cấu hình cắm vào **một thế giới lớp** (`src/worlds/<lop>/events/<id>/`), có lịch, địa điểm trên bản đồ, NPC, nhiệm vụ, thử thách, phần thưởng, thành tích, bảng kỷ lục, boss cuối. **Không hard-code TIMO**; thêm/gỡ sự kiện không sửa Base.

## Requirements
- `EventDefinition` (dữ liệu khai báo):
  - `metadata`: id, `grade` (thế giới chứa sự kiện), tên, mô tả ngắn (đọc to), NPC đưa tin, bảng màu, biểu tượng.
  - `schedule`: `startsOn`, `endsOn` (giờ VN) hoặc `recurring` (mùa lặp lại); ngoài lịch → điểm sự kiện ẩn, dữ liệu cũ vẫn giữ.
  - `location`: điểm neo trên bản đồ thế giới + bản đồ riêng của sự kiện (khu vực mới "mở ra").
  - `quests`: như Quest của Base nhưng `skill` bắt buộc thuộc danh mục kỹ năng **của chính thế giới đó** (không kỹ năng riêng, không lấy kỹ năng lớp khác) + `difficultyBoost` (vd. TIMO +1).
  - `challenges`: thử thách đặc biệt (đại chiến mô phỏng đề, thử thách giờ) + `finalBoss`.
  - `rewards`: vật phẩm/phụ kiện độc quyền sự kiện, xu thưởng; `achievements`: huy hiệu sự kiện.
  - `leaderboard`: bảng kỷ lục cá nhân theo mùa (điểm cao nhất, thời gian nhanh nhất) — không có máy chủ.
- **Trải nghiệm "sự kiện thật"**: banner/thông báo khi sự kiện bắt đầu (lần đầu mở game trong lịch), NPC đưa thư xuất hiện trên bản đồ, hoạt hình khu vực mới mở, đồng hồ đếm ngày còn lại, màn kết mùa.
- **Nối với Base**: bậc khó nhiệm vụ sự kiện = `min(5, mastery[skill].level + difficultyBoost)`; kết quả ghi vào mastery chung + tiến độ riêng của sự kiện (`events[eventId]`: nhiệm vụ đã xong, sao, huy hiệu, kỷ lục).
- Kiểm tra lúc build: mọi `skill` trong cấu hình sự kiện phải có trong `SKILLS` và cùng `grade` với sự kiện; `eventId` không trùng; lịch hợp lệ.

## Architecture
```
src/lib/game/events/
  event-types.ts        EventDefinition, EventProgress
  event-schedule.ts     sự kiện nào đang diễn ra hôm nay (giờ VN)
  event-registry.ts     danh sách sự kiện (import từ các thư mục cấu hình)
  event-difficulty.ts   bậc khó từ mastery + boost
src/worlds/<lop>/events/<event-id>/event.ts   cấu hình một sự kiện (phase 7 thêm worlds/lop-2/events/timo/)
src/pages/the-gioi/[lop]/su-kien/[id].astro   bản đồ sự kiện
```
`GameState.events: Record<string, EventProgress>` (khoá `<lớp>/<eventId>`, vd. `lop-2/timo`) thêm bằng `.default({})` (bản lưu cũ vẫn đọc được).

## Related Code Files
- Create: như trên, `src/components/game/{event-banner,event-map,event-countdown}.astro`, tests
- Modify: `src/lib/game/state/game-state.ts` (+ `events`), bản đồ thế giới (điểm neo), khung nhiệm vụ (boost)

## Implementation Steps
1. Kiểu dữ liệu + lịch (test ranh giới 0h giờ VN, sự kiện lặp mùa).
2. `events` trong GameState + test đọc bản lưu cũ không có trường này.
3. Registry + kiểm tra cấu hình lúc build (test: skill lạ → build lỗi).
4. Banner, NPC đưa tin, điểm sự kiện trên bản đồ, bản đồ sự kiện, đếm ngày.
5. Độ khó có boost + ghi tiến độ sự kiện + kỷ lục cá nhân.
6. **Sự kiện mẫu "thử nghiệm"** chỉ trong test/dev (2 nhiệm vụ dùng mini-game demo) để chứng minh thêm sự kiện không sửa Base.

## Success Criteria
- [ ] Sự kiện mẫu hiện/ẩn đúng lịch; không file nào dưới `lib/game/world/` hay vùng môn học bị sửa khi thêm nó.
- [ ] Bậc khó sự kiện đúng công thức; mastery chung được cập nhật.
- [ ] Bản lưu không có `events` vẫn đọc được.

## Risk Assessment
- Sự kiện lén thêm hệ thống học riêng → test chặn kỹ năng ngoài danh mục; review mỗi sự kiện theo 6 câu hỏi §12.
- Giờ máy iPad sai làm lệch lịch → chấp nhận (không có máy chủ giờ); ghi chú trong trang bố mẹ.
