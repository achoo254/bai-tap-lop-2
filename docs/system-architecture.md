# Kiến trúc hệ thống: bai-tap-lop-2

Tài liệu mô tả ranh giới kiến trúc, cấu trúc monorepo, luồng dữ liệu và thiết kế lõi game "Thế giới học tập của Miu".

---

## 1. Ranh giới Monorepo (Monorepo Topology)

Hệ thống được tổ chức dưới dạng monorepo dùng `pnpm workspace`, gồm các gói sau:

```
bai-tap-lop-2/
├── packages/
│   └── lesson-core/      # Lõi nghiệp vụ bài học (Node + Browser, TypeScript thuần)
│                         # Zod schema, Markdown parser/serializer, validator, hồ sơ bé
├── apps/
│   ├── site/             # Web của bé: Astro 5 (SSG) + PWA + Lõi Game (DOM/SVG)
│   │                     # Triển khai trên Cloudflare Pages (lop2.hoandat.com)
│   ├── editor/           # Trang Soạn bài của bố mẹ: Hono HTTP Server + Vite UI
│   │                     # Chạy cục bộ (http://127.0.0.1:4321), đồng bộ qua git
│   └── mcp-worker/       # Remote MCP Server: Cloudflare Workers + Durable Objects
│                         # Điểm kết nối cho AI soạn bài (mcp-baitap.inetdev.io.vn)
└── content/              # Kho bài tập tuần (Markdown, phân nhóm theo thư mục ngày)
```

### Ranh giới trách nhiệm:

1. `lesson-core`: Là nguồn sự thật duy nhất về cấu trúc bài học, định dạng thẻ tuỳ biến (`::hinh`, `::dat-tinh`, `::ke-bang`) và kiểm tra tính hợp lệ của bài. Không phụ thuộc vào DOM hay runtime cụ thể.
2. `apps/site`: Tiếp nhận bài tập từ `content/` qua Astro Content Collections và chứa toàn bộ logic tương tác của Thế giới học tập (`src/lib/game/`).
3. `apps/editor` & `apps/mcp-worker`: Hai công cụ tạo/sửa nội dung cho bố mẹ và AI. Cả hai đều kiểm định bài qua `lesson-core` trước khi commit lên kho git.

---

## 2. Kiến trúc Lõi Game (Game Engine Architecture)

Toàn bộ lõi Thế giới học tập nằm tại [`apps/site/src/lib/game/`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/apps/site/src/lib/game/), không sử dụng engine game đồ hoạ nặng (như Phaser hay Unity) mà xây dựng trên nền tảng **DOM + SVG + Web Animations API**. Điều này giúp ứng dụng nhẹ, tải tức thì, hình ảnh sắc nét trên màn hình Retina của iPad và dễ bảo trì.

```
apps/site/src/lib/game/
├── state/             # Quản lý trạng thái người chơi và lưu trữ bền vững
│   ├── game-state.ts  # Zod schema trạng thái: the-gioi:v1 (avatar, xu, XP, mastery, quests)
│   └── game-store.ts  # Pub/sub store, debounce ghi 300ms, tự động khôi phục dữ liệu hỏng
├── skills/            # Danh mục kỹ năng học tập theo từng lớp và môn
│   ├── skill-types.ts # GRADES (lop-2...), SUBJECTS, SkillDefinition, Challenge, HintStep
│   ├── skill-registry.ts # Sổ đăng ký kỹ năng toàn hệ thống
│   ├── random.ts      # Bộ tạo số ngẫu nhiên có kiểm soát hạt giống (seed)
│   └── lop-2/         # Kỹ năng cụ thể của Lớp 2 (Toán, Tiếng Việt, Tiếng Anh)
├── progression/       # Hệ thống tiến trình và cơ chế thích ứng
│   ├── level-table.ts # Bảng quy đổi cấp độ nhân vật theo XP
│   ├── rewards.ts     # Tính toán xu, XP và sao thưởng dựa trên kết quả nhiệm vụ
│   └── adaptive-difficulty.ts # Thuật toán tự động tăng/giảm bậc thử thách (1-5)
├── media/             # Tương tác ngoại vi và truyền thông
│   ├── audio.ts       # Giọng đọc TTS đa ngữ (vi/en), hiệu ứng âm thanh Web Audio
│   ├── drag-and-place.ts # Xử lý cảm ứng kéo-thả + chạm-đặt tối ưu cho iPad
│   └── motion.ts      # Điều phối chuyển động hoạt hình
├── world/             # Cấu trúc bản đồ và phân cấp thế giới
└── events/            # Hệ thống Sự kiện tổng quát (Event Engine)
```

---

## 3. Quản lý trạng thái & Độ bền vững (State Persistence)

- **Lưu trữ cục bộ**: Trạng thái chơi game lưu tại `localStorage` trình duyệt dưới khoá `the-gioi:v1`.
- **Chống mất mát dữ liệu**:
  - `GameStore` áp dụng cơ chế debounce ghi 300ms khi chơi liên tục, đồng thời lắng nghe sự kiện `beforeunload` và `pagehide` để ghi ngay lập tức khi bé đóng trang.
  - Tự động bổ sung các kỹ năng mới vào hồ sơ cũ khi danh mục mở rộng (thông qua `.default()` trong Zod schema).
  - Nếu dữ liệu trong `localStorage` bị hỏng cấu trúc, hệ thống sao lưu bản lỗi sang khoá `the-gioi:hong` và khởi tạo lại trạng thái sạch để bé không bị treo app.
- **Đối phó giới hạn 7 ngày của Safari**: Safari trên iPad có cơ chế tự xoá `localStorage` của các trang web không truy cập trong 7 ngày. Giải pháp:
  1. Hướng dẫn cài đặt trang web ra Màn hình chính (PWA Add-to-Home-Screen) để giữ bộ nhớ lâu dài.
  2. Cung cấp tính năng Xuất / Nhập mã sao lưu tiến độ ở trang Bố Mẹ.

---

## 4. Ranh giới hệ thống Sự kiện (Event System Boundary)

Sự kiện (ví dụ: TIMO Khối 2 — "Quần Đảo Số") là các hoạt động có thời hạn được cắm vào một Thế giới cụ thể.

```
       ┌────────────────────────────────────────────────────────┐
       │                 THẾ GIỚI LỚP 2                         │
       │                                                        │
       │  ┌──────────────────────────┐                          │
       │  │ NỀN TẢNG (BASE)          │                          │
       │  │ - Danh mục kỹ năng lớp 2 │◄─────────────────────┐   │
       │  │ - Vùng Toán, TV, TA      │                      │   │
       │  │ - Tiến trình Mastery 1-5 │                      │   │
       │  └──────────────────────────┘                      │   │
       │                                                    │   │
       │  ┌──────────────────────────┐      tham chiếu      │   │
       │  │ SỰ KIỆN (EVENT - TIMO)   │      kỹ năng Base    │   │
       │  │ - Bản đồ sự kiện         │──────────────────────┘   │
       │  │ - Lịch mở / kết thúc     │                          │
       │  │ - Nhiệm vụ & Boss        │ (KHÔNG tạo kỹ năng mới)   │
       │  │ - Huy hiệu & Cúp         │                          │
       │  └──────────────────────────┘                          │
       └────────────────────────────────────────────────────────┘
```

**Nguyên tắc cắm/gỡ:**

1. **Tham chiếu một chiều**: Sự kiện chỉ được phép tham chiếu các kỹ năng đã khai báo trong danh mục môn học của Base. Sự kiện **không được tự tạo mã kỹ năng mới**.
2. **Kế thừa độ khó**: Bậc thử thách trong sự kiện được tính bằng bậc thành thạo hiện tại của kỹ năng đó trong Base + mức nâng độ khó sự kiện (ví dụ: TIMO nâng +1 bậc, tối đa 5).
3. **Không phá vỡ Base**: Khi thêm sự kiện mới hoặc gỡ bỏ sự kiện đã hết hạn, mã nguồn của các Vùng Base không bị chỉnh sửa.

---

## 5. Đa thế giới theo năm học (Multi-World Architecture)

- Mỗi năm học tương ứng với một Thế giới (`lop-2`, `lop-3`, ...).
- Mã kỹ năng được phân vùng theo tiền tố lớp học (ví dụ: `lop-2/chan-le`, `lop-3/phan-so`).
- Khi bước sang năm học mới, một thế giới mới được khởi tạo với bản đồ và vùng môn học mới, **hoàn toàn độc lập với thế giới cũ**. Bé vẫn có thể quay lại Thế giới Lớp 2 để ôn tập hoặc thu thập đủ sao.
- Hồ sơ nhân vật (Level, tổng xu, tủ đồ, huy hiệu) là tài sản xuyên suốt của bé qua mọi năm học.
