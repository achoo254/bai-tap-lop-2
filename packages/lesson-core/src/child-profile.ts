/**
 * Hồ sơ của bé để cá nhân hoá giao diện và gợi ý nội dung bài.
 * Web công khai nên chỉ dùng tên ở nhà và ngày/tháng sinh (không có họ tên đầy đủ, không có năm sinh).
 */
export interface DayMonth {
  day: number;
  month: number;
}

export const CHILD_PROFILE = {
  /** Tên gọi ở nhà mặc định của bạn mèo. */
  nickname: 'Miu',
  /** Bé là con gái. */
  isGirl: true,
  birthday: { day: 15, month: 12 } satisfies DayMonth,
  sibling: {
    nickname: 'em',
    relation: 'em',
    isBoy: true,
    birthday: { day: 19, month: 3 } satisfies DayMonth,
  },
  father: 'bố',
  mother: 'mẹ',
} as const;

/** "YYYY-MM-DD" có trùng ngày/tháng sinh không. */
export function isBirthdayOn(isoDate: string, birthday: DayMonth): boolean {
  const [, month, day] = isoDate.split('-').map(Number);
  return month === birthday.month && day === birthday.day;
}

/** Gợi ý cho AI dùng tên người thân quen thuộc trong bài toán có lời văn. */
export function familyNamesHint(): string {
  const { nickname } = CHILD_PROFILE;
  return (
    `Trong bài toán có lời văn và câu ví dụ, có thể dùng tên người thân quen thuộc của bé: ` +
    `bé ${nickname} (học lớp 2), bố mẹ.`
  );
}
