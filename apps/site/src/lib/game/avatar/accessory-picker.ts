/**
 * apps/site/src/lib/game/avatar/accessory-picker.ts
 *
 * Gắn hành vi cho bộ chọn phụ kiện theo loại (markup ở components/game/accessory-category-picker.astro):
 * mỗi loại 1 món; bấm lại món đang đeo hoặc "Không đeo" để bỏ.
 */
import { CAT_ACCESSORIES, type CatAccessoryId } from '../../../components/game/characters/cat-character';

export interface AccessoryPicker {
  /** Vẽ lại trạng thái các nút theo danh sách phụ kiện đang đeo. */
  sync(): void;
}

export function bindAccessoryPicker(
  root: ParentNode,
  getWorn: () => CatAccessoryId[],
  onChange: (next: CatAccessoryId[]) => void,
): AccessoryPicker {
  const groups = root.querySelectorAll<HTMLElement>('[data-acc-category]');

  function sync(): void {
    const worn = getWorn();
    groups.forEach((group) => {
      const category = group.dataset.accCategory;
      const current = worn.find((id) => CAT_ACCESSORIES[id]?.category === category) ?? '';
      group.querySelectorAll<HTMLElement>('[data-acc-id]').forEach((chip) => {
        const selected = (chip.dataset.accId ?? '') === current;
        chip.classList.toggle('active', selected);
        chip.setAttribute('aria-checked', String(selected));
      });
    });
  }

  groups.forEach((group) => {
    const category = group.dataset.accCategory;
    group.querySelectorAll<HTMLElement>('[data-acc-id]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const accId = (chip.dataset.accId ?? '') as CatAccessoryId | '';
        const worn = getWorn();
        const withoutCategory = worn.filter((id) => CAT_ACCESSORIES[id]?.category !== category);
        const alreadyWorn = accId !== '' && worn.includes(accId);
        onChange(accId === '' || alreadyWorn ? withoutCategory : [...withoutCategory, accId]);
        sync();
      });
    });
  });

  sync();
  return { sync };
}
