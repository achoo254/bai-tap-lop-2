# Brainstorm — Home Base, tạo nhân vật dạng game, Quest Arc và tiến trình nhân vật

Nguồn: `plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu/miu-homepage-character-creator-game-world.html` và `.../miu-quest-gameplay-character-progression.html` (bố mẹ cung cấp 2026-09-28).
Kế hoạch đích: `plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu/plan.md` (Phase 1–4 xong, Phase 5 chưa làm).

## Quyết định của user (2026-09-28)

- Trang chủ `/` thành **Home Base**; đồng phục, thời khoá biểu, Phiếu cuối tuần thu thành một dải **"Bảng tin nhà Miu"** gọn ở dưới.
- Phần mở rộng này **chèn thành các phase mới TRƯỚC Phase 5**, vì Phase 5 là nơi chốt khuôn nhiệm vụ rồi nhân rộng.
- Nhiệm vụ mẫu **giữ bài "Cầu thủ dự bị"** (bố mẹ tự nhập), chỉ dựng lại thành Quest Arc; câu hỏi và đáp án mẫu chép vở giữ nguyên.
- **Tính cách ảnh hưởng cách chơi** (không chỉ là danh tính).

## Hiện trạng (đã kiểm tra trong code)

| Tài liệu yêu cầu                               | Đang có                                                                          | Khoảng trống                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Home Base có nhân vật ở giữa                   | `pages/index.astro` (1254 dòng): thẻ Thế giới + đồng phục + TKB                  | Nhân vật không phải trung tâm; không có nhiệm vụ hôm nay, bộ sưu tập                     |
| Tạo nhân vật dạng game                         | `the-gioi/tao-nhan-vat.astro`: một trang, chọn tên, màu lông, phụ kiện, 4 tư thế | Chưa chia bước; không có tính cách; phụ kiện đều mở sẵn                                  |
| Kỹ năng nhân vật (Toán Lv.5, Đọc Lv.4…)        | `mastery` theo 29 kỹ năng, bậc 1–5, dùng cho độ khó thích ứng                    | Không có cấp độ kỹ năng theo môn để bé thấy mình mạnh lên                                |
| Hành trình danh hiệu Lv.1→30                   | `level-table.ts`, `MAX_PLAYER_LEVEL = 30`                                        | Chưa có bảng danh hiệu                                                                   |
| Vật phẩm có công dụng (Chìa khoá rừng mở cổng) | `inventory: string[]`, `unlock-rules.ts`                                         | Chưa có danh mục vật phẩm, chưa có luật mở theo vật phẩm/level/số huy hiệu               |
| Quest nhiều màn: NPC, khám phá, lựa chọn, boss | `choi.astro` chạy N câu của một mini-game rồi hiện màn thưởng                    | Đúng kiểu "đọc → chọn đáp án → đúng/sai" mà tài liệu 2 phê phán (`doc-hieu-minigame.ts`) |
| Nhiệm vụ hôm nay, bộ sưu tập                   | Phase 11 có nhiệm vụ ngày; chưa có bộ sưu tập                                    | Cần kéo lên sớm vì Home Base cần hiển thị                                                |

## Contract

**Outcome:** Bé mở web là về "nhà" của nhân vật mình: thấy nhân vật đang sống, level/danh hiệu, kỹ năng theo môn, nhiệm vụ hôm nay, sự kiện, bộ sưu tập, bản đồ. Tạo nhân vật là chuỗi bước như game. Mỗi nhiệm vụ là một chuyến phiêu lưu nhiều màn (mở đầu → khám phá → dùng kiến thức → lựa chọn → boss → thưởng → mở khoá), phần thưởng có công dụng ở nhiệm vụ sau.

**Constraints:**

- Giữ đủ mục tiêu kiến thức; ≥ 70% thời gian nhiệm vụ vẫn là thao tác học; hoạt hình ≤ 1.5s và bỏ qua được (quy tắc sẵn có của plan).
- Tương thích bản lưu `the-gioi:v1`: trường mới có `.default()`; không lấy lại đồ bé đã có (phụ kiện đang đeo/đang có được giữ khi chuyển sang chế độ khoá đồ).
- Mini-game giữ interface `MiniGame` hiện có; Sự kiện vẫn cắm vào Base không sửa file Base.
- Ảnh AI chỉ cho tranh nền tĩnh và mô hình 3D nhân vật (ghi nguồn trong `licenses.json`), không chép SGK; iPad Safari, touch-first; giao diện DOM + CSS, nhân vật 3D bằng Three.js (thư viện dựng hình, không dùng engine game đầy đủ).
- 27 file đang sửa chưa commit phải được commit trước khi bắt đầu.

**Non-goals:** Làm nội dung 29 kỹ năng Toán (vẫn là Phase 5–6); cửa hàng và Nhà của Miu (vẫn Phase 11); đồng bộ máy chủ, chơi nhiều người, bảng xếp hạng với người khác.

**Acceptance criteria:**

- `/` hiện nhân vật ở giữa (idle: chớp mắt, vẫy đuôi, nhìn quanh), Lv + danh hiệu + thanh XP, xu, chuỗi ngày, kỹ năng theo môn, 3 nhiệm vụ hôm nay, sự kiện đang diễn ra, số bộ sưu tập, lối vào bản đồ; "Bảng tin nhà Miu" vẫn xem được đồng phục/TKB/Phiếu cuối tuần.
- Tạo nhân vật đi qua các bước Tên → Tính cách → Ngoại hình → Trang phục → Phụ kiện → Xem trước → Vào thế giới; mọi lựa chọn đổi ngay trên nhân vật xem trước; món bị khoá hiện ổ khoá + điều kiện mở.
- Chọn tính cách khác nhau thì nhiệm vụ mẫu có khác biệt thấy được (điểm ẩn, phương án lựa chọn phụ, tim boss…); nhiệm vụ hoàn thành được với cả 5 tính cách; sao/XP học không đổi theo tính cách.
- Một nhiệm vụ mẫu (dựng lại "Cầu thủ dự bị", giữ bài và câu hỏi) chạy đủ 8 màn của Adventure Arc, trả lời được 7 câu hỏi kiểm tra của tài liệu 2, nhận một vật phẩm dùng được ở nhiệm vụ kế tiếp.
- Màn thưởng hiện XP kỹ năng theo môn tăng và vật phẩm mới; level kỹ năng đổi thì có hiệu ứng.
- Unit test: luật mở khoá (level, vật phẩm, số huy hiệu, hoàn thành nhiệm vụ/sự kiện), tính cấp kỹ năng theo môn, đọc bản lưu cũ không mất dữ liệu, trình chạy màn nhiệm vụ đi đúng nhánh lựa chọn.
- `pnpm ci:all` sạch.

## Lựa chọn thiết kế chính: cấu trúc nhiệm vụ nhiều màn

| Cách                                                                                                                                                                                                                                                                                     | Giả định dựa vào nhiều nhất                                   | Hỏng đầu tiên khi                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **A. Kịch bản màn theo dữ liệu (khuyến nghị)** — Nhiệm vụ = danh sách màn khai báo: `dialogue`, `explore` (chạm tìm manh mối), `challenge` (gọi mini-game hiện có), `choice` (rẽ nhánh rồi hội tụ), `boss`, `reward`, `unlock`. Một trình chạy chung thay cho vòng N câu ở `choi.astro`. | Phần lớn nhiệm vụ đi theo cùng khuôn 8 màn, chỉ khác nội dung | Cần nhiệm vụ có luật chơi riêng không diễn tả được bằng các loại màn → thêm loại màn mới (rẻ) |
| B. Mỗi mini-game tự chứa câu chuyện                                                                                                                                                                                                                                                      | Ít nhiệm vụ, mỗi cái đặc thù                                  | Nhân lên 29 kỹ năng: lặp code hội thoại/khám phá/thưởng ở mọi mini-game                       |
| C. Đồ thị cảnh tự do + trạng thái thế giới phân nhánh                                                                                                                                                                                                                                    | Cần cốt truyện phân nhánh sâu                                 | Quá sức với trẻ 7 tuổi và với khối lượng nội dung; khó test                                   |

Chọn **A**: tận dụng interface `MiniGame` sẵn có làm màn `challenge`; Sự kiện TIMO dùng cùng trình chạy; rẻ nhất để bỏ nếu khuôn không hợp sau khi Miu chơi thử.

**Better approaches:** Kỹ năng nhân vật tính từ **XP kỹ năng theo môn** (trường mới `skillXp`, có `.default({})`) thay vì suy từ `mastery` bậc 1–5. `mastery` dao động lên/xuống theo độ khó thích ứng nên nếu hiện làm "Level" bé sẽ thấy tụt cấp; XP chỉ tăng, đúng thông điệp "mình đang mạnh lên". Kỹ năng "Logic" gom từ các kỹ năng Toán được gắn nhãn tư duy (TIMO dùng nhiều).

## Tính cách ảnh hưởng cách chơi

Nguyên tắc: tính cách đổi **cách** bé đi qua nhiệm vụ (đường đi, lựa chọn thêm, phần thưởng phụ), **không** làm câu hỏi dễ hơn, không thêm gợi ý miễn phí, không đổi sao/XP học. Như vậy mastery và độ khó thích ứng vẫn đo đúng.

| Tính cách         | Tác động gameplay                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 🔎 Nhà thám hiểm  | Màn khám phá có thêm 1 điểm ẩn → vật phẩm bộ sưu tập hiếm; thấy lối Hidden Quest trên bản đồ sớm hơn                          |
| 🧠 Nhà thông thái | Màn lựa chọn có thêm phương án "suy luận" (giải câu đố logic để đi đường tắt); cộng thêm XP kỹ năng Logic                     |
| ⚔️ Chiến binh     | Boss có thêm 1 tim; đòn cuối có hoạt ảnh riêng; huy hiệu boss riêng                                                           |
| 🎨 Nghệ sĩ        | Nhận vật phẩm trang trí/màu độc quyền từ nhiệm vụ; màn thưởng cho chọn 1 trong 2 món trang phục                               |
| 🚀 Nhà du hành    | Mở điểm dịch chuyển nhanh trên bản đồ; thêm lựa chọn "đi đường vòng" ở màn lựa chọn dẫn tới địa điểm ẩn (bộ sưu tập Địa điểm) |

- Đổi tính cách được ở tủ đồ, ngoài lúc đang làm nhiệm vụ (bé 7 tuổi thích thử; không phạt).
- Màn `choice` trong kịch bản nhiệm vụ khai báo phương án phụ theo tính cách (`requiresPersonality`); phương án thường luôn có, nên nhiệm vụ không bao giờ bị kẹt.
- NPC/nhân vật đồng hành có lời thoại theo tính cách.
- Test: mọi nhiệm vụ đều hoàn thành được với cả 5 tính cách; tính cách không đổi sao/XP học.

## Phase đề xuất (chèn trước Phase 5, đánh số 4a–4d để không đổi số phase cũ)

0. **4-0 — Thử kỹ thuật nhân vật 3D:** 1 con mèo, 3 hoạt ảnh, 1 mũ, xoay 360°, trên nền AI, chạy iPad thật (xem mục "Nhân vật 3D"). Kết quả quyết định cách làm 4b.
1. **4a — Tiến trình nhân vật:** `skillXp` theo môn + Logic, bảng danh hiệu Lv.1/5/10/20/30, danh mục vật phẩm (loại: trang phục, phụ kiện, đặc biệt, chìa khoá/công cụ, huy hiệu) kèm điều kiện mở; mở rộng `unlock-rules` (level, có vật phẩm, số huy hiệu, xong nhiệm vụ/sự kiện); `avatar.personality`, `collections` với `.default()`; giữ đồ đã có; bảng tác động của từng tính cách.
2. **4b — Tạo nhân vật dạng game:** chia bước, xem trước trung tâm có idle + phản ứng khi chọn đồ, ổ khoá + điều kiện mở, tủ đồ (Inventory) xem đồ đã có, đổi tính cách.
3. **4c — Quest Arc:** trình chạy màn theo dữ liệu, NPC hội thoại, màn khám phá, lựa chọn có hệ quả và phương án theo tính cách, boss tổng hợp, màn thưởng mới (XP kỹ năng, vật phẩm, mở khoá); dựng lại nhiệm vụ "Cầu thủ dự bị" (giữ nguyên bài và câu hỏi) làm nhiệm vụ mẫu; quy tắc 7 câu hỏi thành checklist trong phase 5–10.
4. **4d — Home Base:** `/` mới + "Bảng tin nhà Miu"; 3 nhiệm vụ hôm nay (kéo phần nhiệm vụ ngày + chuỗi ngày từ Phase 11 lên đây); ô sự kiện; bộ sưu tập (sinh vật/đá quý/sách/huy hiệu/địa điểm) nhận vật từ màn khám phá.

Phase 5–10 cập nhật: mọi nhiệm vụ mới viết theo khuôn Quest Arc. Phase 11 bỏ phần đã kéo lên (nhiệm vụ ngày, tủ đồ).

## Rủi ro

- **Quá nhiều hệ thống với trẻ 7 tuổi** → Home Base chỉ có một lối vào mỗi hệ thống, biểu tượng lớn, không menu nhiều tầng; bố mẹ chơi thử với Miu sau 4c trước khi nhân rộng.
- **Game lấn át học** → trình chạy đếm thời gian màn học/màn truyện; test chặn nhiệm vụ không có màn `challenge`.
- **Bản lưu cũ** → test đọc bản lưu hiện tại trên máy (xuất mẫu) trước khi đổi schema.
- **WIP chưa commit (27 file)** → commit trước, tránh trộn với thay đổi lớn.

## Chuẩn hình ảnh (user chốt 2026-09-28 21:54)

Ảnh mẫu: `plans/dattqh/260928-0613-the-gioi-hoc-tap-cua-miu/design-reference-miu-game-world-mockup.png` (7 màn: Trang chủ, Chọn nhân vật, Tuỳ chỉnh, Khu vực, Nhiệm vụ, Sự kiện TIMO, Hồ sơ và bộ sưu tập). Đây là chuẩn thiết kế cho phase 4a–4d.

- **Nguồn tranh — phương án B:** cho phép **ảnh AI cho tranh nền tĩnh** (bản đồ đảo, cảnh khu vực, nền nhiệm vụ, nền sự kiện, ảnh thu nhỏ địa điểm), sinh một lần và lưu thành file trong repo. Nhân vật, NPC và đồ mặc: xem mục "Nhân vật 3D" bên dưới (thay cho SVG nhiều lớp). Thay đổi quyết định cũ "không sinh ảnh AI": phải sửa README (nguyên tắc 3), `plan.md` (quyết định đã chốt) và ghi nguồn trong `licenses.json` (loại "AI-generated", công cụ, ngày).
- **Đủ 4 loài nhân vật:** Mèo, Thỏ, Cáo, Gấu. Mỗi loài có đủ tư thế, màu, biểu cảm và mặc được mọi món đồ. Khối lượng hình nhân khoảng 4 lần → đồ mặc nên vẽ theo khung cơ thể dùng chung (điểm neo đầu, thân, lưng, chân) để một món đồ vừa cả 4 loài.
- **Không dựng thử trước:** đưa thẳng vào kế hoạch.
- Thư viện đề xuất: GSAP (chuyển động), Rive hoặc Lottie (hoạt ảnh nhân vật), canvas-confetti (màn thưởng), CSS scroll-snap (băng lướt ngang), font Baloo 2 hoặc Fredoka cho tiêu đề.
- Rủi ro mới: nét vẽ nhân vật SVG lệch với nền AI → đặt một bảng màu và quy tắc đổ bóng chung, sinh nền theo cùng một prompt phong cách; hạn mức Gemini thấp → lập danh sách ảnh nền cần sinh (ước khoảng 15–25 ảnh cho Thế giới Lớp 2) trước khi sinh.

## Nhân vật 3D (user chốt 2026-09-28)

- Nhân vật (4 loài), NPC và đồ mặc làm **3D bằng Three.js**: mô hình `.glb` có xương + hoạt ảnh (đứng thở, chớp mắt, vẫy tay, nhảy, đi, suy nghĩ, ngáp) qua `AnimationMixer`; xoay 360° bằng `OrbitControls` ở màn tạo nhân vật; đồ mặc là mô hình riêng gắn vào xương (đầu, lưng, chân); tai và đuôi đung đưa bằng xương lò xo; tô hoạt hình có viền để hợp nền AI 2D (lớp canvas trong suốt đặt trên tranh nền).
- Nguồn mô hình: AI dựng 3D từ ảnh 2D mẫu (Tripo/Meshy/Rodin…), tự gắn xương, hoạt ảnh dùng chung (Mixamo). Phải kiểm tra điều khoản bản quyền của gói dùng trước khi đưa vào repo; ghi nguồn trong `licenses.json`.
- **Bộ xương và tỉ lệ chibi dùng chung cho 4 loài**, để một món đồ và một hoạt ảnh dùng được cho cả Mèo, Thỏ, Cáo, Gấu.
- 3D thật chỉ ở Trang chủ, màn tạo nhân vật, màn nhiệm vụ (một WebGL renderer mỗi trang); chỗ nhỏ (đầu trang, nhân vật đồng hành góc màn hình) dùng ảnh chụp sẵn từ mô hình. Nén glb (Draco/meshopt), mục tiêu ≤ 2 MB mỗi nhân vật, cache cho offline.
- Hệ SVG hiện có (`cat-character.ts`, phụ kiện) thay dần; giữ tới khi 3D đủ tư thế và đồ.
- **Bước đầu tiên bắt buộc — thử kỹ thuật 1 con mèo:** 1 mô hình mèo, 3 hoạt ảnh (đứng thở, vẫy tay, nhảy), 1 cái mũ gắn xương, xoay 360°, đặt trên 1 nền AI; chạy trên iPad Safari thật. Đạt khi: ≥ 50fps, tải < 3s trên 4G, nhìn hợp với nền, bố mẹ duyệt độ dễ thương. Không đạt → quay lại chọn giữa "3D dựng bằng code" và "SVG nâng cấp".

## Câu hỏi đã giải quyết

- Bài "Cầu thủ dự bị": giữ (bố mẹ tự nhập).
- Tính cách: có ảnh hưởng cách chơi, theo bảng ở trên.
- Nguồn tranh: phương án B (AI cho nền tĩnh); đủ 4 loài; màn hình không dựng thử trước.
- Nhân vật, NPC, đồ mặc: 3D Three.js, thử kỹ thuật 1 con mèo trên iPad trước khi làm cả 4 loài.
- Ghi chú: khi lập kế hoạch (2026-09-28 22:10) các phase trên đổi tên thành 4a (thử 3D), 4b (nền tảng hình ảnh), 4c (tiến trình), 4d (nhân vật 3D + tạo nhân vật), 4e (Quest Arc), 4f (Home Base); xem `plan.md`.
