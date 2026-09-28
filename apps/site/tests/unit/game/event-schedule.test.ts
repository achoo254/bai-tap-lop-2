import { describe, expect, it } from 'vitest';
import {
  addDays,
  diffDays,
  getEventScheduleStatus,
  getVietnamDateString,
  isEventActive,
  resolveScheduleWindow,
} from '../../../src/lib/game/events/event-schedule';
import type { EventSchedule } from '../../../src/lib/game/events/event-types';

describe('event-schedule: Múi giờ Việt Nam và ngày', () => {
  it('định dạng chính xác theo giờ Việt Nam (UTC+7)', () => {
    // 17:00 UTC ngày 27/09 chính là 00:00 ngày 28/09 tại Việt Nam
    const utcDate1 = new Date('2026-09-27T17:00:00.000Z');
    expect(getVietnamDateString(utcDate1)).toBe('2026-09-28');

    // 16:59:59 UTC ngày 27/09 vẫn là 23:59:59 ngày 27/09 tại Việt Nam
    const utcDate2 = new Date('2026-09-27T16:59:59.000Z');
    expect(getVietnamDateString(utcDate2)).toBe('2026-09-27');
  });

  it('tính số ngày chênh lệch (diffDays) và cộng ngày (addDays)', () => {
    expect(diffDays('2026-09-28', '2026-10-01')).toBe(3);
    expect(diffDays('2026-10-01', '2026-09-28')).toBe(-3);
    expect(diffDays('2026-09-28', '2026-09-28')).toBe(0);

    expect(addDays('2026-09-28', 5)).toBe('2026-10-03');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
});

describe('event-schedule: Ranh giới 0h và trạng thái sự kiện cố định', () => {
  const schedule: EventSchedule = {
    startsOn: '2026-09-28',
    endsOn: '2026-10-05',
  };

  it('trước ngày bắt đầu -> upcoming với startsInDays', () => {
    const status = getEventScheduleStatus(schedule, '2026-09-25');
    expect(status.status).toBe('upcoming');
    expect(status.startsInDays).toBe(3);
    expect(status.activeToday).toBe(false);
  });

  it('đúng 00:00:00 ngày bắt đầu (giờ VN) -> active', () => {
    // 2026-09-27T17:00:00Z = 2026-09-28 00:00:00 VN
    const exactStart = new Date('2026-09-27T17:00:00.000Z');
    const status = getEventScheduleStatus(schedule, exactStart);
    expect(status.status).toBe('active');
    expect(status.activeToday).toBe(true);
    expect(status.daysRemaining).toBe(7);
  });

  it('trong khoảng thời gian sự kiện -> active và tính đúng daysRemaining', () => {
    const status = getEventScheduleStatus(schedule, '2026-10-02');
    expect(status.status).toBe('active');
    expect(status.daysRemaining).toBe(3);
    expect(isEventActive(schedule, '2026-10-02')).toBe(true);
  });

  it('ngày cuối cùng (endsOn) -> active với daysRemaining = 0', () => {
    // 2026-10-05T16:59:59Z = 2026-10-05 23:59:59 VN
    const lastMoment = new Date('2026-10-05T16:59:59.000Z');
    const status = getEventScheduleStatus(schedule, lastMoment);
    expect(status.status).toBe('active');
    expect(status.daysRemaining).toBe(0);
    expect(status.activeToday).toBe(true);
  });

  it('sang 00:00:00 ngày hôm sau (endsOn + 1) -> concluded', () => {
    // 2026-10-05T17:00:00Z = 2026-10-06 00:00:00 VN
    const expiredMoment = new Date('2026-10-05T17:00:00.000Z');
    const status = getEventScheduleStatus(schedule, expiredMoment);
    expect(status.status).toBe('concluded');
    expect(status.activeToday).toBe(false);
    expect(isEventActive(schedule, expiredMoment)).toBe(false);
  });
});

describe('event-schedule: Sự kiện định kỳ hàng năm (recurring)', () => {
  const tetSchedule: EventSchedule = {
    startsOn: '',
    endsOn: '',
    recurring: {
      type: 'annual',
      month: 1,
      day: 15,
      durationDays: 10, // từ 15/01 đến 24/01
    },
  };

  it('tính đúng cửa sổ thời gian (window) cho năm hiện tại', () => {
    const window2027 = resolveScheduleWindow(tetSchedule, '2027-01-10');
    expect(window2027.startsOn).toBe('2027-01-15');
    expect(window2027.endsOn).toBe('2027-01-24');
  });

  it('trước ngày bắt đầu trong năm -> upcoming', () => {
    const status = getEventScheduleStatus(tetSchedule, '2027-01-10');
    expect(status.status).toBe('upcoming');
    expect(status.startsInDays).toBe(5);
  });

  it('trong thời gian diễn ra định kỳ -> active', () => {
    const status = getEventScheduleStatus(tetSchedule, '2027-01-18');
    expect(status.status).toBe('active');
    expect(status.activeToday).toBe(true);
    expect(status.daysRemaining).toBe(6);
  });

  it('sau khi kỳ kết thúc trong năm -> window chuyển sang năm kế tiếp', () => {
    const windowNext = resolveScheduleWindow(tetSchedule, '2027-02-01');
    expect(windowNext.startsOn).toBe('2028-01-15');
    expect(windowNext.endsOn).toBe('2028-01-24');
  });
});
