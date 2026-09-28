---
title: "Kế hoạch mở rộng Thế giới của Miu: Home Base, nhân vật 3D, Quest Arc"
date: 2026-09-28
summary: Thêm Phase 4a–4f trước Phase 5 theo 2 tài liệu sản phẩm và 2 ảnh mẫu giao diện; đổi quy tắc ảnh AI
---

# Kế hoạch mở rộng Thế giới của Miu: Home Base, nhân vật 3D, Quest Arc

## What happened
Bố mẹ gửi 2 tài liệu sản phẩm (Home Base + tạo nhân vật dạng game; Quest gameplay + tiến trình nhân vật) và 2 ảnh mẫu giao diện (7 màn thế giới, 9 màn nhiệm vụ). Soát code: trang chủ là dashboard, tạo nhân vật là một trang chọn, đồ mở sẵn hết, nhiệm vụ đọc hiểu là "đọc → chọn đáp án", chưa có XP kỹ năng theo môn, danh hiệu, vật phẩm có công dụng.

## Decision
- Chèn Phase 4a–4f trước Phase 5: 4a thử kỹ thuật 3D (1 mèo trên iPad, cổng quyết định), 4b nền tảng hình ảnh + tranh nền AI, 4c dữ liệu tiến trình (skillXp chỉ tăng, danh hiệu, vật phẩm, luật mở khoá, tính cách, loài, bộ sưu tập), 4d nhân vật 3D 4 loài + tạo nhân vật, 4e Quest Arc (kịch bản màn theo dữ liệu, 9 màn theo ảnh mẫu), 4f Home Base + màn khu vực/sự kiện/hồ sơ.
- Đổi quy tắc hình: cho phép AI cho tranh nền tĩnh và mô hình 3D; README nguyên tắc 3 đã sửa.
- Nhân vật 3D bằng Three.js, bộ xương chibi chung để đồ vừa 4 loài; 3D chỉ ở 3 trang, nơi khác dùng ảnh chụp.
- Tính cách đổi cách chơi nhưng không đổi độ khó/sao/XP học.
- Trắc nghiệm A–D là một loại màn, không được chiếm mọi màn học; Hướng dẫn dùng câu song sinh nên không trừ sao.
- Giữ bài "Cầu thủ dự bị" (bố mẹ tự nhập) làm nhiệm vụ mẫu.

## Next steps
Commit 27 file đang dở trên main, rồi /ak:cook Phase 4a (và 4c song song). Nếu công cụ AI 3D cần trả phí thì hỏi bố mẹ.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
