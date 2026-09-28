/**
 * Kéo-thả cho mini-game, chạy bằng Pointer Events (ngón tay trên iPad, chuột trên máy tính).
 * Cùng lúc hỗ trợ cách "chạm để chọn, chạm chỗ để đặt" cho bé chưa quen kéo và cho bàn phím
 * (Enter/Space chọn vật, rồi Enter/Space trên chỗ đặt).
 *
 * Mini-game quyết định chỗ đặt có hợp lệ không qua onPlace; không hợp lệ thì vật trượt về chỗ cũ.
 */
import { prefersReducedMotion } from './motion';

export interface DragAndPlaceOptions {
  items: readonly HTMLElement[];
  zones: readonly HTMLElement[];
  /** Trả true nếu nhận vật vào chỗ này (mini-game tự di chuyển/ghi nhận vật). */
  onPlace(item: HTMLElement, zone: HTMLElement): boolean;
  /** Gọi khi bắt đầu cầm một vật (vd. phát tiếng "pop"). */
  onPickUp?(item: HTMLElement): void;
}

/** Nhích tay quá ngưỡng này (px) mới tính là kéo; ít hơn là chạm. */
const DRAG_THRESHOLD = 8;

function zoneAt(zones: readonly HTMLElement[], x: number, y: number): HTMLElement | null {
  for (const zone of zones) {
    const rect = zone.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return zone;
  }
  return null;
}

function slideBack(item: HTMLElement, dx: number, dy: number): void {
  item.style.transform = '';
  if (prefersReducedMotion()) return;
  item.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], {
    duration: 250,
    easing: 'ease-out',
  });
}

/** Gắn kéo-thả + chạm-đặt; trả về hàm gỡ bỏ để mini-game dọn khi sang câu mới. */
export function enableDragAndPlace(options: DragAndPlaceOptions): () => void {
  const { items, zones, onPlace, onPickUp } = options;
  const cleanups: (() => void)[] = [];
  let selected: HTMLElement | null = null;

  function select(item: HTMLElement | null): void {
    selected?.setAttribute('aria-pressed', 'false');
    selected?.classList.remove('is-selected');
    selected = item;
    for (const zone of zones) zone.classList.toggle('is-drop-ready', item !== null);
    if (item) {
      item.setAttribute('aria-pressed', 'true');
      item.classList.add('is-selected');
      onPickUp?.(item);
    }
  }

  function place(item: HTMLElement, zone: HTMLElement): boolean {
    const accepted = onPlace(item, zone);
    select(null);
    return accepted;
  }

  for (const item of items) {
    item.style.touchAction = 'none';
    if (!item.hasAttribute('tabindex')) item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-pressed', 'false');

    let startX = 0;
    let startY = 0;
    let dragging = false;
    let hovered: HTMLElement | null = null;

    const onPointerDown = (event: PointerEvent): void => {
      if (event.button !== 0) return;
      startX = event.clientX;
      startY = event.clientY;
      dragging = false;
      item.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent): void => {
      if (!item.hasPointerCapture(event.pointerId)) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!dragging && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!dragging) {
        dragging = true;
        select(null);
        item.classList.add('is-dragging');
        onPickUp?.(item);
      }
      item.style.transform = `translate(${dx}px, ${dy}px)`;
      const zone = zoneAt(zones, event.clientX, event.clientY);
      if (zone !== hovered) {
        hovered?.classList.remove('is-drop-hover');
        zone?.classList.add('is-drop-hover');
        hovered = zone;
      }
    };
    const onPointerUp = (event: PointerEvent): void => {
      if (!item.hasPointerCapture(event.pointerId)) return;
      item.releasePointerCapture(event.pointerId);
      if (!dragging) {
        // Chạm nhẹ: chọn/bỏ chọn vật.
        select(selected === item ? null : item);
        return;
      }
      item.classList.remove('is-dragging');
      hovered?.classList.remove('is-drop-hover');
      const zone = hovered;
      hovered = null;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (zone && onPlace(item, zone)) {
        item.style.transform = '';
      } else {
        slideBack(item, dx, dy);
      }
    };
    const onPointerCancel = (): void => {
      item.classList.remove('is-dragging');
      hovered?.classList.remove('is-drop-hover');
      hovered = null;
      item.style.transform = '';
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      select(selected === item ? null : item);
    };

    item.addEventListener('pointerdown', onPointerDown);
    item.addEventListener('pointermove', onPointerMove);
    item.addEventListener('pointerup', onPointerUp);
    item.addEventListener('pointercancel', onPointerCancel);
    item.addEventListener('keydown', onKeyDown);
    cleanups.push(() => {
      item.removeEventListener('pointerdown', onPointerDown);
      item.removeEventListener('pointermove', onPointerMove);
      item.removeEventListener('pointerup', onPointerUp);
      item.removeEventListener('pointercancel', onPointerCancel);
      item.removeEventListener('keydown', onKeyDown);
    });
  }

  for (const zone of zones) {
    if (!zone.hasAttribute('tabindex')) zone.tabIndex = 0;
    const onZoneActivate = (): void => {
      if (selected) place(selected, zone);
    };
    const onZoneClick = (event: MouseEvent): void => {
      // Chạm vào một vật nằm trong chỗ đặt là để chọn vật đó, không phải để đặt.
      const target = event.target;
      if (target instanceof Node && items.some((item) => item.contains(target))) return;
      onZoneActivate();
    };
    const onZoneKeyDown = (event: KeyboardEvent): void => {
      if (event.target !== zone || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      onZoneActivate();
    };
    zone.addEventListener('click', onZoneClick);
    zone.addEventListener('keydown', onZoneKeyDown);
    cleanups.push(() => {
      zone.removeEventListener('click', onZoneClick);
      zone.removeEventListener('keydown', onZoneKeyDown);
    });
  }

  return () => {
    select(null);
    for (const cleanup of cleanups) cleanup();
  };
}
