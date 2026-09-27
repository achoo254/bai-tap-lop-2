/**
 * Hồ sơ của bé để cá nhân hoá giao diện và gợi ý nội dung bài.
 * Web công khai nên chỉ dùng tên ở nhà và ngày/tháng sinh (không có họ tên đầy đủ, không có năm sinh).
 */
export interface DayMonth {
  day: number;
  month: number;
}

export const CHILD_PROFILE = {
  /** Tên gọi ở nhà, hiện trên web. */
  nickname: 'Miu',
  /** Bé là con gái: xưng "chị" với em. */
  isGirl: true,
  birthday: { day: 15, month: 12 } satisfies DayMonth,
  sibling: {
    nickname: 'Bo',
    /** Cách bé gọi em. */
    relation: 'em',
    isBoy: true,
    birthday: { day: 19, month: 3 } satisfies DayMonth,
  },
  father: 'Đạt',
  mother: 'Thủy',
} as const;

/** "YYYY-MM-DD" có trùng ngày/tháng sinh không. */
export function isBirthdayOn(isoDate: string, birthday: DayMonth): boolean {
  const [, month, day] = isoDate.split('-').map(Number);
  return month === birthday.month && day === birthday.day;
}

/** Gợi ý cho AI dùng tên người thân quen thuộc trong bài toán có lời văn. */
export function familyNamesHint(): string {
  const { nickname, sibling, father, mother } = CHILD_PROFILE;
  return (
    `Trong bài toán có lời văn và câu ví dụ, có thể dùng tên người thân quen thuộc của bé: ` +
    `bé ${nickname} (bạn gái học lớp 2), em trai ${sibling.nickname}, bố ${father}, mẹ ${mother}.`
  );
}
