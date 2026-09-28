import { describe, expect, it } from 'vitest';
import {
  getUniformForDay,
  getUniformForDate,
  UNIFORM_SCHEDULE,
  WEEK_DAYS_ORDER,
  uniformReminderFor,
} from '../../src/lib/uniform-schedule';
import { getScheduleForDay, SCHOOL_WEEK_DAYS } from '../../src/lib/timetable-schedule';

describe('Lịch mặc đồng phục', () => {
  it('đúng quy định Thứ 2, 4, 6 sơ mi trắng, Thứ 3 phông xanh, Thứ 5 thể thao', () => {
    // Thứ 2: Sơ mi trắng
    expect(getUniformForDay(1).title).toBe('Bộ sơ mi trắng');
    // Thứ 3: Phông xanh
    expect(getUniformForDay(2).title).toBe('Bộ phông xanh');
    // Thứ 4: Sơ mi trắng
    expect(getUniformForDay(3).title).toBe('Bộ sơ mi trắng');
    // Thứ 5: Thể thao
    expect(getUniformForDay(4).title).toBe('Bộ thể thao');
    // Thứ 6: Sơ mi trắng
    expect(getUniformForDay(5).title).toBe('Bộ sơ mi trắng');
    // Cuối tuần: Tự do
    expect(getUniformForDay(6).title).toBe('Trang phục tự do');
    expect(getUniformForDay(0).title).toBe('Trang phục tự do');
  });

  it('lấy đúng đồng phục theo ngày ISO', () => {
    // 2026-09-28 là Thứ Hai
    expect(getUniformForDate('2026-09-28').title).toBe('Bộ sơ mi trắng');
    // 2026-09-29 là Thứ Ba
    expect(getUniformForDate('2026-09-29').title).toBe('Bộ phông xanh');
    // 2026-10-01 là Thứ Năm
    expect(getUniformForDate('2026-10-01').title).toBe('Bộ thể thao');
  });

  it('lời nhắc buổi sáng nhắc đúng bộ hôm nay, buổi tối nhắc bộ ngày mai', () => {
    // Sáng Thứ 2 (hour = 7)
    const morningMon = uniformReminderFor(7, 1);
    expect(morningMon.outfit).toBe('Bộ sơ mi trắng');
    expect(morningMon.text).toContain('Thứ Hai');

    // Tối Thứ 2 (hour = 20) nhắc chuẩn bị cho Thứ 3
    const eveningMon = uniformReminderFor(20, 1);
    expect(eveningMon.outfit).toBe('Bộ phông xanh');
    expect(eveningMon.text).toContain('Thứ Ba');
  });

  it('có đủ 7 ngày trong tuần', () => {
    expect(WEEK_DAYS_ORDER).toHaveLength(7);
    for (const d of WEEK_DAYS_ORDER) {
      expect(UNIFORM_SCHEDULE[d]).toBeDefined();
    }
  });
});

describe('Thời khóa biểu Lớp 2', () => {
  it('có đủ 5 ngày học trong tuần từ Thứ 2 đến Thứ 6', () => {
    expect(SCHOOL_WEEK_DAYS).toHaveLength(5);
    for (const day of SCHOOL_WEEK_DAYS) {
      const schedule = getScheduleForDay(day);
      expect(schedule).toBeDefined();
      expect(schedule?.morning.length).toBe(4);
      expect(schedule?.afternoon.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('Thứ Hai có HĐTN chào cờ và Toán', () => {
    const mon = getScheduleForDay(1)!;
    expect(mon.morning[0].subject).toBe('HĐTN');
    expect(mon.afternoon[0].subject).toBe('Toán');
  });

  it('Thứ Năm có GDTC thể dục sáng và HĐ Thư viện chiều', () => {
    const thu = getScheduleForDay(4)!;
    expect(thu.morning[1].subject).toBe('GDTC');
    expect(thu.afternoon[1].subject).toBe('HĐ Thư viện');
  });
});
