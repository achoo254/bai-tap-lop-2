import { CHILD_PROFILE, isBirthdayOn } from 'lesson-core';
import type { TodayPickMode } from './today-lesson-picker';

/** Lời chào, lời khen, lời chúc sinh nhật gọi đúng tên bé và người thân. */
const { nickname: miu, sibling, father, mother } = CHILD_PROFILE;
const bo = sibling.nickname;

export const SITE_TITLE = `Góc học tập của ${miu}`;

/** Buổi trong ngày theo giờ Việt Nam (0–23). */
export function partOfDay(hour: number): string {
  if (hour < 11) return 'buổi sáng';
  if (hour < 14) return 'buổi trưa';
  if (hour < 18) return 'buổi chiều';
  return 'buổi tối';
}

export function greetingFor(mode: TodayPickMode, hour: number): string {
  const hello = `Chào ${miu} ${partOfDay(hour)} vui vẻ!`;
  switch (mode) {
    case 'hom-nay':
      return `${hello} Bài hôm nay đây, ${miu} chép thật đẹp nhé!`;
    case 'gan-nhat':
      return `${hello} Hôm nay chưa có bài mới, ${miu} ôn lại bài gần nhất nhé!`;
    case 'sap-toi':
      return `${hello} Bài mới sắp tới rồi, ${miu} xem trước nhé!`;
    case 'trong':
      return `${hello} Chưa có bài nào, ${miu} chờ bố ${father} mẹ ${mother} thêm bài nhé!`;
  }
}

/** Lời chúc sinh nhật trong ngày (nếu có). */
export function birthdayMessage(isoDate: string): string | null {
  if (isBirthdayOn(isoDate, CHILD_PROFILE.birthday)) {
    return `🎂 Chúc mừng sinh nhật ${miu}! Bố ${father}, mẹ ${mother} và em ${bo} yêu ${miu} nhiều lắm!`;
  }
  if (isBirthdayOn(isoDate, sibling.birthday)) {
    return `🎈 Hôm nay là sinh nhật em ${bo}! Chị ${miu} nhớ chúc mừng em nhé!`;
  }
  return null;
}

/** Lời khen hiện khi bé mở lời giải. */
export const PRAISES = [
  `${miu} giỏi quá! Bố ${father} và mẹ ${mother} tự hào về ${miu} lắm!`,
  `Em ${bo} đang cổ vũ chị ${miu} đó! Cố lên nào!`,
  `${miu} chép bài thật đẹp! Mèo con thưởng cho ${miu} một ngôi sao ⭐`,
  `Tuyệt vời! ${miu} làm xong rồi thì khoe bố mẹ nhé!`,
  `${miu} chăm chỉ quá! Mèo con thích học cùng ${miu} lắm!`,
];

export const FAMILY_FOOTER = `Làm tặng ${miu} với tình yêu của bố ${father}, mẹ ${mother} và em ${bo} 💖`;
