import { describe, expect, it } from 'vitest';
import { recordAnswer } from '../../../src/lib/game/progression/adaptive-difficulty';
import {
  levelForXp,
  levelProgress,
  xpForLevel,
} from '../../../src/lib/game/progression/level-table';
import {
  applyQuestResult,
  calculateReward,
  starsFor,
  type AnswerRecord,
} from '../../../src/lib/game/progression/rewards';
import {
  createInitialMastery,
  createInitialState,
  type SkillMastery,
} from '../../../src/lib/game/state/game-state';

const TODAY = '2026-09-28';

function play(start: SkillMastery, answers: boolean[]): SkillMastery {
  return answers.reduce((mastery, correct) => recordAnswer(mastery, correct, TODAY), start);
}

describe('độ khó thích ứng', () => {
  it('đúng 3 câu liên tiếp thì lên 1 bậc', () => {
    expect(play(createInitialMastery(), [true, true]).level).toBe(1);
    expect(play(createInitialMastery(), [true, true, true]).level).toBe(2);
  });

  it('không lên 2 bậc liền: sau khi lên bậc phải đúng thêm 3 câu nữa', () => {
    const mastery = play(createInitialMastery(), [true, true, true, true, true]);
    expect(mastery.level).toBe(2);
    expect(play(mastery, [true]).level).toBe(3);
  });

  it('sai 2 trong 3 câu gần nhất thì xuống 1 bậc và cần xem mẹo', () => {
    const atLevel3 = { ...createInitialMastery(), level: 3 as const };
    const mastery = play(atLevel3, [false, true, false]);
    expect(mastery.level).toBe(2);
    expect(mastery.needsTip).toBe(true);
  });

  it('không xuống dưới bậc 1 và không lên quá bậc 5', () => {
    expect(play(createInitialMastery(), [false, false, false]).level).toBe(1);
    const atTop = { ...createInitialMastery(), level: 5 as const };
    expect(play(atTop, [true, true, true, true]).level).toBe(5);
  });

  it('đúng ngay lần đầu thì tắt cờ cần mẹo', () => {
    const tip = { ...createInitialMastery(), needsTip: true };
    expect(recordAnswer(tip, true, TODAY).needsTip).toBe(false);
  });

  it('lịch sử giữ tối đa 20 lần và ghi ngày chơi', () => {
    const mastery = play(
      createInitialMastery(),
      Array.from({ length: 25 }, (_, i) => i % 2 === 0),
    );
    expect(mastery.history).toHaveLength(20);
    expect(mastery.lastPlayed).toBe(TODAY);
  });
});

describe('bảng level', () => {
  it('ngưỡng XP tăng dần', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(40);
    expect(xpForLevel(3)).toBe(120);
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(39)).toBe(1);
    expect(levelForXp(40)).toBe(2);
    expect(levelForXp(1_000_000)).toBe(30);
  });

  it('tiến độ thanh XP nằm trong khoảng 0–1', () => {
    expect(levelProgress(80)).toEqual({ level: 2, ratio: 0.5, toNext: 40 });
  });
});

const answer = (correctFirstTry: boolean, hintsUsed = 0): AnswerRecord => ({
  skill: 'lop-2/chan-le',
  correctFirstTry,
  hintsUsed,
});

describe('phần thưởng', () => {
  it('sao: 3 khi đúng hết ngay lần đầu, 2 khi dùng ≤ 1 gợi ý, còn lại 1', () => {
    expect(starsFor([answer(true), answer(true)])).toBe(3);
    expect(starsFor([answer(true), answer(false, 1)])).toBe(2);
    expect(starsFor([answer(false, 2), answer(true)])).toBe(1);
  });

  it('combo cộng thêm xu, sai thì mất combo nhưng không bị trừ', () => {
    // 5, 6, 7 (combo 3) → sai 2 → 5 (combo mới)
    const reward = calculateReward({
      questId: 'lop-2/toan/lang-so-1',
      isBoss: false,
      answers: [answer(true), answer(true), answer(true), answer(false, 1), answer(true)],
    });
    expect(reward.coins).toBe(5 + 6 + 7 + 2 + 5);
    expect(reward.bestCombo).toBe(3);
  });

  it('thưởng combo có trần +4 xu mỗi câu', () => {
    const reward = calculateReward({
      questId: 'x/1',
      isBoss: false,
      answers: Array.from({ length: 8 }, () => answer(true)),
    });
    expect(reward.coins).toBe(5 + 6 + 7 + 8 + 9 + 9 + 9 + 9);
  });

  it('boss nhân đôi xu và thêm 50 XP', () => {
    const normal = calculateReward({ questId: 'x/1', isBoss: false, answers: [answer(true)] });
    const boss = calculateReward({ questId: 'x/boss', isBoss: true, answers: [answer(true)] });
    expect(boss.coins).toBe(normal.coins * 2);
    expect(boss.xp).toBe(normal.xp + 50);
  });

  it('ghi vào tiến độ: cộng xu/XP, cập nhật độ khó, chỉ giữ sao tốt nhất, báo lên level', () => {
    const start = { ...createInitialState(TODAY, 'Miu'), xp: 30 };
    const first = applyQuestResult(
      start,
      { questId: 'lop-2/toan/lang-so-1', isBoss: false, answers: [answer(true)] },
      TODAY,
    );
    expect(first.state.coins).toBe(5);
    expect(first.state.xp).toBe(30 + 10 + 30);
    expect(first.reward.playerLevelBefore).toBe(1);
    expect(first.reward.playerLevelAfter).toBe(2);
    expect(first.state.quests['lop-2/toan/lang-so-1']).toEqual({ stars: 3, completedOn: TODAY });
    expect(first.state.mastery['lop-2/chan-le'].history).toEqual([true]);
    expect(start.coins).toBe(0);

    const worse = applyQuestResult(
      first.state,
      { questId: 'lop-2/toan/lang-so-1', isBoss: false, answers: [answer(false, 3)] },
      '2026-09-29',
    );
    expect(worse.reward.newBestStars).toBe(false);
    expect(worse.state.quests['lop-2/toan/lang-so-1']?.stars).toBe(3);
  });
});
