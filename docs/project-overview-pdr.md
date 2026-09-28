# Tổng quan sản phẩm & PDR: Thế giới học tập của Miu

Tài liệu định hướng sản phẩm, mô hình tư duy, người dùng mục tiêu và các ràng buộc cốt lõi của dự án "Thế giới học tập của Miu" (Miu's Learning World).

---

## 1. Tầm nhìn sản phẩm (Product Vision)

Dự án không xây dựng một ứng dụng làm bài tập thông thường rồi gắn thêm vài trò chơi giải trí rời rạc. Mục tiêu là tạo ra **một thế giới game học tập hoàn chỉnh, trong đó chương trình học là thế giới nền (Base)**, và các hoạt động thi đua đặc biệt là **các Sự kiện (Events) cắm vào thế giới**.

Bé khám phá thế giới qua một nhân vật đại diện (avatar Miu), từng bước rèn luyện kỹ năng, tích luỹ kinh nghiệm (XP), nhận xu thưởng và mở khoá các vùng đất mới.

---

## 2. Mô hình tư duy cốt lõi (Mental Model)

Mô hình tư duy này là kim chỉ nam bắt buộc phải giữ xuyên suốt mọi tính năng và dòng code:

```
🧭 Cổng Thế giới (nhân vật Miu đi theo bé qua các năm: Level, xu, đồ, huy hiệu)
├── 🌎 Thế giới Lớp 2 — năm học 2026–2027 (đang mở)
│   ├── 📚 Vùng Toán        ─┐
│   ├── 📖 Vùng Tiếng Việt   ├─ NỀN (BASE): Learn → Practice → Master
│   ├── 🇬🇧 Vùng Tiếng Anh   ─┘
│   └── 🎪 Sự kiện           ── SỰ KIỆN (EVENT): Apply → Challenge → Compete → Reward
│       └── TIMO Khối 2 — "Quần Đảo Số" (sự kiện đầu tiên)
├── 🔒 Thế giới Lớp 3 — mở năm học 2027–2028 (kế hoạch năm sau)
└── 🔒 Thế giới Lớp 4, 5… — mỗi năm một thế giới mới
```

| Khái niệm đời thực / Giáo dục | Khái niệm trong game       | Cơ chế hoạt động                                                                 |
| ----------------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| **Năm học**                   | **Thế giới (World)**       | Mỗi năm học một thế giới riêng (`lop-2`, `lop-3`). Thế giới cũ vẫn mở để ôn lại. |
| **Chương trình lớp**          | **Nền thế giới (Base)**    | Chia thành 3 Vùng môn học, mở theo tiến trình học kỳ.                            |
| **Môn học**                   | **Vùng (Region)**          | Vùng Toán, Vùng Tiếng Việt, Vùng Tiếng Anh.                                      |
| **Bài học**                   | **Nhiệm vụ (Quest)**       | Chuỗi hoạt động theo cốt truyện để mở khoá vùng đất.                             |
| **Bài tập**                   | **Gameplay**               | Thao tác tương tác (kéo-thả, chạm, cân đo, nối), không dùng trắc nghiệm tĩnh.    |
| **Kỹ năng**                   | **Tiến trình nhân vật**    | Bậc thành thạo (Mastery 1–5), điểm kinh nghiệm (XP), cấp độ (Level).             |
| **Bài kiểm tra**              | **Thử thách (Challenge)**  | Cửa ải đánh giá thành thạo để nhận sao và phần thưởng.                           |
| **Luyện thi / Cuộc thi**      | **Sự kiện (Event)**        | Mô-đun cắm/gỡ linh hoạt (vd: TIMO Khối 2), dùng lại kỹ năng của Base.            |
| **Thành tích**                | **Phần thưởng / Huy hiệu** | Xu mua phụ kiện, trang trí nhà Miu, huy hiệu vinh danh.                          |

**Vòng lặp trải nghiệm của bé:**
`Explore (Khám phá) → Encounter (Gặp thử thách) → Solve (Thao tác học) → Reward (Nhận thưởng) → Upgrade (Nâng cấp nhân vật) → Unlock (Mở vùng mới) → Explore`.

---

## 3. Đối tượng sử dụng & Cá nhân hoá (User Persona)

- **Người dùng chính**: Bé Miu (học sinh lớp 2, sinh nhật ngày 15/12; có em trai Bo sinh ngày 19/03). Xem định nghĩa tại [`packages/lesson-core/src/child-profile.ts`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/packages/lesson-core/src/child-profile.ts).
- **Thiết bị sử dụng chính**: iPad Safari, thao tác cảm ứng hoàn toàn, có thể dùng khi mất kết nối mạng.
- **Người đồng hành / Quản trị**: Bố (Đạt) và Mẹ (Thủy). Bố mẹ sử dụng trang Soạn bài (`apps/editor`) hoặc nhờ AI qua MCP (`apps/mcp-worker`) để cập nhật bài tập và theo dõi tiến độ của bé trên trang Bố Mẹ.

---

## 4. Mục tiêu không thuộc phạm vi (Non-Goals)

1. **Không tạo app làm bài trắc nghiệm**: Không làm các bài tập chọn đáp án A–B–C–D đơn thuần trong chương trình Base. Chỉ cho phép dạng trắc nghiệm chọn nhanh trong chế độ "Đại chiến" mô phỏng đề thi của Sự kiện.
2. **Không xoá bỏ hệ thống Phiếu cuối tuần**: Các bài tập chép vở hàng tuần do bố mẹ đăng ở thư mục `content/` vẫn được duy trì song song tại mục "Phiếu cuối tuần" trên web.
3. **Không làm máy chủ nhiều người chơi (Multiplayer / Global Leaderboard)**: Tránh áp lực ganh đua tiêu cực và chi phí hạ tầng; bảng xếp hạng trong game chỉ là bảng kỷ lục cá nhân theo mùa để bé tự vượt lên chính mình.
4. **Không sao chép nguyên văn tài liệu có bản quyền**: Không bê nguyên đề thi TIMO/FERMAT hay nội dung SGK vào dự án.

---

## 5. Các ràng buộc cốt lõi (Hard Constraints)

- **Bản quyền hình ảnh**: Chỉ dùng SVG do code vẽ (nhân vật Miu, mèo mascot, NPC) và các bộ hình có giấy phép tự do đã chọn lọc: [Kenney.nl](https://kenney.nl/assets) (CC0) và [OpenMoji](https://openmoji.org/) (CC BY-SA 4.0). Mọi file ảnh đều phải khai báo trong `licenses.json`. **Tuyệt đối không sinh hình bằng AI** vì hạn mức miễn phí thấp và phong cách không đồng nhất.
- **Thuật toán sinh câu hỏi tự động**: Mọi kỹ năng trong danh mục đều phải có bộ sinh câu hỏi tự động bằng code với 5 bậc độ khó, 3 bậc gợi ý và sinh câu song sinh khi bé làm sai.
- **Ranh giới Sự kiện (Event Boundary)**: Sự kiện cắm vào thế giới và tham chiếu kỹ năng của Base, không được tự ý tạo ra kỹ năng mới ngoài danh mục của thế giới. Thêm/xoá sự kiện không được làm ảnh hưởng đến Base.
- **Bảo mật và riêng tư trẻ em**: Web công khai tại `lop2.hoandat.com`. Tuyệt đối không lưu hoặc hiển thị họ tên đầy đủ, năm sinh, trường học hay địa chỉ nhà của bé.
- **Cân bằng học và chơi**: Thời lượng hoạt hình tối đa 1.5 giây và có thể bấm bỏ qua; thời gian thao tác học thực tế phải chiếm tối thiểu 70% thời gian làm nhiệm vụ.
