---
phase: 13
title: 'QA iPad, hiệu năng, offline, tài liệu'
status: pending
priority: P2
effort: 'M'
dependencies: [12]
---

# Phase 13: QA iPad, hiệu năng, offline, tài liệu

## Overview

Rà soát tổng trên máy thật, tối ưu tải, chơi offline, và tài liệu để năm sau **thêm Thế giới Lớp 3** và thêm sự kiện mới nhanh. (Mỗi vùng/sự kiện đã test + deploy trong phase của nó.)

## Requirements

- iPad Safari thật: giọng đọc vi + en, mở khoá âm thanh, kéo-thả, xoay màn, PWA toàn màn hình.
- Hiệu năng: ≥ 50fps khi hoạt hình, ảnh mỗi vùng/sự kiện ≤ 1.5MB, JS mỗi trang ≤ 120KB gzip, mini-game nạp theo nơi chơi.
- Offline: service worker cache `/game/*` + trang `/the-gioi/*` sau lần mở đầu; tăng `VERSION` trong `public/sw.js`.
- Trợ năng: reduced-motion, chế độ không cần kéo (chạm chọn → chạm đích), tương phản chữ trên ảnh.
- Tài liệu `docs/the-gioi-hoc-tap.md`: mô hình tư duy (tài liệu sản phẩm), kiến trúc, **cách thêm một thế giới lớp mới** (GRADES + `worlds/<lop>/` + danh mục kỹ năng), **cách thêm một sự kiện**, cách thêm kỹ năng/mini-game, quy trình lấy hình miễn phí + ghi nguồn, quy ước state/migrate; 6 câu hỏi kiểm tra §12.

## Related Code Files

- Modify: `public/sw.js`, `playwright.config.*`, e2e specs
- Create: `docs/the-gioi-hoc-tap.md`, `tests/e2e/the-gioi-*.spec.ts`

## Implementation Steps

1. E2E toàn luồng (tạo nhân vật → mỗi vùng 1 nhiệm vụ → sự kiện 1 nhiệm vụ + boss → nhiệm vụ ngày → sao lưu) trên iPad giả lập. 2. Đo hiệu năng + dung lượng, tối ưu. 3. SW offline + test mất mạng. 4. Thử trên iPad thật của Miu (bố mẹ hỗ trợ) → sửa lỗi. 5. Viết docs. 6. `pnpm ci:all` sạch → deploy.

## Success Criteria

- [ ] Mọi mục Success Criteria trong plan.md đạt, có bằng chứng (số đo, ảnh chụp, log test).

## Risk Assessment

- Không có iPad thật trong phiên làm việc → bố mẹ chạy danh sách kiểm tra ngắn, gửi ảnh/ghi âm lỗi; ghi rõ mục chưa kiểm được.
