# Hướng dẫn phong cách mỹ thuật (Art Style Guide): Thế giới học tập của Miu

Tài liệu quy định chi tiết phong cách hình ảnh, hệ màu, quy chuẩn vẽ nhân vật SVG, tích hợp bộ hình miễn phí và công thái học hiển thị trên web dành cho bé lớp 2.

---

## 1. Triết lý thẩm mỹ cốt lõi

1. **Nét viền mực đậm (Thick Dark Ink Strokes)**: Mọi nhân vật và vật phẩm chính đều có viền mực sẫm màu (`#1f1a33` hoặc `#2b244d`), nét bo tròn (`stroke-linecap="round"`, `stroke-linejoin="round"`), độ dày từ 3px–6px. Điều này giúp hình vẽ nổi bật trên mọi nền cảnh và mang nét ấm áp như tranh vẽ tay trong truyện thiếu nhi.
2. **Bảng màu Pastel tươi sáng**: Sử dụng các mảng màu tươi tắn nhưng dịu mắt, tránh màu neon chói mắt gây mỏi khi bé học lâu trên iPad.
3. **Hình khối rõ ràng, dễ nhận biết**: Ưu tiên các khối cơ bản (tròn, oval, bo góc) giúp trẻ dễ nhận diện các thành phần hình học và số lượng vật thể khi làm bài toán.

---

## 2. Hệ màu theo Vùng học tập (Regional Palettes)

Để bé nhận diện tức thì mình đang ở môn học nào mà không cần đọc nhiều chữ:

### 2.1. Vùng Toán — "Thung Lũng Con Số"

- **Ý nghĩa**: Thông minh, sáng sủa, logic, khám phá.
- **Màu chủ đạo**:
  - Xanh da trời: `#38bdf8` (nền trời, mặt hồ), `#0284c7` (viền/nhấn).
  - Vàng nắng / Vàng kim: `#facc15` (sao, chìa khoá, ánh sáng), `#ca8a04` (gỗ/đất).
  - Trắng kem: `#f8fafc`.

### 2.2. Vùng Tiếng Việt — "Vương Quốc Từ Vựng"

- **Ý nghĩa**: Ngôn ngữ, cảm xúc, thi ca, tình cảm gia đình.
- **Màu chủ đạo**:
  - Hồng đào: `#fb7185` (hoa, mái nhà, cờ), `#fda4af` (nền dịu).
  - Cam ấm: `#fb923c` (sách vở, lối đi gạch), `#ea580c` (điểm nhấn).
  - Vàng kem nhạt: `#fff7ed`.

### 2.3. Vùng Tiếng Anh — "Rừng Rậm Ngôn Từ"

- **Ý nghĩa**: Sinh động, thiên nhiên, giao tiếp thế giới mở.
- **Màu chủ đạo**:
  - Xanh lá non: `#4ade80` (cây cỏ, đồng cỏ), `#16a34a` (tán cây râm mát).
  - Tím lavender: `#c084fc` (hoa dại, bảng tên, ma thuật ngôn từ), `#7e22ce` (viền nhấn).

### 2.4. Khu Sự kiện TIMO — "Quần Đảo Số"

- **Ý nghĩa**: Thi đua, lễ hội, kịch tính, chinh phục cúp vàng.
- **Màu chủ đạo**:
  - Đỏ lễ hội / Đỏ san hô: `#f43f5e`, `#be123c`.
  - Vàng hoàng gia / Vàng cúp: `#eab308`, `#ca8a04`.
  - Xanh biển thẳm: `#0369a1`.

---

## 3. Quy chuẩn nhân vật Miu (Avatar Specification)

Nhân vật chính Miu được vẽ hoàn toàn bằng code SVG với cấu trúc phân lớp (layers) để dễ dàng tạo chuyển động và tuỳ biến trang phục:

```
[Layer 0] Đuôi & bóng đổ sàn (Shadow & Tail)
[Layer 1] Chân sau (Back Feet)
[Layer 2] Thân mình & bụng trắng (Body & Belly)
[Layer 3] Áo / Balo / Dây đeo (Outfit / Backpack)
[Layer 4] Chân trước & Tay (Front Paws / Hands)
[Layer 5] Cổ áo / Khăn quàng (Collar)
[Layer 6] Đầu, tai, vằn trán, má hồng, mắt, mũi, miệng (Head, Ears, Face)
[Layer 7] Phụ kiện đầu: Nơ hồng, Mũ phớt, Mũ cử nhân, Vương miện (Headwear)
[Layer 8] Vật phẩm cầm tay: Bút chì, Kính lúp, Cờ sao (Handheld Item)
```

### 3.1. Màu lông (Fur Colors)

1. **Cam vằn (Mặc định của Miu)**: `#ffb45c`, vằn `#f08a24`.
2. **Xám tro thông thái**: `#94a3b8`, vằn `#64748b`.
3. **Trắng tuyết tinh khôi**: `#f8fafc`, tai hồng `#fda4af`.
4. **Tam thể may mắn**: Nền trắng `#ffffff`, đốm cam `#fb923c`, đốm đen `#334155`.
5. **Nâu chocolate**: `#a16207`, vằn `#713f12`.

### 3.2. Tư thế hoạt hình (Poses)

- `dung` (idle): Đứng vững, đuôi vẫy nhẹ chậm rãi, thở nhịp nhàng.
- `di` (walk): Hai chân bước so le, thân nghiêng nhẹ.
- `nhay` (jump): Chân co, hai tay giơ cao, tai vểnh lên.
- `vui` (cheer/win): Mắt cười tít, nhảy cẫng lên, sao lấp lánh xung quanh.
- `suy-nghi` (think): Tay chống cằm, mắt nhìn lên góc trên, dấu hỏi chấm xuất hiện.
- `buon` (sad/fail): Đầu cúi nhẹ, tai rũ xuống, giọt mồ hôi lăn nhẹ bên má.
- `te` (fall): Mông chạm đất, hai tay chống đỡ, mắt xoay xoay nhẹ.

---

## 4. Tích hợp bộ tài nguyên tự do (CC0 & CC BY-SA)

1. **Kenney.nl (CC0)**:
   - Các gói sử dụng: _Tiny Town_, _Pirate Pack_, _Toon Characters_, _UI Pack_, _Game Icons_.
   - Mục đích: Gạch lát nền (tiles 16x16 / 32x32 / 64x64 scale vector), cổng thành, biển báo, rương báu, cây cối, khung giao diện nút bấm.
2. **OpenMoji (CC BY-SA 4.0)**:
   - Mục đích: Các vật phẩm cụ thể để bé đếm hoặc chọn (kẹo, bánh quy, bút chì, quả táo, củ cà rốt, đồng hồ, xe hơi, các loài động vật trong thẻ từ Tiếng Anh).
   - Tối ưu: Đặt trong thư mục `public/game/openmoji/` hoặc `public/illustrations/`.
3. **Sổ theo dõi bản quyền**: Bắt buộc khai báo tại `public/game/licenses.json`.

---

## 5. Ràng buộc kỹ thuật & Hiệu năng

- **Dung lượng**: Toàn bộ tài nguyên ảnh tĩnh cho một Vùng không vượt quá **1.5MB**.
- **Định dạng**: 100% ưu tiên SVG cho vector sắc nét trên iPad Retina. Với sprite PNG chỉ dùng chuẩn pixel art tối ưu nén lossless.
- **Tốc độ khung hình**: Tất cả hoạt hình CSS / Web Animations phải giữ vững **≥ 50fps** trên iPad.
- **Thời lượng hoạt hình**: Hoạt hình phản hồi đúng/sai tối đa **1.5 giây** và luôn có thể chạm màn hình để bỏ qua tức thì.
