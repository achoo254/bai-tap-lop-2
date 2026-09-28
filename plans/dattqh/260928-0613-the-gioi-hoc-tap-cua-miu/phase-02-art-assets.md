---
phase: 2
title: 'Bộ hình: nhân vật SVG + bộ hình miễn phí'
status: completed
priority: P1
effort: 'L'
dependencies: [1]
---

# Phase 2: Bộ hình — nhân vật SVG + bộ hình miễn phí

## Overview

Chốt phong cách thống nhất cho cả thế giới (3 vùng + khu sự kiện). Nhân vật vẽ SVG bằng code, bối cảnh/vật phẩm/UI lấy từ bộ hình giấy phép tự do, ghi nguồn đầy đủ. Hình riêng của từng vùng/sự kiện lấy trong phase của nó theo style guide này.

## Nguồn hình

| Nguồn                                                                                                 | Giấy phép    | Dùng cho                                                          |
| ----------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| SVG tự vẽ trong repo                                                                                  | của dự án    | Miu (avatar), mèo con đồng hành, NPC chính, boss                  |
| [Kenney.nl](https://kenney.nl/assets) (Tiny Town, Pirate Pack, Toon Characters, UI Pack, Game Icons…) | CC0          | tile bản đồ/cảnh, nhà, cây, thuyền, xe, rương, khung/nút UI, icon |
| [OpenMoji](https://openmoji.org/) (đã dùng trong site)                                                | CC BY-SA 4.0 | vật cần đếm, đồ ăn, con vật (thẻ từ Tiếng Anh), đồ nội thất       |
| [OpenGameArt](https://opengameart.org/) — chỉ mục CC0                                                 | CC0          | bổ sung khi Kenney thiếu                                          |

Không dùng hình "free" không rõ giấy phép.

## Requirements

- `scripts/game-art/style-guide.md`: viền mực đậm + pastel theo `design-tokens.css`; mỗi vùng một bảng màu chủ đạo (Toán: xanh trời/vàng, Tiếng Việt: hồng/cam, Tiếng Anh: xanh lá/tím, Sự kiện: đỏ/vàng lễ hội) để bé nhận ra đang ở đâu.
- **Nhân vật SVG tách phần** (thân, đầu, tai, đuôi, mắt, miệng, tay) → tư thế bằng CSS/Web Animations (đứng, đi, nhảy, té, vui, buồn, suy nghĩ, chiến thắng); **tạo nhân vật thật**: đặt tên, màu lông, nơ/mũ/balo/bộ đồ là lớp SVG.
- Mèo con mascot hiện có dùng chung hình học với `cat-character.ts` (không để 2 bản lệch nhau).
- NPC chính: mỗi vùng 1 người dẫn đường + NPC nhiệm vụ; sự kiện TIMO có NPC riêng (người đưa thư sự kiện, boss).
- `scripts/game-art/fetch-free-assets.mjs`: tải đúng gói đã chọn từ nguồn chính thức, chỉ chép file dùng tới vào `public/game/`, ghi `public/game/licenses.json` (file → nguồn, tác giả, giấy phép, link); trang Ghi nguồn đọc file này.
- Mọi vật mang số liệu toán do code đặt/vẽ; ảnh mỗi vùng ≤ 1.5MB; ưu tiên SVG.

## Architecture

```
scripts/game-art/  style-guide.md, fetch-free-assets.mjs
public/game/       kenney/…, openmoji/…, licenses.json
src/components/game/characters/  cat-character.ts, character-poses.css, npc-*.ts, boss-*.ts
src/lib/game/media/art-manifest.ts   tra cứu asset theo id; test mọi id tồn tại + có giấy phép
```

## Related Code Files

- Create: như trên
- Modify: `src/components/mascot-kitten.astro`, `src/pages/ghi-nguon.astro`, `public/_headers` (cache dài `/game/*`)

## Implementation Steps

1. [x] Chọn gói Kenney/OpenMoji cho 3 vùng + sự kiện, lập danh sách file + giấy phép (`public/game/licenses.json`).
2. [x] Style guide (`scripts/game-art/style-guide.md`) + **1 cảnh mẫu** (`src/pages/the-gioi/mau-cong-toan.astro`: tile Kenney + Miu SVG + vật OpenMoji + NPC Cú Thông Thái) → **sẵn sàng để bố mẹ duyệt phong cách**.
3. [x] `cat-character.ts` + tư thế (8 tư thế); phụ kiện avatar (6 bộ); màu lông (5 màu); mascot dùng chung hình học.
4. [x] NPC dẫn đường 3 vùng (`npc-guide.ts`) + NPC/boss sự kiện TIMO (`boss-timo.ts`).
5. [x] Script tải & đồng bộ (`scripts/game-art/fetch-free-assets.mjs`) + `licenses.json` + trang Ghi nguồn + test manifest (`art-manifest.test.ts`).

## Success Criteria

- [ ] Bố mẹ duyệt cảnh mẫu (truy cập `/the-gioi/mau-cong-toan/` để trải nghiệm trực tiếp).
- [x] 100% file trong `public/game/` có mục trong `licenses.json`.
- [x] Đổi phụ kiện/màu avatar tức thì; tư thế chạy mượt trên iPad giả lập.

## Risk Assessment

- Lệch phong cách giữa nguồn → Kenney là họ chính cho cảnh, SVG cho nhân vật, OpenMoji chỉ cho vật nhỏ; duyệt cảnh mẫu trước khi làm hàng loạt.
- SVG tự vẽ trông đơn giản → bù bằng biểu cảm + hoạt hình; tuỳ chọn vài ảnh điểm nhấn bằng lượt Gemini miễn phí nếu bố mẹ muốn.
