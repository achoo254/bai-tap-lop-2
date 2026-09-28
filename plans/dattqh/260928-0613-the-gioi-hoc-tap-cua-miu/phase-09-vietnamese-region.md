---
phase: 9
title: "Vùng Tiếng Việt"
status: pending
priority: P2
effort: "L"
dependencies: [5]
---

# Phase 9: Vùng Tiếng Việt (Thế giới Lớp 2)

## Overview
Vùng thứ hai của Thế giới Lớp 2: chương trình Tiếng Việt lớp 2 (GDPT 2018) thành gameplay, dùng lại khuôn mini-game, HUD, thưởng, mastery.
Kiểm tra §12: Base ✓ · cùng thế giới ✓ · kiến thức thành cơ chế (phân loại, xây dựng, điều khiển), không phải phiếu bài tập.

## Requirements
- Danh mục `src/lib/game/skills/lop-2/vietnamese-skills.ts` (thêm vào `SKILLS` qua `catalogOf('lop-2', 'tieng-viet', …)`):
  `chinh-ta-phan-biet` (s/x, ch/tr, r/d/gi, l/n, iên/yên/uyên, ai/ay…), `van-va-tieng`, `tu-chi-su-vat`, `tu-chi-hoat-dong`, `tu-chi-dac-diem`, `cau-gioi-thieu` (Ai là gì), `cau-neu-hoat-dong` (Ai làm gì), `cau-neu-dac-diem` (Ai thế nào), `dau-cau` (chấm, phẩy, hỏi, chấm than), `sap-xep-cau`, `doc-hieu`, `viet-doan-ngan` (điền theo mẫu, lời nhắn/thiệp).

| Chương | Mini-game | Cơ chế |
|---|---|---|
| Rừng Bướm Chữ | `bat-buom-chu` | Bắt bướm mang tiếng viết đúng (s/x, ch/tr…) thả vào lọ; bướm sai bay mất |
| Xưởng Phân Loại | `bang-chuyen-tu` | Băng chuyền đưa từ tới, gạt vào thùng sự vật/hoạt động/đặc điểm |
| Cầu Câu | `xay-cau-cau` | Xếp các viên đá từ thành câu đúng để xây cầu; kiểu câu Ai là gì/làm gì/thế nào |
| Bến Dấu Câu | `thuyen-dau-cau` | Đặt dấu câu làm "biển báo" cho thuyền dừng/đi đúng chỗ |
| Thư Viện Truyện | `thu-vien-truyen` | Truyện ngắn tự viết, đọc to từng câu (tô chữ khi đọc); trả lời bằng hành động trong truyện (chọn đồ vật, kéo nhân vật) |
| Bưu Điện Làng | `buu-dien` | Ghép câu theo mẫu thành lời nhắn/thiệp gửi NPC; NPC phản hồi bằng giọng nói |

- Nội dung chữ **tự viết** theo chủ đề chương trình (gia đình, trường học, bạn bè, thiên nhiên…), không chép SGK; **bố mẹ duyệt bộ mẫu đầu tiên**.
- Giọng đọc tiếng Việt chuẩn; chữ hiển thị dùng font chữ mẫu tiểu học của site khi có.

## Related Code Files
- Create: `src/lib/game/skills/lop-2/vietnamese-skills.ts`, `src/worlds/lop-2/regions/tieng-viet.ts`, `src/minigames/{bat-buom-chu,bang-chuyen-tu,xay-cau-cau,thuyen-dau-cau,thu-vien-truyen,buu-dien}/**`, `src/content-game/lop-2/tieng-viet/*.ts` (kho từ, câu, truyện), tests, `public/game/lop-2/tieng-viet/**`
- Modify: `src/lib/game/skills/skill-types.ts` (thêm danh mục)

## Implementation Steps
1. Danh mục kỹ năng + kho nội dung (từ theo cặp chính tả, câu mẫu, 10 truyện ngắn đầu) → bố mẹ duyệt. 2. Hình vùng. 3. Sáu mini-game. 4. Boss vùng "Bà Chằn Lẫn Chữ". 5. Test (kho từ: mỗi từ đúng chính tả + đúng nhãn loại từ; kiểm bằng danh sách cố định) + chơi thử.

## Success Criteria
- [ ] Mọi kỹ năng Tiếng Việt lớp 2 có ít nhất một nhiệm vụ; bố mẹ duyệt kho nội dung.
- [ ] Bản lưu cũ đọc được và có thêm mastery Tiếng Việt ở bậc 1 (test migrate).

## Risk Assessment
- Nhãn loại từ gây tranh cãi (một từ vừa là sự vật vừa là hoạt động) → kho từ chỉ gồm từ rõ nghĩa trong ngữ cảnh lớp 2, có câu ví dụ.
- Giọng đọc máy đọc sai dấu/ngắt câu → rút ngắn câu, thử trên iPad thật, sửa bằng dấu câu.
