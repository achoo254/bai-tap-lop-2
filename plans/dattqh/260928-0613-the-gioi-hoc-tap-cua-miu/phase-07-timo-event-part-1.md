---
phase: 7
title: 'Sự kiện TIMO 1: Quần Đảo Số — lý thuyết số, tư duy logic, số học'
status: pending
priority: P2
effort: 'L'
dependencies: [4, 5]
---

# Phase 7: Sự kiện TIMO Khối 2 (phần 1) — Quần Đảo Số

## Overview

Sự kiện đầu tiên của Thế giới Lớp 2, cấu hình tại `src/worlds/lop-2/events/timo/`. Một ngày thuyền đưa thư cập bến: "Quần Đảo Số vừa nổi lên!" — khu vực mới mở trên bản đồ, NPC mới, nhiệm vụ, phần thưởng và huy hiệu riêng.
Kiểm tra §12: **Event** ✓ · trong cùng Thế giới Lớp 2 ✓ · dùng kỹ năng Toán Base (`lop-2/*`) ở bậc khó + 1 ✓ · không kỹ năng riêng ✓ · gỡ sự kiện không ảnh hưởng Vùng Toán ✓.
Nội dung bám dạng bài trong bộ đề ôn TIMO Khối 2 (FERMAT) nhưng **tự sinh**, không chép câu gốc.

## Requirements

- Cấu hình sự kiện: metadata (tên "TIMO Khối 2 — Quần Đảo Số", NPC Thuyền Trưởng Mèo Biển), lịch (mùa ôn luyện kéo dài; mặc định mở từ ngày deploy, bố mẹ chỉnh ở phase 12), `difficultyBoost: 1`, phần thưởng độc quyền (mũ thuyền trưởng, cờ đảo), huy hiệu mỗi đảo.
- Ba đảo đầu:

| Đảo           | Kỹ năng (Base)                                                       | Mini-game                                                                 | Cơ chế                                                                                             |
| ------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Làng Chẵn Lẻ  | `lop-2/chan-le`                                                      | `ben-thuyen-doi` Bến Thuyền Đôi (nâng cấp từ "Kẹo chẵn lẻ")               | Xếp khách lên thuyền 2 chỗ; lọc số áo chẵn/lẻ lớn hơn mốc; áo mang phép tính; tổng dãy chẵn hay lẻ |
|               | `lop-2/chia-deu`                                                     | `bua-ca-cua-meo` Bữa Cá Của Mèo                                           | Kéo cá giữa các bát cho bằng nhau, "chuyển bao nhiêu"                                              |
|               | `lop-2/dien-dau`                                                     | `cong-tac-ray-tau` Công Tắc Ray Tàu                                       | Bật +/− cho tàu tới đúng ga số                                                                     |
|               | `lop-2/day-cach-deu`                                                 | `den-long-ben-song` Đèn Lồng Bến Sông                                     | Thắp đèn thứ n của dãy cách đều                                                                    |
| Rừng Quy Luật | `lop-2/day-so`                                                       | `cau-da-quy-luat` (từ phase 6)                                            | Kéo đá mang số đúng vào nhịp cầu gãy                                                               |
|               | `lop-2/day-hinh`                                                     | `bang-chuyen-hinh` Băng Chuyền Hình                                       | Đặt hình tiếp theo; đếm hình trong nhóm thứ n                                                      |
|               | `lop-2/can-thang-bang`                                               | `cong-doi-trong` Cổng Đối Trọng                                           | Kéo vật lên cân để cổng nâng                                                                       |
|               | `lop-2/tuoi-ngay`                                                    | `co-may-thoi-gian` Cỗ Máy Thời Gian                                       | Vặn bánh xe tuổi/thứ tới đúng mốc                                                                  |
|               | `lop-2/tu-duy-co-ban`                                                | `cau-do-cu-meo` Câu Đố Cú Mèo                                             | Kéo thẻ nhân vật vào vị trí theo gợi ý                                                             |
| Chợ Đảo       | `lop-2/so-bi-che`, `lop-2/can-bang-phep-tinh`, `lop-2/cong-tru-1000` | `ruong-ma-so`, `sap-hang` (dùng lại Base) + `can-phep-tinh` Cân Phép Tính | Bậc khó TIMO: "mua 3 tặng 1", chuỗi phép tính tìm số đầu, chữ số A/B                               |

- Boss mỗi đảo (Thuyền Trưởng Rối, Cáo Rối Rắm, Chuột Tham Ăn); câu trong sự kiện có dòng tiếng Anh nhỏ như đề song ngữ.
- Chuyển mục cũ: trang `/luyen-timo/keo-chan-le/` trỏ về nhiệm vụ Bến Thuyền Đôi (phase 12 gỡ hẳn mã cũ).

## Related Code Files

- Create: `src/worlds/lop-2/events/timo/**`, `src/minigames/{ben-thuyen-doi,bua-ca-cua-meo,cong-tac-ray-tau,den-long-ben-song,bang-chuyen-hinh,cong-doi-trong,co-may-thoi-gian,cau-do-cu-meo,can-phep-tinh}/**`, tests, `public/game/lop-2/su-kien/timo/**`
- Modify: chuyển `src/lib/timo/even-odd-questions.ts` → `src/minigames/ben-thuyen-doi/generator.ts` (giữ test)

## Implementation Steps

1. Cấu hình sự kiện + hình khu sự kiện. 2. Làng Chẵn Lẻ (4 mini-game + boss). 3. Rừng Quy Luật (4 mới + dùng lại cầu đá + boss). 4. Chợ Đảo (Cân Phép Tính + dùng lại Base + boss). 5. Test (kể cả test kỹ năng trong cấu hình đều thuộc `lop-2`) + chơi thử.

## Success Criteria

- [ ] Sự kiện xuất hiện với banner + NPC + khu vực mới; ba đảo + ba boss chơi được.
- [ ] Bậc khó = mastery Base + 1 (test); kết quả cập nhật mastery chung.
- [ ] Bậc 5 mỗi kỹ năng tư duy khớp độ khó câu tương ứng trong đề (so 3 câu mẫu/dạng, ghi báo cáo).

## Risk Assessment

- "Quy luật" có nhiều cách hiểu → chỉ dùng họ quy luật đã khai báo; kiểm đáp án duy nhất trong các lựa chọn.
