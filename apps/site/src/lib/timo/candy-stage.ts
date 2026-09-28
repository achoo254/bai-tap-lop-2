/**
 * Vẽ và làm hoạt hình khu vực chơi của "Kẹo chẵn lẻ": kẹo bọc giấy (SVG), thẻ phép tính,
 * hoạt hình xếp kẹo thành từng đôi. Chỉ lo phần hình, không biết luật chơi.
 */

const CANDY_COLORS = ['#ff7aa8', '#7cc8ff', '#7fdc8c', '#ffcf3f', '#b99cff', '#ff9f45'];

function candyColor(index: number): string {
  return CANDY_COLORS[index % CANDY_COLORS.length] ?? '#ff7aa8';
}

import { prefersReducedMotion } from '../game/media/motion';

/** Một viên kẹo bọc giấy; label là số in trên kẹo (câu lọc số), bỏ trống với câu đếm kẹo. */
function candyElement(color: string, label?: string): HTMLElement {
  const item = document.createElement('span');
  item.className = 'candy';
  item.style.setProperty('--candy', color);
  item.style.setProperty('--tilt', `${Math.round(Math.random() * 40 - 20)}deg`);
  item.innerHTML = `
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <path d="M30 32 L4 10 L10 32 L4 54 Z" class="candy__wrap" />
      <path d="M90 32 L116 10 L110 32 L116 54 Z" class="candy__wrap" />
      <ellipse cx="60" cy="32" rx="32" ry="26" class="candy__body" />
      <path d="M44 20 Q52 14 60 16" class="candy__shine" />
    </svg>`;
  if (label !== undefined) {
    const text = document.createElement('span');
    text.className = 'candy__label';
    // Tách chữ số cuối để gợi ý "nhìn chữ số hàng đơn vị".
    text.innerHTML = `${label.slice(0, -1)}<span class="candy__last-digit">${label.slice(-1)}</span>`;
    item.append(text);
  }
  return item;
}

export function renderCandies(stage: HTMLElement, count: number): HTMLElement[] {
  stage.className = 'play-stage candy-stage';
  const candies = Array.from({ length: count }, (_, index) =>
    candyElement(candyColor(index * 7 + count)),
  );
  stage.replaceChildren(...candies);
  return candies;
}

export function renderNumberCandies(stage: HTMLElement, numbers: number[]): HTMLElement[] {
  stage.className = 'play-stage candy-stage candy-stage--numbers';
  const candies = numbers.map((value, index) => {
    const candy = candyElement(candyColor(index), String(value));
    candy.setAttribute('role', 'button');
    candy.tabIndex = 0;
    candy.setAttribute('aria-label', `Số ${value}`);
    candy.setAttribute('aria-pressed', 'false');
    // Kẹo có số để thẳng cho bé dễ đọc.
    candy.style.setProperty('--tilt', '0deg');
    return candy;
  });
  stage.replaceChildren(...candies);
  return candies;
}

/** Thẻ phép tính dạng hộp kẹo: mặt trước là phép tính, lật ra mặt sau là kết quả. */
export function renderExpressionCards(
  stage: HTMLElement,
  cards: { text: string; value: number }[],
): HTMLElement[] {
  stage.className = 'play-stage card-stage';
  const elements = cards.map((card, index) => {
    const element = document.createElement('span');
    element.className = 'expression-card';
    element.setAttribute('role', 'button');
    element.tabIndex = 0;
    element.setAttribute('aria-label', `Phép tính ${card.text}`);
    element.setAttribute('aria-pressed', 'false');
    element.style.setProperty('--candy', candyColor(index));
    element.innerHTML = `
      <span class="expression-card__text">${card.text}</span>
      <span class="expression-card__result">= ${card.value}</span>`;
    return element;
  });
  stage.replaceChildren(...elements);
  return elements;
}

/**
 * Xếp kẹo thành từng đôi (mỗi cột 2 viên), mỗi đôi cùng một màu; viên thừa lắc lư một mình.
 * Dùng kỹ thuật FLIP: ghi vị trí cũ, đổi bố cục, rồi trượt từ vị trí cũ sang vị trí mới.
 */
export async function pairUpCandies(stage: HTMLElement): Promise<void> {
  const candies = [...stage.querySelectorAll<HTMLElement>('.candy')];
  if (stage.classList.contains('is-paired')) return;
  const before = candies.map((candy) => candy.getBoundingClientRect());
  stage.classList.add('is-paired');
  candies.forEach((candy, index) => {
    candy.style.setProperty('--candy', candyColor(Math.floor(index / 2)));
    candy.style.setProperty('--tilt', '0deg');
  });
  const reduced = prefersReducedMotion();
  const animations = candies.flatMap((candy, index) => {
    const old = before[index];
    if (!old) return [];
    const now = candy.getBoundingClientRect();
    const dx = old.left - now.left;
    const dy = old.top - now.top;
    const animation = candy.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
      {
        duration: reduced ? 0 : 650,
        delay: reduced ? 0 : index * 45,
        easing: 'cubic-bezier(.3,1.4,.5,1)',
        fill: 'backwards',
      },
    );
    return [animation.finished];
  });
  await Promise.all(animations);
  const alone = candies.length % 2 === 1 ? candies.at(-1) : undefined;
  alone?.classList.add('is-alone');
}

/** Tung pháo giấy từ giữa màn hình khi bé trả lời đúng. */
export function burstConfetti(host: HTMLElement, pieces = 28): void {
  if (prefersReducedMotion()) return;
  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.setProperty('--candy', candyColor(i));
    piece.style.setProperty('--x', `${Math.round(Math.random() * 600 - 300)}px`);
    piece.style.setProperty('--y', `${Math.round(Math.random() * -320 - 80)}px`);
    piece.style.setProperty('--spin', `${Math.round(Math.random() * 720 - 360)}deg`);
    host.append(piece);
    piece.addEventListener('animationend', () => piece.remove(), { once: true });
  }
}
