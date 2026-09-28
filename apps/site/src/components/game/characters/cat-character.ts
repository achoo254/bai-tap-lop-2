/**
 * apps/site/src/components/game/characters/cat-character.ts
 *
 * Nhân vật Miu — mèo con đại diện của bé trong Thế giới học tập.
 * Dựng hoàn toàn bằng SVG dạng module phân lớp, chia sẻ chung thông số hình học
 * với mascot-kitten.astro để đảm bảo tính đồng nhất 100%.
 */

export type CatPose =
  | 'dung' // Đứng bình thường (idle, thở nhẹ, đuôi vẫy)
  | 'chao' // Giơ tay vẫy chào
  | 'di' // Bước đi thực sự
  | 'nhay' // Nhảy bật cao lên không trung
  | 'vui' // Cười tít mắt, nhảy múa ăn mừng
  | 'suy-nghi' // Chống cằm suy nghĩ, hiện bong bóng tư duy
  | 'buon' // Buồn rũ tai, giọt nước mắt rơi
  | 'te'; // Trượt chân ngã ngồi bệt, sao xoay quanh đầu

export type CatFurColorId =
  | 'vang-cam' // Vàng cam Miu mặc định
  | 'xam-tro' // Xám khói Anh lông ngắn
  | 'trang-tuyet' // Trắng tuyết tinh khôi
  | 'den-mun' // Đen mun huyền bí
  | 'tam-the' // Mèo tam thể may mắn
  | 'muop-ho' // Mướp vằn hổ năng động
  | 'xiem' // Mèo Xiêm quý tộc (mặt/tai/chân sẫm)
  | 'hong-pastel' // Hồng kẹo ngọt cổ tích
  | 'kem-sua' // Vàng kem sữa latte
  | 'bac-anh-trang'; // Bạc ánh trăng lấp lánh

export interface CatFurColorDef {
  id: CatFurColorId;
  name: string;
  fur: string;
  furDark: string;
  belly: string;
  earPink: string;
  spotDark?: string;
  faceMask?: string;
  eyeColor?: string;
}

export const CAT_FUR_COLORS: Record<CatFurColorId, CatFurColorDef> = {
  'vang-cam': {
    id: 'vang-cam',
    name: 'Vàng Cam (Miu)',
    fur: '#ffb45c',
    furDark: '#f08a24',
    belly: '#fff3e0',
    earPink: '#ff8fb1',
  },
  'xam-tro': {
    id: 'xam-tro',
    name: 'Xám Khói',
    fur: '#94a3b8',
    furDark: '#64748b',
    belly: '#f1f5f9',
    earPink: '#fda4af',
  },
  'trang-tuyet': {
    id: 'trang-tuyet',
    name: 'Trắng Tuyết',
    fur: '#ffffff',
    furDark: '#cbd5e1',
    belly: '#f8fafc',
    earPink: '#ff8fb1',
    eyeColor: '#0284c7', // Mắt xanh biếc
  },
  'den-mun': {
    id: 'den-mun',
    name: 'Đen Mun',
    fur: '#334155',
    furDark: '#1e293b',
    belly: '#475569',
    earPink: '#f472b6',
    eyeColor: '#facc15', // Mắt vàng sáng
  },
  'tam-the': {
    id: 'tam-the',
    name: 'Tam Thể',
    fur: '#ffffff',
    furDark: '#fb923c',
    belly: '#fff7ed',
    earPink: '#ff8fb1',
    spotDark: '#334155',
  },
  'muop-ho': {
    id: 'muop-ho',
    name: 'Mướp Vằn Hổ',
    fur: '#d97706',
    furDark: '#78350f',
    belly: '#fef3c7',
    earPink: '#fca5a5',
  },
  xiem: {
    id: 'xiem',
    name: 'Mèo Xiêm',
    fur: '#fef3c7',
    furDark: '#78350f',
    belly: '#fffbeb',
    earPink: '#f472b6',
    faceMask: '#78350f',
    eyeColor: '#38bdf8',
  },
  'hong-pastel': {
    id: 'hong-pastel',
    name: 'Hồng Kẹo Ngọt',
    fur: '#f472b6',
    furDark: '#db2777',
    belly: '#fdf2f8',
    earPink: '#fda4af',
  },
  'kem-sua': {
    id: 'kem-sua',
    name: 'Vàng Kem Sữa',
    fur: '#fde68a',
    furDark: '#d97706',
    belly: '#fffbeb',
    earPink: '#fda4af',
  },
  'bac-anh-trang': {
    id: 'bac-anh-trang',
    name: 'Bạc Ánh Trăng',
    fur: '#e2e8f0',
    furDark: '#94a3b8',
    belly: '#f8fafc',
    earPink: '#c084fc',
    eyeColor: '#a855f7',
  },
};

export type CatAccessoryId =
  | 'no-hong' // Nơ hồng xinh của Miu
  | 'no-do' // Nơ đỏ chấm bi
  | 'mu-cu-nhan' // Mũ cử nhân tốt nghiệp
  | 'mu-phot' // Mũ phớt thám tử
  | 'vuong-mien-sao' // Vương miện ngôi sao vàng
  | 'mu-len-bong' // Mũ len quả bông mùa đông
  | 'tai-nghe-gamer' // Tai nghe phi công / gamer
  | 'mu-dau-bep' // Mũ đầu bếp tí hon
  | 'sung-tuan-loc' // Sừng tuần lộc Giáng sinh
  | 'kinh-tri-thuc' // Kính tròn trí thức
  | 'kinh-ram-ngau' // Kính râm sành điệu
  | 'co-bon-la' // Ngậm nhánh cỏ 4 lá may mắn
  | 'balo-tho' // Balo tai thỏ hồng
  | 'khan-quang-do' // Khăn quàng cổ ấm áp
  | 'canh-thien-than' // Cánh thiên thần nhỏ
  | 'ao-choang-hero'; // Áo choàng siêu nhân

/** Loại phụ kiện: mỗi loại bé chỉ đeo được 1 món. */
export type CatAccessoryCategoryId =
  | 'no-cai-tai'
  | 'mu'
  | 'tai-nghe'
  | 'kinh'
  | 'ngam-mieng'
  | 'khan-co'
  | 'deo-lung';

export interface CatAccessoryCategoryDef {
  id: CatAccessoryCategoryId;
  name: string;
  icon: string;
}

/** Thứ tự hiển thị các loại phụ kiện ở trang tạo nhân vật. */
export const CAT_ACCESSORY_CATEGORIES: CatAccessoryCategoryDef[] = [
  { id: 'no-cai-tai', name: 'Nơ cài tai', icon: '🎀' },
  { id: 'mu', name: 'Mũ & đồ đội đầu', icon: '🎩' },
  { id: 'tai-nghe', name: 'Tai nghe', icon: '🎧' },
  { id: 'kinh', name: 'Kính', icon: '👓' },
  { id: 'ngam-mieng', name: 'Ngậm miệng', icon: '🍀' },
  { id: 'khan-co', name: 'Khăn cổ', icon: '🧣' },
  { id: 'deo-lung', name: 'Đồ đeo lưng', icon: '🎒' },
];

export interface CatAccessoryDef {
  id: CatAccessoryId;
  name: string;
  /** Vị trí vẽ trên người mèo. */
  slot: 'head' | 'face' | 'back' | 'neck';
  category: CatAccessoryCategoryId;
}

export const CAT_ACCESSORIES: Record<CatAccessoryId, CatAccessoryDef> = {
  // --- Mũ & Đầu ---
  'no-hong': { id: 'no-hong', name: 'Nơ hồng Miu', slot: 'head', category: 'no-cai-tai' },
  'no-do': { id: 'no-do', name: 'Nơ đỏ chấm bi', slot: 'head', category: 'no-cai-tai' },
  'mu-cu-nhan': { id: 'mu-cu-nhan', name: 'Mũ cử nhân', slot: 'head', category: 'mu' },
  'mu-phot': { id: 'mu-phot', name: 'Mũ phớt thám tử', slot: 'head', category: 'mu' },
  'vuong-mien-sao': { id: 'vuong-mien-sao', name: 'Vương miện sao', slot: 'head', category: 'mu' },
  'mu-len-bong': { id: 'mu-len-bong', name: 'Mũ len quả bông', slot: 'head', category: 'mu' },
  'tai-nghe-gamer': { id: 'tai-nghe-gamer', name: 'Tai nghe phi công', slot: 'head', category: 'tai-nghe' },
  'mu-dau-bep': { id: 'mu-dau-bep', name: 'Mũ đầu bếp', slot: 'head', category: 'mu' },
  'sung-tuan-loc': { id: 'sung-tuan-loc', name: 'Sừng tuần lộc', slot: 'head', category: 'mu' },

  // --- Mặt & Mắt ---
  'kinh-tri-thuc': { id: 'kinh-tri-thuc', name: 'Kính tròn trí thức', slot: 'face', category: 'kinh' },
  'kinh-ram-ngau': { id: 'kinh-ram-ngau', name: 'Kính râm ngầu', slot: 'face', category: 'kinh' },
  'co-bon-la': { id: 'co-bon-la', name: 'Cỏ 4 lá may mắn', slot: 'face', category: 'ngam-mieng' },

  // --- Cổ & Lưng ---
  'balo-tho': { id: 'balo-tho', name: 'Balo tai thỏ', slot: 'back', category: 'deo-lung' },
  'khan-quang-do': { id: 'khan-quang-do', name: 'Khăn quàng đỏ', slot: 'neck', category: 'khan-co' },
  'canh-thien-than': { id: 'canh-thien-than', name: 'Cánh thiên thần', slot: 'back', category: 'deo-lung' },
  'ao-choang-hero': { id: 'ao-choang-hero', name: 'Áo choàng siêu nhân', slot: 'back', category: 'deo-lung' },
};

/**
 * Chuẩn hoá danh sách phụ kiện: bỏ mã lạ, mỗi loại chỉ giữ 1 món (món chọn sau cùng thắng).
 * Dùng cả khi vẽ lẫn khi đọc dữ liệu cũ đã lưu nhiều món cùng loại.
 */
export function normalizeAccessories(ids: readonly string[]): CatAccessoryId[] {
  const byCategory = new Map<CatAccessoryCategoryId, CatAccessoryId>();
  for (const id of ids) {
    const def = CAT_ACCESSORIES[id as CatAccessoryId];
    if (!def) continue;
    byCategory.delete(def.category);
    byCategory.set(def.category, def.id);
  }
  return [...byCategory.values()];
}

export interface RenderCatOptions {
  pose?: CatPose;
  furColor?: CatFurColorId;
  accessories?: CatAccessoryId[];
  className?: string;
  label?: string;
  size?: number; // px, mặc định 200
}

/**
 * Sinh chuỗi HTML SVG cho nhân vật Miu với đầy đủ phân lớp, tư thế và phụ kiện.
 */
export function renderCatSvgHtml(options: RenderCatOptions = {}): string {
  const {
    pose = 'dung',
    furColor = 'vang-cam',
    accessories = ['no-hong'],
    className = '',
    label = 'Nhân vật Miu',
    size = 200,
  } = options;

  const color = CAT_FUR_COLORS[furColor] ?? CAT_FUR_COLORS['vang-cam'];
  const ink = '#1f1a33';
  const pink = color.earPink;
  const eyeColor = color.eyeColor ?? ink;

  // Lọc phụ kiện
  const wornAccessories = normalizeAccessories(accessories);
  const hasAccessory = (id: CatAccessoryId) => wornAccessories.includes(id);

  // SVG các phụ kiện lưng (Back layer)
  let accessoryBackSvg = '';
  if (hasAccessory('balo-tho')) {
    accessoryBackSvg += `
      <g class="cat-accessory-backpack" stroke="${ink}" stroke-width="3">
        <rect x="52" y="136" width="24" height="36" rx="8" fill="#f472b6" />
        <ellipse cx="58" cy="126" rx="4" ry="12" fill="#fbcfe8" />
        <ellipse cx="68" cy="126" rx="4" ry="12" fill="#fbcfe8" />
      </g>`;
  }
  if (hasAccessory('canh-thien-than')) {
    accessoryBackSvg += `
      <g class="cat-accessory-wings" stroke="#38bdf8" stroke-width="3" fill="#e0f2fe">
        <path d="M48 136 C24 116 10 136 28 156 C38 162 48 150 48 144 Z" />
        <path d="M152 136 C176 116 190 136 172 156 C162 162 152 150 152 144 Z" />
      </g>`;
  }
  if (hasAccessory('ao-choang-hero')) {
    accessoryBackSvg += `
      <g class="cat-accessory-cape" stroke="#991b1b" stroke-width="3">
        <path class="cat-cape-flutter" d="M60 148 L36 196 L164 196 L140 148 Z" fill="#ef4444" />
      </g>`;
  }

  // Phụ kiện cổ (Neck layer)
  let accessoryNeckSvg = '';
  if (hasAccessory('khan-quang-do')) {
    accessoryNeckSvg = `
      <g class="cat-accessory-scarf" stroke="#7f1d1d" stroke-width="3">
        <path d="M66 142 Q100 154 134 142 L132 154 Q100 166 68 154 Z" fill="#ef4444" />
        <rect x="114" y="152" width="14" height="30" rx="3" fill="#dc2626" />
      </g>`;
  }

  // SVG các phụ kiện đầu (Head layer)
  let accessoryHeadSvg = '';
  // Nơ cài tai vẽ riêng và đặt trên cùng để không bị mũ/tai nghe che mất
  let accessoryBowSvg = '';
  if (hasAccessory('no-hong')) {
    accessoryBowSvg += `
      <g class="cat-accessory-bow" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
        <path d="M132 40 L112 26 L114 54 Z" fill="#ff5c9a" />
        <path d="M132 40 L154 28 L150 56 Z" fill="#ff5c9a" />
        <circle cx="132" cy="41" r="7" fill="#ffb3cf" />
      </g>`;
  }
  if (hasAccessory('no-do')) {
    accessoryBowSvg += `
      <g class="cat-accessory-bow-red" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
        <path d="M68 40 L48 26 L50 54 Z" fill="#ef4444" />
        <path d="M68 40 L90 28 L86 56 Z" fill="#ef4444" />
        <circle cx="68" cy="41" r="7" fill="#fca5a5" />
        <circle cx="56" cy="38" r="2" fill="#fff" />
        <circle cx="80" cy="40" r="2" fill="#fff" />
      </g>`;
  }
  if (hasAccessory('mu-cu-nhan')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-grad" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
        <polygon points="100,10 148,26 100,42 52,26" fill="#1e1b4b" />
        <rect x="76" y="28" width="48" height="18" rx="2" fill="#312e81" />
        <path d="M100 26 Q128 32 134 46" fill="none" stroke="#eab308" stroke-width="3" stroke-linecap="round" />
        <circle cx="134" cy="48" r="4" fill="#facc15" />
      </g>`;
  }
  if (hasAccessory('mu-phot')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-fedora" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
        <ellipse cx="100" cy="38" rx="54" ry="12" fill="#78350f" />
        <path d="M68 34 C68 14 78 8 100 8 C122 8 132 14 132 34 Z" fill="#92400e" />
        <rect x="70" y="26" width="60" height="8" rx="2" fill="#ca8a04" />
      </g>`;
  }
  if (hasAccessory('vuong-mien-sao')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-crown" stroke="#713f12" stroke-width="3" stroke-linejoin="round">
        <polygon points="68,36 74,16 88,28 100,10 112,28 126,16 132,36" fill="#facc15" />
        <circle cx="100" cy="10" r="4" fill="#f43f5e" />
        <circle cx="74" cy="16" r="3" fill="#38bdf8" />
        <circle cx="126" cy="16" r="3" fill="#38bdf8" />
      </g>`;
  }
  if (hasAccessory('mu-len-bong')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-beanie" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
        <path d="M58 42 C58 16 142 16 142 42 Z" fill="#3b82f6" />
        <rect x="54" y="38" width="92" height="10" rx="3" fill="#93c5fd" />
        <circle cx="100" cy="12" r="10" fill="#f8fafc" stroke="${ink}" stroke-width="2.5" />
      </g>`;
  }
  if (hasAccessory('tai-nghe-gamer')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-headset" stroke="${ink}" stroke-width="3">
        <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#0f172a" stroke-width="6" />
        <ellipse cx="40" cy="92" rx="10" ry="16" fill="#f43f5e" />
        <ellipse cx="160" cy="92" rx="10" ry="16" fill="#f43f5e" />
      </g>`;
  }
  if (hasAccessory('mu-dau-bep')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-chef" stroke="${ink}" stroke-width="3" stroke-linejoin="round" fill="#ffffff">
        <rect x="74" y="30" width="52" height="14" rx="2" />
        <circle cx="78" cy="22" r="14" />
        <circle cx="100" cy="14" r="16" />
        <circle cx="122" cy="22" r="14" />
      </g>`;
  }
  if (hasAccessory('sung-tuan-loc')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-antlers" stroke="#78350f" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M60 40 L50 16 M54 26 L42 22" />
        <path d="M140 40 L150 16 M146 26 L158 22" />
      </g>`;
  }

  // SVG các phụ kiện mặt (Face layer)
  let accessoryFaceSvg = '';
  if (hasAccessory('kinh-tri-thuc')) {
    accessoryFaceSvg += `
      <g class="cat-accessory-glasses" stroke="#0369a1" stroke-width="3.5" fill="none">
        <circle cx="76" cy="92" r="18" fill="#e0f2fe" fill-opacity="0.4" />
        <circle cx="124" cy="92" r="18" fill="#e0f2fe" fill-opacity="0.4" />
        <path d="M94 92 Q100 88 106 92" />
        <path d="M58 90 L46 86" />
        <path d="M142 90 L154 86" />
      </g>`;
  }
  if (hasAccessory('kinh-ram-ngau')) {
    accessoryFaceSvg += `
      <g class="cat-accessory-sunglasses" stroke="#0f172a" stroke-width="3" fill="#0f172a">
        <polygon points="56,82 94,82 90,102 60,102" rx="4" />
        <polygon points="106,82 144,82 140,102 110,102" rx="4" />
        <line x1="94" y1="86" x2="106" y2="86" stroke="#0f172a" stroke-width="4" />
        <line x1="56" y1="84" x2="44" y2="80" stroke="#0f172a" stroke-width="3" />
        <line x1="144" y1="84" x2="156" y2="80" stroke="#0f172a" stroke-width="3" />
        <!-- Vệt phản chiếu sành điệu -->
        <line x1="64" y1="86" x2="72" y2="98" stroke="#fff" stroke-width="2" />
        <line x1="114" y1="86" x2="122" y2="98" stroke="#fff" stroke-width="2" />
      </g>`;
  }
  if (hasAccessory('co-bon-la')) {
    accessoryFaceSvg += `
      <g class="cat-accessory-clover" stroke="#166534" stroke-width="2" fill="#22c55e">
        <path d="M106 114 Q124 116 130 124" fill="none" stroke="#15803d" stroke-width="2.5" />
        <circle cx="130" cy="120" r="4" />
        <circle cx="136" cy="122" r="4" />
        <circle cx="132" cy="126" r="4" />
        <circle cx="126" cy="124" r="4" />
      </g>`;
  }

  // Đốm tam thể hoặc mặt nạ mèo Xiêm
  let furPatternsSvg = '';
  if (color.spotDark) {
    furPatternsSvg += `
      <path d="M60 74 Q74 60 88 72 Q78 90 60 74 Z" fill="${color.spotDark}" opacity="0.9" />
      <path d="M110 148 Q130 140 140 160 Q124 172 110 148 Z" fill="${color.furDark}" opacity="0.9" />
    `;
  }
  if (color.faceMask) {
    furPatternsSvg += `
      <!-- Mặt nạ mũi sẫm màu của mèo Xiêm -->
      <ellipse cx="100" cy="104" rx="22" ry="16" fill="${color.faceMask}" opacity="0.85" />
    `;
  }

  // Biểu cảm mắt theo tư thế
  let eyesSvg: string;
  if (pose === 'vui') {
    eyesSvg = `
      <g fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round">
        <path d="M64 96 Q76 80 88 96" />
        <path d="M112 96 Q124 80 136 96" />
      </g>`;
  } else if (pose === 'buon') {
    eyesSvg = `
      <g fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round">
        <path d="M64 92 Q76 102 88 92" />
        <path d="M112 92 Q124 102 136 92" />
      </g>`;
  } else if (pose === 'te') {
    // Mắt xoay xoay khi bị ngã
    eyesSvg = `
      <g fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round">
        <path d="M70 86 L82 98 M82 86 L70 98" />
        <path d="M118 86 L130 98 M130 86 L118 98" />
      </g>`;
  } else if (pose === 'suy-nghi') {
    eyesSvg = `
      <g>
        <ellipse cx="76" cy="88" rx="10" ry="13" fill="${eyeColor}" />
        <ellipse cx="124" cy="88" rx="10" ry="13" fill="${eyeColor}" />
        <circle cx="79" cy="82" r="4" fill="#fff" />
        <circle cx="127" cy="82" r="4" fill="#fff" />
      </g>`;
  } else {
    // dung, chao, di, nhay
    eyesSvg = `
      <g>
        <ellipse cx="76" cy="92" rx="10" ry="13" fill="${eyeColor}" />
        <ellipse cx="124" cy="92" rx="10" ry="13" fill="${eyeColor}" />
        <circle cx="72" cy="86" r="4" fill="#fff" />
        <circle cx="120" cy="86" r="4" fill="#fff" />
      </g>`;
  }

  // Miệng theo tư thế
  let mouthSvg: string;
  if (pose === 'vui') {
    mouthSvg = `<path d="M86 114 Q100 134 114 114 Z" fill="#e2445c" stroke="${ink}" stroke-width="4" stroke-linejoin="round" />`;
  } else if (pose === 'buon' || pose === 'te') {
    mouthSvg = `<path d="M88 122 Q100 112 112 122" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" />`;
  } else {
    mouthSvg = `<path d="M88 114 Q94 122 100 114 Q106 122 112 114" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" />`;
  }

  // Phụ ứng động tác (Paws / Props)
  let pawsSvg = '';
  if (pose === 'chao') {
    pawsSvg = `
      <g class="cat-paw-wave">
        <path d="M146 150 Q172 128 176 96" fill="none" stroke="${ink}" stroke-width="20" stroke-linecap="round" />
        <path d="M146 150 Q172 128 176 96" fill="none" stroke="${color.fur}" stroke-width="11" stroke-linecap="round" />
        <circle cx="176" cy="92" r="14" fill="${color.fur}" stroke="${ink}" stroke-width="5" />
      </g>`;
  } else if (pose === 'suy-nghi') {
    pawsSvg = `
      <g class="cat-paw-think">
        <circle cx="118" cy="140" r="14" fill="${color.fur}" stroke="${ink}" stroke-width="5" />
        <!-- Bong bóng suy nghĩ -->
        <circle cx="152" cy="68" r="5" fill="#e0e7ff" stroke="#4338ca" stroke-width="2" />
        <circle cx="162" cy="56" r="8" fill="#e0e7ff" stroke="#4338ca" stroke-width="2.5" />
        <text class="cat-question-mark" x="168" y="38" font-family="'Nunito Variable', Nunito, sans-serif" font-size="36" font-weight="900" fill="#5a3fc0">?</text>
      </g>`;
  } else if (pose === 'vui') {
    pawsSvg = `
      <g class="cat-stars">
        <polygon points="24,44 29,54 40,56 32,64 34,75 24,70 14,75 16,64 8,56 19,54" fill="#ffcf3f" stroke="${ink}" stroke-width="2.5" />
        <polygon points="172,130 176,138 185,139 179,145 180,154 172,150 164,154 165,145 159,139 168,138" fill="#ffcf3f" stroke="${ink}" stroke-width="2.5" />
        <!-- Hoa giấy tung bay -->
        <circle cx="36" cy="90" r="4" fill="#f43f5e" />
        <circle cx="164" cy="70" r="4" fill="#38bdf8" />
        <circle cx="140" cy="30" r="3.5" fill="#4ade80" />
      </g>`;
  } else if (pose === 'buon') {
    pawsSvg = `
      <!-- Giọt nước mắt buồn rơi -->
      <path class="cat-teardrop" d="M152 86 C152 76 162 66 162 66 C162 66 172 76 172 86 C172 92 167 96 162 96 C157 96 152 92 152 86 Z" fill="#67e8f9" stroke="#0284c7" stroke-width="2.5" />
    `;
  } else if (pose === 'te') {
    pawsSvg = `
      <!-- Sao xoay vòng trên đầu khi ngã -->
      <g class="cat-dizzy-stars" fill="#facc15" stroke="#713f12" stroke-width="2">
        <polygon points="70,16 73,22 80,23 75,28 76,35 70,32 64,35 65,28 60,23 67,22" />
        <polygon points="130,16 133,22 140,23 135,28 136,35 130,32 124,35 125,28 120,23 127,22" />
        <circle cx="100" cy="18" r="4" fill="#f43f5e" />
      </g>`;
  }

  return `
<svg
  class="cat-character cat-pose-${pose} ${className}"
  viewBox="0 0 200 200"
  width="${size}"
  height="${size}"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="${label}"
  data-pose="${pose}"
  data-fur="${furColor}"
>
  <!-- [Layer 0] Đuôi & Balo sau -->
  <g class="cat-tail">
    <path d="M146 168 C182 164 190 128 170 112" fill="none" stroke="${ink}" stroke-width="16" stroke-linecap="round" />
    <path d="M146 168 C182 164 190 128 170 112" fill="none" stroke="${color.fur}" stroke-width="8" stroke-linecap="round" />
  </g>
  ${accessoryBackSvg}

  <!-- [Layer 1] Thân & Bụng -->
  <g class="cat-body">
    <ellipse cx="100" cy="160" rx="50" ry="34" fill="${color.fur}" stroke="${ink}" stroke-width="5" />
    <ellipse cx="100" cy="166" rx="26" ry="18" fill="${color.belly}" />
  </g>

  <!-- [Layer 1.5] Phụ kiện cổ (Khăn quàng) -->
  ${accessoryNeckSvg}

  <!-- [Layer 2] Chân -->
  <g class="cat-feet">
    <ellipse class="cat-feet-left" cx="78" cy="190" rx="15" ry="9" fill="${color.fur}" stroke="${ink}" stroke-width="4" />
    <ellipse class="cat-feet-right" cx="122" cy="190" rx="15" ry="9" fill="${color.fur}" stroke="${ink}" stroke-width="4" />
  </g>

  <!-- [Layer 3] Đầu & Tai -->
  <g class="cat-head">
    <!-- Tai trái -->
    <path class="cat-ear-left" d="M44 70 L40 16 L88 44 Z" fill="${color.fur}" stroke="${ink}" stroke-width="5" stroke-linejoin="round" />
    <path class="cat-ear-inner-left" d="M52 58 L50 30 L76 46 Z" fill="${pink}" />

    <!-- Tai phải -->
    <path class="cat-ear-right" d="M156 70 L160 16 L112 44 Z" fill="${color.fur}" stroke="${ink}" stroke-width="5" stroke-linejoin="round" />
    <path class="cat-ear-inner-right" d="M148 58 L150 30 L124 46 Z" fill="${pink}" />

    <!-- Khuôn mặt -->
    <ellipse cx="100" cy="92" rx="68" ry="56" fill="${color.fur}" stroke="${ink}" stroke-width="5" />
    ${furPatternsSvg}

    <!-- Vằn trán -->
    <path d="M100 38 L100 54 M86 40 L90 54 M114 40 L110 54" stroke="${color.furDark}" stroke-width="5" stroke-linecap="round" />

    <!-- Mắt -->
    ${eyesSvg}

    <!-- Phụ kiện mắt/mặt -->
    ${accessoryFaceSvg}

    <!-- Má hồng -->
    <ellipse cx="58" cy="112" rx="11" ry="7" fill="${pink}" opacity="0.75" />
    <ellipse cx="142" cy="112" rx="11" ry="7" fill="${pink}" opacity="0.75" />

    <!-- Mũi & Miệng -->
    <path d="M94 104 L106 104 L100 111 Z" fill="${pink}" stroke="${ink}" stroke-width="3" stroke-linejoin="round" />
    ${mouthSvg}

    <!-- Ria mép -->
    <g stroke="${ink}" stroke-width="3" stroke-linecap="round">
      <path d="M40 104 L64 108 M40 118 L64 116" />
      <path d="M160 104 L136 108 M160 118 L136 116" />
    </g>

    <!-- Phụ kiện đầu (Nơ / Mũ / Vương miện...) -->
    ${accessoryHeadSvg}
    ${accessoryBowSvg}
  </g>

  <!-- [Layer 4] Tay & Phụ ứng động tác -->
  ${pawsSvg}
</svg>
`.trim();
}
