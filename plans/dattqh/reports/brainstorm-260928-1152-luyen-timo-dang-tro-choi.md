# Brainstorm: Luyện TIMO Khối 2 dạng trò chơi cho Miu

Ngày: 2026-09-28 · Nguồn: `~/Downloads/TIMOK2.pdf` (FERMAT, 140 trang, 14 đề, ~300 câu)

## Quyết định đã chốt (user)

- Mục tiêu: **vòng loại TIMO sắp tới** → đề song ngữ, trắc nghiệm A–D; tiếng Anh là phụ.
- **Tự sinh câu, không chép đề** (PDF có bản quyền, web lop2.hoandat.com công khai). PDF chỉ là nguồn dạng bài + khoảng số + độ khó.
- Thiết bị: **iPad** → cảm ứng trước, kéo thả, màn ngang/dọc.
- Miu thích game hơn đọc/làm toán → **trò chơi là chính, tối thiểu chữ**, nội dung bám dạng bài PDF.

## Contract

- **Outcome:** mục "Luyện TIMO" trong web hiện tại: bản đồ đảo (5 chủ đề), mỗi dạng = 1 mini-game SVG 2D có hoạt hình mẹo + lượt chơi 5 câu tự sinh + phản hồi tức thì; tiến độ lưu trên máy bé.
- **Constraints:** Astro tĩnh, không server/DB; JS client nhẹ, SVG/CSS animation, không lib game nặng; tái dùng mèo con, font, PWA, design tokens; tôn trọng `prefers-reduced-motion`; không đăng nguyên văn đề.
- **Non-goals:** chuyển cả 300 câu gốc; tài khoản/chấm online; vòng quốc gia (tiếng Anh thuần, tự luận) ở đợt đầu.
- **Acceptance:** mỗi dạng đợt 1 chơi được trên iPad Safari; bé tự chơi hết 1 lượt không cần đọc (đề được đọc to); câu sinh ra đúng đáp án (unit test bộ sinh); bố mẹ xem tiến độ/dạng yếu.

## Hướng chọn: C — mục "Luyện TIMO" + bộ sinh câu theo dạng + widget SVG

Loại A (thêm directive vào bài Markdown): thiếu vòng lặp game, bé chán. Loại B (app riêng): làm lại hạ tầng, không kịp.

### Nguyên tắc "game, ít chữ"

- Đề **đọc to tự động** (Web Speech API, giọng vi-VN; nút nghe lại). Chữ ngắn, số to, hình thay chữ.
- Trả lời bằng thao tác (kéo, bấm, lật, xoay), 4 đáp án dạng nút hình to thay vì "A. B. C. D." khô.
- Sai → gợi ý bằng hình (không lộ đáp án), lần 2 → hoạt hình lời giải. Đúng → pháo giấy + sao.
- Vòng lặp: bản đồ 5 đảo → chặng 5 câu (~5–10 phút) → sao → sticker sưu tập; "trùm đảo" = 5 câu trộn cuối đảo; chuỗi ngày học.
- Tiếng Anh: dòng phụ nhỏ dưới đề (như đề thật), từ khoá bấm để nghe.

### Dạng bài (theo syllabus PDF) → mini-game

| Chủ đề       | Dạng (tần suất trong đề)             | Mini-game                                                |
| ------------ | ------------------------------------ | -------------------------------------------------------- |
| Tư duy       | Dãy số quy luật (cao)                | Ếch nhảy đá, cung "+4 +5 +6"                             |
| Tư duy       | Dãy hình lặp                         | Băng chuyền, nhóm lặp tô màu                             |
| Tư duy       | Cân thăng bằng                       | Kéo đồ vật lên đĩa cân nghiêng                           |
| Tư duy       | Tuổi; thứ trong tuần (cao)           | Dòng thời gian nhân vật lớn lên; bánh xe 7 ngày          |
| Số học       | Số bị che; cộng trừ dãy; chữ số A/B  | Lật chuông; ghép cặp nổi màu; ô số bí ẩn                 |
| Lý thuyết số | Chẵn/lẻ (rất cao)                    | Kẹo xếp đôi, thừa 1 = lẻ                                 |
| Lý thuyết số | Chia đều; điền dấu +/−               | Kéo bút chì cho cột bằng nhau; bấm đổi dấu, kết quả sống |
| Hình học     | Đếm hình vuông/đoạn thẳng (cao)      | Tô sáng lần lượt theo nhóm cỡ, bộ đếm                    |
| Hình học     | Khối lập phương 3D                   | Isometric SVG, nút nhìn trước/trên/bên, tách tầng        |
| Tổ hợp       | Lập số; chọn cách; sắp xếp; mua-tặng | Thẻ số kéo vào ô; cây nhánh mọc; xếp hàng                |

### Đợt giao (tier)

- **Đợt 1 (L):** khung game (bản đồ, chặng, sao, tiến độ localStorage, đọc to, phản hồi) + 5 dạng tần suất cao: chẵn/lẻ, dãy số quy luật, tuổi + thứ, đếm hình vuông, khối lập phương.
- **Đợt 2 (L):** các dạng còn lại.
- **Đợt 3 (M):** thi thử bấm giờ 25 câu kiểu vòng loại + trang tiến độ cho bố mẹ.

## Rủi ro / chưa giải quyết

- Chất lượng giọng đọc vi-VN trên iPad Safari khác nhau theo máy → cần thử trên máy thật của Miu; dự phòng: file audio ghi sẵn cho câu dẫn cố định.
- Bộ sinh câu phải khớp độ khó đề thật → mỗi dạng lấy khoảng số từ các câu PDF tương ứng, test đáp án tự động.
- Hình đặc thù (đếm hình phức tạp) cần mẫu vẽ bằng dữ liệu (lưới, ma trận chiều cao khối), số lượng mẫu giới hạn ban đầu.
- Ngày thi vòng loại chưa rõ → quyết định cắt đợt nếu quá gấp.
