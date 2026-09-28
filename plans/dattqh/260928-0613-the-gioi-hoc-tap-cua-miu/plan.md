---
title: 'Thế giới học tập của Miu — mỗi năm học một thế giới, bắt đầu từ Thế giới Lớp 2 + hệ thống sự kiện (TIMO)'
description: 'Mỗi năm học một thế giới game (Lớp 2 năm 2026–2027, Lớp 3 mở 2027…); nền là chương trình của lớp (Toán, Tiếng Việt, Tiếng Anh) thành gameplay; sự kiện cắm vào thế giới, sự kiện đầu tiên là TIMO Khối 2'
status: in-progress
priority: P1
effort: 'XL'
tags: [game-based-learning, learning-world, event-system, timo, site]
created: 2026-09-28
---

# Thế giới học tập của Miu

## Trạng thái hiện tại (cập nhật 2026-09-28 22:10)

**Để tiếp tục:** commit các thay đổi đang dở trên `main`, rồi `/ak:cook plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu` để làm **Phase 4a (thử kỹ thuật nhân vật 3D)**; Phase 4c làm song song được.

**Mở rộng 2026-09-28 tối:** bố mẹ bổ sung 2 tài liệu (`miu-homepage-character-creator-game-world.html`, `miu-quest-gameplay-character-progression.html`) và ảnh mẫu giao diện (`design-reference-miu-game-world-mockup.png`, `design-reference-quest-screens-mockup.png`). Thêm Phase 4a–4f, làm **trước Phase 5**. Brainstorm: `plans/dattqh/reports/brainstorm-260928-2148-home-base-quest-arc-character-progression.md`.

| Hạng mục                                                          | Trạng thái                                                                                                                                                     | Bằng chứng                                                       |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Domain web                                                        | ✅ `lop2.hoandat.com` (thay `baitap.inetdev.io.vn`, đã gỡ); MCP giữ `mcp-baitap.inetdev.io.vn`, `SITE_URL` mới                                                 | commit `85defa1`                                                 |
| Prototype "Kẹo chẵn lẻ" + trang `/luyen-timo/` + banner trang chủ | ✅ đang chạy trên web (deploy thủ công từ máy, 13:08)                                                                                                          | commit `22e0ff5`                                                 |
| Phase 1 — lõi game                                                | ✅ hoàn thành: GRADES/`lop-2/*` skill id, 29 kỹ năng Toán lớp 2, state `the-gioi:v1`, thưởng, thích ứng, audio vi+en, kéo-thả                                  | commits `20a427c`, `2d0d263`; test xanh                          |
| Phase 2 — bộ hình & mỹ thuật                                      | ✅ hoàn thành: style guide, Kenney CC0 + OpenMoji (`licenses.json`), Miu SVG 8 tư thế/10 màu/16 phụ kiện, NPC & Boss TIMO, cảnh mẫu `/the-gioi/mau-cong-toan/` | `art-manifest.test.ts` 9/9 pass, `pnpm ci:all` exit 0            |
| Phase 3 — Cổng thế giới + Thế giới Lớp 2                          | ✅ hoàn thành: cổng `/the-gioi/`, bản đồ thế giới, bản đồ Vùng Toán, tạo nhân vật, HUD, khung nhiệm vụ `/the-gioi/choi/`                                       | `world.test.ts` 13/13 pass, `pnpm ci:all` exit 0                 |
| Phase 4 — Event System tổng quát                                  | ✅ hoàn thành: EventDefinition, registry, schedule (giờ VN), boost độ khó, Event Map `/the-gioi/lop-2/su-kien/timo/`, EventBanner, HUD, phần thưởng & huy hiệu | `event-*.test.ts` pass, 110 unit test xanh, `pnpm ci:all` exit 0 |
| Phase 4a → 4f (mở rộng)                                           | ⬜ bắt đầu từ 4a (thử 3D) và 4c (dữ liệu tiến trình)                                                                                                            | —                                                                |
| Phase 5 → 13                                                      | ⬜ sau 4f                                                                                                                                                       | —                                                                |

**Chặn / cần bố mẹ làm:**

- ~~Thiếu secret `CLOUDFLARE_API_TOKEN`~~ — đã thêm 2026-09-28; workflow "Cập nhật web của bé" deploy thành công (run 36388589597, custom domain `lop2.hoandat.com`). Từ giờ đăng bài/push `main` là web tự cập nhật.
- Câu hỏi mở cuối file (bộ sách, bảng kỷ lục, ngày mở thế giới mới) — đang dùng mặc định.

**Ghi chú môi trường:** Wrangler + MCP Cloudflare đã đăng nhập OAuth trên máy; Playwright dùng `channel: 'chrome'` (chưa cài trình duyệt riêng của Playwright); `apps/site` đã thêm `zod`.

## Overview

Nguồn sự thật về sản phẩm: `~/Downloads/learning-world-game-based-learning-context.html` (bố mẹ cung cấp 2026-09-28).
Không xây "app học có thêm game" mà xây **một thế giới game, chương trình học là thế giới nền**, hoạt động đặc biệt là **Sự kiện** cắm vào thế giới.

```
🧭 Cổng Thế giới (một nhân vật đi theo bé qua mọi năm: tên, ngoại hình, Level, xu, đồ, huy hiệu)
├── 🌎 Thế giới Lớp 2 — năm học 2026–2027 (đang mở)
│   ├── 📚 Vùng Toán        ─┐
│   ├── 📖 Vùng Tiếng Việt   ├─ BASE: Learn → Practice → Master (chương trình lớp 2)
│   ├── 🇬🇧 Vùng Tiếng Anh   ─┘
│   └── 🎪 Sự kiện           ── EVENT: Apply → Challenge → Compete → Reward (có lịch, cắm/gỡ không đụng Base)
│       └── TIMO Khối 2 — "Quần Đảo Số" (sự kiện đầu tiên)
├── 🔒 Thế giới Lớp 3 — mở năm học 2027–2028 (hiện "sắp mở", làm ở kế hoạch năm sau)
└── 🔒 Thế giới Lớp 4, 5… — mỗi năm một thế giới mới
```

**Mỗi năm học một thế giới** (quyết định của bố mẹ 2026-09-28): thế giới mới có bản đồ, vùng, nội dung và sự kiện của lớp đó; kỹ năng mang mã có tiền tố lớp (`lop-2/chan-le`) nên tiến trình từng năm tách bạch. Thế giới năm trước vẫn mở để ôn lại và lấy nốt sao. Nhân vật và tiến trình nhân vật (Level, xu, đồ, huy hiệu) dùng chung mọi thế giới.

**Mô hình tư duy (bắt buộc giữ xuyên suốt):**
Năm học = Thế giới · Chương trình của lớp = nền của Thế giới · Môn = Vùng · Bài học = Nhiệm vụ (quest) · Bài tập = Gameplay · Kỹ năng = Tiến trình nhân vật · Kiểm tra = Thử thách · Luyện thi/cuộc thi = Sự kiện · Thành tích = Phần thưởng · TIMO = Sự kiện đặc biệt.

**Vòng chơi:** Explore → Encounter → Solve → Reward → Upgrade → Unlock → Explore.

Ngữ cảnh trước đó: brainstorm `plans/dattqh/reports/brainstorm-260928-1152-luyen-timo-dang-tro-choi.md`; prototype "Kẹo chẵn lẻ" (`apps/site/src/lib/timo/*`, đang chạy tại `/luyen-timo/keo-chan-le/`).

## Quyết định đã chốt (user)

- Làm **đủ**, ôn luyện lâu dài, không cắt theo ngày thi.
- Hình: ~~SVG tự vẽ, không sinh ảnh AI~~ → **đổi 2026-09-28 tối**: tranh nền tĩnh sinh bằng AI (một lần, lưu repo); **nhân vật 4 loài, NPC và đồ mặc là 3D** (Three.js, mô hình AI dựng từ ảnh 2D, bộ xương chung); giao diện theo ảnh mẫu `design-reference-miu-game-world-mockup.png`; Kenney/OpenMoji vẫn dùng cho biểu tượng; vật mang số liệu toán do code vẽ; mọi file ghi nguồn trong `licenses.json`.
- Trang chủ `/` là **Home Base** của nhân vật; đồng phục, thời khoá biểu, Phiếu cuối tuần thu vào dải "Bảng tin nhà Miu".
- **4 loài nhân vật**: Mèo, Thỏ, Cáo, Gấu. **Tính cách ảnh hưởng cách chơi** (không đổi độ khó/sao/XP học).
- Nhiệm vụ là **kịch bản nhiều màn (Quest Arc)**; nhiệm vụ mẫu dựng lại bài "Cầu thủ dự bị" (bố mẹ tự nhập, giữ nguyên bài và câu hỏi).
- Câu hỏi **tự sinh**, không chép đề/sách có bản quyền (FERMAT, SGK); web công khai.
- Thiết bị chính **iPad** (Safari), cảm ứng.
- TIMO là **Sự kiện**, không phải môn/chương ngang hàng Toán–Tiếng Việt–Tiếng Anh (tài liệu sản phẩm §5).
- **Mỗi năm học một thế giới**; kế hoạch này làm Thế giới Lớp 2 + khung đa thế giới, Lớp 3 là kế hoạch của năm sau.

## Câu hỏi kiểm tra cho mọi thiết kế (tài liệu sản phẩm §12)

Mỗi phase phải trả lời được: thuộc Base hay Event? có nằm trong cùng thế giới? kiến thức thành gameplay hay chỉ là worksheet? Event có dùng tiến trình/kỹ năng của Base? thêm Event mới có phá Base không? bé có cảm giác đang khám phá và chơi?

## Kiến trúc tóm tắt

```
apps/site/src/lib/game/
  state/        hồ sơ nhân vật, xu, XP, level, mastery theo kỹ năng, nhiệm vụ, sự kiện (localStorage `the-gioi:v1`)
  skills/       GRADES (thế giới theo năm học), SUBJECTS, danh mục kỹ năng theo lớp/môn
                (lop-2/math-skills.ts, sau thêm lop-2/vietnamese-skills.ts, lop-2/english-skills.ts, lop-3/…)
                + giao diện bộ sinh câu 5 bậc + gợi ý 3 bậc + sổ đăng ký
  progression/  thưởng, level, độ khó thích ứng
  world/        cấu trúc Base theo thế giới: Thế giới (lớp) → Vùng → Chương → Bài học → Nhiệm vụ → Mini-game
  events/       Event System tổng quát: metadata, lịch, địa điểm trên bản đồ, nhiệm vụ, thử thách,
                phần thưởng, thành tích, bảng kỷ lục; mỗi sự kiện = 1 thư mục cấu hình
  media/        giọng đọc (vi + en), tiếng động, kéo-thả, chuyển động
apps/site/src/minigames/<co-che>/   mini-game theo cơ chế, dùng chung giữa Base và Event
apps/site/src/worlds/lop-2/         cấu hình Thế giới Lớp 2 (vùng, chương, nhiệm vụ) + events/<id>/ của lớp 2
apps/site/src/pages/the-gioi/       /the-gioi/ (cổng thế giới), /the-gioi/<lop>/ (bản đồ thế giới),
                                    /the-gioi/<lop>/<vung>/, /the-gioi/<lop>/su-kien/<id>/,
                                    /the-gioi/choi/ (khung nhiệm vụ), /the-gioi/nha/, /the-gioi/bo-me/
apps/site/public/game/              hình Kenney/OpenMoji đã chọn + licenses.json
```

- **Mini-game gắn với cơ chế, không gắn với nơi chơi**: "Chợ" dùng cho `cong-tru-100` ở Vùng Toán và cho `so-bi-che` bậc cao ở sự kiện TIMO.
- **Sự kiện thuộc một thế giới** (TIMO Khối 2 ∈ Thế giới Lớp 2; năm sau TIMO Khối 3 là sự kiện mới của Thế giới Lớp 3) và **dùng lại kỹ năng Base của thế giới đó**: độ khó thử thách sự kiện = bậc thành thạo hiện tại của kỹ năng đó + mức nâng của sự kiện (TIMO: +1, tối đa 5). Kết quả trong sự kiện cũng ghi vào mastery chung.
- Rendering: giao diện DOM + CSS + GSAP; nhân vật/NPC/đồ mặc 3D bằng Three.js (tải động, chỉ ở trang chủ, tạo nhân vật, nhiệm vụ; nơi khác dùng ảnh chụp từ mô hình); không dùng engine game đầy đủ. Nhiệm vụ chạy bằng trình chạy Quest Arc chung (`src/lib/game/quest-arc/`).
- Mục "Phiếu cuối tuần" hiện có (bài chép vở do bố mẹ đăng) **giữ nguyên**, ngoài phạm vi.

## Phases

| #   | Phase                                                                                                        | Tier | Status    |
| --- | ------------------------------------------------------------------------------------------------------------ | ---- | --------- |
| 1   | [Lõi game: state, kỹ năng theo môn, tiến trình](./phase-01-game-core.md)                                     | L    | Completed |
| 2   | [Bộ hình: nhân vật SVG + bộ hình miễn phí](./phase-02-art-assets.md)                                         | L    | Completed |
| 3   | [Cổng thế giới + Thế giới Lớp 2: tạo nhân vật, bản đồ, vùng, HUD, khung nhiệm vụ](./phase-03-world-shell.md) | L    | Completed |
| 4   | [Event System tổng quát](./phase-04-event-system.md)                                                         | M    | Completed |
| 4a  | [Thử kỹ thuật nhân vật 3D (1 con mèo trên iPad)](./phase-04a-3d-character-spike.md)                          | M    | Pending   |
| 4b  | [Nền tảng hình ảnh: phong cách, tranh nền AI, font, chuyển động](./phase-04b-visual-foundation.md)           | M    | Pending   |
| 4c  | [Tiến trình nhân vật: kỹ năng theo môn, danh hiệu, vật phẩm, tính cách](./phase-04c-character-progression-data.md) | L | Pending |
| 4d  | [Nhân vật 3D 4 loài, NPC, đồ mặc, màn tạo nhân vật](./phase-04d-3d-character-creation.md)                    | XL   | Pending   |
| 4e  | [Quest Arc: nhiệm vụ nhiều màn, 9 màn theo ảnh mẫu nhiệm vụ](./phase-04e-quest-arc-engine.md)               | XL   | Pending   |
| 4f  | [Home Base và các màn thế giới](./phase-04f-home-base-and-world-screens.md)                                  | L    | Pending   |
| 5   | [Vùng Toán 1: số, cộng trừ, tiền, lời văn (vùng mẫu)](./phase-05-math-region-numbers.md)                     | L    | Pending   |
| 6   | [Vùng Toán 2: nhân chia, hình học, đo lường, thời gian, thống kê](./phase-06-math-region-shapes-measures.md) | L    | Pending   |
| 7   | [Sự kiện TIMO 1: Quần Đảo Số — lý thuyết số, tư duy logic, số học](./phase-07-timo-event-part-1.md)          | L    | Pending   |
| 8   | [Sự kiện TIMO 2: hình học, tổ hợp, đại chiến, boss cuối](./phase-08-timo-event-part-2.md)                    | XL   | Pending   |
| 9   | [Vùng Tiếng Việt](./phase-09-vietnamese-region.md)                                                           | L    | Pending   |
| 10  | [Vùng Tiếng Anh](./phase-10-english-region.md)                                                               | L    | Pending   |
| 11  | [Meta: nhiệm vụ ngày, ôn chỗ yếu, cửa hàng, nhà, tủ đồ, thành tích](./phase-11-meta-systems.md)              | L    | Pending   |
| 12  | [Trang bố mẹ, sao lưu, chuyển mục cũ](./phase-12-parent-dashboard.md)                                        | M    | Pending   |
| 13  | [QA iPad, hiệu năng, offline, tài liệu](./phase-13-qa-release.md)                                            | M    | Pending   |

Thứ tự: 1 → 2 → 3 → 4 → **4a (cổng quyết định 3D) ∥ 4c → 4b → 4d → 4e → 4f** → 5 (chốt khuôn mini-game trong Quest Arc + chơi thử với Miu) → 6 và 7 → 8 → 9 → 10 → 11 → 12 → 13.
4a không đạt (fps/tải/độ dễ thương) → dừng, bố mẹ chọn lại giữa "3D dựng bằng code" và "SVG nâng cấp" trước khi làm 4d.
Mỗi vùng/sự kiện xong là deploy được; phần chưa làm hiện "sắp mở" trên bản đồ.

## Success Criteria

- [ ] Từ trang chủ vào `/the-gioi/`: tạo nhân vật lần đầu, thấy **Cổng thế giới** (Lớp 2 đang mở, Lớp 3 "mở năm 2027"), vào Thế giới Lớp 2 thấy **một bản đồ** có 3 vùng môn học + điểm sự kiện, HUD xu/XP/level.
- [ ] Thêm một thế giới lớp mới (thử bằng thế giới mẫu trong test) chỉ cần mục mới trong `GRADES` + thư mục `worlds/<lop>/` + danh mục kỹ năng của lớp, **không sửa nội dung/tiến trình Lớp 2**.
- [ ] Mỗi kỹ năng trong danh mục có mini-game chơi bằng thao tác (kéo/chạm/xoay/lái…). Trắc nghiệm A–D có hỗ trợ là **một loại màn** trong nhiệm vụ (ảnh mẫu nhiệm vụ màn 3, 6), không có nhiệm vụ mà mọi màn học đều là A–D (trừ "đại chiến" mô phỏng đề thi trong sự kiện).
- [ ] Sự kiện TIMO hiện trên bản đồ có banner, NPC, nhiệm vụ, phần thưởng/huy hiệu riêng, lịch bắt đầu–kết thúc, boss cuối; dùng mastery Toán của Base để đặt độ khó.
- [ ] Thêm một sự kiện thứ hai (mẫu thử, vd. "Tết") chỉ bằng thư mục cấu hình mới, **không sửa file Base** (kiểm bằng test + diff).
- [ ] Bộ sinh câu mọi kỹ năng có unit test đáp án đúng trên ≥ 200 hạt giống × 5 bậc.
- [ ] Mỗi nhiệm vụ: phản hồi ngay bằng hệ quả trong cảnh, gợi ý 3 bậc, câu song sinh sau khi lộ đáp án.
- [ ] Trang bố mẹ hiện thành thạo theo môn → kỹ năng; tiến độ không mất khi đóng/mở; có mã sao lưu.
- [ ] Mọi file hình có giấy phép trong `licenses.json`; vật mang số liệu toán do code vẽ.
- [ ] iPad Safari thật chạy mượt (≥ 50fps hoạt hình), chơi được khi mất mạng sau lần tải đầu.
- [ ] Trang chủ là Home Base theo ảnh mẫu: nhân vật 3D ở giữa, bản đồ đảo, nhiệm vụ hôm nay, sự kiện, bộ sưu tập, Bảng tin nhà Miu.
- [ ] Tạo nhân vật theo bước, 4 loài, xoay 360°, đồ mặc đổi ngay, món khoá hiện điều kiện; tính cách tạo khác biệt khi chơi.
- [ ] Mọi nhiệm vụ là kịch bản Quest Arc trả lời được 7 câu hỏi kiểm tra; phần thưởng công cụ dùng được ở nhiệm vụ sau.
- [ ] Bé thấy kỹ năng theo môn và danh hiệu tăng sau mỗi nhiệm vụ.
- [ ] `pnpm ci:all` sạch.

## Rủi ro chính

- **Khối lượng lớn nhất trong lịch sử repo** (3 môn + sự kiện) → mỗi phase deploy độc lập; vùng mẫu (phase 5) chốt khuôn trước khi nhân rộng.
- **Nội dung Tiếng Việt/Tiếng Anh** không được chép SGK → bài đọc, câu mẫu do mình tự viết theo chủ đề chương trình; bố mẹ duyệt mẫu ở đầu phase 9/10.
- **Safari xoá localStorage** web không mở 7 ngày → cài lên màn hình chính + mã sao lưu (phase 12).
- **Gameplay lấn át học** → hoạt hình ≤ 1.5s bỏ qua được; ≥ 70% thời gian nhiệm vụ là thao tác học; mua sắm cũng là toán.
- **Nhân vật 3D** (chất lượng mô hình AI, bản quyền công cụ, hiệu năng iPad, 4 loài × đồ mặc) → Phase 4a là cổng quyết định; bộ xương chung để đồ vừa mọi loài; 3D chỉ ở 3 trang, chỗ khác dùng ảnh chụp.
- **Ảnh AI lệch nét / hạn mức Gemini** → prompt phong cách chung, danh sách ảnh trước khi sinh.
- **Sự kiện phình thành hệ thống học riêng** (trái tài liệu §7) → sự kiện không được khai báo kỹ năng mới; chỉ tham chiếu kỹ năng trong danh mục môn (test chặn).

## Câu hỏi mở

- Thế giới lớp mới mở **ngày nào**? Mặc định: đầu năm học (`GRADES[...].opensOn`, vd. 05/09), bố mẹ mở sớm/muộn được ở trang bố mẹ.
- Miu học **bộ sách nào** (Kết nối tri thức / Chân trời sáng tạo / Cánh diều)? Mặc định: bám nội dung chương trình GDPT 2018 lớp 2 (chung cho mọi bộ), thứ tự chương theo học kỳ thông thường; biết bộ sách thì sắp lại thứ tự cho khớp lớp.
- **Bảng kỷ lục** (tài liệu §6 "nếu phù hợp"): không có máy chủ/nhiều người chơi → mặc định là **bảng kỷ lục cá nhân theo mùa sự kiện** (so với chính mình các lần trước). Cần bảng xếp hạng với người khác không?
- Đồng bộ tiến độ lên máy chủ? Mặc định: không (chỉ iPad + mã sao lưu).
- Nhạc nền? ~~Mặc định: không~~ — đã có nhạc nền không lời, chỉnh âm lượng được (commit `335f063`).
- Công cụ AI dựng 3D có cần gói trả phí để dùng công khai không? Trả lời ở Phase 4a; nếu cần trả phí sẽ hỏi bố mẹ trước khi mua.

<!-- slug: the-gioi-hoc-tap-cua-miu -->
