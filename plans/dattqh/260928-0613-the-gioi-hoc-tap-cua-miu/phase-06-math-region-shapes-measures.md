---
phase: 6
title: 'Vùng Toán 2: nhân chia, hình học, đo lường, thời gian, thống kê'
status: pending
priority: P2
effort: 'L'
dependencies: [5]
---

# Phase 6: Vùng Toán 2 — nhân chia, hình học, đo lường, thời gian, thống kê

## Overview

> **Cập nhật 2026-09-28 (Phase 4e):** mọi nhiệm vụ của phase này viết thành **kịch bản Quest Arc** (`src/lib/game/quest-arc/`), trả lời 7 câu hỏi kiểm tra; mini-game là màn `challenge` trong kịch bản; cảnh dùng tranh nền AI + nhân vật/NPC 3D của Phase 4b/4d. Chỗ nào dưới đây ghi "SVG + Kenney" cho nhân vật/cảnh thì hiểu theo quy tắc hình mới trong `plan.md`.

Nửa sau Vùng Toán của Thế giới Lớp 2 theo khuôn đã chốt ở phase 5.
Kiểm tra §12: Base ✓ · cơ chế: nhân/chia = xây dựng/nâng cấp, hình học = xoay/lắp mảnh ghép, đo lường = điều khiển phương tiện.

## Requirements

| Chương          | Kỹ năng                                   | Mini-game                         | Cơ chế                                                                                    |
| --------------- | ----------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| Công Trường     | `lop-2/nhan-chia-2-5`                     | `cong-truong` Công Trường         | Xây tường theo hàng × cột (bảng 2, 5); chia gạch đều lên các xe                           |
| Xưởng Ghép Hình | `lop-2/hinh-phang`                        | `xuong-ghep-hinh` Xưởng Ghép Hình | Xoay/lắp mảnh thành hình tứ giác; nối điểm thành đường gấp khúc làm hàng rào, tính độ dài |
| Xưởng Ghép Hình | `lop-2/hinh-khoi`                         | `kho-do-choi` Kho Đồ Chơi         | Phân loại vật vào kệ khối trụ/khối cầu; vật lăn được/không lăn được                       |
| Đường Đua       | `lop-2/do-do-dai`                         | `duong-dua` Đường Đua             | Lái xe đi đúng số cm/dm/m trên thước, đổi đơn vị để về đích                               |
| Bến Xe Tải      | `lop-2/khoi-luong-dung-tich`              | `ben-xe-tai` Bến Xe Tải           | Cân hàng (kg) cho đủ tải; đổ xăng/nước (lít) cho đủ bình                                  |
| Tháp Đồng Hồ    | `lop-2/thoi-gian`                         | `thap-dong-ho` Tháp Đồng Hồ       | Vặn kim đồng hồ để mở cổng đúng giờ; lật lịch tìm ngày/thứ                                |
| Trạm Khảo Sát   | `lop-2/thong-ke-xac-suat`                 | `tram-khao-sat` Trạm Khảo Sát     | Kiểm đếm con vật đi qua, dựng biểu đồ tranh; đoán "có thể/chắc chắn/không thể" với túi bi |
| Thử thách thêm  | `lop-2/dem-hinh`, `lop-2/day-so` (tư duy) | `san-hinh-an`, `cau-da-quy-luat`  | Nhiệm vụ phụ (mini-game dùng chung với sự kiện TIMO phase 7–8)                            |

- Boss vùng: "Rô-bốt Lộn Xộn" — trộn mọi kỹ năng Vùng Toán.
- Hình học: hình phẳng/khối và vật đo do code vẽ SVG (chính xác số liệu).

## Related Code Files

- Create: `src/minigames/{cong-truong,xuong-ghep-hinh,kho-do-choi,duong-dua,ben-xe-tai,thap-dong-ho,tram-khao-sat}/**`, tests, `public/game/lop-2/toan/**`
- Modify: `src/worlds/lop-2/regions/toan.ts`

## Implementation Steps

1. Hình. 2. Bảy mini-game theo khuôn. 3. Hai nhiệm vụ phụ tư duy (làm mini-game ở đây, sự kiện dùng lại). 4. Boss vùng. 5. Test + e2e + chơi thử.

## Success Criteria

- [ ] Mọi kỹ năng `chuong-trinh` của Toán lớp 2 có ít nhất một nhiệm vụ; test generator xanh.
- [ ] Kéo kim đồng hồ, lái xe, xoay mảnh ghép dễ trên iPad (vùng chạm ≥ 44px).

## Risk Assessment

- Kéo kim đồng hồ khó chính xác bằng ngón tay → bám nấc 5 phút + nút ±.
- Lái xe gây rối nếu điều khiển liên tục → điều khiển theo bước (chọn quãng đường rồi xe chạy).
