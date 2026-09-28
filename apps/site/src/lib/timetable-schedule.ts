/**
 * apps/site/src/lib/timetable-schedule.ts
 *
 * Thời khóa biểu Lớp 2 (Áp dụng từ ngày 7/9/2026).
 * Dữ liệu các tiết học buổi sáng và buổi chiều cho từng thứ trong tuần (Thứ 2 -> Thứ 6).
 */

export interface PeriodItem {
  period: number;
  subject: string;
  icon: string;
  color?: string;
  bg?: string;
}

export interface DaySchedule {
  dayOfWeek: number; // 1 = Thứ 2, 2 = Thứ 3, ... 5 = Thứ 6
  dayName: string; // 'Thứ Hai', 'Thứ Ba', ...
  shortName: string; // 'T2', 'T3', ...
  morning: PeriodItem[];
  afternoon: PeriodItem[];
}

const SUBJECT_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  'Tiếng Việt': { icon: '📖', color: '#db2777', bg: '#fce7f3' },
  Toán: { icon: '📐', color: '#0284c7', bg: '#e0f2fe' },
  HĐTN: { icon: '🌱', color: '#16a34a', bg: '#dcfce7' }, // Hoạt động trải nghiệm
  GDTC: { icon: '⚽', color: '#ea580c', bg: '#ffedd5' }, // Giáo dục thể chất
  HĐH: { icon: '✏️', color: '#7c3aed', bg: '#f3e8ff' }, // Hướng dẫn học
  'Âm nhạc': { icon: '🎵', color: '#d97706', bg: '#fef3c7' },
  'Mĩ thuật': { icon: '🎨', color: '#ec4899', bg: '#fdf2f8' },
  'TC Mĩ thuật': { icon: '🎨', color: '#ec4899', bg: '#fdf2f8' },
  'Đạo đức': { icon: '⭐', color: '#ca8a04', bg: '#fef9c3' },
  'TN và XH': { icon: '🌍', color: '#059669', bg: '#ecfdf5' }, // Tự nhiên và Xã hội
  'HĐ Thư viện': { icon: '📚', color: '#2563eb', bg: '#eff6ff' },
  HĐGD: { icon: '🎪', color: '#9333ea', bg: '#faf5ff' },
};

function makePeriod(period: number, subject: string): PeriodItem {
  const meta = SUBJECT_ICONS[subject] ?? { icon: '📝', color: '#475569', bg: '#f1f5f9' };
  return {
    period,
    subject,
    icon: meta.icon,
    color: meta.color,
    bg: meta.bg,
  };
}

export const TIMETABLE_DATA: Record<number, DaySchedule> = {
  1: {
    dayOfWeek: 1,
    dayName: 'Thứ Hai',
    shortName: 'T2',
    morning: [
      makePeriod(1, 'HĐTN'),
      makePeriod(2, 'Tiếng Việt'),
      makePeriod(3, 'Tiếng Việt'),
      makePeriod(4, 'GDTC'),
    ],
    afternoon: [makePeriod(1, 'Toán'), makePeriod(2, 'Đạo đức')],
  },
  2: {
    dayOfWeek: 2,
    dayName: 'Thứ Ba',
    shortName: 'T3',
    morning: [
      makePeriod(1, 'Tiếng Việt'),
      makePeriod(2, 'Tiếng Việt'),
      makePeriod(3, 'Toán'),
      makePeriod(4, 'HĐH'),
    ],
    afternoon: [makePeriod(1, 'Âm nhạc'), makePeriod(2, 'TN và XH')],
  },
  3: {
    dayOfWeek: 3,
    dayName: 'Thứ Tư',
    shortName: 'T4',
    morning: [
      makePeriod(1, 'Tiếng Việt'),
      makePeriod(2, 'Tiếng Việt'),
      makePeriod(3, 'Toán'),
      makePeriod(4, 'HĐH'),
    ],
    afternoon: [makePeriod(1, 'HĐTN'), makePeriod(2, 'TC Mĩ thuật')],
  },
  4: {
    dayOfWeek: 4,
    dayName: 'Thứ Năm',
    shortName: 'T5',
    morning: [
      makePeriod(1, 'Toán'),
      makePeriod(2, 'GDTC'),
      makePeriod(3, 'Tiếng Việt'),
      makePeriod(4, 'Tiếng Việt'),
    ],
    afternoon: [makePeriod(1, 'TN và XH'), makePeriod(2, 'HĐ Thư viện'), makePeriod(3, 'HĐH')],
  },
  5: {
    dayOfWeek: 5,
    dayName: 'Thứ Sáu',
    shortName: 'T6',
    morning: [
      makePeriod(1, 'Mĩ thuật'),
      makePeriod(2, 'Tiếng Việt'),
      makePeriod(3, 'Tiếng Việt'),
      makePeriod(4, 'Toán'),
    ],
    afternoon: [makePeriod(1, 'HĐGD'), makePeriod(2, 'HĐH'), makePeriod(3, 'HĐTN')],
  },
};

export const SCHOOL_WEEK_DAYS = [1, 2, 3, 4, 5];

export function getScheduleForDay(dayOfWeek: number): DaySchedule | null {
  return TIMETABLE_DATA[dayOfWeek] ?? null;
}
