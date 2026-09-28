---
phase: 4e
title: 'Quest Arc: nhiệm vụ nhiều màn có NPC, khám phá, lựa chọn, boss, thưởng có công dụng'
status: pending
priority: P1
effort: 'XL'
dependencies: [4c, 4d]
---

# Phase 4e: Quest Arc

## Overview

Biến nhiệm vụ từ "đọc → chọn đáp án → đúng/sai" thành một chuyến phiêu lưu nhiều màn (ảnh mẫu `design-reference-miu-game-world-mockup.png` màn 5 và **`design-reference-quest-screens-mockup.png` 9 màn** — chuẩn giao diện của phase này; tài liệu `miu-quest-gameplay-character-progression.html`). Nhiệm vụ = **kịch bản màn khai báo bằng dữ liệu**, một trình chạy chung. Mini-game hiện có chạy như một loại màn. Nhiệm vụ mẫu: dựng lại **"Cầu thủ dự bị"** (giữ nguyên bài đọc, câu hỏi, đáp án mẫu chép vở — bố mẹ tự nhập). Đây là **khuôn bắt buộc** cho mọi nhiệm vụ ở phase 5–10.

## Requirements

- **Loại màn:** `dialogue` (NPC 3D nói, đọc to, bấm tiếp), `explore` (cảnh nền AI + đồ vật bấm được để tìm manh mối; có điểm ẩn theo tính cách), `challenge` (gọi `MiniGame` hiện có với 1..N câu), `choice` (2–3 phương án, rẽ nhánh rồi hội tụ; phương án phụ theo tính cách `requiresPersonality`, luôn có phương án chung), `use-item` (dùng vật phẩm công cụ đã có, vd. Chìa khoá rừng mở cổng), `boss` (tổng hợp kiến thức, thanh máu, tim; Chiến binh +1 tim), `reward`, `unlock`.
- **Adventure Arc 8 bước** (Hook → Explore → Learn → Challenge → Decision → Finale → Reward → Unlock) là mẫu mặc định; kịch bản được kiểm tra có ít nhất một `challenge` và một `boss` hoặc `challenge` cuối.
- **7 câu hỏi kiểm tra** thành trường bắt buộc trong kịch bản: vai, nơi chốn, mục tiêu, tương tác, kiến thức dùng, phần thưởng, điều gì mở khoá. Test chặn kịch bản thiếu.
- **Màn khung nhiệm vụ** theo ảnh mẫu: nút quay lại, tên chương, thanh tiến độ màn (2/5), XP đang có, hộp thoại NPC, dải hướng dẫn dưới cùng; nhân vật của bé (3D) đứng trong cảnh và phản ứng (vui khi đúng, suy nghĩ khi sai).
- **Màn thưởng mới:** sao, xu, XP, **XP kỹ năng theo môn tăng có thanh chạy**, vật phẩm/mục sưu tầm nhận được, lên cấp kỹ năng/Level có hiệu ứng (confetti), điều gì vừa mở khoá; Nghệ sĩ chọn 1 trong 2 món trang phục.
- **Liên kết nhiệm vụ:** phần thưởng công cụ dùng ở nhiệm vụ sau (nhiệm vụ mẫu cho "Chìa khoá rừng" → nhiệm vụ 2 Tiếng Việt có màn `use-item` mở cổng).
- Giữ: gợi ý 3 bậc, câu song sinh sau khi lộ đáp án, Câu trước/Câu tiếp, đáp án mẫu chép vở, tính thưởng và mastery hiện có; hoạt ảnh ≤ 1.5s bỏ qua được; ≥ 70% thời gian là màn học (trình chạy đo và ghi log dev).
- **Sự kiện TIMO dùng cùng trình chạy** (nhiệm vụ sự kiện là kịch bản trong thư mục sự kiện, không sửa Base).

## Màn hình theo ảnh mẫu nhiệm vụ (`design-reference-quest-screens-mockup.png`)

1. **Chọn nhiệm vụ trên bản đồ:** nhãn địa điểm có sao đã đạt/tổng (Khu rừng ⭐ 3/12, Trường học ⭐ 5/20), bóng thoại nhân vật gợi ý nơi nên đi (ưu tiên nhiệm vụ hôm nay). Làm cùng Phase 4f, dữ liệu sao lấy từ đây.
2. **Mở đầu nhiệm vụ:** bảng gỗ tên nơi chốn + chương, thanh tiến độ màn (1/5), ô **Phần thưởng** xem trước (+XP, +xu), NPC nói (bóng thoại có tên), nút chính "Bắt đầu…".
3. **Đọc hiểu:** cuốn sách mở bên trái (bài đọc, tranh minh hoạ, nút đọc to), bảng câu hỏi bên phải (Câu 1/3, 4 lựa chọn A–D lớn).
4. **Kéo thả (phép cộng):** NPC nêu tình huống; bảng "Cần có / Đã có / Còn thiếu ?" với vật do code vẽ; kéo thẻ số vào ô trống.
5. **Sắp xếp (so sánh số):** hòn đá mang số kéo vào hàng ô theo thứ tự; nút **Làm lại**; khi đúng thì cầu đá hiện ra để đi qua sông (hệ quả trong cảnh).
6. **Trắc nghiệm có hỗ trợ:** bài toán lời văn + tranh, 4 lựa chọn 2×2; nhân vật phản ứng.
7. **Tình huống lựa chọn:** 3 thẻ hành động có hình (Tìm gỗ sửa cầu / Đi vòng qua khu rừng / Nhờ bạn bè giúp đỡ) — màn `choice`, rẽ nhánh rồi hội tụ.
8. **Hỗ trợ học tập:** bảng **Hướng dẫn** có tab Cách làm (các bước đánh số), Ví dụ mẫu, Mẹo nhỏ; ô **Gợi ý**; ô **Đáp án** (đáp án + giải thích).
9. **Hoàn thành nhiệm vụ:** 3 sao, thẻ thưởng (+XP, +xu, vật phẩm "Hạt giống kỳ diệu", "Kỹ năng đọc +1"), nút **Về bản đồ** và **Tiếp tục khám phá**.

**Thanh hành động chung** dưới mọi màn học: Hướng dẫn · Gợi ý · (Làm lại khi có) · **Kiểm tra**. Bé chọn/kéo xong rồi bấm Kiểm tra mới chấm (không chấm ngay khi chạm), để bé được sửa trước khi nộp.

**Quy tắc hỗ trợ và sao** (giữ đo mastery đúng):
- **Hướng dẫn** (Cách làm, Mẹo nhỏ, Ví dụ mẫu) là cách làm chung, ví dụ mẫu dùng **câu song sinh khác số** → không tính là gợi ý, không trừ sao. (Ảnh mẫu ghi thẳng số của câu đang làm; em đổi sang câu song sinh để hướng dẫn không lộ đáp án.)
- **Gợi ý** = gợi ý bậc 1–2 hiện có; **Đáp án** = bậc 3 (lộ đáp án) rồi ra câu song sinh — tính sao như `rewards.ts` hiện tại.

**Cơ chế mini-game dùng chung mới** (mọi vùng/sự kiện dùng lại, đăng ký qua `MiniGame`): `trac-nghiem-ho-tro` (A–D, dùng cho đọc hiểu và toán lời văn), `keo-tha-dien-so` (kéo thẻ số vào ô trống, có vật đếm do code vẽ), `sap-xep-thu-tu` (kéo vật mang số vào hàng theo thứ tự, có Làm lại). Trắc nghiệm A–D **chỉ là một loại màn**: validator chặn nhiệm vụ mà mọi màn học đều là trắc nghiệm.

## Architecture

```
src/lib/game/quest-arc/quest-script-types.ts   kiểu kịch bản + 7 câu hỏi kiểm tra
src/lib/game/quest-arc/quest-script-validator.ts  zod + luật (có challenge, nhánh hội tụ, phương án chung)
src/lib/game/quest-arc/quest-runner.ts          máy trạng thái màn (không phụ thuộc DOM, test được)
src/components/game/quest/{dialogue,explore,choice,use-item,boss,reward}-step.ts   hiển thị từng loại màn
src/components/game/quest/{quest-frame,help-panel,action-bar}.astro   khung nhiệm vụ, bảng Hướng dẫn/Gợi ý/Đáp án, thanh hành động
src/minigames/{trac-nghiem-ho-tro,keo-tha-dien-so,sap-xep-thu-tu}/   cơ chế dùng chung mới
src/worlds/lop-2/quests/tieng-viet/cau-thu-du-bi.quest.ts   kịch bản nhiệm vụ mẫu
```

## Related Code Files

- Modify: `src/pages/the-gioi/choi.astro` (thay vòng N câu bằng trình chạy), `src/worlds/lop-2/world.ts` (nhiệm vụ trỏ tới kịch bản), `src/lib/game/world/world-types.ts`, `src/minigames/doc-hieu-minigame.ts` (chạy được như màn `challenge` 1 câu), `src/lib/game/progression/rewards.ts`, `src/pages/the-gioi/[lop]/su-kien/[id].astro` (dùng trình chạy).
- Create: các file ở Architecture; test `tests/unit/game/{quest-runner,quest-script-validator}.test.ts`; e2e chơi hết nhiệm vụ mẫu với 2 tính cách.

## Implementation Steps

1. Kiểu kịch bản + validator + test.
2. `quest-runner` (máy trạng thái, rẽ nhánh, tim, dùng vật phẩm) + test đi đủ nhánh với 5 tính cách.
3. Khung nhiệm vụ (màn 2), thanh hành động + bảng hỗ trợ (màn 8), hiển thị từng loại màn, màn thưởng (màn 9).
3b. Ba cơ chế dùng chung `trac-nghiem-ho-tro`, `keo-tha-dien-so`, `sap-xep-thu-tu` (màn 3–6) + bộ sinh câu cho kỹ năng Toán dùng thử (`cong-tru-20`, so sánh số) + test đáp án trên ≥ 200 hạt giống.
4. Kịch bản "Cầu thủ dự bị" (Sóc Nâu/Ông Gác Rừng dẫn chuyện, khám phá rừng tìm manh mối từ bài đọc, câu hỏi đọc hiểu là các màn `challenge`, lựa chọn cách giúp gấu con, boss tổng hợp, thưởng Chìa khoá rừng + mục sưu tầm) và nhiệm vụ 2 dùng chìa khoá.
4b. Nhiệm vụ mẫu Toán "Sửa cầu qua sông" (Vùng Toán): mở đầu → kéo thả phép cộng → sắp xếp đá → trắc nghiệm lời văn → lựa chọn cách sửa cầu → thưởng; phủ đủ màn 4–7.
5. Chuyển nhiệm vụ Toán demo và nhiệm vụ sự kiện TIMO hiện có sang kịch bản.
6. Cập nhật phase 5–10: mọi nhiệm vụ mới viết theo kịch bản Quest Arc.

## Success Criteria

- [ ] Đủ 9 màn của ảnh mẫu nhiệm vụ (bố mẹ duyệt ảnh chụp so với ảnh mẫu); thanh hành động Hướng dẫn/Gợi ý/Làm lại/Kiểm tra hoạt động đúng quy tắc sao.
- [ ] Nhiệm vụ mẫu Toán "Sửa cầu qua sông" chạy hết; bộ sinh câu của 3 cơ chế mới đúng trên ≥ 200 hạt giống × 5 bậc.
- [ ] Validator chặn nhiệm vụ mà mọi màn học đều là trắc nghiệm.
- [ ] Nhiệm vụ mẫu chạy đủ 8 bước, trả lời được 7 câu hỏi, bài đọc/câu hỏi/đáp án mẫu giữ nguyên.
- [ ] Nhận Chìa khoá rừng và dùng được ở nhiệm vụ sau.
- [ ] Hoàn thành được với cả 5 tính cách; khác biệt thấy được (điểm ẩn, phương án phụ, tim boss…); sao/XP học như nhau.
- [ ] Validator chặn kịch bản thiếu `challenge`, nhánh không hội tụ, thiếu phương án chung, thiếu 7 câu hỏi.
- [ ] Nhiệm vụ TIMO chạy bằng trình chạy chung, không sửa file Base (diff).
- [ ] `pnpm ci:all` sạch; e2e xanh.

## Risk Assessment

- Truyện dài làm bé chán → mỗi `dialogue` ≤ 2 câu, bỏ qua được; log tỉ lệ thời gian học.
- Rẽ nhánh gây kẹt → validator + test đi mọi nhánh.

## Rollback

Trình chạy mới đặt sau cờ theo nhiệm vụ (`script` có thì dùng trình chạy, không có thì vòng câu cũ) tới khi chuyển hết.
