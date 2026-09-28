/**
 * Bộ sinh câu hỏi "Kẹo chẵn lẻ" theo đúng các dạng chẵn/lẻ lặp lại trong bộ đề ôn TIMO Khối 2
 * (vòng loại). Chỉ lấy dạng bài và khoảng số, không chép câu gốc:
 * - Đếm kẹo: một nhóm đồ vật là số chẵn hay số lẻ (nền tảng của cả chủ đề).
 * - Lọc số: "Trong các số dưới đây, có bao nhiêu số chẵn lớn hơn 20?"
 * - Phép tính: "Có bao nhiêu kết quả là số chẵn trong các phép tính sau?"
 */

import { numberChoices, pick, randomInt, shuffle, type RandomSource } from '../game/skills/random';

export type { RandomSource };
export { numberChoices };

export type Parity = 'chan' | 'le';

export const PARITY_LABELS: Record<Parity, { vi: string; en: string }> = {
  chan: { vi: 'chẵn', en: 'even' },
  le: { vi: 'lẻ', en: 'odd' },
};

interface QuestionBase {
  /** Câu hỏi tiếng Việt, được đọc to cho bé. */
  prompt: string;
  /** Dòng tiếng Anh nhỏ bên dưới, giống đề song ngữ vòng loại. */
  promptEn: string;
  choices: string[];
  correctIndex: number;
}

export interface CandyQuestion extends QuestionBase {
  kind: 'dem-keo';
  count: number;
}

export interface NumberFilterQuestion extends QuestionBase {
  kind: 'loc-so';
  parity: Parity;
  threshold: number;
  numbers: number[];
  /** Vị trí các số thoả điều kiện, dùng để gợi ý khi bé trả lời sai. */
  matchingIndexes: number[];
}

export interface ExpressionCard {
  text: string;
  value: number;
}

export interface ExpressionQuestion extends QuestionBase {
  kind: 'phep-tinh';
  parity: Parity;
  cards: ExpressionCard[];
  matchingIndexes: number[];
}

export type EvenOddQuestion = CandyQuestion | NumberFilterQuestion | ExpressionQuestion;

export function parityOf(value: number): Parity {
  return value % 2 === 0 ? 'chan' : 'le';
}

export function createCandyQuestion(random: RandomSource): CandyQuestion {
  const count = randomInt(random, 5, 19);
  const correct = parityOf(count);
  return {
    kind: 'dem-keo',
    count,
    prompt: `Có ${count} viên kẹo. ${count} là số chẵn hay số lẻ?`,
    promptEn: `There are ${count} candies. Is ${count} an even or an odd number?`,
    choices: ['Chẵn', 'Lẻ'],
    correctIndex: correct === 'chan' ? 0 : 1,
  };
}

export function createNumberFilterQuestion(random: RandomSource): NumberFilterQuestion {
  // Lặp tới khi đáp án nằm trong khoảng 1–5 như các câu trong đề.
  for (;;) {
    const parity: Parity = random() < 0.5 ? 'chan' : 'le';
    const threshold = pick(random, [20, 30, 39, 40, 50]);
    const size = randomInt(random, 7, 8);
    const numbers = new Set<number>();
    while (numbers.size < size) numbers.add(randomInt(random, 10, 99));
    const list = shuffle(random, [...numbers]);
    const matchingIndexes = list.flatMap((value, index) =>
      parityOf(value) === parity && value > threshold ? [index] : [],
    );
    const answer = matchingIndexes.length;
    if (answer < 1 || answer > 5) continue;
    const label = PARITY_LABELS[parity];
    return {
      kind: 'loc-so',
      parity,
      threshold,
      numbers: list,
      matchingIndexes,
      prompt: `Có bao nhiêu số ${label.vi} lớn hơn ${threshold}?`,
      promptEn: `How many ${label.en} numbers greater than ${threshold} are there?`,
      ...numberChoices(random, answer),
    };
  }
}

/** Một phép tính 2 hoặc 3 số hạng, kết quả từ 1 đến 99, kiểu "22 – 10 + 7" trong đề. */
function createExpression(random: RandomSource): ExpressionCard {
  for (;;) {
    const terms = random() < 0.3 ? 3 : 2;
    let value = randomInt(random, 3, 40);
    let text = String(value);
    for (let i = 1; i < terms; i++) {
      const operand = randomInt(random, 2, 20);
      if (random() < 0.5) {
        value += operand;
        text += ` + ${operand}`;
      } else {
        value -= operand;
        text += ` – ${operand}`;
      }
    }
    if (value >= 1 && value <= 99) return { text, value };
  }
}

export function createExpressionQuestion(random: RandomSource): ExpressionQuestion {
  for (;;) {
    const parity: Parity = random() < 0.5 ? 'chan' : 'le';
    const cards = Array.from({ length: 6 }, () => createExpression(random));
    const matchingIndexes = cards.flatMap((card, index) =>
      parityOf(card.value) === parity ? [index] : [],
    );
    const answer = matchingIndexes.length;
    if (answer < 1 || answer > 5) continue;
    const label = PARITY_LABELS[parity];
    return {
      kind: 'phep-tinh',
      parity,
      cards,
      matchingIndexes,
      prompt: `Có bao nhiêu phép tính có kết quả là số ${label.vi}?`,
      promptEn: `Among the following operations, how many results are ${label.en} numbers?`,
      ...numberChoices(random, answer),
    };
  }
}

/** Một chặng chơi: dễ dần lên khó, 2 câu mỗi dạng. */
export function createEvenOddRound(random: RandomSource = Math.random): EvenOddQuestion[] {
  const first = createCandyQuestion(random);
  let second = createCandyQuestion(random);
  // Hai câu kẹo nên khác chẵn/lẻ để bé thấy cả hai trường hợp.
  while (parityOf(second.count) === parityOf(first.count)) second = createCandyQuestion(random);
  return [
    first,
    second,
    createNumberFilterQuestion(random),
    createNumberFilterQuestion(random),
    createExpressionQuestion(random),
    createExpressionQuestion(random),
  ];
}
