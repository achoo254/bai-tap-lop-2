---
phase: 4a
title: 'Thử kỹ thuật nhân vật 3D (1 con mèo trên iPad)'
status: pending
priority: P1
effort: 'M'
dependencies: [4]
---

# Phase 4a: Thử kỹ thuật nhân vật 3D

## Overview

Cổng quyết định trước khi làm nhân vật 3D cho cả 4 loài. Dựng **1 con mèo 3D** đủ chất lượng như ảnh mẫu (`design-reference-miu-game-world-mockup.png`, màn 2–3), chạy trên iPad Safari thật. Kết quả quyết định cách làm phase 4d; không đạt thì quay lại chọn "3D dựng bằng code" hoặc "SVG nâng cấp" (báo cáo brainstorm `../reports/brainstorm-260928-2148-home-base-quest-arc-character-progression.md`).

## Requirements

- Mô hình mèo chibi dễ thương, đúng tỉ lệ ảnh mẫu (đầu to, mắt to long lanh), dựng bằng công cụ AI tạo 3D từ ảnh 2D (Tripo/Meshy/Rodin… — chọn sau khi so điều khoản bản quyền, chi phí, chất lượng).
- **Bộ xương chibi chung** định nghĩa ngay ở đây (tên xương, tỉ lệ, điểm neo `head`, `spine`, `back`, `hand.L/R`, `foot.L/R`, `tail`, `ear.L/R`) để Thỏ, Cáo, Gấu dùng lại ở phase 4d.
- 3 hoạt ảnh: đứng thở + chớp mắt, vẫy tay, nhảy; chuyển mượt bằng `AnimationMixer` crossfade.
- 1 cái mũ là mô hình riêng gắn vào xương `head`, bật/tắt được; đổi màu lông bằng code.
- Tai/đuôi đung đưa (xương lò xo đơn giản bằng code).
- Xoay 360° bằng vuốt (`OrbitControls` khoá trục dọc, giới hạn zoom).
- Tô hoạt hình có viền (toon shading + outline), canvas trong suốt đặt trên **1 tranh nền AI** (cảnh rừng) để kiểm tra độ hợp nét.
- Trang thử nghiệm riêng `/the-gioi/thu-3d/` (không link từ menu), bỏ khỏi sitemap.

## Architecture

```
src/lib/game/three/character-stage.ts      tạo renderer/scene/camera/ánh sáng, vòng render, dọn dẹp (dispose)
src/lib/game/three/character-rig.ts        tải glb, AnimationMixer, gắn/gỡ đồ vào xương, đổi màu, xương lò xo
src/lib/game/three/toon-material.ts        vật liệu toon + viền
public/game/3d/characters/meo.glb          nén meshopt/Draco
public/game/3d/items/mu-phu-thuy.glb
public/game/backgrounds/rung-bi-mat.webp   nền AI thử
```

Thư viện: `three` (kèm `GLTFLoader`, `OrbitControls`, `MeshoptDecoder`). Chỉ tải động (`import()`) ở trang cần 3D để không làm nặng trang khác.

## Related Code Files

- Create: các file ở trên, `src/pages/the-gioi/thu-3d.astro`, `tests/unit/game/character-rig.test.ts` (logic gắn đồ theo tên xương, chọn hoạt ảnh — không cần WebGL).
- Modify: `apps/site/package.json` (+ `three`, `@types/three`), `public/game/licenses.json` (nguồn mô hình + nền AI).

## Implementation Steps

1. So sánh 2–3 công cụ AI tạo 3D: điều khoản sử dụng/bản quyền với gói định dùng, chi phí, chất lượng mặt/tay, có gắn xương tự động không. Ghi kết quả vào báo cáo `plans/dattqh/reports/`. **Nếu cần trả phí → hỏi bố mẹ trước khi mua.**
2. Vẽ/sinh ảnh 2D mẫu mèo theo ảnh mẫu → tạo 3D → sửa lưới nếu cần → gắn bộ xương chung → gán hoạt ảnh (Mixamo hoặc tự làm).
3. Làm mũ gắn xương `head`.
4. Viết `character-stage` + `character-rig` + toon material; trang `/the-gioi/thu-3d/`.
5. Sinh 1 nền rừng AI, ghép thử.
6. Đo trên iPad thật (Safari Web Inspector): fps, thời gian tải qua 4G (throttle), bộ nhớ; chụp màn hình/quay video cho bố mẹ duyệt.

## Success Criteria

- [ ] iPad Safari: ≥ 50fps khi xoay và chạy hoạt ảnh; tải nhân vật + mũ + nền < 3s trên 4G mô phỏng; `meo.glb` ≤ 2 MB.
- [ ] Mũ bám đúng đầu trong cả 3 hoạt ảnh; đổi màu lông tức thì.
- [ ] Nhân vật nhìn hợp với nền AI; **bố mẹ duyệt độ dễ thương** (so với ảnh mẫu).
- [ ] Bộ xương chung có tài liệu (tên xương, điểm neo) trong đầu `character-rig.ts`.
- [ ] Báo cáo so sánh công cụ AI 3D có kết luận bản quyền rõ ràng.
- [ ] `pnpm ci:all` sạch.

## Risk Assessment

- Mô hình AI xấu mặt/tay → sửa trong Blender (script Python) hoặc chọn công cụ khác; không đạt sau 2 công cụ → báo bố mẹ, chọn phương án dự phòng.
- Điều khoản gói miễn phí không cho dùng công khai → dùng gói trả phí (hỏi bố mẹ) hoặc phương án dự phòng.
- WebGL mất context trên iPad khi chuyển tab → bắt `webglcontextlost`, dựng lại.

## Rollback

Trang thử nghiệm độc lập, không đụng code game hiện có; xoá thư mục `three/`, trang và file `public/game/3d/` là quay về như cũ.
