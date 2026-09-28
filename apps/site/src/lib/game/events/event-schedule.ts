/**
 * apps/site/src/lib/game/events/event-schedule.ts
 *
 * Quản lý lịch trình sự kiện:
 * Tính toán trạng thái sự kiện (sắp diễn ra, đang diễn ra, đã kết thúc)
 * theo giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7).
 */
import type { EventSchedule, EventScheduleStatus } from './event-types';

export const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Chuyển đổi một thời điểm (Date hoặc ISO string hoặc YYYY-MM-DD) thành chuỗi ngày 'YYYY-MM-DD'
 * theo múi giờ Việt Nam.
 */
export function getVietnamDateString(input?: Date | string): string {
  if (!input) {
    input = new Date();
  } else if (typeof input === 'string') {
    // Nếu đã là chuỗi dạng YYYY-MM-DD đơn thuần (10 ký tự, không có T)
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return input;
    }
    input = new Date(input);
  }

  // Định dạng theo múi giờ Asia/Ho_Chi_Minh
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VIETNAM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(input);
}

/**
 * Tính số ngày chênh lệch giữa hai chuỗi ngày 'YYYY-MM-DD'.
 * Trả về (b - a) tính theo ngày nguyên vẹn.
 */
export function diffDays(dateA: string, dateB: string): number {
  const [yA, mA, dA] = dateA.split('-').map(Number);
  const [yB, mB, dB] = dateB.split('-').map(Number);
  const utcA = Date.UTC(yA, mA - 1, dA);
  const utcB = Date.UTC(yB, mB - 1, dB);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utcB - utcA) / msPerDay);
}

/**
 * Cộng thêm số ngày vào một chuỗi ngày 'YYYY-MM-DD'.
 */
export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Xác định khoảng thời gian hiệu lực thực tế của sự kiện trong năm hiện tại
 * (hỗ trợ cả ngày cố định startsOn/endsOn và sự kiện định kỳ recurring hàng năm).
 */
export function resolveScheduleWindow(
  schedule: EventSchedule,
  currentVietnamDate: string,
): { startsOn: string; endsOn: string } {
  if (schedule.recurring?.type === 'annual') {
    const currentYear = Number(currentVietnamDate.slice(0, 4));
    const pad = (n: number) => String(n).padStart(2, '0');
    const recur = schedule.recurring;

    // Tính window cho năm hiện tại
    const thisYearStart = `${currentYear}-${pad(recur.month)}-${pad(recur.day)}`;
    const thisYearEnd = addDays(thisYearStart, recur.durationDays - 1);

    // Nếu ngày hiện tại nhỏ hơn ngày kết thúc của năm nay thì dùng window năm nay
    // (bao gồm cả trường hợp sắp diễn ra trong năm nay hoặc đang diễn ra)
    if (currentVietnamDate <= thisYearEnd) {
      return { startsOn: thisYearStart, endsOn: thisYearEnd };
    }

    // Nếu đã qua đợt của năm nay thì window tiếp theo là năm sau
    const nextYearStart = `${currentYear + 1}-${pad(recur.month)}-${pad(recur.day)}`;
    const nextYearEnd = addDays(nextYearStart, recur.durationDays - 1);
    return { startsOn: nextYearStart, endsOn: nextYearEnd };
  }

  return {
    startsOn: schedule.startsOn,
    endsOn: schedule.endsOn,
  };
}

/**
 * Kiểm tra trạng thái hiện tại của sự kiện.
 */
export function getEventScheduleStatus(
  schedule: EventSchedule,
  now?: Date | string,
): EventScheduleStatus {
  const today = getVietnamDateString(now);
  const { startsOn, endsOn } = resolveScheduleWindow(schedule, today);

  if (today < startsOn) {
    const startsInDays = diffDays(today, startsOn);
    return {
      status: 'upcoming',
      startsInDays,
      activeToday: false,
    };
  }

  if (today > endsOn) {
    return {
      status: 'concluded',
      activeToday: false,
    };
  }

  const daysRemaining = diffDays(today, endsOn);
  return {
    status: 'active',
    daysRemaining,
    activeToday: true,
  };
}

/**
 * Trả về true nếu sự kiện đang diễn ra hôm nay.
 */
export function isEventActive(schedule: EventSchedule, now?: Date | string): boolean {
  return getEventScheduleStatus(schedule, now).activeToday;
}
