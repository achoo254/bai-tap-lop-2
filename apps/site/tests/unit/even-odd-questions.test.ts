import { describe, expect, it } from 'vitest';
import {
  createCandyQuestion,
  createEvenOddRound,
  createExpressionQuestion,
  createNumberFilterQuestion,
  numberChoices,
  parityOf,
  type RandomSource,
} from '../../src/lib/timo/even-odd-questions';

/** Sinh số giả ngẫu nhiên có hạt giống để mỗi lần test ra cùng kết quả. */
function seeded(seed: number): RandomSource {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1);

describe('parityOf', () => {
  it('nhận biết số chẵn và số lẻ', () => {
    expect(parityOf(0)).toBe('chan');
    expect(parityOf(14)).toBe('chan');
    expect(parityOf(17)).toBe('le');
  });
});

describe('numberChoices', () => {
  it('có đúng 4 đáp án khác nhau, không âm, chứa đáp án đúng', () => {
    for (const seed of SEEDS) {
      for (const answer of [0, 1, 3, 5]) {
        const { choices, correctIndex } = numberChoices(seeded(seed), answer);
        expect(new Set(choices).size).toBe(4);
        expect(choices.every((value) => Number(value) >= 0)).toBe(true);
        expect(choices[correctIndex]).toBe(String(answer));
      }
    }
  });
});

describe('câu đếm kẹo', () => {
  it('đáp án đúng khớp với số kẹo', () => {
    for (const seed of SEEDS) {
      const question = createCandyQuestion(seeded(seed));
      expect(question.count).toBeGreaterThanOrEqual(5);
      expect(question.count).toBeLessThanOrEqual(19);
      expect(question.choices[question.correctIndex]).toBe(
        question.count % 2 === 0 ? 'Chẵn' : 'Lẻ',
      );
    }
  });
});

describe('câu lọc số', () => {
  it('đếm đúng các số cùng chẵn/lẻ và lớn hơn mốc', () => {
    for (const seed of SEEDS) {
      const question = createNumberFilterQuestion(seeded(seed));
      const expected = question.numbers.filter(
        (value) => parityOf(value) === question.parity && value > question.threshold,
      ).length;
      expect(expected).toBeGreaterThanOrEqual(1);
      expect(expected).toBeLessThanOrEqual(5);
      expect(question.matchingIndexes).toHaveLength(expected);
      expect(question.choices[question.correctIndex]).toBe(String(expected));
      expect(new Set(question.numbers).size).toBe(question.numbers.length);
      expect(question.numbers.every((value) => value >= 10 && value <= 99)).toBe(true);
    }
  });
});

describe('câu phép tính', () => {
  it('giá trị mỗi thẻ đúng với phép tính và đáp án đếm đúng', () => {
    for (const seed of SEEDS) {
      const question = createExpressionQuestion(seeded(seed));
      expect(question.cards).toHaveLength(6);
      for (const card of question.cards) {
        // Tính lại từ chữ hiển thị (dấu trừ dài "–" như trong đề).
        const tokens = card.text.split(' ');
        let value = Number(tokens[0]);
        for (let i = 1; i < tokens.length; i += 2) {
          const operand = Number(tokens[i + 1]);
          value = tokens[i] === '+' ? value + operand : value - operand;
        }
        expect(value).toBe(card.value);
        expect(card.value).toBeGreaterThanOrEqual(1);
        expect(card.value).toBeLessThanOrEqual(99);
      }
      const expected = question.cards.filter(
        (card) => parityOf(card.value) === question.parity,
      ).length;
      expect(question.choices[question.correctIndex]).toBe(String(expected));
    }
  });
});

describe('createEvenOddRound', () => {
  it('6 câu dễ dần, hai câu kẹo khác chẵn/lẻ', () => {
    for (const seed of SEEDS) {
      const round = createEvenOddRound(seeded(seed));
      expect(round.map((question) => question.kind)).toEqual([
        'dem-keo',
        'dem-keo',
        'loc-so',
        'loc-so',
        'phep-tinh',
        'phep-tinh',
      ]);
      const [first, second] = round;
      if (first?.kind !== 'dem-keo' || second?.kind !== 'dem-keo') throw new Error('Sai dạng');
      expect(parityOf(first.count)).not.toBe(parityOf(second.count));
    }
  });
});
