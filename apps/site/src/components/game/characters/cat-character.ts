/**
 * apps/site/src/components/game/characters/cat-character.ts
 *
 * Nhân vật Miu — mèo con đại diện của bé trong Thế giới học tập.
 * Dựng hoàn toàn bằng SVG dạng module phân lớp, chia sẻ chung thông số hình học
 * với mascot-kitten.astro để đảm bảo tính đồng nhất 100%.
 */

export type CatPose =
  | 'dung'      // Đứng bình thường (idle, thở nhẹ, đuôi vẫy)
  | 'chao'      // Giơ tay vẫy chào
  | 'di'        // Bước đi thực sự
  | 'nhay'      // Nhảy bật cao lên không trung
  | 'vui'       // Cười tít mắt, nhảy múa ăn mừng
  | 'suy-nghi' // Chống cằm suy nghĩ, hiện bong bóng tư duy
  | 'buon'      // Buồn rũ tai, giọt nước mắt rơi
  | 'te';       // Trượt chân ngã ngồi bệt, sao xoay quanh đầu

// ---------------------------------------------------------------------------
// Màu lông — 20 màu (10 màu gốc + 10 màu mới)
// ---------------------------------------------------------------------------
export type CatFurColorId =
  | 'vang-cam'        // Vàng cam Miu mặc định
  | 'xam-tro'         // Xám khói Anh lông ngắn
  | 'trang-tuyet'     // Trắng tuyết tinh khôi
  | 'den-mun'         // Đen mun huyền bí
  | 'tam-the'         // Mèo tam thể may mắn
  | 'muop-ho'         // Mướp vằn hổ năng động
  | 'xiem'            // Mèo Xiêm quý tộc (mặt/tai/chân sẫm)
  | 'hong-pastel'     // Hồng kẹo ngọt cổ tích
  | 'kem-sua'         // Vàng kem sữa latte
  | 'bac-anh-trang'   // Bạc ánh trăng lấp lánh
  // --- 10 màu mới ---
  | 'xanh-bac-ha'     // Xanh bạc hà mát lạnh
  | 'tim-oai'         // Tím oải hương mộng mơ
  | 'cam-chay'        // Cam cháy hoàng hôn
  | 'xanh-duong-bien' // Xanh dương biển sâu
  | 'vang-chanh'      // Vàng chanh tươi sáng
  | 'hong-san-ho'     // Hồng san hô ấm áp
  | 'nau-socola'      // Nâu socola ngọt ngào
  | 'xanh-rong-bien'  // Xanh rong biển huyền ảo
  | 'do-gach'         // Đỏ gạch cổ điển
  | 'vang-kim';       // Vàng kim xa xỉ

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
  // --- Màu gốc (10) ---
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
    eyeColor: '#0284c7',
  },
  'den-mun': {
    id: 'den-mun',
    name: 'Đen Mun',
    fur: '#334155',
    furDark: '#1e293b',
    belly: '#475569',
    earPink: '#f472b6',
    eyeColor: '#facc15',
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
  // --- Màu mới (10) ---
  'xanh-bac-ha': {
    id: 'xanh-bac-ha',
    name: 'Xanh Bạc Hà',
    fur: '#6ee7b7',
    furDark: '#059669',
    belly: '#ecfdf5',
    earPink: '#fda4af',
    eyeColor: '#0f766e',
  },
  'tim-oai': {
    id: 'tim-oai',
    name: 'Tím Oải Hương',
    fur: '#c084fc',
    furDark: '#7c3aed',
    belly: '#faf5ff',
    earPink: '#f9a8d4',
    eyeColor: '#6d28d9',
  },
  'cam-chay': {
    id: 'cam-chay',
    name: 'Cam Cháy',
    fur: '#fb923c',
    furDark: '#c2410c',
    belly: '#fff7ed',
    earPink: '#fca5a5',
    eyeColor: '#b45309',
  },
  'xanh-duong-bien': {
    id: 'xanh-duong-bien',
    name: 'Xanh Dương Biển',
    fur: '#60a5fa',
    furDark: '#1d4ed8',
    belly: '#eff6ff',
    earPink: '#a78bfa',
    eyeColor: '#1e40af',
  },
  'vang-chanh': {
    id: 'vang-chanh',
    name: 'Vàng Chanh',
    fur: '#fef08a',
    furDark: '#ca8a04',
    belly: '#fefce8',
    earPink: '#86efac',
    eyeColor: '#16a34a',
  },
  'hong-san-ho': {
    id: 'hong-san-ho',
    name: 'Hồng San Hô',
    fur: '#fb7185',
    furDark: '#be123c',
    belly: '#fff1f2',
    earPink: '#fda4af',
    eyeColor: '#9f1239',
  },
  'nau-socola': {
    id: 'nau-socola',
    name: 'Nâu Socola',
    fur: '#92400e',
    furDark: '#451a03',
    belly: '#fef3c7',
    earPink: '#fca5a5',
    eyeColor: '#78350f',
  },
  'xanh-rong-bien': {
    id: 'xanh-rong-bien',
    name: 'Xanh Rong Biển',
    fur: '#2dd4bf',
    furDark: '#0f766e',
    belly: '#f0fdfa',
    earPink: '#a7f3d0',
    eyeColor: '#134e4a',
  },
  'do-gach': {
    id: 'do-gach',
    name: 'Đỏ Gạch',
    fur: '#ef4444',
    furDark: '#991b1b',
    belly: '#fef2f2',
    earPink: '#fecdd3',
    eyeColor: '#7f1d1d',
  },
  'vang-kim': {
    id: 'vang-kim',
    name: 'Vàng Kim',
    fur: '#fbbf24',
    furDark: '#92400e',
    belly: '#fffbeb',
    earPink: '#fda4af',
    eyeColor: '#78350f',
  },
};

// ---------------------------------------------------------------------------
// Phụ kiện — 55 phụ kiện tổng, 11 loại (7 gốc + 4 mới)
// ---------------------------------------------------------------------------
export type CatAccessoryId =
  // --- Nơ cài tai (6) ---
  | 'no-hong'
  | 'no-do'
  | 'no-xanh'
  | 'no-tim'
  | 'no-vang'
  | 'no-bac-ha'
  // --- Mũ & đồ đội đầu (10) ---
  | 'mu-cu-nhan'
  | 'mu-phot'
  | 'vuong-mien-sao'
  | 'mu-len-bong'
  | 'mu-dau-bep'
  | 'sung-tuan-loc'
  | 'mu-kowboy'
  | 'mu-phap-su'
  | 'mu-beret'
  | 'mu-bao-hiem'
  // --- Tai nghe (3) ---
  | 'tai-nghe-gamer'
  | 'tai-nghe-nhac'
  | 'tai-nghe-meo'
  // --- Kính (5) ---
  | 'kinh-tri-thuc'
  | 'kinh-ram-ngau'
  | 'kinh-tim'
  | 'kinh-ngoi-sao'
  | 'kinh-cat-keo'
  // --- Ngậm miệng (4) ---
  | 'co-bon-la'
  | 'ken-sao'
  | 'keo-棒'
  | 'bong-hong'
  // --- Khăn & vòng cổ (6) ---
  | 'khan-quang-do'
  | 'no-cham-bi'
  | 'von-co-ren'
  | 'khan-len-soc'
  | 'day-huy-chuong'
  | 'vong-co-ngoc'
  // --- Đồ đeo lưng (6) ---
  | 'balo-tho'
  | 'canh-thien-than'
  | 'ao-choang-hero'
  | 'canh-ca'
  | 'canh-bat-buom'
  | 'balo-vu-tru'
  // --- Bông tai (5) [MỚI] ---
  | 'bong-tai-sao'
  | 'bong-tai-tim'
  | 'bong-tai-kim-cuong'
  | 'bong-tai-hoa'
  | 'bong-tai-cau-vong'
  // --- Đeo tay (4) [MỚI] ---
  | 'vong-tay-vang'
  | 'vong-tay-ngoc'
  | 'dong-ho-cute'
  | 'bang-tay-hero'
  // --- Trang trí đuôi (3) [MỚI] ---
  | 'no-duoi'
  | 'duoi-sao'
  | 'duoi-phep-thuat'
  // --- Áo vest & trang phục (5) [MỚI] ---
  | 'ao-vest-do'
  | 'ao-vest-xanh'
  | 'ao-somi-trang'
  | 'ao-hoa'
  | 'ao-phi-hanh-gia';

/** Loại phụ kiện: mỗi loại bé chỉ đeo được 1 món. */
export type CatAccessoryCategoryId =
  | 'no-cai-tai'
  | 'mu'
  | 'tai-nghe'
  | 'kinh'
  | 'ngam-mieng'
  | 'khan-co'
  | 'deo-lung'
  | 'bong-tai'
  | 'deo-tay'
  | 'trang-tri-duoi'
  | 'ao-vest';

export interface CatAccessoryCategoryDef {
  id: CatAccessoryCategoryId;
  name: string;
  icon: string;
}

/** Thứ tự hiển thị các loại phụ kiện ở trang tạo nhân vật. */
export const CAT_ACCESSORY_CATEGORIES: CatAccessoryCategoryDef[] = [
  { id: 'no-cai-tai',     name: 'Nơ cài tai',        icon: '🎀' },
  { id: 'mu',             name: 'Mũ & đồ đội đầu',   icon: '🎩' },
  { id: 'tai-nghe',       name: 'Tai nghe',           icon: '🎧' },
  { id: 'kinh',           name: 'Kính',               icon: '👓' },
  { id: 'bong-tai',       name: 'Bông tai',           icon: '💎' },
  { id: 'ngam-mieng',     name: 'Ngậm miệng',         icon: '🍀' },
  { id: 'khan-co',        name: 'Khăn & vòng cổ',     icon: '🧣' },
  { id: 'deo-tay',        name: 'Đồ đeo tay',         icon: '⌚' },
  { id: 'deo-lung',       name: 'Đồ đeo lưng',        icon: '🎒' },
  { id: 'trang-tri-duoi', name: 'Trang trí đuôi',     icon: '✨' },
  { id: 'ao-vest',        name: 'Áo vest & trang phục', icon: '👔' },
];

export interface CatAccessoryDef {
  id: CatAccessoryId;
  name: string;
  /** Vị trí vẽ trên người mèo. */
  slot: 'head' | 'face' | 'back' | 'neck' | 'ear' | 'wrist' | 'tail' | 'body';
  category: CatAccessoryCategoryId;
}

export const CAT_ACCESSORIES: Record<CatAccessoryId, CatAccessoryDef> = {
  // --- Nơ cài tai ---
  'no-hong':    { id: 'no-hong',    name: 'Nơ hồng Miu',    slot: 'head', category: 'no-cai-tai' },
  'no-do':      { id: 'no-do',      name: 'Nơ đỏ chấm bi',  slot: 'head', category: 'no-cai-tai' },
  'no-xanh':    { id: 'no-xanh',    name: 'Nơ xanh lá',     slot: 'head', category: 'no-cai-tai' },
  'no-tim':     { id: 'no-tim',     name: 'Nơ tím mộng mơ', slot: 'head', category: 'no-cai-tai' },
  'no-vang':    { id: 'no-vang',    name: 'Nơ vàng óng',    slot: 'head', category: 'no-cai-tai' },
  'no-bac-ha':  { id: 'no-bac-ha',  name: 'Nơ bạc hà',      slot: 'head', category: 'no-cai-tai' },

  // --- Mũ & Đầu ---
  'mu-cu-nhan':    { id: 'mu-cu-nhan',    name: 'Mũ cử nhân',        slot: 'head', category: 'mu' },
  'mu-phot':       { id: 'mu-phot',       name: 'Mũ phớt thám tử',   slot: 'head', category: 'mu' },
  'vuong-mien-sao':{ id: 'vuong-mien-sao',name: 'Vương miện sao',    slot: 'head', category: 'mu' },
  'mu-len-bong':   { id: 'mu-len-bong',   name: 'Mũ len quả bông',   slot: 'head', category: 'mu' },
  'mu-dau-bep':    { id: 'mu-dau-bep',    name: 'Mũ đầu bếp',        slot: 'head', category: 'mu' },
  'sung-tuan-loc': { id: 'sung-tuan-loc', name: 'Sừng tuần lộc',     slot: 'head', category: 'mu' },
  'mu-kowboy':     { id: 'mu-kowboy',     name: 'Mũ cao bồi',         slot: 'head', category: 'mu' },
  'mu-phap-su':    { id: 'mu-phap-su',    name: 'Mũ phù thủy',        slot: 'head', category: 'mu' },
  'mu-beret':      { id: 'mu-beret',      name: 'Mũ beret nghệ sĩ',  slot: 'head', category: 'mu' },
  'mu-bao-hiem':   { id: 'mu-bao-hiem',   name: 'Mũ phi hành gia',   slot: 'head', category: 'mu' },

  // --- Tai nghe ---
  'tai-nghe-gamer': { id: 'tai-nghe-gamer', name: 'Tai nghe gamer',     slot: 'head', category: 'tai-nghe' },
  'tai-nghe-nhac':  { id: 'tai-nghe-nhac',  name: 'Tai nghe nhạc hồng', slot: 'head', category: 'tai-nghe' },
  'tai-nghe-meo':   { id: 'tai-nghe-meo',   name: 'Tai nghe tai mèo',   slot: 'head', category: 'tai-nghe' },

  // --- Kính ---
  'kinh-tri-thuc': { id: 'kinh-tri-thuc', name: 'Kính tròn trí thức', slot: 'face', category: 'kinh' },
  'kinh-ram-ngau': { id: 'kinh-ram-ngau', name: 'Kính râm ngầu',       slot: 'face', category: 'kinh' },
  'kinh-tim':      { id: 'kinh-tim',      name: 'Kính tim Valentine',  slot: 'face', category: 'kinh' },
  'kinh-ngoi-sao': { id: 'kinh-ngoi-sao', name: 'Kính ngôi sao',       slot: 'face', category: 'kinh' },
  'kinh-cat-keo':  { id: 'kinh-cat-keo',  name: 'Kính đầy màu sắc',    slot: 'face', category: 'kinh' },

  // --- Ngậm miệng ---
  'co-bon-la': { id: 'co-bon-la', name: 'Cỏ 4 lá may mắn',   slot: 'face', category: 'ngam-mieng' },
  'ken-sao':   { id: 'ken-sao',   name: 'Kèn sáo mini',        slot: 'face', category: 'ngam-mieng' },
  'keo-棒':    { id: 'keo-棒',    name: 'Kẹo que ngọt ngào',  slot: 'face', category: 'ngam-mieng' },
  'bong-hong': { id: 'bong-hong', name: 'Bông hồng lãng mạn', slot: 'face', category: 'ngam-mieng' },

  // --- Khăn & vòng cổ ---
  'khan-quang-do': { id: 'khan-quang-do', name: 'Khăn quàng đỏ',     slot: 'neck', category: 'khan-co' },
  'no-cham-bi':    { id: 'no-cham-bi',    name: 'Nơ cổ chấm bi',     slot: 'neck', category: 'khan-co' },
  'von-co-ren':    { id: 'von-co-ren',    name: 'Viền cổ đăng ten',  slot: 'neck', category: 'khan-co' },
  'khan-len-soc':  { id: 'khan-len-soc',  name: 'Khăn len sọc',      slot: 'neck', category: 'khan-co' },
  'day-huy-chuong':{ id: 'day-huy-chuong',name: 'Dây huy chương',    slot: 'neck', category: 'khan-co' },
  'vong-co-ngoc':  { id: 'vong-co-ngoc',  name: 'Vòng cổ ngọc trai', slot: 'neck', category: 'khan-co' },

  // --- Đồ đeo lưng ---
  'balo-tho':       { id: 'balo-tho',       name: 'Balo tai thỏ',       slot: 'back', category: 'deo-lung' },
  'canh-thien-than':{ id: 'canh-thien-than',name: 'Cánh thiên thần',    slot: 'back', category: 'deo-lung' },
  'ao-choang-hero': { id: 'ao-choang-hero', name: 'Áo choàng siêu nhân',slot: 'back', category: 'deo-lung' },
  'canh-ca':        { id: 'canh-ca',        name: 'Cánh cá tiên',        slot: 'back', category: 'deo-lung' },
  'canh-bat-buom':  { id: 'canh-bat-buom',  name: 'Cánh bướm phép thuật',slot: 'back', category: 'deo-lung' },
  'balo-vu-tru':    { id: 'balo-vu-tru',    name: 'Balo vũ trụ',         slot: 'back', category: 'deo-lung' },

  // --- Bông tai [MỚI] ---
  'bong-tai-sao':      { id: 'bong-tai-sao',      name: 'Bông tai sao',       slot: 'ear', category: 'bong-tai' },
  'bong-tai-tim':      { id: 'bong-tai-tim',      name: 'Bông tai trái tim',  slot: 'ear', category: 'bong-tai' },
  'bong-tai-kim-cuong':{ id: 'bong-tai-kim-cuong',name: 'Bông tai kim cương', slot: 'ear', category: 'bong-tai' },
  'bong-tai-hoa':      { id: 'bong-tai-hoa',      name: 'Bông tai bông hoa',  slot: 'ear', category: 'bong-tai' },
  'bong-tai-cau-vong': { id: 'bong-tai-cau-vong', name: 'Bông tai cầu vồng',  slot: 'ear', category: 'bong-tai' },

  // --- Đeo tay [MỚI] ---
  'vong-tay-vang': { id: 'vong-tay-vang', name: 'Vòng tay vàng',       slot: 'wrist', category: 'deo-tay' },
  'vong-tay-ngoc': { id: 'vong-tay-ngoc', name: 'Vòng tay ngọc',       slot: 'wrist', category: 'deo-tay' },
  'dong-ho-cute':  { id: 'dong-ho-cute',  name: 'Đồng hồ dễ thương',   slot: 'wrist', category: 'deo-tay' },
  'bang-tay-hero': { id: 'bang-tay-hero', name: 'Băng tay siêu nhân',  slot: 'wrist', category: 'deo-tay' },

  // --- Trang trí đuôi [MỚI] ---
  'no-duoi':         { id: 'no-duoi',         name: 'Nơ trang trí đuôi',     slot: 'tail', category: 'trang-tri-duoi' },
  'duoi-sao':        { id: 'duoi-sao',        name: 'Đuôi gắn sao vàng',     slot: 'tail', category: 'trang-tri-duoi' },
  'duoi-phep-thuat': { id: 'duoi-phep-thuat', name: 'Đuôi phép thuật phát sáng', slot: 'tail', category: 'trang-tri-duoi' },

  // --- Áo vest & trang phục [MỚI] ---
  'ao-vest-do':      { id: 'ao-vest-do',      name: 'Áo vest đỏ sang trọng', slot: 'body', category: 'ao-vest' },
  'ao-vest-xanh':    { id: 'ao-vest-xanh',    name: 'Áo vest xanh học sinh', slot: 'body', category: 'ao-vest' },
  'ao-somi-trang':   { id: 'ao-somi-trang',   name: 'Áo sơ mi trắng tinh tề',slot: 'body', category: 'ao-vest' },
  'ao-hoa':          { id: 'ao-hoa',          name: 'Áo hoa hướng dương',    slot: 'body', category: 'ao-vest' },
  'ao-phi-hanh-gia': { id: 'ao-phi-hanh-gia', name: 'Áo phi hành gia vũ trụ',slot: 'body', category: 'ao-vest' },
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

  // -----------------------------------------------------------------------
  // [Layer 0b] Trang trí đuôi
  // -----------------------------------------------------------------------
  let accessoryTailSvg = '';
  if (hasAccessory('no-duoi')) {
    accessoryTailSvg += `
      <g class="cat-accessory-tail-bow" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round">
        <path d="M178 118 L170 110 L172 122 Z" fill="#f472b6" />
        <path d="M178 118 L188 112 L186 124 Z" fill="#f472b6" />
        <circle cx="178" cy="118" r="4" fill="#fbcfe8" />
      </g>`;
  }
  if (hasAccessory('duoi-sao')) {
    accessoryTailSvg += `
      <g class="cat-accessory-tail-star">
        <polygon points="178,106 181,114 190,115 184,121 186,130 178,126 170,130 172,121 166,115 175,114" fill="#facc15" stroke="#713f12" stroke-width="2" />
      </g>`;
  }
  if (hasAccessory('duoi-phep-thuat')) {
    accessoryTailSvg += `
      <g class="cat-accessory-tail-magic">
        <circle cx="172" cy="112" r="8" fill="#a78bfa" opacity="0.7" />
        <circle cx="176" cy="108" r="5" fill="#c084fc" opacity="0.8" />
        <circle cx="169" cy="116" r="3" fill="#f0abfc" />
      </g>`;
  }

  // -----------------------------------------------------------------------
  // SVG các phụ kiện lưng (Back layer)
  // -----------------------------------------------------------------------
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
  if (hasAccessory('canh-ca')) {
    accessoryBackSvg += `
      <g class="cat-accessory-mermaid-tail" stroke="#0e7490" stroke-width="2.5">
        <path d="M48 140 C20 128 16 148 30 160 C40 166 48 156 48 148 Z" fill="#22d3ee" />
        <path d="M152 140 C180 128 184 148 170 160 C160 166 152 156 152 148 Z" fill="#22d3ee" />
        <path d="M32 155 L22 165 M38 158 L28 170" stroke="#67e8f9" stroke-width="2" />
        <path d="M168 155 L178 165 M162 158 L172 170" stroke="#67e8f9" stroke-width="2" />
      </g>`;
  }
  if (hasAccessory('canh-bat-buom')) {
    accessoryBackSvg += `
      <g class="cat-accessory-butterfly" stroke="#7c3aed" stroke-width="2">
        <path d="M50 130 C20 100 8 130 30 150 C42 156 52 140 50 132 Z" fill="#c084fc" />
        <path d="M150 130 C180 100 192 130 170 150 C158 156 148 140 150 132 Z" fill="#f0abfc" />
        <circle cx="50" cy="131" r="4" fill="#7c3aed" />
        <circle cx="150" cy="131" r="4" fill="#7c3aed" />
      </g>`;
  }
  if (hasAccessory('balo-vu-tru')) {
    accessoryBackSvg += `
      <g class="cat-accessory-spacepack" stroke="${ink}" stroke-width="3">
        <rect x="50" y="130" width="28" height="42" rx="6" fill="#1e293b" />
        <rect x="54" y="134" width="8" height="8" rx="2" fill="#38bdf8" />
        <rect x="66" y="134" width="8" height="8" rx="2" fill="#34d399" />
        <rect x="54" y="146" width="20" height="6" rx="2" fill="#64748b" />
        <path d="M62 172 L54 188 M62 172 L70 188" stroke="#64748b" stroke-width="4" stroke-linecap="round" />
      </g>`;
  }

  // -----------------------------------------------------------------------
  // Phụ kiện áo vest / trang phục (body layer — vẽ trước cổ)
  // -----------------------------------------------------------------------
  let accessoryBodySvg = '';
  if (hasAccessory('ao-vest-do')) {
    accessoryBodySvg += `
      <g class="cat-accessory-vest-red" stroke="#7f1d1d" stroke-width="3">
        <path d="M72 148 L72 185 L100 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#ef4444" />
        <path d="M100 158 L100 185" stroke="#991b1b" stroke-width="2" />
      </g>`;
  }
  if (hasAccessory('ao-vest-xanh')) {
    accessoryBodySvg += `
      <g class="cat-accessory-vest-blue" stroke="#1e40af" stroke-width="3">
        <path d="M72 148 L72 185 L100 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#3b82f6" />
        <path d="M100 158 L100 185" stroke="#1d4ed8" stroke-width="2" />
        <rect x="90" y="162" width="8" height="10" rx="2" fill="#ffffff" />
      </g>`;
  }
  if (hasAccessory('ao-somi-trang')) {
    accessoryBodySvg += `
      <g class="cat-accessory-shirt" stroke="#cbd5e1" stroke-width="3">
        <path d="M72 148 L72 185 L100 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#ffffff" />
        <path d="M100 158 L100 185" stroke="#e2e8f0" stroke-width="2" />
        <circle cx="100" cy="165" r="2.5" fill="#94a3b8" />
        <circle cx="100" cy="173" r="2.5" fill="#94a3b8" />
      </g>`;
  }
  if (hasAccessory('ao-hoa')) {
    accessoryBodySvg += `
      <g class="cat-accessory-floral" stroke="#16a34a" stroke-width="2.5">
        <path d="M72 148 L72 185 L100 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#dcfce7" />
        <circle cx="84" cy="162" r="5" fill="#f472b6" />
        <circle cx="84" cy="162" r="3" fill="#fde68a" />
        <circle cx="100" cy="168" r="5" fill="#fb923c" />
        <circle cx="100" cy="168" r="3" fill="#fde68a" />
        <circle cx="116" cy="162" r="5" fill="#f472b6" />
        <circle cx="116" cy="162" r="3" fill="#fde68a" />
      </g>`;
  }
  if (hasAccessory('ao-phi-hanh-gia')) {
    accessoryBodySvg += `
      <g class="cat-accessory-spacesuit" stroke="#475569" stroke-width="3">
        <path d="M70 148 L70 185 L130 185 L130 148 Q100 160 70 148 Z" fill="#e2e8f0" />
        <rect x="84" y="155" width="32" height="22" rx="6" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2" />
        <circle cx="100" cy="166" r="6" fill="#60a5fa" opacity="0.6" />
      </g>`;
  }

  // -----------------------------------------------------------------------
  // Phụ kiện cổ (Neck layer)
  // -----------------------------------------------------------------------
  let accessoryNeckSvg = '';
  if (hasAccessory('khan-quang-do')) {
    accessoryNeckSvg = `
      <g class="cat-accessory-scarf" stroke="#7f1d1d" stroke-width="3">
        <path d="M66 142 Q100 154 134 142 L132 154 Q100 166 68 154 Z" fill="#ef4444" />
        <rect x="114" y="152" width="14" height="30" rx="3" fill="#dc2626" />
      </g>`;
  }
  if (hasAccessory('no-cham-bi')) {
    accessoryNeckSvg = `
      <g class="cat-accessory-bowtie" stroke="${ink}" stroke-width="3">
        <path d="M82 148 L96 140 L98 156 Z" fill="#1e40af" />
        <path d="M118 148 L104 140 L102 156 Z" fill="#1e40af" />
        <circle cx="100" cy="148" r="6" fill="#3b82f6" />
        <circle cx="86" cy="144" r="2" fill="#fff" />
        <circle cx="92" cy="150" r="2" fill="#fff" />
        <circle cx="114" cy="144" r="2" fill="#fff" />
        <circle cx="108" cy="150" r="2" fill="#fff" />
      </g>`;
  }
  if (hasAccessory('von-co-ren')) {
    accessoryNeckSvg = `
      <g class="cat-accessory-lace-collar" stroke="#94a3b8" stroke-width="2">
        <path d="M62 142 Q100 152 138 142 L136 150 Q100 160 64 150 Z" fill="#ffffff" />
        <path d="M64 142 Q72 152 80 142 Q88 152 96 142 Q104 152 112 142 Q120 152 128 142 Q136 152 136 142" fill="none" stroke="#cbd5e1" stroke-width="1.5" />
      </g>`;
  }
  if (hasAccessory('khan-len-soc')) {
    accessoryNeckSvg = `
      <g class="cat-accessory-striped-scarf" stroke="#7c3aed" stroke-width="2.5">
        <path d="M66 142 Q100 154 134 142 L132 160 Q100 172 68 160 Z" fill="#a78bfa" />
        <path d="M66 148 Q100 160 134 148" stroke="#7c3aed" stroke-width="3" fill="none" />
        <path d="M67 154 Q100 166 133 154" stroke="#c4b5fd" stroke-width="2" fill="none" />
        <rect x="116" y="158" width="12" height="28" rx="4" fill="#8b5cf6" />
      </g>`;
  }
  if (hasAccessory('day-huy-chuong')) {
    accessoryNeckSvg = `
      <g class="cat-accessory-medal" stroke="#ca8a04" stroke-width="2.5">
        <path d="M76 140 Q100 148 124 140 L120 152 L100 156 L80 152 Z" fill="#fbbf24" opacity="0.4" />
        <line x1="100" y1="140" x2="100" y2="162" stroke="#ca8a04" stroke-width="2" />
        <circle cx="100" cy="166" r="8" fill="#fbbf24" stroke="#92400e" stroke-width="2" />
        <polygon points="100,160 102,165 108,165 103,168 105,174 100,171 95,174 97,168 92,165 98,165" fill="#fef3c7" />
      </g>`;
  }
  if (hasAccessory('vong-co-ngoc')) {
    accessoryNeckSvg = `
      <g class="cat-accessory-pearl-necklace" stroke="#94a3b8" stroke-width="1.5">
        <path d="M68 140 Q100 150 132 140" fill="none" />
        <circle cx="72" cy="142" r="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="82" cy="146" r="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="92" cy="148" r="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="100" cy="149" r="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="108" cy="148" r="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="118" cy="146" r="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="128" cy="142" r="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
      </g>`;
  }

  // -----------------------------------------------------------------------
  // SVG các phụ kiện đầu (Head layer)
  // -----------------------------------------------------------------------
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
  if (hasAccessory('no-xanh')) {
    accessoryBowSvg += `
      <g class="cat-accessory-bow-green" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
        <path d="M132 40 L112 26 L114 54 Z" fill="#22c55e" />
        <path d="M132 40 L154 28 L150 56 Z" fill="#22c55e" />
        <circle cx="132" cy="41" r="7" fill="#86efac" />
      </g>`;
  }
  if (hasAccessory('no-tim')) {
    accessoryBowSvg += `
      <g class="cat-accessory-bow-purple" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
        <path d="M68 40 L48 26 L50 54 Z" fill="#a855f7" />
        <path d="M68 40 L90 28 L86 56 Z" fill="#a855f7" />
        <circle cx="68" cy="41" r="7" fill="#d8b4fe" />
      </g>`;
  }
  if (hasAccessory('no-vang')) {
    accessoryBowSvg += `
      <g class="cat-accessory-bow-gold" stroke="#92400e" stroke-width="4" stroke-linejoin="round">
        <path d="M132 40 L112 26 L114 54 Z" fill="#fbbf24" />
        <path d="M132 40 L154 28 L150 56 Z" fill="#fbbf24" />
        <circle cx="132" cy="41" r="7" fill="#fef08a" />
      </g>`;
  }
  if (hasAccessory('no-bac-ha')) {
    accessoryBowSvg += `
      <g class="cat-accessory-bow-mint" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
        <path d="M68 40 L48 26 L50 54 Z" fill="#6ee7b7" />
        <path d="M68 40 L90 28 L86 56 Z" fill="#6ee7b7" />
        <circle cx="68" cy="41" r="7" fill="#a7f3d0" />
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
  if (hasAccessory('tai-nghe-nhac')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-headset-pink" stroke="${ink}" stroke-width="3">
        <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#db2777" stroke-width="6" />
        <ellipse cx="40" cy="92" rx="10" ry="16" fill="#f9a8d4" />
        <ellipse cx="160" cy="92" rx="10" ry="16" fill="#f9a8d4" />
        <circle cx="40" cy="92" r="5" fill="#fbcfe8" />
        <circle cx="160" cy="92" r="5" fill="#fbcfe8" />
      </g>`;
  }
  if (hasAccessory('tai-nghe-meo')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-cat-ears-headset" stroke="${ink}" stroke-width="3">
        <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#7c3aed" stroke-width="6" />
        <ellipse cx="40" cy="92" rx="9" ry="14" fill="#c084fc" />
        <ellipse cx="160" cy="92" rx="9" ry="14" fill="#c084fc" />
        <!-- Mini cat ears on headset -->
        <path d="M32 84 L28 70 L42 80 Z" fill="#f0abfc" stroke="#7c3aed" stroke-width="2" />
        <path d="M168 84 L172 70 L158 80 Z" fill="#f0abfc" stroke="#7c3aed" stroke-width="2" />
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
  if (hasAccessory('mu-kowboy')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-cowboy" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
        <ellipse cx="100" cy="40" rx="60" ry="14" fill="#92400e" />
        <path d="M65 36 C65 12 78 6 100 6 C122 6 135 12 135 36 Z" fill="#a16207" />
        <rect x="67" y="28" width="66" height="10" rx="3" fill="#fbbf24" />
      </g>`;
  }
  if (hasAccessory('mu-phap-su')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-witch" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
        <polygon points="100,4 130,42 70,42" fill="#1e1b4b" />
        <ellipse cx="100" cy="42" rx="48" ry="11" fill="#312e81" />
        <circle cx="100" cy="28" r="5" fill="#facc15" />
        <path d="M100 4 C90 20 100 28 100 28 C100 28 110 20 100 4 Z" fill="#4c1d95" />
      </g>`;
  }
  if (hasAccessory('mu-beret')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-beret" stroke="${ink}" stroke-width="3">
        <ellipse cx="100" cy="30" rx="44" ry="22" fill="#dc2626" />
        <ellipse cx="100" cy="40" rx="50" ry="8" fill="#b91c1c" />
        <ellipse cx="118" cy="20" rx="6" ry="4" fill="#ef4444" />
      </g>`;
  }
  if (hasAccessory('mu-bao-hiem')) {
    accessoryHeadSvg += `
      <g class="cat-accessory-helmet" stroke="${ink}" stroke-width="3">
        <path d="M44 60 C44 20 156 20 156 60 L154 78 L46 78 Z" fill="#e2e8f0" />
        <rect x="70" y="62" width="60" height="16" rx="4" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2" />
        <line x1="44" y1="70" x2="56" y2="70" stroke="#94a3b8" stroke-width="3" />
        <line x1="156" y1="70" x2="144" y2="70" stroke="#94a3b8" stroke-width="3" />
      </g>`;
  }

  // -----------------------------------------------------------------------
  // SVG các phụ kiện mặt (Face layer)
  // -----------------------------------------------------------------------
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
        <line x1="64" y1="86" x2="72" y2="98" stroke="#fff" stroke-width="2" />
        <line x1="114" y1="86" x2="122" y2="98" stroke="#fff" stroke-width="2" />
      </g>`;
  }
  if (hasAccessory('kinh-tim')) {
    accessoryFaceSvg += `
      <g class="cat-accessory-heart-glasses" stroke="#be185d" stroke-width="3" fill="none">
        <!-- Heart left -->
        <path d="M60 84 C60 78 68 74 76 80 C84 74 92 78 92 84 C92 92 76 102 76 102 C76 102 60 92 60 84 Z" fill="#fce7f3" fill-opacity="0.5" />
        <!-- Heart right -->
        <path d="M108 84 C108 78 116 74 124 80 C132 74 140 78 140 84 C140 92 124 102 124 102 C124 102 108 92 108 84 Z" fill="#fce7f3" fill-opacity="0.5" />
        <line x1="92" y1="86" x2="108" y2="86" />
        <line x1="44" y1="82" x2="60" y2="84" />
        <line x1="156" y1="82" x2="140" y2="84" />
      </g>`;
  }
  if (hasAccessory('kinh-ngoi-sao')) {
    accessoryFaceSvg += `
      <g class="cat-accessory-star-glasses" stroke="#713f12" stroke-width="2.5" fill="none">
        <!-- Star left -->
        <polygon points="76,74 79,83 89,84 82,91 84,100 76,96 68,100 70,91 63,84 73,83" fill="#fef08a" fill-opacity="0.5" />
        <!-- Star right -->
        <polygon points="124,74 127,83 137,84 130,91 132,100 124,96 116,100 118,91 111,84 121,83" fill="#fef08a" fill-opacity="0.5" />
        <line x1="89" y1="84" x2="111" y2="84" />
        <line x1="44" y1="82" x2="63" y2="84" />
        <line x1="156" y1="82" x2="137" y2="84" />
      </g>`;
  }
  if (hasAccessory('kinh-cat-keo')) {
    accessoryFaceSvg += `
      <g class="cat-accessory-colorful-glasses" stroke="#0f172a" stroke-width="3" fill="none">
        <rect x="56" y="80" width="38" height="22" rx="8" fill="#f43f5e" fill-opacity="0.35" />
        <rect x="106" y="80" width="38" height="22" rx="8" fill="#38bdf8" fill-opacity="0.35" />
        <line x1="94" y1="88" x2="106" y2="88" stroke="#0f172a" stroke-width="3" />
        <line x1="56" y1="85" x2="44" y2="82" />
        <line x1="144" y1="85" x2="156" y2="82" />
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
  if (hasAccessory('ken-sao')) {
    accessoryFaceSvg += `
      <g class="cat-accessory-flute" stroke="#713f12" stroke-width="2">
        <rect x="104" y="113" width="40" height="6" rx="3" fill="#d97706" />
        <circle cx="114" cy="116" r="2" fill="#92400e" />
        <circle cx="122" cy="116" r="2" fill="#92400e" />
        <circle cx="130" cy="116" r="2" fill="#92400e" />
        <circle cx="138" cy="116" r="2" fill="#92400e" />
      </g>`;
  }
  if (hasAccessory('keo-棒')) {
    accessoryFaceSvg += `
      <g class="cat-accessory-lollipop" stroke="#7f1d1d" stroke-width="2">
        <line x1="108" y1="116" x2="136" y2="126" stroke="#92400e" stroke-width="3" stroke-linecap="round" />
        <circle cx="108" cy="114" r="9" fill="#f43f5e" />
        <path d="M102 110 Q108 104 114 110 Q108 116 102 110 Z" fill="#fb923c" />
      </g>`;
  }
  if (hasAccessory('bong-hong')) {
    accessoryFaceSvg += `
      <g class="cat-accessory-rose" stroke="#9f1239" stroke-width="2">
        <line x1="108" y1="116" x2="134" y2="124" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="106" cy="113" r="7" fill="#f43f5e" />
        <circle cx="100" cy="116" r="5" fill="#fb7185" />
        <circle cx="106" cy="108" r="4" fill="#fda4af" />
      </g>`;
  }

  // -----------------------------------------------------------------------
  // Bông tai (ear layer — vẽ ở vùng tai)
  // -----------------------------------------------------------------------
  let accessoryEarSvg = '';
  if (hasAccessory('bong-tai-sao')) {
    accessoryEarSvg += `
      <g class="cat-accessory-earring-star">
        <polygon points="44,72 46,78 53,79 48,84 49,90 44,87 39,90 40,84 35,79 42,78" fill="#facc15" stroke="#713f12" stroke-width="1.5" />
        <polygon points="156,72 158,78 165,79 160,84 161,90 156,87 151,90 152,84 147,79 154,78" fill="#facc15" stroke="#713f12" stroke-width="1.5" />
      </g>`;
  }
  if (hasAccessory('bong-tai-tim')) {
    accessoryEarSvg += `
      <g class="cat-accessory-earring-heart">
        <path d="M38 72 C38 68 43 66 46 70 C49 66 54 68 54 72 C54 77 46 83 46 83 C46 83 38 77 38 72 Z" fill="#f43f5e" stroke="#9f1239" stroke-width="1.5" />
        <path d="M146 72 C146 68 151 66 154 70 C157 66 162 68 162 72 C162 77 154 83 154 83 C154 83 146 77 146 72 Z" fill="#f43f5e" stroke="#9f1239" stroke-width="1.5" />
      </g>`;
  }
  if (hasAccessory('bong-tai-kim-cuong')) {
    accessoryEarSvg += `
      <g class="cat-accessory-earring-diamond">
        <polygon points="46,68 52,76 46,84 40,76" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
        <polygon points="154,68 160,76 154,84 148,76" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
        <line x1="40" y1="72" x2="52" y2="80" stroke="#bfdbfe" stroke-width="1" />
        <line x1="148" y1="72" x2="160" y2="80" stroke="#bfdbfe" stroke-width="1" />
      </g>`;
  }
  if (hasAccessory('bong-tai-hoa')) {
    accessoryEarSvg += `
      <g class="cat-accessory-earring-flower">
        <circle cx="46" cy="76" r="8" fill="#f472b6" />
        <circle cx="46" cy="68" r="4" fill="#fda4af" />
        <circle cx="46" cy="84" r="4" fill="#fda4af" />
        <circle cx="38" cy="76" r="4" fill="#fda4af" />
        <circle cx="54" cy="76" r="4" fill="#fda4af" />
        <circle cx="46" cy="76" r="4" fill="#fef08a" />
        <circle cx="154" cy="76" r="8" fill="#f472b6" />
        <circle cx="154" cy="68" r="4" fill="#fda4af" />
        <circle cx="154" cy="84" r="4" fill="#fda4af" />
        <circle cx="146" cy="76" r="4" fill="#fda4af" />
        <circle cx="162" cy="76" r="4" fill="#fda4af" />
        <circle cx="154" cy="76" r="4" fill="#fef08a" />
      </g>`;
  }
  if (hasAccessory('bong-tai-cau-vong')) {
    accessoryEarSvg += `
      <g class="cat-accessory-earring-rainbow">
        <path d="M36 82 C36 70 56 70 56 82" fill="none" stroke="#ef4444" stroke-width="3" />
        <path d="M38 82 C38 72 54 72 54 82" fill="none" stroke="#f97316" stroke-width="2" />
        <path d="M40 82 C40 74 52 74 52 82" fill="none" stroke="#facc15" stroke-width="2" />
        <path d="M42 82 C42 76 50 76 50 82" fill="none" stroke="#22c55e" stroke-width="1.5" />
        <path d="M144 82 C144 70 164 70 164 82" fill="none" stroke="#ef4444" stroke-width="3" />
        <path d="M146 82 C146 72 162 72 162 82" fill="none" stroke="#f97316" stroke-width="2" />
        <path d="M148 82 C148 74 160 74 160 82" fill="none" stroke="#facc15" stroke-width="2" />
        <path d="M150 82 C150 76 158 76 158 82" fill="none" stroke="#22c55e" stroke-width="1.5" />
      </g>`;
  }

  // -----------------------------------------------------------------------
  // Đeo tay (wrist) — vẽ ở vùng chân trước / tay mèo
  // -----------------------------------------------------------------------
  let accessoryWristSvg = '';
  if (hasAccessory('vong-tay-vang')) {
    accessoryWristSvg += `
      <g class="cat-accessory-bracelet-gold">
        <ellipse cx="78" cy="188" rx="14" ry="5" fill="none" stroke="#fbbf24" stroke-width="4" />
      </g>`;
  }
  if (hasAccessory('vong-tay-ngoc')) {
    accessoryWristSvg += `
      <g class="cat-accessory-bracelet-jade">
        <ellipse cx="78" cy="188" rx="14" ry="5" fill="none" stroke="#10b981" stroke-width="4" />
      </g>`;
  }
  if (hasAccessory('dong-ho-cute')) {
    accessoryWristSvg += `
      <g class="cat-accessory-watch">
        <rect x="68" y="183" width="18" height="10" rx="3" fill="#f43f5e" stroke="#7f1d1d" stroke-width="2" />
        <circle cx="77" cy="188" r="4" fill="#fff" stroke="#7f1d1d" stroke-width="1" />
        <line x1="77" y1="186" x2="77" y2="188" stroke="#0f172a" stroke-width="1.5" />
        <line x1="77" y1="188" x2="79" y2="188" stroke="#0f172a" stroke-width="1.5" />
      </g>`;
  }
  if (hasAccessory('bang-tay-hero')) {
    accessoryWristSvg += `
      <g class="cat-accessory-hero-band">
        <rect x="67" y="183" width="20" height="10" rx="4" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
        <polygon points="77,185 79,189 84,190 80,193 81,198 77,196 73,198 74,193 70,190 75,189" fill="#facc15" stroke="#713f12" stroke-width="1" />
      </g>`;
  }

  // -----------------------------------------------------------------------
  // Đốm tam thể hoặc mặt nạ mèo Xiêm
  // -----------------------------------------------------------------------
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

  // -----------------------------------------------------------------------
  // Biểu cảm mắt theo tư thế
  // -----------------------------------------------------------------------
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
  <!-- [Layer 0] Đuôi & Trang trí đuôi -->
  <g class="cat-tail">
    <path d="M146 168 C182 164 190 128 170 112" fill="none" stroke="${ink}" stroke-width="16" stroke-linecap="round" />
    <path d="M146 168 C182 164 190 128 170 112" fill="none" stroke="${color.fur}" stroke-width="8" stroke-linecap="round" />
  </g>
  ${accessoryTailSvg}
  ${accessoryBackSvg}

  <!-- [Layer 1] Thân & Áo vest & Bụng -->
  <g class="cat-body">
    <ellipse cx="100" cy="160" rx="50" ry="34" fill="${color.fur}" stroke="${ink}" stroke-width="5" />
    ${accessoryBodySvg}
    <ellipse cx="100" cy="166" rx="26" ry="18" fill="${color.belly}" />
  </g>

  <!-- [Layer 1.5] Phụ kiện cổ (Khăn quàng / Vòng cổ) -->
  ${accessoryNeckSvg}

  <!-- [Layer 2] Chân & Vòng tay -->
  <g class="cat-feet">
    <ellipse class="cat-feet-left" cx="78" cy="190" rx="15" ry="9" fill="${color.fur}" stroke="${ink}" stroke-width="4" />
    <ellipse class="cat-feet-right" cx="122" cy="190" rx="15" ry="9" fill="${color.fur}" stroke="${ink}" stroke-width="4" />
  </g>
  ${accessoryWristSvg}

  <!-- [Layer 3] Đầu & Tai & Bông tai -->
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
    <!-- Bông tai (vẽ sau tai để hiện trên tai) -->
    ${accessoryEarSvg}
  </g>

  <!-- [Layer 4] Tay & Phụ ứng động tác -->
  ${pawsSvg}
</svg>
`.trim();
}
