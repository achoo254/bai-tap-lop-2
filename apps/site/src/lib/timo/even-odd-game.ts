/**
 * Luật chơi "Kẹo chẵn lẻ": 6 câu một chặng, đúng ngay lần đầu được 1 sao.
 * Sai lần 1 → mèo gợi ý bằng hình; sai lần 2 → mèo chỉ đáp án rồi sang câu mới.
 * Kỷ lục sao lưu trên máy của bé (localStorage).
 */
import { CHILD_PROFILE } from 'lesson-core';
import { createEvenOddRound, PARITY_LABELS, type EvenOddQuestion } from './even-odd-questions';
import {
  burstConfetti,
  pairUpCandies,
  renderCandies,
  renderExpressionCards,
  renderNumberCandies,
} from './candy-stage';
import {
  playCorrectSound,
  playPopSound,
  playWrongSound,
  speak,
  unlockAudio,
  waitForVietnameseVoice,
} from '../game/media/audio';
import { KEO_CHAN_LE, readBestStars, saveBestStars } from './timo-game-catalog';

const miu = CHILD_PROFILE.nickname;

const CORRECT_PRAISES = [
  `Đúng rồi! ${miu} giỏi quá!`,
  `Chính xác! Mèo con thưởng ${miu} một ngôi sao!`,
  `Tuyệt vời ${miu} ơi!`,
  `Hay lắm! ${miu} nhanh như mèo luôn!`,
];

function required<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Thiếu phần tử ${selector}`);
  return element;
}

function randomItem(items: readonly string[]): string {
  return items[Math.floor(Math.random() * items.length)] ?? '';
}

export function startEvenOddGame(root: HTMLElement): void {
  const screens = {
    start: required<HTMLElement>(root, '[data-screen="start"]'),
    tip: required<HTMLElement>(root, '[data-screen="tip"]'),
    play: required<HTMLElement>(root, '[data-screen="play"]'),
    end: required<HTMLElement>(root, '[data-screen="end"]'),
  };
  const stage = required<HTMLElement>(root, '[data-stage]');
  const promptText = required<HTMLElement>(root, '[data-prompt]');
  const promptEn = required<HTMLElement>(root, '[data-prompt-en]');
  const choicesBox = required<HTMLElement>(root, '[data-choices]');
  const feedback = required<HTMLElement>(root, '[data-feedback]');
  const pickedCounter = required<HTMLElement>(root, '[data-picked]');
  const nextButton = required<HTMLButtonElement>(root, '[data-next]');
  const progress = required<HTMLElement>(root, '[data-progress]');
  const starCount = required<HTMLElement>(root, '[data-stars]');
  const confettiHost = required<HTMLElement>(root, '[data-confetti]');

  let round: EvenOddQuestion[] = [];
  let index = 0;
  let stars = 0;
  let wrongTries = 0;
  let items: HTMLElement[] = [];

  function show(name: keyof typeof screens): void {
    for (const [key, screen] of Object.entries(screens)) screen.hidden = key !== name;
    window.scrollTo({ top: 0 });
  }

  function current(): EvenOddQuestion {
    const question = round[index];
    if (!question) throw new Error('Hết câu hỏi');
    return question;
  }

  function updateProgress(): void {
    progress.replaceChildren(
      ...round.map((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'progress-dot';
        if (i < index) dot.classList.add('is-done');
        if (i === index) dot.classList.add('is-current');
        return dot;
      }),
    );
    starCount.textContent = String(stars);
  }

  function updatePickedCounter(): void {
    const picked = items.filter((item) => item.getAttribute('aria-pressed') === 'true').length;
    pickedCounter.textContent = `${miu} đã chọn: ${picked}`;
  }

  /** Câu lọc số / phép tính: chạm vào kẹo hoặc thẻ để đánh dấu, giúp bé đếm. */
  function makePickable(elements: HTMLElement[]): void {
    for (const element of elements) {
      const toggle = (): void => {
        const pressed = element.getAttribute('aria-pressed') === 'true';
        element.setAttribute('aria-pressed', String(!pressed));
        playPopSound();
        updatePickedCounter();
      };
      element.addEventListener('click', toggle);
      element.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      });
    }
  }

  function renderQuestion(): void {
    const question = current();
    wrongTries = 0;
    feedback.textContent = '';
    nextButton.hidden = true;
    promptText.textContent = question.prompt;
    promptEn.textContent = question.promptEn;
    pickedCounter.hidden = question.kind === 'dem-keo';

    if (question.kind === 'dem-keo') {
      items = renderCandies(stage, question.count);
    } else if (question.kind === 'loc-so') {
      items = renderNumberCandies(stage, question.numbers);
      makePickable(items);
    } else {
      items = renderExpressionCards(stage, question.cards);
      makePickable(items);
    }
    updatePickedCounter();

    choicesBox.replaceChildren(
      ...question.choices.map((choice, choiceIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'comic-button answer-button';
        button.textContent = choice;
        button.addEventListener('click', () => answer(choiceIndex, button));
        return button;
      }),
    );
    choicesBox.dataset.count = String(question.choices.length);
    updateProgress();
    speak(question.prompt);
  }

  /** Cho bé thấy vì sao: xếp đôi kẹo, tô chữ số cuối, lật thẻ ra kết quả. */
  function explain(question: EvenOddQuestion, markMatches: boolean): Promise<void> {
    if (question.kind === 'dem-keo') return pairUpCandies(stage);
    stage.classList.add('is-hinting');
    if (markMatches) {
      for (const matchIndex of question.matchingIndexes)
        items[matchIndex]?.classList.add('is-match');
    }
    return Promise.resolve();
  }

  function hintText(question: EvenOddQuestion): string {
    if (question.kind === 'dem-keo') {
      return 'Mèo xếp kẹo thành từng đôi nhé. Vừa hết là số chẵn, thừa một viên là số lẻ.';
    }
    const label = PARITY_LABELS[question.parity].vi;
    if (question.kind === 'loc-so') {
      return `Nhìn chữ số cuối cùng: 0, 2, 4, 6, 8 là số chẵn. Chỉ đếm số ${label} lớn hơn ${question.threshold} thôi.`;
    }
    return `Mèo tính giúp rồi đó. ${miu} đếm các kết quả là số ${label} nhé.`;
  }

  function finishQuestion(): void {
    for (const button of choicesBox.querySelectorAll('button')) button.disabled = true;
    nextButton.hidden = false;
    nextButton.focus({ preventScroll: true });
  }

  function answer(choiceIndex: number, button: HTMLButtonElement): void {
    const question = current();
    if (choiceIndex === question.correctIndex) {
      button.classList.add('is-correct');
      playCorrectSound();
      burstConfetti(confettiHost);
      if (wrongTries === 0) stars += 1;
      updateProgress();
      const praise = randomItem(CORRECT_PRAISES);
      feedback.textContent = praise;
      speak(praise);
      void explain(question, true);
      finishQuestion();
      return;
    }

    wrongTries += 1;
    button.classList.add('is-wrong');
    button.disabled = true;
    playWrongSound();
    if (wrongTries === 1) {
      const hint = hintText(question);
      feedback.textContent = `🐾 ${hint}`;
      speak(hint);
      void explain(question, false);
      return;
    }
    const correctChoice = question.choices[question.correctIndex] ?? '';
    choicesBox.querySelectorAll('button')[question.correctIndex]?.classList.add('is-correct');
    const reveal = `Đáp án là ${correctChoice}. Câu sau ${miu} làm được mà!`;
    feedback.textContent = reveal;
    speak(reveal);
    void explain(question, true);
    finishQuestion();
  }

  function next(): void {
    index += 1;
    if (index < round.length) {
      renderQuestion();
      return;
    }
    saveBestStars(KEO_CHAN_LE, stars);
    required<HTMLElement>(root, '[data-end-stars]').textContent = '⭐'.repeat(stars) || '🐾';
    const message =
      stars === round.length
        ? `Tuyệt đỉnh! ${miu} được đủ ${stars} sao!`
        : `${miu} được ${stars} sao! Chơi lại để lấy đủ ${round.length} sao nhé!`;
    required<HTMLElement>(root, '[data-end-message]').textContent = message;
    show('end');
    burstConfetti(confettiHost, 60);
    speak(message);
  }

  function play(): void {
    unlockAudio();
    round = createEvenOddRound();
    index = 0;
    stars = 0;
    show('play');
    renderQuestion();
  }

  /** Mẹo của mèo: hai nhóm kẹo 6 và 7 viên tự xếp đôi để thấy chẵn và lẻ. */
  async function showTip(): Promise<void> {
    unlockAudio();
    show('tip');
    const evenStage = required<HTMLElement>(root, '[data-tip-even]');
    const oddStage = required<HTMLElement>(root, '[data-tip-odd]');
    renderCandies(evenStage, 6);
    renderCandies(oddStage, 7);
    for (const label of root.querySelectorAll<HTMLElement>('[data-tip-label]')) label.hidden = true;
    speak('Mèo xếp kẹo thành từng đôi nhé!');
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    await pairUpCandies(evenStage);
    required<HTMLElement>(root, '[data-tip-label="chan"]').hidden = false;
    speak('Sáu viên xếp đôi vừa hết. Sáu là số chẵn.');
    await new Promise((resolve) => window.setTimeout(resolve, 3200));
    await pairUpCandies(oddStage);
    required<HTMLElement>(root, '[data-tip-label="le"]').hidden = false;
    speak(
      'Bảy viên thì thừa một viên. Bảy là số lẻ. Số có chữ số cuối là 0, 2, 4, 6, 8 là số chẵn.',
    );
  }

  required<HTMLElement>(root, '[data-best]').textContent = String(readBestStars(KEO_CHAN_LE));
  for (const button of root.querySelectorAll('[data-action="play"]'))
    button.addEventListener('click', play);
  for (const button of root.querySelectorAll('[data-action="tip"]')) {
    button.addEventListener('click', () => void showTip());
  }
  required<HTMLElement>(root, '[data-speak]').addEventListener('click', () =>
    speak(current().prompt),
  );
  nextButton.addEventListener('click', next);

  void waitForVietnameseVoice().then((hasVoice) => {
    required<HTMLElement>(root, '[data-no-voice]').hidden = hasVoice;
  });
}
