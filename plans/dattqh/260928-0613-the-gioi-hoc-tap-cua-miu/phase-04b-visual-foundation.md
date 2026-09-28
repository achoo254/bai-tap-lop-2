---
phase: 4b
title: 'Nền tảng hình ảnh: phong cách, tranh nền AI, font, thư viện chuyển động'
status: pending
priority: P1
effort: 'M'
dependencies: [4a]
---

# Phase 4b: Nền tảng hình ảnh

## Overview

Chuẩn hoá phong cách theo ảnh mẫu `design-reference-miu-game-world-mockup.png` trước khi dựng màn hình: bảng màu, font, thành phần giao diện dùng chung, thư viện chuyển động, và bộ tranh nền AI cho Thế giới Lớp 2. Chốt lại quyết định mới về ảnh AI trong README và `plan.md`.

## Requirements

- **Quy tắc ảnh AI (quyết định 2026-09-28):** AI chỉ dùng cho **tranh nền tĩnh** và **mô hình 3D nhân vật/NPC/đồ mặc**; sinh một lần, lưu file trong repo, ghi nguồn trong `licenses.json` (loại `ai-generated`, công cụ, ngày, prompt rút gọn). Vật mang số liệu toán vẫn do code vẽ.
- **Phong cách:** bảng màu (xanh trời, hồng nút chính, vàng xu, tím kim cương), độ bo, đổ bóng mềm, viền trắng dày, nút gradient hồng có bóng như ảnh mẫu → token CSS trong `design-tokens.css`.
- **Font tiêu đề** tròn, béo (Baloo 2 hoặc Fredoka, tự host qua `@fontsource`), giữ Nunito cho chữ thường và font chữ mẫu tiểu học cho nội dung bài.
- **Thành phần dùng chung** (Astro component): thẻ kính mờ, nút chính/phụ, thanh XP/tiến độ, chip tiền tệ (xu, kim cương, chuỗi ngày), nhãn địa điểm trên bản đồ, ô vật phẩm có ổ khoá, bóng thoại NPC, tab biểu tượng, băng thẻ lướt ngang (CSS scroll-snap).
- **Thư viện:** GSAP (chuyển động giao diện, bản đồ), canvas-confetti (màn thưởng); cả hai tải động theo trang.
- **Tranh nền AI cho Thế giới Lớp 2:** lập danh sách trước (ước 15–25 ảnh): bản đồ đảo thế giới, cảnh từng địa điểm (Nhà của Miu, Khu rừng, Trường học, Thư viện, Lâu đài, Núi tuyết, Đảo bí ẩn), cảnh nhiệm vụ mẫu (rừng có tảng đá NPC, bờ sông có cầu hỏng, suối có hòn đá, rừng đêm lấp lánh — theo `design-reference-quest-screens-mockup.png`), khung sách mở và bảng gỗ tiêu đề, nền sự kiện TIMO (cổng phép), nền màn tạo nhân vật, ảnh thu nhỏ địa điểm. Một **prompt phong cách chung** để các ảnh cùng nét; xuất `webp`, có bản 1x/2x cho iPad.
- Bản đồ đảo: vị trí các địa điểm khai báo bằng toạ độ % trong dữ liệu thế giới để đặt nhãn/ổ khoá bằng DOM phía trên ảnh.

## Related Code Files

- Create: `src/components/game/ui/*.astro` (thành phần dùng chung), `src/lib/game/media/motion-gsap.ts`, `public/game/backgrounds/**`, `plans/dattqh/reports/` danh sách ảnh nền + prompt phong cách.
- Modify: `src/styles/design-tokens.css`, `src/styles/game.css`, `apps/site/package.json` (+ `gsap`, `canvas-confetti`, font), `public/game/licenses.json`, `src/lib/game/media/art-manifest.ts` (+ loại `ai-generated`), `tests/unit/game/art-manifest.test.ts`, `README.md` (nguyên tắc 3), `plan.md` (quyết định đã chốt).

## Implementation Steps

1. README nguyên tắc 3 và `plan.md` đã sửa ở bước lập kế hoạch (2026-09-28); kiểm tra lại cho khớp khi làm.
2. Token màu/độ bo/bóng + font tiêu đề.
3. Thành phần giao diện dùng chung + trang xem mẫu nội bộ (mở rộng `/the-gioi/mau-cong-toan/` hoặc trang mẫu mới).
4. Danh sách ảnh nền + prompt phong cách → sinh ảnh (dùng key Gemini hiện có qua skill `ak:ai-artist`/`ak:ai-multimodal`), chọn lọc, nén webp, ghi `licenses.json`.
5. `motion-gsap.ts` (hàm dùng chung: nảy vào, bay xu về HUD, rung ổ khoá) tôn trọng `prefers-reduced-motion`.
6. Test `art-manifest` bắt buộc mọi file trong `public/game/**` có mục giấy phép (kể cả `ai-generated`).

## Success Criteria

- [ ] README và `plan.md` ghi đúng quy tắc ảnh AI mới.
- [ ] Mọi ảnh nền có trong `licenses.json`; test art-manifest xanh.
- [ ] Trang mẫu hiện đủ thành phần dùng chung, giống ảnh mẫu khi bố mẹ so sánh.
- [ ] Mỗi ảnh nền ≤ 400 KB (2x); tổng bộ nền Lớp 2 ≤ 8 MB.
- [ ] `pnpm ci:all` sạch.

## Risk Assessment

- Hạn mức Gemini miễn phí thấp → sinh theo danh sách, ưu tiên ảnh dùng ở 4e/4f; ảnh chưa có thì dùng nền màu tạm.
- Ảnh AI lệch nét nhau → cùng prompt phong cách + cùng bảng màu; loại ảnh lệch.
- Ảnh AI vẽ chữ sai → yêu cầu không có chữ trong ảnh; mọi nhãn là DOM.

## Rollback

Token và thành phần mới không thay thế giao diện cũ cho tới phase 4f; gỡ được bằng revert commit.
