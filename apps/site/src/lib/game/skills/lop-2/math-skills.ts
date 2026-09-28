/**
 * Kỹ năng Toán lớp 2.
 * - `chuong-trinh`: nội dung chương trình GDPT 2018 lớp 2 — nền của Vùng Toán.
 * - `tu-duy`: toán tư duy nâng cao (dạng thường gặp trong đề Olympic như TIMO). Vùng Toán dùng làm
 *   thử thách thêm; sự kiện cuộc thi dùng nhiều ở bậc khó cao hơn.
 */
export const MATH_SKILLS = {
  // Chương trình lớp 2
  'so-den-1000': {
    strand: 'chuong-trinh',
    title: 'Số đến 1000: đọc, viết, so sánh, trăm chục đơn vị',
  },
  'cong-tru-20': { strand: 'chuong-trinh', title: 'Cộng, trừ (có nhớ) trong phạm vi 20' },
  'cong-tru-100': { strand: 'chuong-trinh', title: 'Cộng, trừ (có nhớ) trong phạm vi 100' },
  'cong-tru-1000': { strand: 'chuong-trinh', title: 'Cộng, trừ trong phạm vi 1000' },
  'nhan-chia-2-5': { strand: 'chuong-trinh', title: 'Phép nhân, phép chia: bảng 2 và bảng 5' },
  'toan-loi-van': { strand: 'chuong-trinh', title: 'Bài toán có lời văn' },
  'hinh-phang': { strand: 'chuong-trinh', title: 'Điểm, đoạn thẳng, đường gấp khúc, hình tứ giác' },
  'hinh-khoi': { strand: 'chuong-trinh', title: 'Khối trụ, khối cầu' },
  'do-do-dai': { strand: 'chuong-trinh', title: 'Độ dài: cm, dm, m, km' },
  'khoi-luong-dung-tich': { strand: 'chuong-trinh', title: 'Khối lượng (kg) và dung tích (lít)' },
  'thoi-gian': { strand: 'chuong-trinh', title: 'Ngày, giờ, phút, xem đồng hồ, xem lịch' },
  'tien-viet-nam': { strand: 'chuong-trinh', title: 'Tiền Việt Nam' },
  'thong-ke-xac-suat': {
    strand: 'chuong-trinh',
    title: 'Kiểm đếm, biểu đồ tranh, có thể – chắc chắn – không thể',
  },
  // Toán tư duy nâng cao
  'chan-le': { strand: 'tu-duy', title: 'Số chẵn, số lẻ' },
  'chia-deu': { strand: 'tu-duy', title: 'Chia đều' },
  'dien-dau': { strand: 'tu-duy', title: 'Điền dấu cho phép tính đúng' },
  'day-cach-deu': { strand: 'tu-duy', title: 'Dãy số cách đều' },
  'day-so': { strand: 'tu-duy', title: 'Dãy số có quy luật' },
  'day-hinh': { strand: 'tu-duy', title: 'Dãy hình có quy luật' },
  'can-thang-bang': { strand: 'tu-duy', title: 'Bài toán cái cân' },
  'tuoi-ngay': { strand: 'tu-duy', title: 'Bài toán tuổi và ngày tháng' },
  'tu-duy-co-ban': { strand: 'tu-duy', title: 'Bài toán suy luận' },
  'so-bi-che': { strand: 'tu-duy', title: 'Tìm số bị che' },
  'can-bang-phep-tinh': { strand: 'tu-duy', title: 'Cân bằng phép tính' },
  'dem-hinh': { strand: 'tu-duy', title: 'Đếm hình' },
  'khoi-3d': { strand: 'tu-duy', title: 'Khối lập phương: đếm và quan sát' },
  'chon-cach': { strand: 'tu-duy', title: 'Đếm số cách chọn' },
  'lap-so': { strand: 'tu-duy', title: 'Lập số từ các chữ số' },
  'chia-nhom': { strand: 'tu-duy', title: 'Chia đồ vật vào nhóm' },
} as const satisfies Record<string, { strand: 'chuong-trinh' | 'tu-duy'; title: string }>;
