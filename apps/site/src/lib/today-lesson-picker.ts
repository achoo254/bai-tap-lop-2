/**
 * Chọn bài hiển thị ở trang chủ theo ngày hôm nay (giờ Việt Nam).
 * Chạy phía trình duyệt nên web tĩnh build hôm trước vẫn hiện đúng bài hôm nay.
 */
export interface DatedLesson {
  id: string;
  ngay: string;
}

export type TodayPickMode = 'hom-nay' | 'gan-nhat' | 'sap-toi' | 'trong';

export interface TodayPick {
  mode: TodayPickMode;
  ngay: string | null;
  ids: string[];
}

export const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh';

/** Ngày hiện tại dạng YYYY-MM-DD theo giờ Việt Nam. */
export function todayInVietnam(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: VIETNAM_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function pickLessonsForToday(lessons: DatedLesson[], today: string): TodayPick {
  const onDate = (ngay: string) =>
    lessons.filter((lesson) => lesson.ngay === ngay).map((l) => l.id);
  if (lessons.some((lesson) => lesson.ngay === today)) {
    return { mode: 'hom-nay', ngay: today, ids: onDate(today) };
  }
  const dates = [...new Set(lessons.map((lesson) => lesson.ngay))].sort();
  const past = dates.filter((ngay) => ngay < today).pop();
  if (past) return { mode: 'gan-nhat', ngay: past, ids: onDate(past) };
  const future = dates.find((ngay) => ngay > today);
  if (future) return { mode: 'sap-toi', ngay: future, ids: onDate(future) };
  return { mode: 'trong', ngay: null, ids: [] };
}

/** Giờ hiện tại (0–23) theo giờ Việt Nam. */
export function hourInVietnam(now: Date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: VIETNAM_TIME_ZONE,
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(now),
  );
}
