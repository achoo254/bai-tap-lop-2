import { CHILD_PROFILE, isBirthdayOn } from 'lesson-core';
import type { TodayPickMode } from './today-lesson-picker';
import { uniformReminderFor } from './uniform-schedule';

/** Tên mặc định của bạn mèo nếu chưa được đặt tên */
const defaultName: string = CHILD_PROFILE.nickname || 'Miu';

export const SITE_TITLE = `Góc học tập của ${defaultName}`;

/** Buổi trong ngày theo giờ Việt Nam (0–23). */
export function partOfDay(hour: number): string {
  if (hour < 11) return 'buổi sáng';
  if (hour < 14) return 'buổi trưa';
  if (hour < 18) return 'buổi chiều';
  return 'buổi tối';
}

export function greetingFor(
  mode: TodayPickMode | 'the-gioi',
  hour: number,
  catName: string = defaultName,
): string {
  const hello = `Chào ${catName} ${partOfDay(hour)} vui vẻ!`;
  if (mode === 'the-gioi') {
    return `${hello} Cùng mèo con khám phá Thế giới học tập nhé! 🚀`;
  }
  switch (mode) {
    case 'hom-nay':
      return `${hello} Bài hôm nay đây, ${catName} chép thật đẹp nhé!`;
    case 'gan-nhat':
      return `${hello} Hôm nay chưa có bài mới, ${catName} ôn lại bài gần nhất nhé!`;
    case 'sap-toi':
      return `${hello} Bài mới sắp tới rồi, ${catName} xem trước nhé!`;
    case 'trong':
      return `${hello} Chưa có bài nào, ${catName} chờ bố mẹ thêm bài nhé!`;
  }
}

/** Lời chào mèo con khi vào Thế giới học tập (kèm nhắc nhở đồng phục theo ngày). */
export function greetingForWorld(
  hour: number,
  dayOfWeek?: number,
  catName: string = defaultName,
): string {
  const hello = `Chào ${catName} ${partOfDay(hour)} vui vẻ!`;
  if (dayOfWeek === undefined) {
    return `${hello} Cùng mèo con khám phá Thế giới học tập nhé! 🚀`;
  }
  const reminder = uniformReminderFor(hour, dayOfWeek);
  return `${hello} ${reminder.text} Cùng bước vào Thế giới học tập nào! 🚀`;
}

/** Lời chúc sinh nhật trong ngày (nếu có). */
export function birthdayMessage(isoDate: string, catName: string = defaultName): string | null {
  if (isBirthdayOn(isoDate, CHILD_PROFILE.birthday)) {
    return `🎂 Chúc mừng sinh nhật ${catName}! Bố mẹ yêu ${catName} nhiều lắm!`;
  }
  return null;
}

/** Lời khen hiện khi bé mở lời giải. */
export const PRAISES = [
  'Bé giỏi quá! Bố mẹ rất tự hào về bé!',
  'Mèo con đang cổ vũ bạn đó! Cố lên nào!',
  'Chép bài thật đẹp! Mèo con thưởng cho bạn một ngôi sao ⭐',
  'Tuyệt vời! Làm xong rồi thì khoe bố mẹ nhé!',
  'Chăm chỉ quá! Mèo con rất thích học cùng bạn!',
];

export const FAMILY_FOOTER = 'Làm tặng bé với tình yêu của bố mẹ 💖';
