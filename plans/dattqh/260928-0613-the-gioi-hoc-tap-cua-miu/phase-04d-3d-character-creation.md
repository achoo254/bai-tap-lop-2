---
phase: 4d
title: 'Nhân vật 3D 4 loài, NPC, đồ mặc và màn tạo nhân vật dạng game'
status: pending
priority: P1
effort: 'XL'
dependencies: [4a, 4b, 4c]
---

# Phase 4d: Nhân vật 3D và tạo nhân vật

## Overview

Nhân rộng kết quả phase 4a lên **4 loài (Mèo, Thỏ, Cáo, Gấu)**, NPC và toàn bộ đồ mặc; làm lại màn tạo nhân vật thành chuỗi bước như game (ảnh mẫu màn 2–3); tủ đồ; thay nhân vật SVG ở các chỗ nhỏ bằng ảnh chụp từ mô hình 3D.

## Requirements

- **4 loài** trên bộ xương chibi chung của 4a; mỗi loài đủ hoạt ảnh: đứng thở + chớp mắt, vẫy tay, nhảy, suy nghĩ, ngáp, vui mừng, đi, nhìn quanh, phản ứng khi mặc đồ mới. Màu lông/mắt/biểu cảm đổi được.
- **Đồ mặc 3D** gắn xương, một món vừa cả 4 loài: áo, mũ, giày, kính, tai nghe, balo, cánh; đặc biệt: aura, vệt sáng (hệ hạt), thú cưng đi theo. Đủ các món trong danh mục 4c.
- **NPC 3D** (Cú Mèo/Bác Cú, Sóc Nâu, Chim Sâu, Ông Gác Rừng, Boss TIMO): cùng kiểu tô, hoạt ảnh nói/chào/vui/buồn.
- **Màn tạo nhân vật** (`/the-gioi/tao-nhan-vat/`), theo ảnh mẫu:
  1. Chọn nhân vật: 4 thẻ loài + nhân vật 3D lớn giữa + bóng thoại, nút Tiếp tục.
  2. Thanh bước bên trái: Thông tin (tên, tính cách) → Ngoại hình (màu lông, mắt, biểu cảm) → Trang phục (áo, mũ, giày) → Phụ kiện (kính, balo, cánh…) → Hiệu ứng đặc biệt (aura, vệt sáng) → Xem trước.
  3. Nhân vật 3D giữa, vuốt để xoay; nút xem hoạt ảnh (Vẫy tay, Nhảy, Ngáp, Vui mừng); lưới đồ theo tab biểu tượng, món khoá có ổ khoá + điều kiện mở (chạm vào đọc to điều kiện).
  4. Chọn tính cách hiện một câu mô tả tác động dễ hiểu ("Nhà thám hiểm tìm được đồ ẩn!").
  5. "Hoàn tất — Bắt đầu hành trình" → hoạt ảnh vào thế giới.
- Bé đã có nhân vật: màn này mở ở chế độ **sửa** (không mất tiến độ), dùng làm **tủ đồ** (đồ đã có, đổi tính cách ngoài lúc làm nhiệm vụ).
- **Ảnh chụp sẵn** (PNG/webp) từ mô hình cho nhân vật đồng hành, đầu trang, avatar HUD: tạo lại khi bé đổi ngoại hình/đồ (dựng offscreen một lần, lưu `IndexedDB`/bộ nhớ đệm), không chạy WebGL liên tục ở mọi trang.
- Thay dần `cat-character.ts` SVG: nhân vật đồng hành, `mascot-kitten`, trang mẫu dùng ảnh chụp 3D; giữ SVG làm dự phòng khi WebGL không có.

## Related Code Files

- Create: `public/game/3d/characters/{meo,tho,cao,gau}.glb`, `public/game/3d/npcs/*.glb`, `public/game/3d/items/*.glb`, `src/lib/game/three/{character-snapshot,particle-effects,npc-rig}.ts`, `src/components/game/creator/*.astro`, test `tests/unit/game/{character-creator-steps,item-attach}.test.ts`, e2e tạo nhân vật trong `tests/e2e/`.
- Modify: `src/pages/the-gioi/tao-nhan-vat.astro` (viết lại), `src/components/game/accessory-category-picker.astro` (thay bằng lưới đồ mới hoặc bỏ), `src/components/companion/companion-buddy.astro`, `src/components/mascot-kitten.astro`, `src/components/game/hud.astro`, `src/lib/game/items/item-catalog.ts` (điền đường dẫn mô hình), `public/game/licenses.json`.

## Implementation Steps

1. Sinh 3 loài còn lại theo quy trình 4a, gắn bộ xương chung, gán hoạt ảnh.
2. Đồ mặc theo danh mục; kiểm tra từng món trên cả 4 loài × mọi hoạt ảnh (trang soát lỗi nội bộ lưới 4 loài).
3. NPC.
4. Hệ hạt cho aura/vệt sáng; thú cưng đi theo.
5. Màn tạo nhân vật theo bước + chế độ sửa/tủ đồ.
6. Ảnh chụp sẵn + thay nhân vật SVG ở các chỗ nhỏ; dự phòng khi không có WebGL.
7. Test + e2e + đo iPad.

## Success Criteria

- [ ] Mọi món đồ vừa cả 4 loài, không xuyên lưới trong mọi hoạt ảnh (soát bằng trang lưới + ảnh chụp).
- [ ] Màn tạo nhân vật đi đủ các bước, mọi lựa chọn đổi ngay trên nhân vật; món khoá hiện điều kiện; bé đã có nhân vật sửa được mà không mất tiến độ.
- [ ] Trang không dùng 3D không tải `three` (kiểm tra bundle); nhân vật đồng hành dùng ảnh chụp.
- [ ] iPad: màn tạo nhân vật ≥ 50fps, tải < 3s trên 4G; mỗi nhân vật ≤ 2 MB, mỗi món đồ ≤ 300 KB.
- [ ] Có WebGL tắt → vẫn tạo nhân vật được bằng ảnh/SVG dự phòng.
- [ ] `pnpm ci:all` sạch.

## Risk Assessment

- Khối lượng lớn nhất trong nhóm 4x (4 loài × nhiều đồ) → làm Mèo đủ trước, 3 loài còn lại nối tiếp; đồ theo nhóm ưu tiên của ảnh mẫu.
- Một món đồ không vừa loài nào đó → cho phép chỉnh điểm neo/tỉ lệ theo loài trong danh mục (`fitOverrides`).
- Nhiều canvas WebGL cùng trang → một renderer mỗi trang, dùng chung cho nhân vật + NPC.

## Rollback

Giữ nhân vật SVG làm dự phòng tới hết phase; tắt 3D bằng một cờ cấu hình trong `character-stage`.
