import { describe, expect, it } from 'vitest';
import {
  CAT_ACCESSORIES,
  CAT_ACCESSORY_CATEGORIES,
  normalizeAccessories,
  renderCatSvgHtml,
} from '../../../src/components/game/characters/cat-character';

describe('phụ kiện mèo theo loại', () => {
  it('mọi phụ kiện đều thuộc một loại có trong danh sách hiển thị', () => {
    const categoryIds = new Set(CAT_ACCESSORY_CATEGORIES.map((c) => c.id));
    for (const acc of Object.values(CAT_ACCESSORIES)) {
      expect(categoryIds.has(acc.category)).toBe(true);
    }
  });

  it('mỗi loại chỉ giữ 1 món, món chọn sau cùng thắng', () => {
    expect(
      normalizeAccessories(['no-hong', 'mu-phot', 'no-do', 'kinh-tri-thuc', 'vuong-mien-sao']),
    ).toEqual(['no-do', 'kinh-tri-thuc', 'vuong-mien-sao']);
  });

  it('bỏ qua mã phụ kiện lạ trong dữ liệu cũ', () => {
    expect(normalizeAccessories(['khong-ton-tai', 'balo-tho'])).toEqual(['balo-tho']);
  });

  it('khi vẽ chỉ hiện 1 món mỗi loại dù dữ liệu lưu nhiều món', () => {
    const svg = renderCatSvgHtml({ accessories: ['mu-phot', 'mu-cu-nhan'] });
    expect(svg).toContain('cat-accessory-grad');
    expect(svg).not.toContain('cat-accessory-fedora');
  });
});
