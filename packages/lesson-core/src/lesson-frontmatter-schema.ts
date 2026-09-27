import { z } from 'zod';

/** Môn học của bài; dùng để tô màu nhãn và lọc danh sách. */
export const LESSON_SUBJECTS = ['toan', 'tieng-viet', 'khac'] as const;
export type LessonSubject = (typeof LESSON_SUBJECTS)[number];

export const LESSON_SUBJECT_LABELS: Record<LessonSubject, string> = {
  toan: 'Toán',
  'tieng-viet': 'Tiếng Việt',
  khac: 'Khác',
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Ngày dạng YYYY-MM-DD và phải là ngày có thật (loại 2026-02-30). */
const isoDateSchema = z
  .string()
  .regex(ISO_DATE_PATTERN, 'Ngày phải có dạng YYYY-MM-DD')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  }, 'Ngày không tồn tại');

export const PREVIEW_CODE_PATTERN = /^[a-z0-9]{8,32}$/;

export const lessonFrontmatterSchema = z.object({
  tieu_de: z.string().trim().min(1, 'Thiếu tiêu đề').max(120, 'Tiêu đề quá dài (tối đa 120 ký tự)'),
  ngay: isoDateSchema,
  mon: z.enum(LESSON_SUBJECTS, { message: 'Môn phải là toan, tieng-viet hoặc khac' }),
  nhap: z.boolean().default(true),
  ma_xem_truoc: z.string().regex(PREVIEW_CODE_PATTERN, 'Mã xem trước không hợp lệ'),
});

export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;
