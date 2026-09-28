# Hướng dẫn thiết kế & Mỹ thuật: Thế giới học tập của Miu

Tài liệu quy định ngôn ngữ thiết kế thị giác, bảng màu nhận diện, chiến lược tài nguyên hình ảnh và tiêu chuẩn thao tác cảm ứng trên iPad.

---

## 1. Ngôn ngữ thiết kế & Bảng màu (Visual Identity)

Phong cách tổng thể là **nét viền mực đậm rõ ràng kết hợp màu pastel ấm áp**, thân thiện và dễ chịu cho mắt trẻ nhỏ (tham khảo các biến tại `apps/site/src/styles/design-tokens.css`).

### Mã màu nhận diện theo Vùng (Regional Color Coding)

Để bé 7 tuổi nhận biết ngay mình đang ở vùng môn học nào mà không cần đọc nhiều chữ, mỗi vùng có một cặp màu chủ đạo:

| Vùng đất / Khu vực        | Bảng màu chủ đạo             | Ý nghĩa thị giác                          |
| ------------------------- | ---------------------------- | ----------------------------------------- |
| **Vùng Toán**             | **Xanh da trời & Vàng nắng** | Tư duy logic, rõ ràng, sáng sủa           |
| **Vùng Tiếng Việt**       | **Hồng đào & Cam ấm**        | Ngôn ngữ, cảm xúc, văn thơ, ấm áp         |
| **Vùng Tiếng Anh**        | **Xanh lá non & Tím hoa cà** | Khám phá thế giới, sinh động, tự nhiên    |
| **Khu Sự kiện (TIMO...)** | **Đỏ lễ hội & Vàng ánh kim** | Không khí thi đua, náo nhiệt, phần thưởng |

---

## 2. Font chữ & Hiển thị vở ô li (Typography)

1. **Font chữ tập viết tiểu học (HP001)**:
   - Áp dụng cho các bài tập toán, bài đọc, câu hỏi và khung đặt tính theo cột (`::dat-tinh`).
   - Đảm bảo độ cao chữ và khoảng cách dòng khớp chính xác với lưới dòng kẻ ô li tiểu học.
2. **Font chữ giao diện (UI)**:
   - Dùng font chữ không chân tròn trịa, kích thước to, rõ ràng, dễ đọc cho trẻ nhỏ.

---

## 3. Chiến lược tài nguyên hình ảnh (Art Asset Strategy)

Để đảm bảo hiệu năng tải trang tức thì, hình ảnh sắc nét trên màn hình Retina của iPad và tuân thủ bản quyền, hệ thống áp dụng chiến lược 3 nguồn hình:

| Nguồn hình                                | Giấy phép               | Vai trò sử dụng                                                                                                               |
| ----------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **SVG tự vẽ bằng code**                   | Bản quyền dự án         | Nhân vật Miu (avatar nhiều lớp), mèo mascot, NPC chính và boss sự kiện. Cho phép đổi màu lông, thêm nơ/mũ/trang phục qua CSS. |
| **[Kenney.nl](https://kenney.nl/assets)** | **CC0 (Public Domain)** | Gạch bản đồ (tiles), nhà cửa, cây cối, rương báu, khung viền UI, nút bấm.                                                     |
| **[OpenMoji](https://openmoji.org/)**     | **CC BY-SA 4.0**        | Các vật thể cần đếm (kẹo, hoa quả, đồ chơi), con vật trong thẻ Tiếng Anh.                                                     |

### Các quy tắc bắt buộc về hình ảnh:

- **Tuyệt đối không sinh hình bằng AI**: Không tích hợp các API như Gemini hay DALL-E để sinh ảnh động vì tốn tài nguyên, chậm và phá vỡ tính nhất quán của phong cách đồ hoạ.
- **Sổ theo dõi giấy phép**: Mọi tài nguyên đặt trong `apps/site/public/game/` đều phải được ghi danh trong [`apps/site/public/game/licenses.json`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/apps/site/public/game/licenses.json) (bao gồm tên file, nguồn gốc, tác giả và loại giấy phép).
- **Vật thể mang dữ liệu toán học**: Mọi vật thể có số liệu (thước kẻ, đồng hồ, cân thăng bằng) phải do code vẽ bằng SVG để đảm bảo độ chính xác tuyệt đối về mặt số học.

---

## 4. Công thái học cảm ứng iPad (iPad Touch Ergonomics)

1. **Kích thước vùng chạm (Touch Target)**:
   - Vùng chạm tối thiểu là **48×48px** (khuyến nghị **56×56px** cho các ngón tay nhỏ của trẻ em).
   - Khoảng cách giữa các nút bấm không dưới 12px để tránh chạm nhầm.
2. **Cơ chế tương tác kéo-thả kép (Dual Drag & Place)**:
   - Hỗ trợ thao tác kéo trực tiếp trên màn hình cảm ứng (`pointermove`).
   - Luôn có phương án dự phòng: chạm vào vật thể để chọn → chạm vào vị trí đích để đặt.
3. **Tỉ lệ học tập và hiệu ứng hoạt hình**:
   - Hoạt hình chuyển cảnh hoặc phản hồi: thời lượng tối đa **≤ 1.5 giây** và bé có thể chạm để bỏ qua.
   - Thời gian thực tế bé thao tác giải quyết bài tập phải chiếm **tối thiểu 70%** tổng thời gian thực hiện nhiệm vụ.
   - Đảm bảo tốc độ khung hình đạt **≥ 50fps** trên trình duyệt Safari của iPad.
