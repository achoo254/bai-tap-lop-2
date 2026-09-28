---
phase: 10
title: "Vùng Tiếng Anh"
status: pending
priority: P2
effort: "L"
dependencies: [5]
---

# Phase 10: Vùng Tiếng Anh (Thế giới Lớp 2)

## Overview
Vùng thứ ba của Thế giới Lớp 2: Tiếng Anh lớp 2 (chữ cái + âm, từ vựng theo chủ đề, câu mẫu ngắn) thành gameplay dựa trên nghe và hình, gần như không cần đọc.
Kiểm tra §12: Base ✓ · cùng thế giới ✓ · cơ chế nghe → hành động, không phải điền từ.

## Requirements
- Danh mục `src/lib/game/skills/lop-2/english-skills.ts`: `phonics-chu-cai` (chữ cái + âm đầu), `tu-vung-mau-sac`, `tu-vung-con-vat`, `tu-vung-do-choi`, `tu-vung-do-an`, `tu-vung-gia-dinh`, `tu-vung-truong-lop`, `tu-vung-co-the`, `so-dem-tieng-anh` (1–20), `cau-mau` (I have…, This is…, I like…, Can you…?).

| Chương | Mini-game | Cơ chế |
|---|---|---|
| Vườn Chữ Cái | `vuon-chu-cai` | Nghe âm → tưới đúng cây mang chữ cái; cây nở hoa |
| Sở Thú Thân Thiện | `so-thu-nghe-goi` | Nghe tên con vật/màu (TTS en-US) → dẫn đúng con vào chuồng (hình OpenMoji) |
| Cửa Hàng Đồ Chơi | `cua-hang-do-choi` | Khách nói "I want a red ball" → lấy đúng món; đếm số tiếng Anh |
| Cầu Đánh Vần | `cau-danh-van` | Nghe từ → kéo chữ cái xây cầu (từ 3–5 chữ) |
| Rạp Múa Rối | `rap-mua-roi` | Nghe câu mẫu → bấm/kéo cho con rối làm đúng hành động |

- Giọng đọc tiếng Anh `en-US`/`en-GB` có sẵn trên máy (`speak(text, 'en')` từ phase 1); tốc độ chậm; nút nghe lại.
- Từ vựng/câu **tự soạn** theo chủ đề phổ biến của Tiếng Anh lớp 2, không chép giáo trình; bố mẹ duyệt danh sách.

## Related Code Files
- Create: `src/lib/game/skills/lop-2/english-skills.ts`, `src/worlds/lop-2/regions/tieng-anh.ts`, `src/minigames/{vuon-chu-cai,so-thu-nghe-goi,cua-hang-do-choi,cau-danh-van,rap-mua-roi}/**`, `src/content-game/lop-2/tieng-anh/*.ts`, tests, `public/game/lop-2/tieng-anh/**`
- Modify: `src/lib/game/skills/skill-types.ts`, `src/lib/game/media/audio.ts` (nếu phase 1 chưa xong phần en)

## Implementation Steps
1. Danh mục + kho từ vựng (mỗi từ gắn một hình OpenMoji) → bố mẹ duyệt. 2. Hình vùng. 3. Năm mini-game. 4. Boss vùng "Rồng Quên Chữ". 5. Test (mọi từ có hình + phát âm được) + thử giọng en trên iPad + chơi thử.

## Success Criteria
- [ ] Mọi kỹ năng Tiếng Anh lớp 2 có ít nhất một nhiệm vụ; mỗi từ có hình đúng nghĩa.
- [ ] Trên iPad thật chọn được giọng tiếng Anh; không có giọng thì hiện hướng dẫn cài.

## Risk Assessment
- Giọng TTS tiếng Anh đọc sai từ ngắn/chữ cái rời → âm chữ cái đọc qua từ ví dụ ("A — apple"), kiểm danh sách trên iPad thật.
