---
phase: 12
title: "Trang bố mẹ, sao lưu, chuyển mục cũ"
status: pending
priority: P2
effort: "M"
dependencies: [11]
---

# Phase 12: Trang bố mẹ, sao lưu, chuyển mục cũ

## Overview
Bố mẹ xem Miu học gì, yếu đâu, theo từng thế giới → môn → kỹ năng; điều khiển lịch thế giới/sự kiện; tiến độ không mất; gỡ mục "Luyện TIMO" cũ.

## Requirements
- `/the-gioi/bo-me/` (noindex, "cổng người lớn": một phép tính 2 chữ số × 1 chữ số):
  - Chọn thế giới (Lớp 2, sau này Lớp 3…) → bảng theo môn: mỗi kỹ năng có bậc 1–5, tỉ lệ đúng 20 lần gần nhất, lần ôn cuối, cờ "cần mẹo"; kỹ năng `tu-duy` tách riêng.
  - Sự kiện: tiến độ, huy hiệu, bảng kỷ lục mùa, điểm đại chiến theo chủ đề.
  - Thời gian chơi 7 ngày, chuỗi ngày.
  - Cài đặt: giới hạn thời gian/ngày (nhắc nghỉ), **mở thế giới lớp mới sớm/muộn**, bật/tắt và lịch từng sự kiện, bật/tắt đồng hồ đại chiến, tắt tiếng, đặt lại tiến độ (xác nhận 2 lần).
- **Sao lưu/khôi phục**: xuất mã (JSON nén → base64 + checksum) hoặc file `.json` nếu mã > 2KB; nhập để khôi phục; nhắc sao lưu hằng tuần; hướng dẫn "Thêm vào MH chính".
- Chuyển mục cũ: `/luyen-timo/*` chuyển tới sự kiện TIMO; kỷ lục "Kẹo chẵn lẻ" nhập vào mastery `lop-2/chan-le`; xoá `src/lib/timo`, `src/pages/luyen-timo`, `timo-game.css`, test cũ sau khi đã chuyển theo generator.

## Related Code Files
- Create: `src/pages/the-gioi/bo-me.astro`, `src/lib/game/state/backup-code.ts`, `src/lib/game/state/parent-settings.ts`, tests
- Modify: `src/lib/game/world/world-calendar.ts`, `src/lib/game/events/event-schedule.ts` (đọc cài đặt của bố mẹ), `src/pages/index.astro`
- Delete: `src/lib/timo/**`, `src/pages/luyen-timo/**`, `src/styles/timo-game.css`, `tests/unit/even-odd-questions.test.ts`

## Implementation Steps
1. Mã sao lưu (test vòng xuất → nhập; mã hỏng báo lỗi thân thiện). 2. Cài đặt bố mẹ (ghi đè lịch thế giới/sự kiện; test). 3. Trang bố mẹ + cổng người lớn. 4. Giới hạn thời gian + nhắc nghỉ. 5. Chuyển hướng + nhập kỷ lục cũ + xoá mã cũ.

## Success Criteria
- [ ] Xuất mã máy A → nhập máy B → tiến độ giống hệt (e2e).
- [ ] Mở sớm một thế giới mẫu trong test bằng cài đặt bố mẹ → cổng thế giới hiện ngay.
- [ ] Link cũ `/luyen-timo/keo-chan-le/` vẫn dẫn tới sự kiện TIMO.

## Risk Assessment
- Mã quá dài để copy tay → nén + chỉ lưu dữ liệu cần; quá 2KB thì dùng file.
