---
phase: 5
title: 'Vùng Toán 1: số, cộng trừ, tiền, lời văn (vùng mẫu)'
status: pending
priority: P1
effort: 'L'
dependencies: [3]
---

# Phase 5: Vùng Toán 1 — số, cộng trừ, tiền, lời văn (vùng mẫu)

## Overview

Nửa đầu Vùng Toán của Thế giới Lớp 2, làm hoàn chỉnh trước để **chốt khuôn mini-game** cho mọi vùng/sự kiện sau. Là Base: Learn → Practice → Master theo chương trình lớp 2.
Kiểm tra §12: Base ✓ · cùng thế giới ✓ · cơ chế: cộng = thu thập tài nguyên, trừ = quản lý tài nguyên, lời văn = giải quyết tình huống.

## Requirements

Mỗi mini-game: bộ sinh câu 5 bậc, gợi ý 3 bậc, hệ quả đúng/sai trong cảnh.

| Chương (khu vực)    | Kỹ năng                                     | Mini-game (`src/minigames/`)         | Cơ chế                                                                                                   |
| ------------------- | ------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Làng Trăm Chục      | `lop-2/so-den-1000`                         | `kho-bo-que` Kho Bó Que              | Gom que thành bó chục, bó trăm để xếp đủ số hàng cần giao; so sánh hai kho                               |
| Cánh Đồng Thu Hoạch | `lop-2/cong-tru-20`, `lop-2/cong-tru-100`   | `thu-hoach` Thu Hoạch                | Hái trái cây vào giỏ cho đủ số đơn đặt hàng (cộng); có nhớ = gom 10 quả thành 1 thùng                    |
| Kho Lương Thực      | `lop-2/cong-tru-100`, `lop-2/cong-tru-1000` | `kho-luong-thuc` Quản Kho            | Xuất hàng cho xe (trừ), còn lại bao nhiêu; đủ/thiếu để giao                                              |
| Chợ Phiên           | `lop-2/tien-viet-nam`                       | `sap-hang` Sạp Hàng                  | Trả tiền bằng tờ tiền đúng mệnh giá, thối tiền (dùng lại ở cửa hàng phase 11 và sự kiện TIMO)            |
| (xuyên các chương)  | `lop-2/toan-loi-van`                        | `nhiem-vu-npc` Nhiệm Vụ Của Dân Làng | NPC kể tình huống bằng giọng nói (nhiều hơn/ít hơn/gộp/bớt), bé giải bằng thao tác trong cảnh của chương |
| Thử thách thêm      | `lop-2/so-bi-che` (tư duy)                  | `ruong-ma-so` Rương Mã Số            | Tìm số sau chiếc chuông để mở rương — nhiệm vụ phụ, không bắt buộc                                       |

- Boss chương cuối: "Chuột Kho Tham Ăn" — trộn kỹ năng của vùng, thanh máu.
- Hình: SVG + Kenney/OpenMoji theo style guide phase 2; vật cần đếm là sprite rời do code sắp.
- Lời thoại NPC ngắn, đọc to; không chép đề SGK.

## Architecture

```
src/worlds/lop-2/regions/toan.ts            chương → bài học → nhiệm vụ (dữ liệu)
src/minigames/<co-che>/{generator,scene,hints}.ts   generator đăng ký SkillDefinition cho kỹ năng nó phục vụ
```

Một mini-game có thể phục vụ nhiều kỹ năng (vd. `thu-hoach` cho cả `cong-tru-20` và `cong-tru-100`), bậc khó chọn khoảng số.

## Related Code Files

- Create: `src/worlds/lop-2/regions/toan.ts`, `src/minigames/{kho-bo-que,thu-hoach,kho-luong-thuc,sap-hang,nhiem-vu-npc,ruong-ma-so}/**`, `tests/unit/minigames/**`, `public/game/lop-2/toan/**`
- Delete: mini-game `demo` của phase 3

## Implementation Steps

1. Hình của vùng. 2. Bốn mini-game chính + nhiệm vụ lời văn. 3. Rương Mã Số (nhiệm vụ phụ). 4. Boss + điều kiện mở nửa sau vùng. 5. Test generator (≥ 200 hạt giống × 5 bậc) + e2e một nhiệm vụ mỗi mini-game.
2. **Chơi thử với Miu trên iPad**, ghi báo cáo (chỗ kẹt, độ khó, thời lượng, thích/không thích) → chỉnh hằng số thích ứng, thời lượng hoạt hình, **đóng băng khuôn MiniGame**.

## Success Criteria

- [ ] Các mini-game + boss chơi được đúng khuôn MiniGame; test generator xanh.
- [ ] Buổi chơi thử có ghi nhận và điều chỉnh; mỗi nhiệm vụ ≤ 4 phút.

## Risk Assessment

- Khuôn MiniGame thiếu → sửa ở phase này; sau phase 5 đổi khuôn phải cập nhật mọi mini-game.
- Miu thấy chán → giảm số câu/nhiệm vụ, tăng hệ quả vui (hoạt hình ngắn) — đo ở buổi chơi thử.
