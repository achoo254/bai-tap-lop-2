/**
 * apps/site/src/lib/game/media/art-manifest.ts
 *
 * Sổ danh mục tài nguyên mỹ thuật (Art Manifest) của Thế giới học tập.
 * Cho phép tra cứu hình ảnh theo ID, nhóm theo thể loại và kiểm định bản quyền.
 */

export type AssetCategory = 'tile' | 'structure' | 'item' | 'icon' | 'character' | 'ui';

export interface GameAssetDef {
  id: string;
  name: string;
  category: AssetCategory;
  packageId: 'kenney-cc0' | 'openmoji' | 'project-original-svg';
  relativePath: string; // Tương đối trong public/game/
  license: string;
  width?: number;
  height?: number;
}

export const GAME_ASSETS: Record<string, GameAssetDef> = {
  // --- Kenney CC0 Tiles & Bối cảnh ---
  'tile-grass': {
    id: 'tile-grass',
    name: 'Gạch Cỏ Xanh',
    category: 'tile',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/tile-grass.svg',
    license: 'CC0 1.0 Universal',
    width: 64,
    height: 64,
  },
  'tile-stone-path': {
    id: 'tile-stone-path',
    name: 'Đường Đá Lát Lối Đi',
    category: 'tile',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/tile-stone-path.svg',
    license: 'CC0 1.0 Universal',
    width: 64,
    height: 64,
  },
  'gate-wood': {
    id: 'gate-wood',
    name: 'Cổng Gỗ Vùng Toán',
    category: 'structure',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/gate-wood.svg',
    license: 'CC0 1.0 Universal',
    width: 200,
    height: 180,
  },
  signpost: {
    id: 'signpost',
    name: 'Biển Gỗ Chỉ Đường',
    category: 'structure',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/signpost.svg',
    license: 'CC0 1.0 Universal',
    width: 80,
    height: 120,
  },
  'tree-cartoon': {
    id: 'tree-cartoon',
    name: 'Cây Táo Hoạt Hình',
    category: 'structure',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/tree-cartoon.svg',
    license: 'CC0 1.0 Universal',
    width: 120,
    height: 160,
  },
  flowers: {
    id: 'flowers',
    name: 'Khóm Hoa Cúc & Tulip',
    category: 'structure',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/flowers.svg',
    license: 'CC0 1.0 Universal',
    width: 64,
    height: 64,
  },
  'chest-gold': {
    id: 'chest-gold',
    name: 'Rương Kho Báu Vàng',
    category: 'item',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/chest-gold.svg',
    license: 'CC0 1.0 Universal',
    width: 80,
    height: 80,
  },
  'coin-star': {
    id: 'coin-star',
    name: 'Đồng Xu Ngôi Sao Vàng',
    category: 'item',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/coin-star.svg',
    license: 'CC0 1.0 Universal',
    width: 64,
    height: 64,
  },
  'banner-ribbon': {
    id: 'banner-ribbon',
    name: 'Dải Ruy Băng Hoàng Gia',
    category: 'ui',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/banner-ribbon.svg',
    license: 'CC0 1.0 Universal',
    width: 240,
    height: 60,
  },
  'ui-panel': {
    id: 'ui-panel',
    name: 'Bảng Giao Diện Khung Gỗ',
    category: 'ui',
    packageId: 'kenney-cc0',
    relativePath: 'kenney/ui-panel.svg',
    license: 'CC0 1.0 Universal',
    width: 200,
    height: 120,
  },

  // --- OpenMoji CC BY-SA 4.0 Vật phẩm bài học & Đếm số ---
  'openmoji-candy': {
    id: 'openmoji-candy',
    name: 'Kẹo Ngọt',
    category: 'item',
    packageId: 'openmoji',
    relativePath: 'openmoji/1F36C.svg',
    license: 'CC BY-SA 4.0',
    width: 72,
    height: 72,
  },
  'openmoji-apple': {
    id: 'openmoji-apple',
    name: 'Quả Táo Đỏ',
    category: 'item',
    packageId: 'openmoji',
    relativePath: 'openmoji/1F34E.svg',
    license: 'CC BY-SA 4.0',
    width: 72,
    height: 72,
  },
  'openmoji-star': {
    id: 'openmoji-star',
    name: 'Ngôi Sao Vàng',
    category: 'icon',
    packageId: 'openmoji',
    relativePath: 'openmoji/2B50.svg',
    license: 'CC BY-SA 4.0',
    width: 72,
    height: 72,
  },
  'openmoji-book': {
    id: 'openmoji-book',
    name: 'Sách Mở',
    category: 'item',
    packageId: 'openmoji',
    relativePath: 'openmoji/1F4D6.svg',
    license: 'CC BY-SA 4.0',
    width: 72,
    height: 72,
  },
  'openmoji-rainbow': {
    id: 'openmoji-rainbow',
    name: 'Cầu Vồng',
    category: 'icon',
    packageId: 'openmoji',
    relativePath: 'openmoji/1F308.svg',
    license: 'CC BY-SA 4.0',
    width: 72,
    height: 72,
  },
  'openmoji-clock': {
    id: 'openmoji-clock',
    name: 'Đồng Hồ Báo Thức',
    category: 'item',
    packageId: 'openmoji',
    relativePath: 'openmoji/23F0.svg',
    license: 'CC BY-SA 4.0',
    width: 72,
    height: 72,
  },
  'openmoji-ruler': {
    id: 'openmoji-ruler',
    name: 'Thước Kẻ Đo',
    category: 'item',
    packageId: 'openmoji',
    relativePath: 'openmoji/1F4CF.svg',
    license: 'CC BY-SA 4.0',
    width: 72,
    height: 72,
  },
  'openmoji-mango': {
    id: 'openmoji-mango',
    name: 'Quả Xoài',
    category: 'item',
    packageId: 'openmoji',
    relativePath: 'openmoji/1F96D.svg',
    license: 'CC BY-SA 4.0',
    width: 72,
    height: 72,
  },
};

/** Lấy thông tin định nghĩa của một asset */
export function getAsset(id: string): GameAssetDef | undefined {
  return GAME_ASSETS[id];
}

/** Lấy đường dẫn URL công khai của asset để dùng trong <img> hoặc CSS */
export function getAssetUrl(id: string): string {
  const asset = GAME_ASSETS[id];
  if (!asset) {
    console.warn(`[art-manifest] Không tìm thấy asset với id: ${id}`);
    return '';
  }
  return `/game/${asset.relativePath}`;
}

/** Lọc asset theo thể loại */
export function getAssetsByCategory(category: AssetCategory): GameAssetDef[] {
  return Object.values(GAME_ASSETS).filter((a) => a.category === category);
}

/** Lọc asset theo gói cấp phép */
export function getAssetsByPackage(packageId: GameAssetDef['packageId']): GameAssetDef[] {
  return Object.values(GAME_ASSETS).filter((a) => a.packageId === packageId);
}
