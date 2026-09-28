/**
 * apps/site/src/lib/game/companion/companion-chatter.ts
 *
 * Nhân vật đồng hành góc dưới phải: vẽ mèo của bé, tự nói chuyện theo màn đang xem,
 * phản ứng khi bé làm đúng/sai/được thưởng. Bấm vào bong bóng thoại để nghe đọc to.
 */
import {
  renderCatSvgHtml,
  type CatAccessoryId,
  type CatFurColorId,
  type CatPose,
} from '../../../components/game/characters/cat-character';
import type { GameState } from '../state/game-state';
import { SFX_EVENT, speak, type SfxType } from '../media/audio';
import {
  detectCompanionContext,
  linesForContext,
  personalize,
  pickLine,
  REACTION_LINES,
  type CompanionContext,
  type CompanionLine,
  type CompanionReaction,
} from './companion-lines';

const CHATTER_ENABLED_KEY = 'the-gioi:meo-noi-chuyen';
const FIRST_LINE_DELAY_MS = 1500;
const BUBBLE_VISIBLE_MS = 7000;
const CHATTER_MIN_GAP_MS = 22000;
const CHATTER_MAX_GAP_MS = 38000;

const SFX_REACTIONS: Partial<Record<SfxType, CompanionReaction>> = {
  correct: 'correct',
  wrong: 'wrong',
  fail: 'wrong',
  reward: 'reward',
  cheer: 'reward',
  levelUp: 'levelUp',
};

export function isChatterEnabled(): boolean {
  try {
    return localStorage.getItem(CHATTER_ENABLED_KEY) !== '0';
  } catch {
    return true;
  }
}

export function setChatterEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(CHATTER_ENABLED_KEY, enabled ? '1' : '0');
  } catch {
    // Không lưu được: chỉ áp dụng trong phiên này.
  }
}

export interface CompanionChatter {
  /** Vẽ lại mèo khi bé đổi tên/màu lông/phụ kiện. */
  render(state: GameState): void;
  /** Nói ngay một câu phản ứng (ví dụ khi mở bảng cài đặt). */
  react(reaction: CompanionReaction): void;
  /** Bật/tắt tự nói chuyện theo lựa chọn trong bảng cài đặt. */
  refreshChatter(): void;
}

export function startCompanionChatter(
  figure: HTMLElement,
  bubble: HTMLElement,
  initialState: GameState,
  contextOverride?: string,
): CompanionChatter {
  let state = initialState;
  let pose: CatPose = 'chao';
  let lastText = '';
  let hideTimer: number | undefined;
  let chatterTimer: number | undefined;

  const lessonSubject = document.querySelector<HTMLElement>('[data-subject]')?.dataset.subject;
  const context =
    (contextOverride as CompanionContext | undefined) ??
    detectCompanionContext(window.location.pathname, lessonSubject);

  function draw(): void {
    figure.innerHTML = renderCatSvgHtml({
      pose,
      furColor: (state.avatar.furColor as CatFurColorId) || 'vang-cam',
      accessories: (state.avatar.accessories as CatAccessoryId[]) ?? [],
      size: 84,
      label: `Bạn mèo ${state.avatar.name}`,
    });
  }

  function say(line: CompanionLine): void {
    const personal = personalize(line, state.avatar.name || 'Miu');
    lastText = personal.text;
    pose = personal.pose;
    draw();
    bubble.textContent = personal.text;
    bubble.hidden = false;
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      bubble.hidden = true;
      pose = 'dung';
      draw();
    }, BUBBLE_VISIBLE_MS);
  }

  function sayContextLine(): void {
    say(pickLine(linesForContext(context, new Date().getHours()), lastText));
  }

  function scheduleChatter(): void {
    window.clearTimeout(chatterTimer);
    if (!isChatterEnabled()) return;
    const gap = CHATTER_MIN_GAP_MS + Math.random() * (CHATTER_MAX_GAP_MS - CHATTER_MIN_GAP_MS);
    chatterTimer = window.setTimeout(() => {
      // Không nói khi bé đang ở tab khác
      if (!document.hidden) sayContextLine();
      scheduleChatter();
    }, gap);
  }

  function react(reaction: CompanionReaction): void {
    say(pickLine(REACTION_LINES[reaction], lastText));
  }

  bubble.addEventListener('click', () => {
    if (!bubble.hidden && bubble.textContent) speak(bubble.textContent, { tone: 'cheer' });
  });

  window.addEventListener(SFX_EVENT, (event) => {
    const reaction = SFX_REACTIONS[(event as CustomEvent<SfxType>).detail];
    if (reaction) react(reaction);
  });

  draw();
  if (isChatterEnabled()) window.setTimeout(sayContextLine, FIRST_LINE_DELAY_MS);
  scheduleChatter();

  return {
    render(next) {
      state = next;
      draw();
    },
    react,
    refreshChatter() {
      if (isChatterEnabled()) scheduleChatter();
      else {
        window.clearTimeout(chatterTimer);
        bubble.hidden = true;
      }
    },
  };
}
