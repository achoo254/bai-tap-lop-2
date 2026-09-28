# Điều hướng mã nguồn: bai-tap-lop-2

Tài liệu điều hướng cấu trúc dự án, các điểm vào thực thi (entry points) và các ranh giới module trong monorepo.

---

## 1. Bản đồ điểm vào (Entry Points)

| Vị trí                 | Điểm vào chính                                                                                                                                       | Vai trò & Thực thi                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Root**               | [`package.json`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/package.json)                                                                       | Quản lý lệnh điều phối toàn bộ monorepo (`ci:all`, `build`, `test`, `lint`).       |
| **Gói lõi**            | [`packages/lesson-core/src/index.ts`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/packages/lesson-core/src/index.ts)                             | Export toàn bộ schema, hàm phân tích Markdown, validator và hồ sơ trẻ em.          |
| **Web của bé**         | [`apps/site/src/pages/index.astro`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/apps/site/src/pages/index.astro)                                 | Cổng thông tin trang chủ của bé (Astro Static Page).                               |
| **Lõi Game**           | [`apps/site/src/lib/game/state/game-store.ts`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/apps/site/src/lib/game/state/game-store.ts)           | Điểm khởi tạo và điều phối trạng thái Thế giới học tập (`the-gioi:v1`).            |
| **Sổ đăng ký kỹ năng** | [`apps/site/src/lib/game/skills/skill-registry.ts`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/apps/site/src/lib/game/skills/skill-registry.ts) | Nơi tập trung toàn bộ kỹ năng học tập của các lớp và môn.                          |
| **Trang Soạn bài**     | [`apps/editor/src/server/editor-main.ts`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/apps/editor/src/server/editor-main.ts)                     | Máy chủ Node.js/Hono phục vụ công cụ soạn bài cục bộ cho bố mẹ (`pnpm soan`).      |
| **Remote MCP**         | [`apps/mcp-worker/src/worker-entry.ts`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/apps/mcp-worker/src/worker-entry.ts)                         | Điểm tiếp nhận request Cloudflare Worker phục vụ giao thức Model Context Protocol. |

---

## 2. Ranh giới Module & Trách nhiệm thực thi

### `packages/lesson-core`

- **Chức năng**: Lõi nghiệp vụ độc lập, dùng chung giữa `site`, `editor` và `mcp-worker`.
- **Thư mục quan trọng**:
  - `src/lesson-frontmatter-schema.ts`: Schema Zod cho tiêu đề bài, môn học, ngày đăng và trạng thái nháp.
  - `src/lesson-validator.ts`: Kiểm tra toàn diện quy chuẩn bài học (chính tả, độ dài, tính an toàn liên kết).
  - `src/render/`: Bộ chuyển đổi Markdown bài học sang HTML an toàn có kiểm tra scheme.
  - `src/child-profile.ts`: Thông tin hồ sơ của Miu và các gợi ý cá nhân hoá bài học.

### `apps/site`

- **Chức năng**: Ứng dụng web hiển thị bài học và không gian chơi game "Thế giới học tập".
- **Thư mục quan trọng**:
  - `src/lib/game/`: Toàn bộ logic lõi game (trạng thái, kỹ năng, tiến trình, phần thưởng, âm thanh, kéo-thả).
  - `src/pages/the-gioi/`: Các trang giao diện thế giới (Cổng thế giới, bản đồ, khu vực nhiệm vụ).
  - `src/pages/luyen-timo/`: Khu vực thử nghiệm và sự kiện TIMO Khối 2.
  - `public/game/`: Tài nguyên hình ảnh tự do (Kenney CC0, OpenMoji) và file `licenses.json`.

### `apps/editor`

- **Chức năng**: Công cụ web chạy cục bộ giúp phụ huynh viết bài, xem trước trực tiếp và commit lên GitHub.
- **Thư mục quan trọng**:
  - `src/server/`: HTTP API quản lý đọc/ghi file bài tập trong `content/` và đồng bộ qua git (`simple-git`).
  - `src/ui/`: Giao diện React/Vite cho phụ huynh nhập liệu với font chữ tiểu học HP001.

### `apps/mcp-worker`

- **Chức năng**: Dịch vụ máy chủ MCP chạy trên Cloudflare Workers, cho phép Claude đọc và tạo bài tập trực tiếp từ xa.
- **Thư mục quan trọng**:
  - `src/mcp/`: Đăng ký các công cụ MCP (`create_lesson`, `update_lesson`, `publish_lesson`, `list_lessons`).
  - `src/github/`: Giao tiếp với GitHub API để đọc/ghi bài viết thông qua commit có bảo vệ xung đột.

---

## 3. Quản lý luồng kiểm định & CI

- **Lệnh kiểm tra toàn bộ**: `pnpm ci:all` (thực thi tuần tự: `lint` -> `typecheck` -> `test` -> `build`).
- **File cấu hình CI**: [`.github/workflows/ci.yml`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/.github/workflows/ci.yml).
- **File tự động cập nhật web**: [`.github/workflows/deploy-web.yml`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/.github/workflows/deploy-web.yml).
