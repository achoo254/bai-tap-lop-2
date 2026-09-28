/**
 * Kỹ năng Tiếng Việt lớp 2 (Chương trình GDPT 2018).
 * - `chuong-trinh`: kỹ năng theo khung bài học lớp 2.
 * - `tu-duy`: kỹ năng tư duy ngôn ngữ và suy luận văn bản.
 */
export const VIETNAMESE_SKILLS = {
  'chinh-ta-phan-biet': {
    strand: 'chuong-trinh',
    title: 'Chính tả: phân biệt s/x, ch/tr, r/d/gi, l/n, c/k, g/gh, ng/ngh...',
  },
  'van-va-tieng': {
    strand: 'chuong-trinh',
    title: 'Vần và tiếng: mở rộng vốn từ',
  },
  'tu-chi-su-vat': {
    strand: 'chuong-trinh',
    title: 'Từ chỉ sự vật (người, đồ vật, con vật, cây cối)',
  },
  'tu-chi-hoat-dong': {
    strand: 'chuong-trinh',
    title: 'Từ chỉ hoạt động, trạng thái',
  },
  'tu-chi-dac-diem': {
    strand: 'chuong-trinh',
    title: 'Từ chỉ đặc điểm (màu sắc, hình dáng, tính nết)',
  },
  'cau-gioi-thieu': {
    strand: 'chuong-trinh',
    title: 'Câu giới thiệu (Ai là gì?)',
  },
  'cau-neu-hoat-dong': {
    strand: 'chuong-trinh',
    title: 'Câu nêu hoạt động (Ai làm gì?)',
  },
  'cau-neu-dac-diem': {
    strand: 'chuong-trinh',
    title: 'Câu nêu đặc điểm (Ai thế nào?)',
  },
  'dau-cau': {
    strand: 'chuong-trinh',
    title: 'Dấu câu: dấu chấm, dấu chấm hỏi, dấu chấm than, dấu phẩy',
  },
  'sap-xep-cau': {
    strand: 'tu-duy',
    title: 'Sắp xếp từ ngữ thành câu hoàn chỉnh',
  },
  'doc-hieu': {
    strand: 'chuong-trinh',
    title: 'Đọc hiểu văn bản và trả lời câu hỏi',
  },
  'viet-doan-ngan': {
    strand: 'chuong-trinh',
    title: 'Viết đoạn văn ngắn, lời nhắn, bưu thiếp',
  },
} as const satisfies Record<string, { strand: 'chuong-trinh' | 'tu-duy'; title: string }>;
