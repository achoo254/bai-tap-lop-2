---
phase: 11
title: "Meta: nhiệm vụ ngày, ôn chỗ yếu, cửa hàng, nhà, tủ đồ, thành tích"
status: pending
priority: P2
effort: "L"
dependencies: [5, 7]
---

# Phase 11: Meta — nhiệm vụ ngày, ôn chỗ yếu, cửa hàng, nhà, tủ đồ, thành tích

## Overview
Các hệ thống giữ Miu quay lại mỗi ngày, hướng ôn đúng chỗ yếu và cho xu/đồ có ý nghĩa. Thuộc nhân vật (dùng chung mọi thế giới), không thuộc riêng thế giới nào. Làm khi đã có Vùng Toán + sự kiện TIMO; tự mở rộng khi thêm vùng/thế giới.

## Requirements
- **Nhiệm vụ hằng ngày**: 3 nhiệm vụ/ngày theo giờ VN (dùng lại `todayInVietnam`), trộn các vùng của thế giới hiện tại + sự kiện đang diễn ra ("Giúp bác cá 1 lần", "Bắt 5 bướm chữ", "Combo 5"); xong đủ → rương ngày; chuỗi ngày 🔥 (mỗi tuần 1 "khiên" khi lỡ 1 ngày).
- **Ôn chỗ yếu**: NPC trên bản đồ có dấu "!" khi kỹ năng có mastery thấp hoặc ≥ 5 ngày chưa ôn → nhiệm vụ ngắn 3 câu đúng kỹ năng đó.
- **Cửa hàng** (Chợ Phiên, dùng mini-game `sap-hang` của phase 5): mua đồ bằng xu, trả tiền và nhận tiền thối bằng thao tác (mua sắm cũng là toán); không cho nợ; giá tăng theo Level, món đẹp cần Level tối thiểu.
- **Nhà của Miu** (tile Kenney + SVG): đặt đồ đã mua; **tủ đồ**: đổi phụ kiện avatar đã mở (kể cả phần thưởng sự kiện).
- **Thành tích**: ≥ 20 huy hiệu (theo kỹ năng, chuỗi ngày, boss, sự kiện, thế giới hoàn thành); bảng huy hiệu sưu tầm theo từng thế giới.
- Chống lạm dụng: thưởng ngày chỉ nhận 1 lần/ngày; không có hộp may rủi.

## Related Code Files
- Create: `src/lib/game/{quests,shop,achievements}/**`, `src/pages/the-gioi/{nha,tu-do,huy-hieu}.astro`, components, tests, `public/game/nha/**`
- Modify: `src/lib/game/state/game-state.ts` (+ trường có `.default()`: `daily`, `house`), bản đồ (NPC "!"), HUD (🔥)

## Implementation Steps
1. Nhiệm vụ ngày + chuỗi + khiên (test đổi ngày giờ VN). 2. Ôn chỗ yếu (test chọn kỹ năng). 3. Cửa hàng + inventory (test xu không âm). 4. Nhà + tủ đồ. 5. Thành tích. 6. Test + e2e.

## Success Criteria
- [ ] Reset đúng 0h giờ VN; chuỗi ngày và khiên đúng quy tắc (unit test).
- [ ] Dấu "!" xuất hiện đúng khi mastery thấp/lâu chưa ôn.
- [ ] Mua sắm luôn đi qua thao tác trả tiền; xu không bao giờ âm.

## Risk Assessment
- Quá nhiều hệ thống làm rối trẻ 7 tuổi → mỗi hệ thống 1 lối vào trên bản đồ, biểu tượng + âm thanh, không menu nhiều tầng.
