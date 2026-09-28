---
phase: 4c
title: 'Tiến trình nhân vật: kỹ năng theo môn, danh hiệu, vật phẩm, luật mở khoá, tính cách, bộ sưu tập'
status: pending
priority: P1
effort: 'L'
dependencies: [4]
---

# Phase 4c: Tiến trình nhân vật (dữ liệu và luật)

## Overview

Lớp dữ liệu và luật cho mọi màn hình mới: bé thấy mình "mạnh lên" theo môn, level có danh hiệu, đồ vật có công dụng và điều kiện mở, tính cách đổi cách chơi, bộ sưu tập. Không có giao diện mới ở phase này (trừ màn thưởng tạm hiện XP kỹ năng); làm song song được với 4a/4b.

## Requirements

- **XP kỹ năng theo môn** (`skillXp`: `toan`, `tieng-viet`, `tieng-anh`, `logic`), chỉ tăng. Nguồn: mỗi câu trong nhiệm vụ cộng XP vào môn của kỹ năng; kỹ năng có `strand: 'tu-duy'` cộng thêm vào `logic`. Cấp kỹ năng theo bảng riêng (nhanh hơn Level nhân vật). `mastery` giữ nguyên cho độ khó thích ứng.
- **Danh hiệu theo Level:** Lv.1 🌱 Người mới bắt đầu · Lv.5 🎒 Nhà thám hiểm nhỏ · Lv.10 🔎 Thám tử học đường · Lv.20 🧙 Nhà thông thái · Lv.30 🏆 Bậc thầy Learning World (dùng `MAX_PLAYER_LEVEL = 30`).
- **Danh mục vật phẩm** (`src/lib/game/items/`): loại `trang-phuc` (áo, mũ, giày), `phu-kien` (kính, tai nghe, balo, cánh), `dac-biet` (aura, vệt sáng, thú cưng, hiệu ứng), `cong-cu` (chìa khoá, la bàn… có công dụng mở khoá), `huy-hieu`. Mỗi món: id, tên, biểu tượng, loại, điều kiện mở, mô hình 3D (điền ở 4d), công dụng (nếu là công cụ).
- **Luật mở khoá mở rộng** (dùng chung cho nhiệm vụ, địa điểm, vật phẩm): thêm `level-at-least`, `has-item`, `badge-count`, `event-completed`, `skill-level-at-least`, `all-of` (kết hợp). Giữ các luật cũ.
- **Tính cách** `avatar.personality`: `tham-hiem` 🔎, `thong-thai` 🧠, `chien-binh` ⚔️, `nghe-si` 🎨, `du-hanh` 🚀, với bảng tác động (báo cáo brainstorm, mục "Tính cách ảnh hưởng cách chơi"): điểm ẩn khi khám phá, lựa chọn suy luận + XP Logic, +1 tim boss, chọn 1 trong 2 món trang phục ở màn thưởng, điểm dịch chuyển nhanh và lối đi vòng. **Không** đổi độ khó, gợi ý, sao, XP học.
- **Loài nhân vật** `avatar.species`: `meo` | `tho` | `cao` | `gau` (mặc định `meo`).
- **Bộ sưu tập** `collections`: `sinh-vat`, `da-quy`, `sach`, `huy-hieu`, `dia-diem`, `vat-pham`; danh mục mục sưu tầm (id, tên, độ hiếm, nơi tìm) trong dữ liệu thế giới.
- **Tương thích bản lưu `the-gioi:v1`:** mọi trường mới có `.default()`; phụ kiện bé đang có (`avatar.accessories`, `inventory`) được coi là đã sở hữu dù sau này món đó có điều kiện mở; `no-hong` luôn mở.

## Architecture

```
src/lib/game/progression/skill-xp.ts        cộng XP theo môn/Logic, bảng cấp kỹ năng
src/lib/game/progression/player-titles.ts   danh hiệu theo Level
src/lib/game/items/item-catalog.ts          danh mục vật phẩm + công dụng
src/lib/game/items/item-ownership.ts        sở hữu, mở khoá, giữ đồ cũ
src/lib/game/world/unlock-rules.ts          + luật mới (một hàm đánh giá dùng chung)
src/lib/game/character/personality.ts       danh sách tính cách + tác động (dữ liệu)
src/lib/game/collections/collection-catalog.ts, collection-progress.ts
```

## Related Code Files

- Modify: `src/lib/game/state/game-state.ts` (+ `skillXp`, `avatar.personality`, `avatar.species`, `collections`, tất cả `.default()`), `src/lib/game/progression/rewards.ts` (trả thêm XP kỹ năng, vật phẩm, mục sưu tầm), `src/lib/game/world/world-types.ts` (`UnlockRule` mới), `src/lib/game/avatar/accessory-picker.ts` (đọc sở hữu từ `item-ownership`), `src/pages/the-gioi/choi.astro` (màn thưởng tạm hiện XP kỹ năng).
- Create: các file ở Architecture; test `tests/unit/game/{skill-xp,player-titles,item-ownership,unlock-rules,personality,collections}.test.ts`.

## Implementation Steps

1. Schema + mặc định + test đọc bản lưu hiện tại (lấy mẫu JSON thật từ trình duyệt làm fixture) không mất dữ liệu.
2. `skill-xp` + gắn vào `applyQuestResult`.
3. Danh hiệu.
4. Danh mục vật phẩm (chuyển 16 phụ kiện hiện có sang danh mục, gán điều kiện mở theo ảnh mẫu: Mũ thám tử Lv.5, Đồ phi hành gia xong "Space Adventure", Vương miện TIMO xong sự kiện TIMO, Cánh phép 10 huy hiệu) + giữ đồ cũ.
5. Luật mở khoá mới + test từng luật.
6. Tính cách + loài + bộ sưu tập (dữ liệu, chưa có giao diện).

## Success Criteria

- [ ] Bản lưu cũ đọc được, không mất xu/XP/đồ; đồ đang có vẫn dùng được.
- [ ] XP kỹ năng chỉ tăng; kỹ năng `tu-duy` cộng cả vào Logic (unit test).
- [ ] Mỗi luật mở khoá có test đúng/sai; `all-of` lồng được.
- [ ] Tính cách không đổi sao/XP học (test trên cùng một bộ câu trả lời với 5 tính cách).
- [ ] `pnpm ci:all` sạch.

## Risk Assessment

- Đổi schema làm hỏng tiến độ bé → fixture bản lưu thật + test; không nâng `SCHEMA_VERSION` nếu chỉ thêm trường có mặc định.
- Khoá đồ làm bé buồn vì "mất đồ" → quy tắc giữ đồ cũ, có test.

## Rollback

Trường mới có mặc định nên revert code không làm hỏng bản lưu (trường thừa bị zod bỏ qua khi đọc).
