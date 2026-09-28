/**
 * apps/site/src/lib/game/world/world-calendar.ts
 *
 * Quản lý lịch mở các thế giới học tập theo năm học.
 * Mỗi năm học là một thế giới (Lớp 2 năm 2026-2027, Lớp 3 mở năm 2027-2028...).
 */
import { GRADES, type GradeId } from '../skills/skill-types';
import type { World } from './world-types';

/** Lấy ngày hôm nay theo định dạng chuẩn ISO YYYY-MM-DD. */
export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Kiểm tra xem một thế giới (hoặc ngày mở cụ thể) đã tới thời điểm mở hay chưa. */
export function isWorldOpen(
  opensOnOrGrade: string | GradeId,
  today: string = getTodayDateString(),
): boolean {
  let targetOpensOn: string;
  if (opensOnOrGrade in GRADES) {
    targetOpensOn = GRADES[opensOnOrGrade as GradeId].opensOn;
  } else {
    targetOpensOn = opensOnOrGrade;
  }
  return today >= targetOpensOn;
}

/** Lấy trạng thái hiển thị của một thế giới (đang mở hoặc sắp mở vào năm nào). */
export function getWorldOpeningStatus(
  world: Pick<World, 'opensOn' | 'schoolYear'>,
  today: string = getTodayDateString(),
): { isOpen: boolean; statusLabel: string; badgeColor: string } {
  const isOpen = isWorldOpen(world.opensOn, today);
  if (isOpen) {
    return {
      isOpen: true,
      statusLabel: 'Đang mở',
      badgeColor: '#16a34a',
    };
  }

  return {
    isOpen: false,
    statusLabel: `Mở năm học ${world.schoolYear}`,
    badgeColor: '#64748b',
  };
}
