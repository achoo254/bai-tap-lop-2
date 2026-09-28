---
phase: 8
title: 'Sự kiện TIMO 2: hình học, tổ hợp, đại chiến, boss cuối'
status: pending
priority: P2
effort: 'XL'
dependencies: [7, 6]
---

# Phase 8: Sự kiện TIMO Khối 2 (phần 2) — hình học, tổ hợp, đại chiến, boss cuối

## Overview

> **Cập nhật 2026-09-28 (Phase 4e):** mọi nhiệm vụ của phase này viết thành **kịch bản Quest Arc** (`src/lib/game/quest-arc/`), trả lời 7 câu hỏi kiểm tra; mini-game là màn `challenge` trong kịch bản; cảnh dùng tranh nền AI + nhân vật/NPC 3D của Phase 4b/4d. Chỗ nào dưới đây ghi "SVG + Kenney" cho nhân vật/cảnh thì hiểu theo quy tắc hình mới trong `plan.md`.

Hai đảo cuối của Quần Đảo Số, **đại chiến** mô phỏng đề vòng loại và **trận cuối** Vua Lộn Xộn, cùng bảng kỷ lục mùa và màn kết sự kiện. Phần nặng nhất: hình để đếm và khối 3D do code sinh chính xác.

## Requirements

| Đảo            | Kỹ năng (Base)    | Mini-game                           | Cơ chế                                                                                                                       |
| -------------- | ----------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Núi Khối Vuông | `lop-2/dem-hinh`  | `san-hinh-an` (từ phase 6, bậc cao) | Chạm khoanh hình vuông/tam giác/đoạn thẳng ẩn; bộ đếm chuẩn liệt kê mọi hình                                                 |
|                | `lop-2/khoi-3d`   | `thap-khoi` Tháp Khối               | Ma trận chiều cao → isometric SVG; xoay 4 góc, nhìn trước/trên/bên, tách tầng; đếm khối bị che, ô nhìn thấy, xây theo bản vẽ |
|                | `lop-2/day-hinh`  | `bang-chuyen-hinh` (xoay/lật)       | Dãy hình nâng cao                                                                                                            |
| Bếp Phù Thủy   | `lop-2/chon-cach` | `noi-sup-phu-thuy` Nồi Súp Phù Thủy | Ghép nguyên liệu, mỗi món mới vào sổ công thức; cây nhánh làm gợi ý                                                          |
|                | `lop-2/lap-so`    | `o-khoa-the-so` Ổ Khoá Thẻ Số       | Kéo thẻ lập số lớn nhất/nhỏ nhất/chẵn/tổng nhỏ nhất; đếm số lập được                                                         |
|                | `lop-2/chia-nhom` | `tui-qua-ti-hon` Túi Quà Tí Hon     | Chia đồ vào túi theo điều kiện; tìm số lớn thứ k                                                                             |

- **Đại chiến Vua Lộn Xộn**: 25 câu theo cấu trúc đề vòng loại (5 chủ đề × 5 câu, A–D, 60 phút tạm dừng được), song ngữ; thanh máu boss; lưu điểm theo chủ đề vào bảng kỷ lục mùa. Là chỗ duy nhất dùng A–D (quen format thi thật).
- **Trận cuối**: 15 lượt trộn mọi kỹ năng sự kiện, ưu tiên kỹ năng mastery thấp; thắng → cảnh kết + danh hiệu "Nhà thám hiểm Quần Đảo Số".
- Bảng kỷ lục cá nhân theo mùa (điểm đại chiến cao nhất, thời gian nhanh nhất, số huy hiệu).

## Architecture

`src/lib/game/geometry/{grid-figure,isometric,views}.ts` (mô hình + liệt kê hình, chiếu isometric, chiếu các mặt) — dùng chung cho Base (`hinh-phang`) và sự kiện.

## Related Code Files

- Create: `src/lib/game/geometry/**`, `src/minigames/{thap-khoi,noi-sup-phu-thuy,o-khoa-the-so,tui-qua-ti-hon,dai-chien}/**`, tests, `public/game/lop-2/su-kien/timo/**`
- Modify: `src/worlds/lop-2/events/timo/event.ts`, `src/minigames/san-hinh-an/**`

## Implementation Steps

1. Hình học: mô hình + bộ đếm (test 10 hình mẫu dựng tay) + isometric + xoay/chiếu (test đếm ô nhìn thấy). 2. Núi Khối Vuông + boss. 3. Bếp Phù Thủy (đáp án tính bằng liệt kê vét cạn) + boss. 4. Đại chiến + bảng kỷ lục. 5. Trận cuối + cảnh kết. 6. Test + chơi thử.

## Success Criteria

- [ ] Bộ đếm hình đúng 100% trên bộ mẫu; khối 3D xoay đủ 4 góc không lỗi thứ tự vẽ.
- [ ] Đại chiến đúng tỉ lệ 5 chủ đề × 5 câu; kết quả vào bảng kỷ lục.
- [ ] Đáp án tổ hợp khớp liệt kê vét cạn trên mọi hạt giống test.

## Risk Assessment

- Chạm khoanh hình mơ hồ khi hình chồng nhau → chọn 2 góc đối diện thay vì chạm vùng; quyết ở thử nghiệm đầu phase.
- Thứ tự vẽ isometric sai khi xoay → sắp theo (x+y+z) sau khi xoay, test ảnh chụp.
- Tổ hợp bậc cao vượt sức lớp 2 → bậc 5 giới hạn như các câu trong đề (≤ 3 nhóm, ≤ 40 kết quả).
