/**
 * Bảng Level theo XP tích luỹ. Level L cần 20·L·(L−1) XP: Lv2 = 40, Lv3 = 120, Lv4 = 240, Lv5 = 400…
 * Đầu game lên Level nhanh cho bé hứng thú, về sau chậm dần.
 */
export const MAX_PLAYER_LEVEL = 30;

export function xpForLevel(level: number): number {
  return 20 * level * (level - 1);
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (level < MAX_PLAYER_LEVEL && xp >= xpForLevel(level + 1)) level += 1;
  return level;
}

/** Tiến độ trong level hiện tại, dùng cho thanh XP (0–1). */
export function levelProgress(xp: number): { level: number; ratio: number; toNext: number } {
  const level = levelForXp(xp);
  if (level === MAX_PLAYER_LEVEL) return { level, ratio: 1, toNext: 0 };
  const start = xpForLevel(level);
  const end = xpForLevel(level + 1);
  return { level, ratio: (xp - start) / (end - start), toNext: end - xp };
}
