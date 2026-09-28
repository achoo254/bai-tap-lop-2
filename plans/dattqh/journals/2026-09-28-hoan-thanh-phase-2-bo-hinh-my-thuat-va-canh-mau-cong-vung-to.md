---
title: Hoan thanh Phase 2 bo hinh my thuat va canh mau cong Vung Toan
date: 2026-09-28
summary: 'Khoi tao tai lieu docs, quy tac AGENTS.md, Kenney CC0, OpenMoji, Miu SVG da tu the va trang mau /the-gioi/mau-cong-toan/'
---

## Bối cảnh & Mục tiêu

Thực hiện Phase 2 của kế hoạch chính "Thế giới học tập của Miu" ([`plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu/plan.md`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu/plan.md)):

1. Thiết lập tài liệu `docs/` và quy tắc `AGENTS.md` theo chuẩn `/ak:docs`.
2. Chốt phong cách mỹ thuật: Viền mực đậm + màu pastel, kết hợp Kenney CC0 + OpenMoji CC BY-SA 4.0 + SVG tự vẽ bằng mã.
3. Dựng nhân vật Miu SVG module tách lớp hỗ trợ 8 tư thế, 5 màu lông, 6 phụ kiện.
4. Dựng NPC các vùng (`npc-guide.ts`) và Boss sự kiện TIMO (`boss-timo.ts`).
5. Tạo cảnh mẫu cổng Vùng Toán tại `/the-gioi/mau-cong-toan/` để bố mẹ duyệt phong cách trực tiếp.

## Các tệp bàn giao

- **Quy tắc & Tài liệu**: `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/index.md`, `docs/project-overview-pdr.md`, `docs/system-architecture.md`, `docs/code-standards.md`, `docs/codebase-summary.md`, `docs/design-guidelines.md`, `docs/deployment-guide.md`.
- **Mỹ thuật & Bản quyền**: `scripts/game-art/style-guide.md`, `scripts/game-art/fetch-free-assets.mjs`, `apps/site/public/game/licenses.json`, 10 tệp Kenney SVG trong `public/game/kenney/`, 8 tệp OpenMoji SVG trong `public/game/openmoji/`.
- **Nhân vật & Chuyển động**: `apps/site/src/components/game/characters/cat-character.ts`, `character-poses.css`, `npc-guide.ts`, `boss-timo.ts`.
- **Hạ tầng Media & Sân khấu mẫu**: `apps/site/src/lib/game/media/art-manifest.ts`, `apps/site/src/lib/game/media/audio.ts` (thêm `playRewardSound`, `playSfx`), `apps/site/src/pages/the-gioi/mau-cong-toan.astro`.
- **Kiểm thử**: `apps/site/tests/unit/game/art-manifest.test.ts` (9 tests pass).

## Kiểm chứng

- `pnpm ci:all` chạy thành công (exit code 0): 0 lỗi lint, 0 lỗi typecheck, 112/112 tests pass, build 12 static pages.
- Cột mốc tiếp theo: Bố mẹ duyệt cảnh mẫu tại `/the-gioi/mau-cong-toan/` trước khi chuyển sang Phase 3.
