/**
 * Danh sách trò chơi trong mục Luyện TIMO. Thêm trò chơi mới = thêm một mục ở đây và một trang
 * trong src/pages/luyen-timo/. Khoá kỷ lục dùng chung cho trang trò chơi và trang danh sách.
 */
export interface TimoGame {
  slug: string;
  title: string;
  emoji: string;
  /** Chủ đề trong khung chương trình TIMO Khối 2. */
  topic: string;
  description: string;
  /** Khoá localStorage lưu số sao cao nhất bé đạt được. */
  bestStarsKey: string;
  maxStars: number;
}

export const KEO_CHAN_LE: TimoGame = {
  slug: 'keo-chan-le',
  title: 'Kẹo chẵn lẻ',
  emoji: '🍬',
  topic: 'Số chẵn, số lẻ',
  description: 'Xếp kẹo thành đôi, tìm số chẵn và số lẻ.',
  bestStarsKey: 'timo-keo-chan-le-ky-luc',
  maxStars: 6,
};

export const TIMO_GAMES: TimoGame[] = [KEO_CHAN_LE];

export function timoGameHref(game: TimoGame): string {
  return `/luyen-timo/${game.slug}/`;
}

export function readBestStars(game: TimoGame): number {
  try {
    return Number(localStorage.getItem(game.bestStarsKey)) || 0;
  } catch {
    return 0;
  }
}

export function saveBestStars(game: TimoGame, stars: number): void {
  try {
    if (stars > readBestStars(game)) localStorage.setItem(game.bestStarsKey, String(stars));
  } catch {
    // Trình duyệt chặn bộ nhớ: bỏ qua kỷ lục.
  }
}
