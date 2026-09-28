import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GAME_ASSETS,
  getAsset,
  getAssetUrl,
  getAssetsByCategory,
} from '../../../src/lib/game/media/art-manifest';
import {
  CAT_ACCESSORIES,
  CAT_FUR_COLORS,
  renderCatSvgHtml,
  type CatAccessoryId,
  type CatFurColorId,
  type CatPose,
} from '../../../src/components/game/characters/cat-character';
import { NPC_GUIDES } from '../../../src/components/game/characters/npc-guide';
import { BOSS_TIMO } from '../../../src/components/game/characters/boss-timo';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicGameDir = path.resolve(__dirname, '../../../public/game');
const licensesJsonPath = path.join(publicGameDir, 'licenses.json');

describe('Art Manifest & Asset Licensing', () => {
  it('tất cả asset trong manifest đều tồn tại thực tế trên đĩa', () => {
    const assets = Object.values(GAME_ASSETS);
    expect(assets.length).toBeGreaterThan(0);

    for (const asset of assets) {
      const fullPath = path.join(publicGameDir, asset.relativePath);
      expect(fs.existsSync(fullPath), `File thiếu trên đĩa: ${asset.relativePath}`).toBe(true);
      const stat = fs.statSync(fullPath);
      expect(stat.size).toBeGreaterThan(0);
    }
  });

  it('100% asset của Kenney và OpenMoji được ghi danh trong licenses.json', () => {
    expect(fs.existsSync(licensesJsonPath)).toBe(true);
    const licenses = JSON.parse(fs.readFileSync(licensesJsonPath, 'utf8'));
    const registeredFiles = new Set<string>();

    for (const pkg of licenses.packages) {
      for (const file of pkg.files) {
        registeredFiles.add(file);
      }
    }

    for (const asset of Object.values(GAME_ASSETS)) {
      expect(
        registeredFiles.has(asset.relativePath),
        `Asset ${asset.id} (${asset.relativePath}) chưa được khai báo trong licenses.json`,
      ).toBe(true);
    }
  });

  it('hàm getAsset và getAssetUrl hoạt động chuẩn xác', () => {
    const grass = getAsset('tile-grass');
    expect(grass).toBeDefined();
    expect(grass?.name).toBe('Gạch Cỏ Xanh');

    const url = getAssetUrl('tile-grass');
    expect(url).toBe('/game/kenney/tile-grass.svg');

    const nonExistent = getAsset('khong-ton-tai');
    expect(nonExistent).toBeUndefined();
    expect(getAssetUrl('khong-ton-tai')).toBe('');
  });

  it('lọc asset theo danh mục phân loại', () => {
    const tiles = getAssetsByCategory('tile');
    expect(tiles.length).toBe(2);
    expect(tiles.map((t) => t.id)).toContain('tile-grass');
    expect(tiles.map((t) => t.id)).toContain('tile-stone-path');
  });
});

describe('Miu Cat Character SVG Generation', () => {
  it('sinh mã SVG hợp lệ cho tất cả 8 tư thế', () => {
    const poses: CatPose[] = ['dung', 'chao', 'di', 'nhay', 'vui', 'suy-nghi', 'buon', 'te'];
    for (const pose of poses) {
      const svg = renderCatSvgHtml({ pose });
      expect(svg).toContain('<svg');
      expect(svg).toContain(`cat-pose-${pose}`);
      expect(svg).toContain('</svg>');
    }
  });

  it('hỗ trợ đầy đủ tất cả màu lông của mèo', () => {
    const furIds = Object.keys(CAT_FUR_COLORS) as CatFurColorId[];
    expect(furIds.length).toBeGreaterThanOrEqual(4);

    for (const furId of furIds) {
      const svg = renderCatSvgHtml({ furColor: furId });
      expect(svg).toContain(`data-fur="${furId}"`);
      const def = CAT_FUR_COLORS[furId];
      expect(svg).toContain(def.fur);
    }
  });

  it('hỗ trợ đầy đủ các bộ phụ kiện', () => {
    const accessoryIds = Object.keys(CAT_ACCESSORIES) as CatAccessoryId[];
    expect(accessoryIds.length).toBeGreaterThanOrEqual(3);

    for (const accId of accessoryIds) {
      const svg = renderCatSvgHtml({ accessories: [accId] });
      expect(svg).toContain('<svg');
    }
  });
});

describe('NPC Guides & Boss SVG Generation', () => {
  it('sinh SVG cho toàn bộ NPC dẫn đường các vùng và sự kiện', () => {
    const guides = Object.values(NPC_GUIDES);
    expect(guides.length).toBeGreaterThanOrEqual(3);

    for (const npc of guides) {
      const svg = npc.renderSvg();
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain(npc.name);
    }
  });

  it('sinh SVG cho Boss TIMO cả 2 trạng thái thách thức và thất bại', () => {
    const svgChallenge = BOSS_TIMO.renderSvg(220, 'thach-thuc');
    expect(svgChallenge).toContain('<svg');
    expect(svgChallenge).toContain('Thuyền Trưởng Bội Số');
    expect(svgChallenge).not.toContain('boss-defeated');

    const svgDefeated = BOSS_TIMO.renderSvg(220, 'thua');
    expect(svgDefeated).toContain('boss-defeated');
  });
});
