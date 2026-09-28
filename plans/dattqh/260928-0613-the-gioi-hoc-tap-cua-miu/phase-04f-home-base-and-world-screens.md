---
phase: 4f
title: 'Home Base và các màn thế giới: trang chủ, khu vực, sự kiện, hồ sơ và bộ sưu tập'
status: pending
priority: P1
effort: 'L'
dependencies: [4b, 4c, 4d, 4e]
---

# Phase 4f: Home Base và các màn thế giới

## Overview

Làm lại các màn theo ảnh mẫu `design-reference-miu-game-world-mockup.png` màn 1, 4, 6, 7. Trang chủ `/` thành **Home Base**: nhân vật của bé là trung tâm, bản đồ đảo, nhiệm vụ hôm nay, sự kiện, bộ sưu tập. Tiện ích trường học (đồng phục, thời khoá biểu, Phiếu cuối tuần) thu thành dải **"Bảng tin nhà Miu"** gọn.

## Requirements

- **Trang chủ (màn 1):**
  - HUD trên: avatar (ảnh chụp 3D) + tên + Lv + thanh XP; chip xu, kim cương, chuỗi ngày 🔥; nút thư, cài đặt.
  - Nhân vật 3D bên trái với bóng thoại ("Hôm nay chúng ta sẽ khám phá đâu nhỉ?", lời theo tính cách), hoạt ảnh nhàn rỗi.
  - Bản đồ đảo (tranh nền AI) với nhãn địa điểm DOM: Nhà của Miu (trang trí, bộ sưu tập), Khu rừng (Tiếng Việt), Trường học (Toán, Tiếng Anh), Thư viện, Lâu đài (thử thách), Núi tuyết (sắp mở), Đảo bí ẩn (cần Lv.15); ổ khoá theo luật mở khoá 4c. Chạm địa điểm → màn khu vực.
  - "Nhiệm vụ hôm nay": 3 nhiệm vụ/ngày theo giờ VN, trộn môn + sự kiện, hiện môn/kỹ năng và +XP; xong đủ → rương ngày; chuỗi ngày có "khiên" mỗi tuần (kéo từ phase 11).
  - "Sự kiện đang diễn ra": thẻ TIMO Challenge, đếm ngày còn lại (dùng `event-schedule`), nút Khám phá event.
  - "Bảng tin nhà Miu": đồng phục hôm nay, tiết học hôm nay, Phiếu cuối tuần mới — gọn, mở rộng khi chạm; giữ `uniform-schedule`, thời khoá biểu, danh sách bài hiện có.
- **Màn khu vực (màn 4):** nền địa điểm, tên + môn, mô tả, "Hoàn thành: x/y" + rương, nút Khám phá ngay; danh sách chương có sao và ổ khoá; băng lướt ngang các địa điểm khác. Thay trang vùng hiện tại (`/the-gioi/[lop]/[vung]`), địa điểm ↔ vùng theo dữ liệu thế giới (một vùng có thể có nhiều địa điểm).
- **Màn sự kiện TIMO (màn 6):** nền cổng phép phát sáng (CSS/hệ hạt), 4 ô lợi ích (thử thách đặc biệt, bài toán nâng cao, huy hiệu giới hạn, vật phẩm độc quyền), đếm ngày, nút Tham gia ngay. Giữ Event System phase 4.
- **Màn hồ sơ và bộ sưu tập (màn 7):** menu trái (Hồ sơ, Kỹ năng, Hành trình danh hiệu, Túi đồ, Bộ sưu tập, Thành tích); thẻ nhân vật + danh hiệu + XP; kỹ năng học tập (Toán, Tiếng Việt, English, Logic) có thanh và Lv; bộ sưu tập (huy hiệu, sinh vật, vật phẩm, địa điểm) có x/y.
- Mỗi hệ thống một lối vào lớn trên Home Base, không menu nhiều tầng; mọi nút có `data-id`; đọc to nhãn khi chạm lâu.
- Cổng thế giới `/the-gioi/` (chọn Lớp 2/Lớp 3) giữ, vào từ HUD.

## Related Code Files

- Modify: `src/pages/index.astro` (viết lại, tách thành component), `src/pages/the-gioi/[lop]/index.astro`, `src/pages/the-gioi/[lop]/[vung].astro`, `src/pages/the-gioi/[lop]/su-kien/[id].astro`, `src/components/game/{hud,event-banner,event-countdown}.astro`, `src/worlds/lop-2/world.ts` (+ địa điểm, toạ độ trên bản đồ đảo), `tests/e2e/kid-website.spec.ts`.
- Create: `src/components/home/{home-hud,home-character,island-map,daily-quests-card,event-card,school-notice-strip}.astro`, `src/lib/game/daily/{daily-quests,streak}.ts`, `src/pages/the-gioi/ho-so.astro`, test `tests/unit/game/{daily-quests,streak}.test.ts`.

## Implementation Steps

1. Dữ liệu địa điểm + toạ độ bản đồ đảo.
2. Nhiệm vụ hôm nay + chuỗi ngày + khiên (test đổi ngày giờ VN).
3. Trang chủ Home Base + Bảng tin nhà Miu.
4. Màn khu vực; màn sự kiện; màn hồ sơ và bộ sưu tập.
5. Cập nhật phase 11 (bỏ phần nhiệm vụ ngày, tủ đồ đã làm).
6. e2e + đo iPad + ảnh chụp so với ảnh mẫu cho bố mẹ duyệt.

## Success Criteria

- [ ] Trang chủ có đủ khối của màn 1; nhân vật là trung tâm thị giác; Bảng tin vẫn xem được đồng phục/TKB/Phiếu cuối tuần.
- [ ] Nhiệm vụ hôm nay reset 0h giờ VN; rương ngày nhận 1 lần/ngày; chuỗi + khiên đúng (unit test).
- [ ] Địa điểm khoá/mở đúng luật; chạm địa điểm mở màn khu vực.
- [ ] Màn khu vực, sự kiện, hồ sơ giống bố cục ảnh mẫu (bố mẹ duyệt ảnh chụp).
- [ ] iPad: trang chủ tải < 3s trên 4G, ≥ 50fps; hoạt động offline sau lần tải đầu.
- [ ] `pnpm ci:all` sạch; e2e xanh; không lỗi axe mức nghiêm trọng.

## Risk Assessment

- Trang chủ quá nặng (3D + tranh nền + GSAP) → tải 3D sau khi khung trang hiện; ảnh nền có bản nhỏ trước.
- Quá nhiều thứ trên một màn cho trẻ 7 tuổi → bố mẹ chơi thử cùng Miu, bỏ bớt khối ít dùng xuống dưới.

## Rollback

Trang chủ cũ giữ trong lịch sử git; có thể đặt Home Base ở `/the-gioi/nha-cua-miu/` và khôi phục `/` cũ nếu cần.
