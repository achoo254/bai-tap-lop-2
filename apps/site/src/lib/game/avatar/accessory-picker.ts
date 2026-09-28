/**
 * apps/site/src/lib/game/avatar/accessory-picker.ts
 *
 * Gắn hành vi thông minh cho bộ chọn phụ kiện (markup ở components/game/accessory-category-picker.astro):
 * - Quản lý trang bị: mỗi loại 1 món; bấm lại món đang đeo hoặc "Không đeo" để bỏ.
 * - Thanh tab danh mục: chuyển đổi mượt mà giữa các loại hoặc xem "Tất cả".
 * - Tìm kiếm tức thì: lọc nhanh theo từ khóa (hỗ trợ cả tiếng Việt có dấu và không dấu).
 * - Thanh tóm tắt đồ đang đeo: huy hiệu gỡ nhanh từng món (✕) và nút "Tháo tất cả".
 */
import {
  CAT_ACCESSORIES,
  type CatAccessoryId,
} from '../../../components/game/characters/cat-character';

export interface AccessoryPicker {
  /** Vẽ lại trạng thái các nút, tab badges và thanh tóm tắt theo danh sách phụ kiện đang đeo. */
  sync(): void;
}

/** Chuẩn hoá chuỗi để tìm kiếm không phân biệt dấu và hoa thường */
function normalizeForSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

export function bindAccessoryPicker(
  root: ParentNode,
  getWorn: () => CatAccessoryId[],
  onChange: (next: CatAccessoryId[]) => void,
): AccessoryPicker {
  const groups = root.querySelectorAll<HTMLElement>('[data-acc-category]');
  const tabs = root.querySelectorAll<HTMLButtonElement>('[data-acc-tab]');
  const searchInput = root.querySelector<HTMLInputElement>('[data-acc-search]');
  const searchClear = root.querySelector<HTMLElement>('[data-acc-clear]');
  const equippedBar = root.querySelector<HTMLElement>('[data-acc-equipped-bar]');
  const equippedCount = root.querySelector<HTMLElement>('[data-acc-equipped-count]');
  const equippedChipsContainer = root.querySelector<HTMLElement>('[data-acc-equipped-chips]');
  const clearAllBtn = root.querySelector<HTMLElement>('[data-acc-clear-all]');

  let currentTab = 'all';

  function applyTabFilter(tabId: string): void {
    currentTab = tabId;
    tabs.forEach((tab) => {
      const active = tab.dataset.accTab === tabId;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    groups.forEach((group) => {
      if (tabId === 'all') {
        group.classList.remove('is-hidden');
      } else {
        const match = group.dataset.accCategory === tabId;
        group.classList.toggle('is-hidden', !match);
      }
    });
  }

  function applySearchFilter(query: string): void {
    const raw = query.trim();
    if (!raw) {
      if (searchClear) searchClear.hidden = true;
      // Khôi phục lại trạng thái tab hiện tại
      applyTabFilter(currentTab);
      // Hiện lại tất cả các chip
      groups.forEach((group) => {
        group.querySelectorAll<HTMLElement>('[data-acc-id]').forEach((chip) => {
          chip.classList.remove('is-search-hidden');
        });
      });
      return;
    }

    if (searchClear) searchClear.hidden = false;
    const clean = normalizeForSearch(raw);

    groups.forEach((group) => {
      let groupHasMatch = false;
      group.querySelectorAll<HTMLElement>('[data-acc-id]').forEach((chip) => {
        const id = chip.dataset.accId ?? '';
        if (id === '') {
          // Ẩn nút "Không đeo" khi đang tìm kiếm
          chip.classList.add('is-search-hidden');
          return;
        }
        const acc = CAT_ACCESSORIES[id as CatAccessoryId];
        const name = acc?.name ?? '';
        const match = normalizeForSearch(name).includes(clean);
        chip.classList.toggle('is-search-hidden', !match);
        if (match) groupHasMatch = true;
      });

      // Nếu nhóm có ít nhất 1 món khớp, hiện nhóm đó
      group.classList.toggle('is-hidden', !groupHasMatch);
    });
  }

  function sync(): void {
    const worn = getWorn();

    // 1. Đồng bộ active trên từng chip phụ kiện
    groups.forEach((group) => {
      const category = group.dataset.accCategory;
      const current = worn.find((id) => CAT_ACCESSORIES[id]?.category === category) ?? '';
      group.querySelectorAll<HTMLElement>('[data-acc-id]').forEach((chip) => {
        const selected = (chip.dataset.accId ?? '') === current;
        chip.classList.toggle('active', selected);
        chip.setAttribute('aria-checked', String(selected));
      });

      // Đồng bộ huy hiệu trên tab danh mục
      const tabBadge = root.querySelector<HTMLElement>(`[data-tab-badge="${category}"]`);
      if (tabBadge) {
        tabBadge.hidden = !current;
      }
    });

    // 2. Đồng bộ thanh tóm tắt đang trang bị
    if (equippedBar && equippedCount && equippedChipsContainer) {
      if (worn.length === 0) {
        equippedBar.hidden = true;
        equippedChipsContainer.innerHTML = '';
      } else {
        equippedBar.hidden = false;
        equippedCount.textContent = String(worn.length);

        equippedChipsContainer.innerHTML = worn
          .map((id) => {
            const acc = CAT_ACCESSORIES[id];
            if (!acc) return '';
            return `
              <span class="acc-equipped-pill">
                <span>${acc.name}</span>
                <button type="button" class="acc-pill-remove" data-remove-acc-id="${id}" aria-label="Bỏ ${acc.name}" title="Bỏ món này">✕</button>
              </span>
            `;
          })
          .join('');

        // Gắn sự kiện nút ✕ trên từng chip tóm tắt
        equippedChipsContainer
          .querySelectorAll<HTMLElement>('[data-remove-acc-id]')
          .forEach((btn) => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const removeId = btn.dataset.removeAccId as CatAccessoryId;
              const next = getWorn().filter((id) => id !== removeId);
              onChange(next);
              sync();
            });
          });
      }
    }
  }

  // Gắn sự kiện click cho các chip phụ kiện
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

  // Gắn sự kiện chuyển Tab danh mục
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.accTab ?? 'all';
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        if (searchClear) searchClear.hidden = true;
      }
      applyTabFilter(tabId);
    });
  });

  // Gắn sự kiện tìm kiếm nhanh
  searchInput?.addEventListener('input', () => {
    applySearchFilter(searchInput.value);
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    applySearchFilter('');
  });

  // Gắn sự kiện nút "Tháo tất cả"
  clearAllBtn?.addEventListener('click', () => {
    onChange([]);
    sync();
  });

  sync();
  return { sync };
}
