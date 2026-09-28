# Tài liệu dự án: bai-tap-lop-2

Hệ thống tài liệu dự án "Thế giới học tập của Miu" (monorepo `bai-tap-lop-2`). Tài liệu tập trung giải thích **TẠI SAO (WHY)** và **ĐỊNH HƯỚNG / ĐỊA CHỈ (WHERE)**, mã nguồn sở hữu **CÁI GÌ (WHAT)** và **NHƯ THẾ NÀO (HOW)**.

---

## Bản đồ tài liệu

| Tài liệu                                                                                                    | Mục đích và phạm vi                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [Tổng quan dự án & PDR](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/docs/project-overview-pdr.md)       | Tầm nhìn sản phẩm, mô hình tư duy (Thế giới / Vùng / Nhiệm vụ / Sự kiện), đối tượng sử dụng, ranh giới và ràng buộc kinh doanh.             |
| [Kiến trúc hệ thống](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/docs/system-architecture.md)           | Cấu trúc monorepo, ranh giới module, kiến trúc lõi game, hệ thống sự kiện cắm/gỡ, lưu trữ trạng thái `the-gioi:v1`.                         |
| [Tiêu chuẩn kỹ thuật](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/docs/code-standards.md)               | Chuẩn code TypeScript, chính sách kiểm thử (test sinh câu >= 200 hạt giống), bảo mật XSS, định nghĩa hoàn thành (DoD).                      |
| [Điều hướng mã nguồn](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/docs/codebase-summary.md)             | Điểm vào (entry points), đơn vị sở hữu thực thi và ranh giới module trong repo.                                                             |
| [Hướng dẫn thiết kế & Mỹ thuật](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/docs/design-guidelines.md)  | Hệ thống màu sắc nhận diện từng vùng, nhân vật SVG, giấy phép bộ hình miễn phí (Kenney CC0, OpenMoji), trải nghiệm chạm iPad.               |
| [Hướng dẫn triển khai & Vận hành](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/docs/deployment-guide.md) | Cấu hình Cloudflare Pages (`lop2.hoandat.com`), Cloudflare Worker MCP (`mcp-baitap.inetdev.io.vn`), CI/CD GitHub Actions và trang Soạn bài. |

---

## Mối liên hệ với các tài liệu khác

- **Quy tắc hành vi cho AI Agent**: Xem [AGENTS.md](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/AGENTS.md) (hoặc liên kết [CLAUDE.md](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/CLAUDE.md)) để biết các lệnh kiểm tra bắt buộc, danh sách cấm và quy tắc thực thi.
- **Kế hoạch phát triển chi tiết**: Xem [`plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu/plan.md`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu/plan.md) cùng 13 tài liệu phase tương ứng (`phase-01` đến `phase-13`).
- **Nguồn sự thật về sản phẩm**: Tài liệu yêu cầu từ bố mẹ (`learning-world-game-based-learning-context.html`).
