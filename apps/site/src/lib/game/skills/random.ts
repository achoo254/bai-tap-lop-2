/**
 * Tiện ích ngẫu nhiên cho mọi bộ sinh câu. Hàm sinh số được truyền vào (thay vì gọi Math.random
 * trực tiếp) để unit test chạy với hạt giống cố định và ra cùng kết quả.
 */

/** Hàm sinh số ngẫu nhiên trong [0, 1). */
export type RandomSource = () => number;

export function randomInt(random: RandomSource, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1));
}

export function pick<T>(random: RandomSource, items: readonly T[]): T {
  const item = items[Math.floor(random() * items.length)];
  if (item === undefined) throw new Error('Danh sách rỗng');
  return item;
}

export function shuffle<T>(random: RandomSource, items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = result[i] as T;
    result[i] = result[j] as T;
    result[j] = a;
  }
  return result;
}

/** 4 đáp án số khác nhau quanh đáp án đúng (không âm), trộn thứ tự như đề trắc nghiệm A–D. */
export function numberChoices(
  random: RandomSource,
  answer: number,
): { choices: string[]; correctIndex: number } {
  const options = new Set<number>([answer]);
  const nearby = shuffle(random, [answer - 2, answer - 1, answer + 1, answer + 2, answer + 3]);
  for (const value of nearby) {
    if (options.size === 4) break;
    if (value >= 0) options.add(value);
  }
  const choices = shuffle(random, [...options]);
  return { choices: choices.map(String), correctIndex: choices.indexOf(answer) };
}

/** Sinh số giả ngẫu nhiên có hạt giống (LCG) — dùng cho test và cho câu "song sinh" tái lập được. */
export function seededRandom(seed: number): RandomSource {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
