# Thế giới học tập của Miu 🐱✨

Ứng dụng web học tập dạng trò chơi (game-based learning) dành cho bé Miu, kết hợp hệ thống bài tập hàng tuần và thế giới học tập theo từng năm học (bắt đầu từ Thế giới Lớp 2 năm học 2026–2027) cùng các sự kiện thi đua (TIMO Khối 2).

- **Trang web của bé**: [lop2.hoandat.com](https://lop2.hoandat.com) (PWA, tối ưu cho iPad)
- **Kế hoạch phát triển chính**: [`plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu/plan.md`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu/plan.md)
- **Tài liệu dự án**: [docs/index.md](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/docs/index.md)
- **Quy tắc cho AI Agent**: [AGENTS.md](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/AGENTS.md)

---

## Cấu trúc Monorepo

```
bai-tap-lop-2/
├── apps/
│   ├── site/          # Web học tập của bé (Astro 5 + PWA, deploy lên Cloudflare Pages)
│   ├── editor/        # Ứng dụng web Soạn bài cục bộ cho bố mẹ (Hono + Vite/React)
│   └── mcp-worker/    # Remote MCP Server trên Cloudflare Workers cho Claude soạn bài
├── packages/
│   └── lesson-core/   # Thư viện dùng chung (schema bài học, parser Markdown, validator, hồ sơ bé)
├── content/           # Dữ liệu các bài tập / phiếu cuối tuần (Markdown)
├── docs/              # Tài liệu kiến trúc, tiêu chuẩn kỹ thuật và hướng dẫn vận hành
└── plans/             # Kế hoạch phát triển và lộ trình chi tiết
```

---

## Bắt đầu nhanh

Yêu cầu môi trường: **Node.js >= 22** và **pnpm v10+**.

```bash
# Cài đặt toàn bộ dependencies
pnpm install

# Chạy web của bé ở môi trường dev
pnpm dev:site

# Chạy trang Soạn bài của bố mẹ (mở http://127.0.0.1:4321)
pnpm soan
# Hoặc trên Windows: chạy file Soan-bai.cmd

# Chạy toàn bộ unit test
pnpm test

# Chạy kiểm tra toàn diện trước khi commit (lint + typecheck + test + build)
pnpm ci:all
```

---

## Nguyên tắc cốt lõi

1. **Học qua trò chơi thực thụ**: Kiến thức được thiết kế thành gameplay tương tác (kéo-thả, chọn, ghép, điều khiển), không biến thành bài trắc nghiệm khoanh A–D khô khan.
2. **Không sao chép nội dung có bản quyền**: Đề bài và câu hỏi được sinh tự động bằng thuật toán sinh câu (5 bậc độ khó + 3 bậc gợi ý), không chép y nguyên sách giáo khoa hay tài liệu cuộc thi.
3. **Hình ảnh bản quyền tự do**: Nhân vật chính Miu được vẽ vector SVG; bối cảnh và icon sử dụng các gói miễn phí CC0 ([Kenney.nl](https://kenney.nl/assets)) và CC BY-SA ([OpenMoji](https://openmoji.org/)). Tuyệt đối không sinh hình AI.
4. **Bảo mật và quyền riêng tư**: Web công khai nên chỉ hiển thị tên gọi ở nhà và ngày/tháng sinh, không công khai họ tên đầy đủ, trường lớp hay năm sinh.
5. **Ưu tiên iPad Safari**: Thiết kế touch-first, chuyển động mượt mà (>= 50fps) và hỗ trợ PWA offline khi mất mạng.
