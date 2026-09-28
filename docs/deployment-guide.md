# Hướng dẫn triển khai & Vận hành: bai-tap-lop-2

Tài liệu hướng dẫn cấu hình hạ tầng, triển khai lên Cloudflare và vận hành các thành phần trong hệ thống.

---

## 1. Bản đồ hạ tầng & Tên miền

| Thành phần         | Công nghệ / Nền tảng                | Địa chỉ môi trường                 | Ghi chú                                                 |
| ------------------ | ----------------------------------- | ---------------------------------- | ------------------------------------------------------- |
| **Web của bé**     | Cloudflare Pages / Worker Assets    | `https://lop2.hoandat.com`         | Phục vụ file tĩnh từ Astro build (`dist/`), PWA offline |
| **Remote MCP**     | Cloudflare Worker + Durable Objects | `https://mcp-baitap.inetdev.io.vn` | Điểm kết nối MCP cho Claude soạn và duyệt bài           |
| **Trang Soạn bài** | Node.js (Hono) chạy cục bộ          | `http://127.0.0.1:4321`            | Công cụ soạn bài trên máy tính của bố mẹ                |

---

## 2. Quy trình CI/CD tự động (GitHub Actions)

Hệ thống có 2 luồng tự động hoá chính:

### 2.1. Kiểm tra mã nguồn ([`.github/workflows/ci.yml`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/.github/workflows/ci.yml))

- **Kích hoạt**: Mỗi khi có `push` lên nhánh `main` hoặc tạo `pull_request` (bỏ qua nếu chỉ sửa nội dung `content/**`).
- **Nhiệm vụ**: Chạy `pnpm ci:all` (lint, typecheck, unit test và build thử toàn bộ dự án).

### 2.2. Tự động cập nhật web ([`.github/workflows/deploy-web.yml`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/.github/workflows/deploy-web.yml))

- **Kích hoạt**: Tự động khi push lên nhánh `main` có thay đổi ở `content/**`, `apps/site/**`, `packages/lesson-core/**` hoặc chạy thủ công qua `workflow_dispatch`.
- **Yêu cầu Secret trong GitHub Repository Settings**:
  - `CLOUDFLARE_API_TOKEN`: Token có quyền _Workers Scripts: Edit_ và _Pages: Edit_.
  - `CLOUDFLARE_ACCOUNT_ID`: Mã tài khoản Cloudflare.
- **Quy trình thực thi**:
  1. Kiểm tra định dạng bài học: `pnpm --filter lesson-core test`.
  2. Build web tĩnh: `pnpm --filter site build` (sẽ dừng lại nếu bài đã đăng còn lỗi chính tả hoặc thiếu file).
  3. Đẩy lên Cloudflare: `pnpm exec wrangler deploy` từ thư mục `apps/site`.

---

## 3. Hướng dẫn triển khai thủ công từ máy tính

Nếu cần triển khai trực tiếp từ máy tính phát triển mà không qua GitHub Actions:

### 3.1. Triển khai Web của bé (`apps/site`)

Đảm bảo đã đăng nhập Wrangler trên máy tính (`npx wrangler login`):

```bash
# Build và deploy web lên tên miền lop2.hoandat.com
pnpm --filter site build
pnpm --filter site deploy
```

### 3.2. Triển khai Remote MCP Server (`apps/mcp-worker`)

Để triển khai worker MCP cho Claude:

```bash
# Cài đặt các secret bắt buộc cho Worker (chỉ cần làm lần đầu)
cd apps/mcp-worker
pnpm exec wrangler secret put GITHUB_CLIENT_ID
pnpm exec wrangler secret put GITHUB_CLIENT_SECRET
pnpm exec wrangler secret put COOKIE_ENCRYPTION_KEY
pnpm exec wrangler secret put GITHUB_CONTENT_TOKEN

# Triển khai worker
pnpm exec wrangler deploy
```

---

## 4. Vận hành Trang Soạn bài cục bộ (`apps/editor`)

Trang Soạn bài giúp phụ huynh nhập bài tập tuần và xem trước trực quan với font chữ mẫu tiểu học:

- **Trên máy tính Windows**: Nhấp đúp vào file [`Soan-bai.cmd`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/Soan-bai.cmd) ở thư mục gốc của repo.
- **Trên macOS / Linux**: Chạy lệnh từ terminal:
  ```bash
  pnpm soan
  ```
- Trình duyệt sẽ mở tại `http://127.0.0.1:4321`. Khi bấm "Lưu bài" hoặc "Đăng bài", ứng dụng tự động kiểm tra cú pháp, tạo commit git và đẩy lên nhánh `main` của GitHub; luồng GitHub Actions sau đó sẽ tự động build và đưa bài mới lên `lop2.hoandat.com`.
