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

// ---------------------------------------------------------------------------
// Màu lông — 20 màu (10 màu gốc + 10 màu mới)
// ---------------------------------------------------------------------------
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
  | 'bac-anh-trang' // Bạc ánh trăng lấp lánh
  // --- 10 màu bổ sung ---
  | 'xanh-bac-ha' // Xanh bạc hà mát lạnh
  | 'tim-oai' // Tím oải hương mộng mơ
  | 'cam-chay' // Cam cháy hoàng hôn
  | 'xanh-duong-bien' // Xanh dương biển sâu
  | 'vang-chanh' // Vàng chanh tươi sáng
  | 'hong-san-ho' // Hồng san hô ấm áp
  | 'nau-socola' // Nâu socola ngọt ngào
  | 'xanh-rong-bien' // Xanh rong biển huyền ảo
  | 'do-gach' // Đỏ gạch cổ điển
  | 'vang-kim'; // Vàng kim xa xỉ

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
// 11 Loại phụ kiện
// ---------------------------------------------------------------------------
export type CatAccessoryCategoryId =
  | 'no-cai-tai'
  | 'mu'
  | 'tai-nghe'
  | 'kinh'
  | 'bong-tai'
  | 'ngam-mieng'
  | 'khan-co'
  | 'deo-tay'
  | 'deo-lung'
  | 'trang-tri-duoi'
  | 'ao-vest';

export interface CatAccessoryCategoryDef {
  id: CatAccessoryCategoryId;
  name: string;
  icon: string;
}

export const CAT_ACCESSORY_CATEGORIES: CatAccessoryCategoryDef[] = [
  { id: 'no-cai-tai', name: 'Nơ cài tai', icon: '🎀' },
  { id: 'mu', name: 'Mũ & đồ đội đầu', icon: '🎩' },
  { id: 'tai-nghe', name: 'Tai nghe', icon: '🎧' },
  { id: 'kinh', name: 'Kính mắt', icon: '👓' },
  { id: 'bong-tai', name: 'Bông tai', icon: '💎' },
  { id: 'ngam-mieng', name: 'Ngậm miệng', icon: '🍀' },
  { id: 'khan-co', name: 'Khăn & vòng cổ', icon: '🧣' },
  { id: 'deo-tay', name: 'Đồ đeo tay', icon: '⌚' },
  { id: 'deo-lung', name: 'Đồ đeo lưng', icon: '🎒' },
  { id: 'trang-tri-duoi', name: 'Trang trí đuôi', icon: '✨' },
  { id: 'ao-vest', name: 'Áo vest & trang phục', icon: '👔' },
];

// ---------------------------------------------------------------------------
// 150 Phụ kiện chi tiết (11-18 món mỗi loại)
// ---------------------------------------------------------------------------
export type CatAccessoryId =
  // --- 1. Nơ cài tai (14) ---
  | 'no-hong'
  | 'no-do'
  | 'no-xanh'
  | 'no-tim'
  | 'no-vang'
  | 'no-bac-ha'
  | 'no-cau-vong'
  | 'no-da-quang'
  | 'no-kep-buom'
  | 'no-hoa-tuyet'
  | 'no-caro'
  | 'no-trai-tim'
  | 'no-ren-trang'
  | 'no-anh-kim'
  // --- 2. Mũ & đồ đội đầu (18) ---
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
  | 'mu-sinh-nhat'
  | 'vuong-mien-cong-chua'
  | 'mu-rom-mua-he'
  | 'mu-luoi-trai'
  | 'sung-unicorn'
  | 'mu-hai-tac'
  | 'mu-tho-bong'
  | 'vong-hoa-doi-dau'
  // --- 3. Tai nghe (12) ---
  | 'tai-nghe-gamer'
  | 'tai-nghe-nhac'
  | 'tai-nghe-meo'
  | 'tai-nghe-phi-cong'
  | 'tai-nghe-dj-neon'
  | 'tai-nghe-gau-truc'
  | 'tai-nghe-ngoi-sao'
  | 'tai-nghe-ech-xanh'
  | 'tai-nghe-retro'
  | 'tai-nghe-robot'
  | 'tai-nghe-bong-tuyet'
  | 'tai-nghe-trai-tim'
  // --- 4. Kính (14) ---
  | 'kinh-tri-thuc'
  | 'kinh-ram-ngau'
  | 'kinh-tim'
  | 'kinh-ngoi-sao'
  | 'kinh-cat-keo'
  | 'kinh-boi-lan'
  | 'kinh-mat-meo'
  | 'kinh-3d'
  | 'kinh-hoa-cuc'
  | 'kinh-cyberpunk'
  | 'kinh-nobita'
  | 'kinh-phi-cong'
  | 'kinh-ngan-ha'
  | 'kinh-doc-sach'
  // --- 5. Bông tai (13) ---
  | 'bong-tai-sao'
  | 'bong-tai-tim'
  | 'bong-tai-kim-cuong'
  | 'bong-tai-hoa'
  | 'bong-tai-cau-vong'
  | 'bong-tai-mat-trang'
  | 'bong-tai-not-nhac'
  | 'bong-tai-giot-nuoc'
  | 'bong-tai-cherry'
  | 'bong-tai-tia-chop'
  | 'bong-tai-buom-xanh'
  | 'bong-tai-keo-mut'
  | 'bong-tai-chuong-vang'
  // --- 6. Ngậm miệng (13) ---
  | 'co-bon-la'
  | 'ken-sao'
  | 'keo-棒'
  | 'bong-hong'
  | 'ngam-banh-quy'
  | 'ngam-ca-vang'
  | 'ngam-que-kem'
  | 'ngam-la-phong'
  | 'ngam-keo-bong'
  | 'ngam-but-chi'
  | 'ngam-thu-tinh'
  | 'ngam-banh-donut'
  | 'ngam-nhanh-o-liu'
  // --- 7. Khăn & vòng cổ (14) ---
  | 'khan-quang-do'
  | 'no-cham-bi'
  | 'von-co-ren'
  | 'khan-len-soc'
  | 'day-huy-chuong'
  | 'vong-co-ngoc'
  | 'vong-luc-lac'
  | 'khan-ran-nam-bo'
  | 'no-buom-da-hoi'
  | 'vong-hoa-hawaii'
  | 'khan-len-tuyet'
  | 'vong-co-chuong-bac'
  | 'ca-vat-hoc-sinh'
  | 'vong-co-trai-tim'
  // --- 8. Đồ đeo tay (12) ---
  | 'vong-tay-vang'
  | 'vong-tay-ngoc'
  | 'dong-ho-cute'
  | 'bang-tay-hero'
  | 'vong-hat-cau-vong'
  | 'dong-ho-thong-minh'
  | 'vong-hoa-tay'
  | 'bang-do-the-thao'
  | 'gang-tay-len'
  | 'lac-tay-chuong'
  | 'vong-tay-da-quang'
  | 'gang-tay-dam-boc'
  // --- 9. Đồ đeo lưng (14) ---
  | 'balo-tho'
  | 'canh-thien-than'
  | 'ao-choang-hero'
  | 'canh-ca'
  | 'canh-bat-buom'
  | 'balo-vu-tru'
  | 'canh-rong-lua'
  | 'balo-phan-luc'
  | 'canh-doi-dem'
  | 'balo-gau-bong'
  | 'mai-rua-xanh'
  | 'hop-dan-guitar'
  | 'kiem-hiep-si'
  | 'bong-bay-chum'
  // --- 10. Trang trí đuôi (11) ---
  | 'no-duoi'
  | 'duoi-sao'
  | 'duoi-phep-thuat'
  | 'luc-lac-duoi'
  | 'hoa-cai-duoi'
  | 'duoi-ngon-lua'
  | 'duoi-sam-set'
  | 'duoi-bang-tuyet'
  | 'duoi-bong-bay'
  | 'duoi-trai-tim'
  | 'duoi-cai-no-vang'
  // --- 11. Áo vest & trang phục (15) ---
  | 'ao-vest-do'
  | 'ao-vest-xanh'
  | 'ao-somi-trang'
  | 'ao-hoa'
  | 'ao-phi-hanh-gia'
  | 'ao-len-giang-sinh'
  | 'ao-yem-bo'
  | 'ao-dai-tet'
  | 'ao-hoodie'
  | 'ao-bong-da'
  | 'ao-bac-si'
  | 'ao-tham-tu'
  | 'ao-kimono'
  | 'ao-sieu-nhan'
  | 'ao-da-hoi';

export interface CatAccessoryDef {
  id: CatAccessoryId;
  name: string;
  slot: 'head' | 'face' | 'back' | 'neck' | 'ear' | 'wrist' | 'tail' | 'body';
  category: CatAccessoryCategoryId;
}

export const CAT_ACCESSORIES: Record<CatAccessoryId, CatAccessoryDef> = {
  // 1. Nơ cài tai (14)
  'no-hong': { id: 'no-hong', name: 'Nơ hồng Miu', slot: 'head', category: 'no-cai-tai' },
  'no-do': { id: 'no-do', name: 'Nơ đỏ chấm bi', slot: 'head', category: 'no-cai-tai' },
  'no-xanh': { id: 'no-xanh', name: 'Nơ xanh lá tươi', slot: 'head', category: 'no-cai-tai' },
  'no-tim': { id: 'no-tim', name: 'Nơ tím mộng mơ', slot: 'head', category: 'no-cai-tai' },
  'no-vang': { id: 'no-vang', name: 'Nơ vàng óng ánh', slot: 'head', category: 'no-cai-tai' },
  'no-bac-ha': { id: 'no-bac-ha', name: 'Nơ bạc hà mát dịu', slot: 'head', category: 'no-cai-tai' },
  'no-cau-vong': {
    id: 'no-cau-vong',
    name: 'Nơ 7 sắc cầu vồng',
    slot: 'head',
    category: 'no-cai-tai',
  },
  'no-da-quang': {
    id: 'no-da-quang',
    name: 'Nơ dạ quang neon',
    slot: 'head',
    category: 'no-cai-tai',
  },
  'no-kep-buom': {
    id: 'no-kep-buom',
    name: 'Kẹp nơ bướm xinh',
    slot: 'head',
    category: 'no-cai-tai',
  },
  'no-hoa-tuyet': {
    id: 'no-hoa-tuyet',
    name: 'Nơ hoa tuyết trắng',
    slot: 'head',
    category: 'no-cai-tai',
  },
  'no-caro': { id: 'no-caro', name: 'Nơ caro học sinh', slot: 'head', category: 'no-cai-tai' },
  'no-trai-tim': {
    id: 'no-trai-tim',
    name: 'Nơ trái tim hồng',
    slot: 'head',
    category: 'no-cai-tai',
  },
  'no-ren-trang': {
    id: 'no-ren-trang',
    name: 'Nơ ren công chúa',
    slot: 'head',
    category: 'no-cai-tai',
  },
  'no-anh-kim': {
    id: 'no-anh-kim',
    name: 'Nơ ánh kim lấp lánh',
    slot: 'head',
    category: 'no-cai-tai',
  },

  // 2. Mũ & đồ đội đầu (18)
  'mu-cu-nhan': { id: 'mu-cu-nhan', name: 'Mũ cử nhân tốt nghiệp', slot: 'head', category: 'mu' },
  'mu-phot': { id: 'mu-phot', name: 'Mũ phớt thám tử', slot: 'head', category: 'mu' },
  'vuong-mien-sao': {
    id: 'vuong-mien-sao',
    name: 'Vương miện sao vàng',
    slot: 'head',
    category: 'mu',
  },
  'mu-len-bong': { id: 'mu-len-bong', name: 'Mũ len quả bông ấm', slot: 'head', category: 'mu' },
  'mu-dau-bep': { id: 'mu-dau-bep', name: 'Mũ đầu bếp tí hon', slot: 'head', category: 'mu' },
  'sung-tuan-loc': {
    id: 'sung-tuan-loc',
    name: 'Sừng tuần lộc Giáng sinh',
    slot: 'head',
    category: 'mu',
  },
  'mu-kowboy': { id: 'mu-kowboy', name: 'Mũ cao bồi miền Tây', slot: 'head', category: 'mu' },
  'mu-phap-su': { id: 'mu-phap-su', name: 'Mũ phù thủy bóng đêm', slot: 'head', category: 'mu' },
  'mu-beret': { id: 'mu-beret', name: 'Mũ beret họa sĩ Pháp', slot: 'head', category: 'mu' },
  'mu-bao-hiem': { id: 'mu-bao-hiem', name: 'Mũ phi hành gia', slot: 'head', category: 'mu' },
  'mu-sinh-nhat': {
    id: 'mu-sinh-nhat',
    name: 'Mũ chóp sinh nhật vui',
    slot: 'head',
    category: 'mu',
  },
  'vuong-mien-cong-chua': {
    id: 'vuong-mien-cong-chua',
    name: 'Vương miện công chúa',
    slot: 'head',
    category: 'mu',
  },
  'mu-rom-mua-he': {
    id: 'mu-rom-mua-he',
    name: 'Mũ rơm hướng dương hè',
    slot: 'head',
    category: 'mu',
  },
  'mu-luoi-trai': {
    id: 'mu-luoi-trai',
    name: 'Mũ lưỡi trai thể thao',
    slot: 'head',
    category: 'mu',
  },
  'sung-unicorn': { id: 'sung-unicorn', name: 'Sừng kỳ lân 7 màu', slot: 'head', category: 'mu' },
  'mu-hai-tac': {
    id: 'mu-hai-tac',
    name: 'Mũ thuyền trưởng cướp biển',
    slot: 'head',
    category: 'mu',
  },
  'mu-tho-bong': { id: 'mu-tho-bong', name: 'Mũ len tai thỏ nhung', slot: 'head', category: 'mu' },
  'vong-hoa-doi-dau': {
    id: 'vong-hoa-doi-dau',
    name: 'Vòng hoa đào đội đầu',
    slot: 'head',
    category: 'mu',
  },

  // 3. Tai nghe (12)
  'tai-nghe-gamer': {
    id: 'tai-nghe-gamer',
    name: 'Tai nghe gaming Pro',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-nhac': {
    id: 'tai-nghe-nhac',
    name: 'Tai nghe nhạc dâu hồng',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-meo': {
    id: 'tai-nghe-meo',
    name: 'Tai nghe gắn tai mèo',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-phi-cong': {
    id: 'tai-nghe-phi-cong',
    name: 'Tai nghe phi công bầu trời',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-dj-neon': {
    id: 'tai-nghe-dj-neon',
    name: 'Tai nghe DJ phát sáng',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-gau-truc': {
    id: 'tai-nghe-gau-truc',
    name: 'Tai nghe gấu trúc tròn',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-ngoi-sao': {
    id: 'tai-nghe-ngoi-sao',
    name: 'Tai nghe ngôi sao vàng',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-ech-xanh': {
    id: 'tai-nghe-ech-xanh',
    name: 'Tai nghe chú ếch cốm',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-retro': {
    id: 'tai-nghe-retro',
    name: 'Tai nghe vintage vàng kim',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-robot': {
    id: 'tai-nghe-robot',
    name: 'Tai nghe robot tương lai',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-bong-tuyet': {
    id: 'tai-nghe-bong-tuyet',
    name: 'Bịt tai mùa đông lông trắng',
    slot: 'head',
    category: 'tai-nghe',
  },
  'tai-nghe-trai-tim': {
    id: 'tai-nghe-trai-tim',
    name: 'Tai nghe trái tim đôi',
    slot: 'head',
    category: 'tai-nghe',
  },

  // 4. Kính mắt (14)
  'kinh-tri-thuc': {
    id: 'kinh-tri-thuc',
    name: 'Kính tròn trí thức',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-ram-ngau': {
    id: 'kinh-ram-ngau',
    name: 'Kính râm phi công ngầu',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-tim': { id: 'kinh-tim', name: 'Kính gọng trái tim', slot: 'face', category: 'kinh' },
  'kinh-ngoi-sao': {
    id: 'kinh-ngoi-sao',
    name: 'Kính ngôi sao sân khấu',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-cat-keo': {
    id: 'kinh-cat-keo',
    name: 'Kính kẹo ngọt đa sắc',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-boi-lan': {
    id: 'kinh-boi-lan',
    name: 'Kính bơi lặn biển sâu',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-mat-meo': {
    id: 'kinh-mat-meo',
    name: 'Kính mắt mèo thời thượng',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-3d': { id: 'kinh-3d', name: 'Kính 3D rạp chiếu phim', slot: 'face', category: 'kinh' },
  'kinh-hoa-cuc': {
    id: 'kinh-hoa-cuc',
    name: 'Kính gọng hoa cúc vàng',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-cyberpunk': {
    id: 'kinh-cyberpunk',
    name: 'Kính tương lai Cyberpunk',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-nobita': {
    id: 'kinh-nobita',
    name: 'Kính gọng tròn Nobita',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-phi-cong': {
    id: 'kinh-phi-cong',
    name: 'Kính phi công mạ vàng',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-ngan-ha': {
    id: 'kinh-ngan-ha',
    name: 'Kính dải ngân hà huyền bí',
    slot: 'face',
    category: 'kinh',
  },
  'kinh-doc-sach': {
    id: 'kinh-doc-sach',
    name: 'Kính nửa viền đọc sách',
    slot: 'face',
    category: 'kinh',
  },

  // 5. Bông tai (13)
  'bong-tai-sao': {
    id: 'bong-tai-sao',
    name: 'Bông tai ngôi sao vàng',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-tim': {
    id: 'bong-tai-tim',
    name: 'Bông tai ruby trái tim',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-kim-cuong': {
    id: 'bong-tai-kim-cuong',
    name: 'Bông tai kim cương lam',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-hoa': {
    id: 'bong-tai-hoa',
    name: 'Bông tai hoa anh đào',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-cau-vong': {
    id: 'bong-tai-cau-vong',
    name: 'Bông tai cầu vồng nhỏ',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-mat-trang': {
    id: 'bong-tai-mat-trang',
    name: 'Bông tai trăng khuyết bạc',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-not-nhac': {
    id: 'bong-tai-not-nhac',
    name: 'Bông tai nốt nhạc vui',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-giot-nuoc': {
    id: 'bong-tai-giot-nuoc',
    name: 'Bông tai ngọc bích nước',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-cherry': {
    id: 'bong-tai-cherry',
    name: 'Bông tai quả cherry đỏ',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-tia-chop': {
    id: 'bong-tai-tia-chop',
    name: 'Bông tai tia chớp vàng',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-buom-xanh': {
    id: 'bong-tai-buom-xanh',
    name: 'Bông tai cánh bướm biếc',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-keo-mut': {
    id: 'bong-tai-keo-mut',
    name: 'Bông tai kẹo que xoắn',
    slot: 'ear',
    category: 'bong-tai',
  },
  'bong-tai-chuong-vang': {
    id: 'bong-tai-chuong-vang',
    name: 'Bông tai chuông leng keng',
    slot: 'ear',
    category: 'bong-tai',
  },

  // 6. Ngậm miệng (13)
  'co-bon-la': {
    id: 'co-bon-la',
    name: 'Nhánh cỏ 4 lá may mắn',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ken-sao': { id: 'ken-sao', name: 'Cây sáo tre tí hon', slot: 'face', category: 'ngam-mieng' },
  'keo-棒': { id: 'keo-棒', name: 'Kẹo mút dâu ngọt ngào', slot: 'face', category: 'ngam-mieng' },
  'bong-hong': {
    id: 'bong-hong',
    name: 'Cành hoa hồng kiêu sa',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ngam-banh-quy': {
    id: 'ngam-banh-quy',
    name: 'Bánh quy bơ socola giòn',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ngam-ca-vang': {
    id: 'ngam-ca-vang',
    name: 'Chú cá nhỏ vàng cam',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ngam-que-kem': {
    id: 'ngam-que-kem',
    name: 'Que kem ốc quế mát lạnh',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ngam-la-phong': {
    id: 'ngam-la-phong',
    name: 'Chiếc lá phong mùa thu',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ngam-keo-bong': {
    id: 'ngam-keo-bong',
    name: 'Kẹo bông gòn mây hồng',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ngam-but-chi': {
    id: 'ngam-but-chi',
    name: 'Bút chì chăm chỉ học tập',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ngam-thu-tinh': {
    id: 'ngam-thu-tinh',
    name: 'Lá thư gửi lời yêu thương',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ngam-banh-donut': {
    id: 'ngam-banh-donut',
    name: 'Bánh Donut phủ đường dâu',
    slot: 'face',
    category: 'ngam-mieng',
  },
  'ngam-nhanh-o-liu': {
    id: 'ngam-nhanh-o-liu',
    name: 'Nhành ô liu hòa bình',
    slot: 'face',
    category: 'ngam-mieng',
  },

  // 7. Khăn & vòng cổ (14)
  'khan-quang-do': {
    id: 'khan-quang-do',
    name: 'Khăn quàng đỏ Đội viên',
    slot: 'neck',
    category: 'khan-co',
  },
  'no-cham-bi': {
    id: 'no-cham-bi',
    name: 'Nơ cổ quý tộc chấm bi',
    slot: 'neck',
    category: 'khan-co',
  },
  'von-co-ren': {
    id: 'von-co-ren',
    name: 'Viền đăng ten tiểu thư',
    slot: 'neck',
    category: 'khan-co',
  },
  'khan-len-soc': {
    id: 'khan-len-soc',
    name: 'Khăn len sọc ấm áp',
    slot: 'neck',
    category: 'khan-co',
  },
  'day-huy-chuong': {
    id: 'day-huy-chuong',
    name: 'Huy chương vàng vô địch',
    slot: 'neck',
    category: 'khan-co',
  },
  'vong-co-ngoc': {
    id: 'vong-co-ngoc',
    name: 'Vòng cổ chuỗi ngọc trai',
    slot: 'neck',
    category: 'khan-co',
  },
  'vong-luc-lac': {
    id: 'vong-luc-lac',
    name: 'Vòng chuông lục lạc vàng',
    slot: 'neck',
    category: 'khan-co',
  },
  'khan-ran-nam-bo': {
    id: 'khan-ran-nam-bo',
    name: 'Khăn rằn Nam Bộ thân thương',
    slot: 'neck',
    category: 'khan-co',
  },
  'no-buom-da-hoi': {
    id: 'no-buom-da-hoi',
    name: 'Nơ bướm dạ tiệc đen sang',
    slot: 'neck',
    category: 'khan-co',
  },
  'vong-hoa-hawaii': {
    id: 'vong-hoa-hawaii',
    name: 'Vòng hoa nhiệt đới Hawaii',
    slot: 'neck',
    category: 'khan-co',
  },
  'khan-len-tuyet': {
    id: 'khan-len-tuyet',
    name: 'Khăn len họa tiết bông tuyết',
    slot: 'neck',
    category: 'khan-co',
  },
  'vong-co-chuong-bac': {
    id: 'vong-co-chuong-bac',
    name: 'Vòng da chuông bạc leng keng',
    slot: 'neck',
    category: 'khan-co',
  },
  'ca-vat-hoc-sinh': {
    id: 'ca-vat-hoc-sinh',
    name: 'Cà vạt kẻ sọc học sinh giỏi',
    slot: 'neck',
    category: 'khan-co',
  },
  'vong-co-trai-tim': {
    id: 'vong-co-trai-tim',
    name: 'Dây chuyền mặt trái tim',
    slot: 'neck',
    category: 'khan-co',
  },

  // 8. Đồ đeo tay (12)
  'vong-tay-vang': {
    id: 'vong-tay-vang',
    name: 'Vòng tay vàng may mắn',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'vong-tay-ngoc': {
    id: 'vong-tay-ngoc',
    name: 'Vòng tay cẩm thạch xanh',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'dong-ho-cute': {
    id: 'dong-ho-cute',
    name: 'Đồng hồ gấu bông dâu',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'bang-tay-hero': {
    id: 'bang-tay-hero',
    name: 'Băng tay năng lượng siêu nhân',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'vong-hat-cau-vong': {
    id: 'vong-hat-cau-vong',
    name: 'Vòng hạt pha lê cầu vồng',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'dong-ho-thong-minh': {
    id: 'dong-ho-thong-minh',
    name: 'Đồng hồ thông minh Smartwatch',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'vong-hoa-tay': {
    id: 'vong-hoa-tay',
    name: 'Vòng hoa cài cổ tay',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'bang-do-the-thao': {
    id: 'bang-do-the-thao',
    name: 'Băng cổ tay thể thao cam',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'gang-tay-len': {
    id: 'gang-tay-len',
    name: 'Găng tay len mùa đông',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'lac-tay-chuong': {
    id: 'lac-tay-chuong',
    name: 'Lắc tay chuông ngân vàng',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'vong-tay-da-quang': {
    id: 'vong-tay-da-quang',
    name: 'Vòng tay dạ quang phát sáng',
    slot: 'wrist',
    category: 'deo-tay',
  },
  'gang-tay-dam-boc': {
    id: 'gang-tay-dam-boc',
    name: 'Găng boxing vô địch đỏ',
    slot: 'wrist',
    category: 'deo-tay',
  },

  // 9. Đồ đeo lưng (14)
  'balo-tho': {
    id: 'balo-tho',
    name: 'Balo tai thỏ hồng xinh',
    slot: 'back',
    category: 'deo-lung',
  },
  'canh-thien-than': {
    id: 'canh-thien-than',
    name: 'Đôi cánh thiên thần trắng',
    slot: 'back',
    category: 'deo-lung',
  },
  'ao-choang-hero': {
    id: 'ao-choang-hero',
    name: 'Áo choàng đỏ siêu nhân',
    slot: 'back',
    category: 'deo-lung',
  },
  'canh-ca': { id: 'canh-ca', name: 'Đôi cánh nàng tiên cá', slot: 'back', category: 'deo-lung' },
  'canh-bat-buom': {
    id: 'canh-bat-buom',
    name: 'Cánh bướm tiên phép thuật',
    slot: 'back',
    category: 'deo-lung',
  },
  'balo-vu-tru': {
    id: 'balo-vu-tru',
    name: 'Bình dưỡng khí vũ trụ',
    slot: 'back',
    category: 'deo-lung',
  },
  'canh-rong-lua': {
    id: 'canh-rong-lua',
    name: 'Cánh rồng lửa dũng cảm',
    slot: 'back',
    category: 'deo-lung',
  },
  'balo-phan-luc': {
    id: 'balo-phan-luc',
    name: 'Tên lửa phản lực bay lượn',
    slot: 'back',
    category: 'deo-lung',
  },
  'canh-doi-dem': {
    id: 'canh-doi-dem',
    name: 'Đôi cánh dơi đêm kỳ bí',
    slot: 'back',
    category: 'deo-lung',
  },
  'balo-gau-bong': {
    id: 'balo-gau-bong',
    name: 'Balo gấu con màu nâu',
    slot: 'back',
    category: 'deo-lung',
  },
  'mai-rua-xanh': {
    id: 'mai-rua-xanh',
    name: 'Mai rùa Ninja xanh ngọc',
    slot: 'back',
    category: 'deo-lung',
  },
  'hop-dan-guitar': {
    id: 'hop-dan-guitar',
    name: 'Bao đàn guitar nghệ sĩ',
    slot: 'back',
    category: 'deo-lung',
  },
  'kiem-hiep-si': {
    id: 'kiem-hiep-si',
    name: 'Thanh kiếm gỗ hiệp sĩ',
    slot: 'back',
    category: 'deo-lung',
  },
  'bong-bay-chum': {
    id: 'bong-bay-chum',
    name: 'Chùm bóng bay sắc màu',
    slot: 'back',
    category: 'deo-lung',
  },

  // 10. Trang trí đuôi (11)
  'no-duoi': {
    id: 'no-duoi',
    name: 'Nơ hồng buộc chóp đuôi',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'duoi-sao': {
    id: 'duoi-sao',
    name: 'Ngôi sao vàng gắn đuôi',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'duoi-phep-thuat': {
    id: 'duoi-phep-thuat',
    name: 'Bụi sao phép thuật phát sáng',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'luc-lac-duoi': {
    id: 'luc-lac-duoi',
    name: 'Chuông lục lạc rung rinh',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'hoa-cai-duoi': {
    id: 'hoa-cai-duoi',
    name: 'Bông hoa hướng dương đuôi',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'duoi-ngon-lua': {
    id: 'duoi-ngon-lua',
    name: 'Ngọn lửa năng lượng cam',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'duoi-sam-set': {
    id: 'duoi-sam-set',
    name: 'Tia sét thần tốc vàng rực',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'duoi-bang-tuyet': {
    id: 'duoi-bang-tuyet',
    name: 'Tinh thể băng tuyết xanh',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'duoi-bong-bay': {
    id: 'duoi-bong-bay',
    name: 'Quả bóng bay đỏ buộc đuôi',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'duoi-trai-tim': {
    id: 'duoi-trai-tim',
    name: 'Trái tim hồng lấp lánh',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },
  'duoi-cai-no-vang': {
    id: 'duoi-cai-no-vang',
    name: 'Nơ chuông vàng rực rỡ',
    slot: 'tail',
    category: 'trang-tri-duoi',
  },

  // 11. Áo vest & trang phục (15)
  'ao-vest-do': {
    id: 'ao-vest-do',
    name: 'Áo vest dạ hội đỏ nhung',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-vest-xanh': {
    id: 'ao-vest-xanh',
    name: 'Áo vest xanh học sinh thanh lịch',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-somi-trang': {
    id: 'ao-somi-trang',
    name: 'Áo sơ mi trắng tinh khôi',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-hoa': { id: 'ao-hoa', name: 'Áo hoa mùa hè rực rỡ', slot: 'body', category: 'ao-vest' },
  'ao-phi-hanh-gia': {
    id: 'ao-phi-hanh-gia',
    name: 'Bộ giáp phi hành gia vũ trụ',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-len-giang-sinh': {
    id: 'ao-len-giang-sinh',
    name: 'Áo len tuần lộc Giáng sinh',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-yem-bo': {
    id: 'ao-yem-bo',
    name: 'Áo yếm bò jean tinh nghịch',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-dai-tet': {
    id: 'ao-dai-tet',
    name: 'Áo dài Tết truyền thống gấm đỏ',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-hoodie': {
    id: 'ao-hoodie',
    name: 'Áo hoodie đường phố năng động',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-bong-da': {
    id: 'ao-bong-da',
    name: 'Áo bóng đá số 10 cờ sao',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-bac-si': { id: 'ao-bac-si', name: 'Áo blouse bác sĩ nhí', slot: 'body', category: 'ao-vest' },
  'ao-tham-tu': {
    id: 'ao-tham-tu',
    name: 'Áo măng tô thám tử Sherlock',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-kimono': {
    id: 'ao-kimono',
    name: 'Áo Kimono hoa đào thắt nơ',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-sieu-nhan': {
    id: 'ao-sieu-nhan',
    name: 'Chiến giáp siêu nhân tia chớp',
    slot: 'body',
    category: 'ao-vest',
  },
  'ao-da-hoi': {
    id: 'ao-da-hoi',
    name: 'Váy dạ tiệc đính kim sa',
    slot: 'body',
    category: 'ao-vest',
  },
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

// ---------------------------------------------------------------------------
// Từ điển SVG các lớp phụ kiện
// ---------------------------------------------------------------------------
const ink = '#1f1a33';

const TAIL_ACCESSORIES: Record<string, string> = {
  'no-duoi': `
    <g class="cat-accessory-tail-bow" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round">
      <path d="M178 118 L170 110 L172 122 Z" fill="#f472b6" />
      <path d="M178 118 L188 112 L186 124 Z" fill="#f472b6" />
      <circle cx="178" cy="118" r="4" fill="#fbcfe8" />
    </g>`,
  'duoi-sao': `
    <g class="cat-accessory-tail-star">
      <polygon points="178,106 181,114 190,115 184,121 186,130 178,126 170,130 172,121 166,115 175,114" fill="#facc15" stroke="#713f12" stroke-width="2" />
    </g>`,
  'duoi-phep-thuat': `
    <g class="cat-accessory-tail-magic">
      <circle cx="172" cy="112" r="8" fill="#a78bfa" opacity="0.7" />
      <circle cx="176" cy="108" r="5" fill="#c084fc" opacity="0.8" />
      <circle cx="169" cy="116" r="3" fill="#f0abfc" />
    </g>`,
  'luc-lac-duoi': `
    <g class="cat-accessory-tail-bell" stroke="#854d0e" stroke-width="2">
      <circle cx="174" cy="114" r="7" fill="#fbbf24" />
      <circle cx="174" cy="117" r="1.5" fill="#713f12" />
      <path d="M171 114 H177" stroke="#713f12" stroke-width="1.5" />
    </g>`,
  'hoa-cai-duoi': `
    <g class="cat-accessory-tail-flower">
      <circle cx="172" cy="114" r="6" fill="#f59e0b" />
      <circle cx="172" cy="107" r="4" fill="#fde047" />
      <circle cx="178" cy="111" r="4" fill="#fde047" />
      <circle cx="178" cy="117" r="4" fill="#fde047" />
      <circle cx="172" cy="120" r="4" fill="#fde047" />
      <circle cx="166" cy="117" r="4" fill="#fde047" />
      <circle cx="166" cy="111" r="4" fill="#fde047" />
      <circle cx="172" cy="114" r="3" fill="#78350f" />
    </g>`,
  'duoi-ngon-lua': `
    <g class="cat-accessory-tail-fire">
      <path d="M170 120 C165 105 185 95 180 88 C190 102 188 122 170 120 Z" fill="#f97316" />
      <path d="M172 118 C168 108 180 102 178 96 C184 105 182 118 172 118 Z" fill="#facc15" />
    </g>`,
  'duoi-sam-set': `
    <g class="cat-accessory-tail-lightning">
      <polygon points="176,96 168,110 174,111 166,126 182,108 175,107" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
    </g>`,
  'duoi-bang-tuyet': `
    <g class="cat-accessory-tail-ice" stroke="#0284c7" stroke-width="2" fill="none">
      <line x1="172" y1="104" x2="172" y2="124" />
      <line x1="162" y1="114" x2="182" y2="114" />
      <line x1="165" y1="107" x2="179" y2="121" />
      <line x1="165" y1="121" x2="179" y2="107" />
      <circle cx="172" cy="114" r="3" fill="#bae6fd" />
    </g>`,
  'duoi-bong-bay': `
    <g class="cat-accessory-tail-balloon">
      <path d="M170 114 Q160 80 156 50" stroke="#64748b" stroke-width="1.5" fill="none" stroke-dasharray="2,2" />
      <ellipse cx="156" cy="40" rx="12" ry="15" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
      <polygon points="156,54 153,58 159,58" fill="#b91c1c" />
    </g>`,
  'duoi-trai-tim': `
    <g class="cat-accessory-tail-heart">
      <path d="M172 108 C172 102 178 98 183 103 C188 98 194 102 194 108 C194 116 183 124 183 124 C183 124 172 116 172 108 Z" fill="#ec4899" stroke="#be185d" stroke-width="1.5" />
    </g>`,
  'duoi-cai-no-vang': `
    <g class="cat-accessory-tail-gold-bow" stroke="#854d0e" stroke-width="2">
      <path d="M176 116 L168 108 L170 120 Z" fill="#fbbf24" />
      <path d="M176 116 L184 108 L182 120 Z" fill="#fbbf24" />
      <circle cx="176" cy="116" r="3.5" fill="#fef08a" />
    </g>`,
};

const BACK_ACCESSORIES: Record<string, string> = {
  'balo-tho': `
    <g class="cat-accessory-backpack" stroke="${ink}" stroke-width="3">
      <rect x="52" y="136" width="24" height="36" rx="8" fill="#f472b6" />
      <ellipse cx="58" cy="126" rx="4" ry="12" fill="#fbcfe8" />
      <ellipse cx="68" cy="126" rx="4" ry="12" fill="#fbcfe8" />
    </g>`,
  'canh-thien-than': `
    <g class="cat-accessory-wings" stroke="#38bdf8" stroke-width="3" fill="#e0f2fe">
      <path d="M48 136 C24 116 10 136 28 156 C38 162 48 150 48 144 Z" />
      <path d="M152 136 C176 116 190 136 172 156 C162 162 152 150 152 144 Z" />
    </g>`,
  'ao-choang-hero': `
    <g class="cat-accessory-cape" stroke="#991b1b" stroke-width="3">
      <path d="M60 148 L36 196 L164 196 L140 148 Z" fill="#ef4444" />
    </g>`,
  'canh-ca': `
    <g class="cat-accessory-mermaid" stroke="#0e7490" stroke-width="2.5">
      <path d="M48 140 C20 128 16 148 30 160 C40 166 48 156 48 148 Z" fill="#22d3ee" />
      <path d="M152 140 C180 128 184 148 170 160 C160 166 152 156 152 148 Z" fill="#22d3ee" />
    </g>`,
  'canh-bat-buom': `
    <g class="cat-accessory-butterfly" stroke="#7c3aed" stroke-width="2">
      <path d="M50 130 C20 100 8 130 30 150 C42 156 52 140 50 132 Z" fill="#c084fc" />
      <path d="M150 130 C180 100 192 130 170 150 C158 156 148 140 150 132 Z" fill="#f0abfc" />
      <circle cx="50" cy="131" r="4" fill="#7c3aed" />
      <circle cx="150" cy="131" r="4" fill="#7c3aed" />
    </g>`,
  'balo-vu-tru': `
    <g class="cat-accessory-spacepack" stroke="${ink}" stroke-width="3">
      <rect x="50" y="130" width="28" height="42" rx="6" fill="#1e293b" />
      <rect x="54" y="134" width="8" height="8" rx="2" fill="#38bdf8" />
      <rect x="66" y="134" width="8" height="8" rx="2" fill="#34d399" />
    </g>`,
  'canh-rong-lua': `
    <g class="cat-accessory-dragon-wings" stroke="#7f1d1d" stroke-width="3" fill="#dc2626">
      <path d="M46 136 C16 106 4 126 18 150 C26 158 42 154 48 144 Z" />
      <path d="M154 136 C184 106 196 126 182 150 C174 158 158 154 152 144 Z" />
    </g>`,
  'balo-phan-luc': `
    <g class="cat-accessory-jetpack" stroke="${ink}" stroke-width="2.5">
      <rect x="48" y="132" width="14" height="38" rx="7" fill="#94a3b8" />
      <rect x="138" y="132" width="14" height="38" rx="7" fill="#94a3b8" />
      <polygon points="48,170 55,186 62,170" fill="#f97316" />
      <polygon points="138,170 145,186 152,170" fill="#f97316" />
    </g>`,
  'canh-doi-dem': `
    <g class="cat-accessory-bat-wings" stroke="${ink}" stroke-width="2.5" fill="#1e1b4b">
      <path d="M48 138 C14 116 8 138 22 154 Q36 150 48 142 Z" />
      <path d="M152 138 C186 116 192 138 178 154 Q164 150 152 142 Z" />
    </g>`,
  'balo-gau-bong': `
    <g class="cat-accessory-bearpack" stroke="#78350f" stroke-width="2.5">
      <rect x="52" y="138" width="24" height="32" rx="10" fill="#b45309" />
      <circle cx="56" cy="136" r="5" fill="#92400e" />
      <circle cx="72" cy="136" r="5" fill="#92400e" />
    </g>`,
  'mai-rua-xanh': `
    <g class="cat-accessory-turtle-shell" stroke="#065f46" stroke-width="3">
      <ellipse cx="44" cy="154" rx="16" ry="24" fill="#10b981" />
      <path d="M38 140 L50 154 L38 168" stroke="#047857" stroke-width="2" fill="none" />
    </g>`,
  'hop-dan-guitar': `
    <g class="cat-accessory-guitar" stroke="#451a03" stroke-width="2.5">
      <path d="M50 120 L40 180 L56 182 L64 122 Z" fill="#78350f" rx="4" />
      <circle cx="48" cy="166" r="10" fill="#92400e" />
    </g>`,
  'kiem-hiep-si': `
    <g class="cat-accessory-sword" stroke="#713f12" stroke-width="2.5">
      <rect x="42" y="116" width="6" height="58" rx="2" fill="#d4d4d8" />
      <rect x="36" y="160" width="18" height="6" rx="2" fill="#ca8a04" />
    </g>`,
  'bong-bay-chum': `
    <g class="cat-accessory-balloons">
      <circle cx="42" cy="110" r="12" fill="#ef4444" opacity="0.9" />
      <circle cx="34" cy="124" r="11" fill="#3b82f6" opacity="0.9" />
      <circle cx="50" cy="124" r="10" fill="#facc15" opacity="0.9" />
      <path d="M42 122 L56 150 M34 135 L56 150 M50 134 L56 150" stroke="#94a3b8" stroke-width="1.5" />
    </g>`,
};

const BODY_ACCESSORIES: Record<string, string> = {
  'ao-vest-do': `
    <g class="cat-accessory-vest-red" stroke="#7f1d1d" stroke-width="3">
      <path d="M72 148 L72 185 L100 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#ef4444" />
      <path d="M100 158 L100 185" stroke="#991b1b" stroke-width="2" />
    </g>`,
  'ao-vest-xanh': `
    <g class="cat-accessory-vest-blue" stroke="#1e40af" stroke-width="3">
      <path d="M72 148 L72 185 L100 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#3b82f6" />
      <path d="M100 158 L100 185" stroke="#1d4ed8" stroke-width="2" />
      <rect x="90" y="162" width="8" height="10" rx="2" fill="#ffffff" />
    </g>`,
  'ao-somi-trang': `
    <g class="cat-accessory-shirt" stroke="#cbd5e1" stroke-width="3">
      <path d="M72 148 L72 185 L100 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#ffffff" />
      <circle cx="100" cy="165" r="2.5" fill="#94a3b8" />
      <circle cx="100" cy="173" r="2.5" fill="#94a3b8" />
    </g>`,
  'ao-hoa': `
    <g class="cat-accessory-floral" stroke="#16a34a" stroke-width="2.5">
      <path d="M72 148 L72 185 L100 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#dcfce7" />
      <circle cx="84" cy="162" r="4" fill="#f472b6" />
      <circle cx="100" cy="168" r="4" fill="#fb923c" />
      <circle cx="116" cy="162" r="4" fill="#f472b6" />
    </g>`,
  'ao-phi-hanh-gia': `
    <g class="cat-accessory-spacesuit" stroke="#475569" stroke-width="3">
      <path d="M70 148 L70 185 L130 185 L130 148 Q100 160 70 148 Z" fill="#e2e8f0" />
      <rect x="84" y="155" width="32" height="22" rx="6" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2" />
    </g>`,
  'ao-len-giang-sinh': `
    <g class="cat-accessory-xmas-sweater" stroke="#14532d" stroke-width="2.5">
      <path d="M72 148 L72 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#15803d" />
      <polygon points="100,154 94,166 106,166" fill="#ef4444" />
      <line x1="74" y1="172" x2="126" y2="172" stroke="#fff" stroke-width="2" stroke-dasharray="3,3" />
    </g>`,
  'ao-yem-bo': `
    <g class="cat-accessory-dungarees" stroke="#1e3a8a" stroke-width="3">
      <path d="M74 156 L74 185 L126 185 L126 156 Q100 162 74 156 Z" fill="#2563eb" />
      <line x1="82" y1="148" x2="82" y2="158" stroke="#1e3a8a" stroke-width="3" />
      <line x1="118" y1="148" x2="118" y2="158" stroke="#1e3a8a" stroke-width="3" />
      <rect x="94" y="164" width="12" height="12" rx="2" fill="#1d4ed8" />
    </g>`,
  'ao-dai-tet': `
    <g class="cat-accessory-aodai" stroke="#991b1b" stroke-width="3">
      <path d="M70 146 L68 190 L132 190 L130 146 Q100 156 70 146 Z" fill="#dc2626" />
      <circle cx="100" cy="164" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
    </g>`,
  'ao-hoodie': `
    <g class="cat-accessory-hoodie" stroke="#374151" stroke-width="3">
      <path d="M70 148 L70 186 L130 186 L130 148 Q100 158 70 148 Z" fill="#6b7280" />
      <rect x="88" y="166" width="24" height="14" rx="4" fill="#4b5563" />
    </g>`,
  'ao-bong-da': `
    <g class="cat-accessory-football" stroke="#991b1b" stroke-width="3">
      <path d="M72 148 L72 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#ef4444" />
      <polygon points="100,160 102,165 107,165 103,168 105,173 100,170 95,173 97,168 93,165 98,165" fill="#facc15" />
    </g>`,
  'ao-bac-si': `
    <g class="cat-accessory-doctor" stroke="#94a3b8" stroke-width="2.5">
      <path d="M72 148 L72 185 L128 185 L128 148 Q100 158 72 148 Z" fill="#f8fafc" />
      <rect x="98" y="160" width="4" height="12" fill="#ef4444" />
      <rect x="94" y="164" width="12" height="4" fill="#ef4444" />
    </g>`,
  'ao-tham-tu': `
    <g class="cat-accessory-detective" stroke="#78350f" stroke-width="3">
      <path d="M70 148 L70 188 L130 188 L130 148 Q100 158 70 148 Z" fill="#b45309" />
      <line x1="86" y1="154" x2="94" y2="174" stroke="#78350f" stroke-width="2" />
      <line x1="114" y1="154" x2="106" y2="174" stroke="#78350f" stroke-width="2" />
    </g>`,
  'ao-kimono': `
    <g class="cat-accessory-kimono" stroke="#831843" stroke-width="2.5">
      <path d="M70 148 L70 188 L130 188 L130 148 Q100 158 70 148 Z" fill="#f472b6" />
      <rect x="80" y="164" width="40" height="10" fill="#dc2626" />
    </g>`,
  'ao-sieu-nhan': `
    <g class="cat-accessory-superman" stroke="#1e3a8a" stroke-width="3">
      <path d="M70 148 L70 186 L130 186 L130 148 Q100 158 70 148 Z" fill="#2563eb" />
      <polygon points="100,158 110,165 106,176 94,176 90,165" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
      <text x="96" y="172" font-size="10" font-weight="900" fill="#dc2626">M</text>
    </g>`,
  'ao-da-hoi': `
    <g class="cat-accessory-ballgown" stroke="#6b21a8" stroke-width="2.5">
      <path d="M72 150 L64 190 L136 190 L128 150 Q100 158 72 150 Z" fill="#a855f7" />
      <circle cx="86" cy="174" r="2" fill="#fff" />
      <circle cx="100" cy="178" r="2" fill="#fff" />
      <circle cx="114" cy="174" r="2" fill="#fff" />
    </g>`,
};

const NECK_ACCESSORIES: Record<string, string> = {
  'khan-quang-do': `
    <g class="cat-accessory-scarf" stroke="#7f1d1d" stroke-width="3">
      <path d="M66 142 Q100 154 134 142 L132 154 Q100 166 68 154 Z" fill="#ef4444" />
      <rect x="114" y="152" width="14" height="30" rx="3" fill="#dc2626" />
    </g>`,
  'no-cham-bi': `
    <g class="cat-accessory-bowtie" stroke="${ink}" stroke-width="3">
      <path d="M82 148 L96 140 L98 156 Z" fill="#1e40af" />
      <path d="M118 148 L104 140 L102 156 Z" fill="#1e40af" />
      <circle cx="100" cy="148" r="6" fill="#3b82f6" />
      <circle cx="86" cy="144" r="2" fill="#fff" />
      <circle cx="114" cy="144" r="2" fill="#fff" />
    </g>`,
  'von-co-ren': `
    <g class="cat-accessory-lace" stroke="#94a3b8" stroke-width="2">
      <path d="M62 142 Q100 152 138 142 L136 150 Q100 160 64 150 Z" fill="#ffffff" />
    </g>`,
  'khan-len-soc': `
    <g class="cat-accessory-striped-scarf" stroke="#7c3aed" stroke-width="2.5">
      <path d="M66 142 Q100 154 134 142 L132 160 Q100 172 68 160 Z" fill="#a78bfa" />
      <rect x="116" y="158" width="12" height="28" rx="4" fill="#8b5cf6" />
    </g>`,
  'day-huy-chuong': `
    <g class="cat-accessory-medal" stroke="#ca8a04" stroke-width="2.5">
      <path d="M76 140 Q100 148 124 140 L120 152 L100 156 L80 152 Z" fill="#fbbf24" opacity="0.4" />
      <circle cx="100" cy="166" r="8" fill="#fbbf24" stroke="#92400e" stroke-width="2" />
    </g>`,
  'vong-co-ngoc': `
    <g class="cat-accessory-pearls" stroke="#cbd5e1" stroke-width="1.5">
      <circle cx="74" cy="142" r="4" fill="#f8fafc" />
      <circle cx="84" cy="146" r="4" fill="#f8fafc" />
      <circle cx="94" cy="148" r="4" fill="#f8fafc" />
      <circle cx="104" cy="148" r="4" fill="#f8fafc" />
      <circle cx="114" cy="146" r="4" fill="#f8fafc" />
      <circle cx="124" cy="142" r="4" fill="#f8fafc" />
    </g>`,
  'vong-luc-lac': `
    <g class="cat-accessory-bell" stroke="#854d0e" stroke-width="2.5">
      <path d="M70 144 Q100 154 130 144" stroke="#ef4444" stroke-width="5" fill="none" />
      <circle cx="100" cy="154" r="8" fill="#facc15" />
      <circle cx="100" cy="157" r="1.5" fill="#713f12" />
    </g>`,
  'khan-ran-nam-bo': `
    <g class="cat-accessory-khanran" stroke="#1e293b" stroke-width="2">
      <path d="M66 142 Q100 154 134 142 L130 156 Q100 166 70 156 Z" fill="#f1f5f9" />
      <line x1="78" y1="146" x2="84" y2="158" stroke="#334155" stroke-width="2" />
      <line x1="96" y1="149" x2="102" y2="161" stroke="#334155" stroke-width="2" />
      <line x1="114" y1="146" x2="120" y2="158" stroke="#334155" stroke-width="2" />
    </g>`,
  'no-buom-da-hoi': `
    <g class="cat-accessory-blacktie" stroke="${ink}" stroke-width="2.5">
      <path d="M84 148 L96 142 L96 154 Z" fill="#18181b" />
      <path d="M116 148 L104 142 L104 154 Z" fill="#18181b" />
      <circle cx="100" cy="148" r="5" fill="#27272a" />
    </g>`,
  'vong-hoa-hawaii': `
    <g class="cat-accessory-lei">
      <circle cx="74" cy="144" r="5" fill="#f43f5e" />
      <circle cx="86" cy="149" r="5" fill="#facc15" />
      <circle cx="100" cy="152" r="5" fill="#ec4899" />
      <circle cx="114" cy="149" r="5" fill="#38bdf8" />
      <circle cx="126" cy="144" r="5" fill="#4ade80" />
    </g>`,
  'khan-len-tuyet': `
    <g class="cat-accessory-snow-scarf" stroke="#0284c7" stroke-width="2.5">
      <path d="M66 142 Q100 154 134 142 L132 158 Q100 168 68 158 Z" fill="#38bdf8" />
      <rect x="114" y="156" width="14" height="26" rx="3" fill="#0284c7" />
    </g>`,
  'vong-co-chuong-bac': `
    <g class="cat-accessory-silver-bell" stroke="#475569" stroke-width="2">
      <path d="M72 144 Q100 153 128 144" stroke="#0284c7" stroke-width="4" fill="none" />
      <circle cx="100" cy="153" r="7" fill="#e2e8f0" />
    </g>`,
  'ca-vat-hoc-sinh': `
    <g class="cat-accessory-tie" stroke="#1e3a8a" stroke-width="2">
      <polygon points="97,144 103,144 106,172 100,178 94,172" fill="#3b82f6" />
      <line x1="96" y1="152" x2="104" y2="152" stroke="#facc15" stroke-width="2" />
    </g>`,
  'vong-co-trai-tim': `
    <g class="cat-accessory-heart-locket" stroke="#ca8a04" stroke-width="1.5">
      <path d="M74 142 Q100 152 126 142" stroke="#eab308" stroke-width="2" fill="none" />
      <path d="M96 154 C96 150 100 148 103 151 C106 148 110 150 110 154 C110 160 103 166 103 166 C103 166 96 160 96 154 Z" fill="#ef4444" stroke="#b91c1c" />
    </g>`,
};

const WRIST_ACCESSORIES: Record<string, string> = {
  'vong-tay-vang': `
    <g class="cat-accessory-bracelet-gold">
      <ellipse cx="78" cy="188" rx="14" ry="5" fill="none" stroke="#fbbf24" stroke-width="4" />
    </g>`,
  'vong-tay-ngoc': `
    <g class="cat-accessory-bracelet-jade">
      <ellipse cx="78" cy="188" rx="14" ry="5" fill="none" stroke="#10b981" stroke-width="4" />
    </g>`,
  'dong-ho-cute': `
    <g class="cat-accessory-watch">
      <rect x="68" y="183" width="18" height="10" rx="3" fill="#f43f5e" stroke="#7f1d1d" stroke-width="2" />
      <circle cx="77" cy="188" r="4" fill="#fff" />
    </g>`,
  'bang-tay-hero': `
    <g class="cat-accessory-hero-band">
      <rect x="67" y="183" width="20" height="10" rx="4" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
    </g>`,
  'vong-hat-cau-vong': `
    <g class="cat-accessory-rainbow-beads">
      <circle cx="70" cy="188" r="3" fill="#ef4444" />
      <circle cx="75" cy="188" r="3" fill="#facc15" />
      <circle cx="80" cy="188" r="3" fill="#22c55e" />
      <circle cx="85" cy="188" r="3" fill="#3b82f6" />
    </g>`,
  'dong-ho-thong-minh': `
    <g class="cat-accessory-smartwatch" stroke="#0f172a" stroke-width="1.5">
      <rect x="70" y="184" width="16" height="9" rx="3" fill="#0284c7" />
      <rect x="73" y="186" width="10" height="5" rx="1" fill="#38bdf8" />
    </g>`,
  'vong-hoa-tay': `
    <g class="cat-accessory-wrist-flower">
      <circle cx="78" cy="188" r="5" fill="#f472b6" />
      <circle cx="78" cy="188" r="2.5" fill="#fef08a" />
    </g>`,
  'bang-do-the-thao': `
    <g class="cat-accessory-sweatband">
      <rect x="68" y="184" width="18" height="9" rx="3" fill="#f97316" stroke="#c2410c" stroke-width="1.5" />
    </g>`,
  'gang-tay-len': `
    <g class="cat-accessory-mitten">
      <ellipse cx="78" cy="190" rx="16" ry="10" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
      <rect x="70" y="182" width="16" height="4" fill="#ffffff" />
    </g>`,
  'lac-tay-chuong': `
    <g class="cat-accessory-wrist-bell" stroke="#ca8a04" stroke-width="1.5">
      <ellipse cx="78" cy="188" rx="13" ry="4" fill="none" stroke="#eab308" stroke-width="2" />
      <circle cx="78" cy="191" r="3" fill="#fde047" />
    </g>`,
  'vong-tay-da-quang': `
    <g class="cat-accessory-neon-bracelet">
      <ellipse cx="78" cy="188" rx="14" ry="5" fill="none" stroke="#22c55e" stroke-width="3" />
    </g>`,
  'gang-tay-dam-boc': `
    <g class="cat-accessory-boxing-glove">
      <ellipse cx="78" cy="190" rx="17" ry="12" fill="#ef4444" stroke="#991b1b" stroke-width="2.5" />
    </g>`,
};

const EAR_ACCESSORIES: Record<string, string> = {
  'bong-tai-sao': `
    <g class="cat-accessory-ear-star" fill="#facc15" stroke="#713f12" stroke-width="1.5">
      <polygon points="44,72 46,78 53,79 48,84 49,90 44,87 39,90 40,84 35,79 42,78" />
      <polygon points="156,72 158,78 165,79 160,84 161,90 156,87 151,90 152,84 147,79 154,78" />
    </g>`,
  'bong-tai-tim': `
    <g class="cat-accessory-ear-heart" fill="#f43f5e" stroke="#9f1239" stroke-width="1.5">
      <path d="M38 72 C38 68 43 66 46 70 C49 66 54 68 54 72 C54 77 46 83 46 83 C46 83 38 77 38 72 Z" />
      <path d="M146 72 C146 68 151 66 154 70 C157 66 162 68 162 72 C162 77 154 83 154 83 C154 83 146 77 146 72 Z" />
    </g>`,
  'bong-tai-kim-cuong': `
    <g class="cat-accessory-ear-diamond" fill="#e0f2fe" stroke="#0284c7" stroke-width="2">
      <polygon points="46,68 52,76 46,84 40,76" />
      <polygon points="154,68 160,76 154,84 148,76" />
    </g>`,
  'bong-tai-hoa': `
    <g class="cat-accessory-ear-flower" fill="#fda4af">
      <circle cx="46" cy="76" r="6" fill="#f472b6" />
      <circle cx="46" cy="76" r="2.5" fill="#fef08a" />
      <circle cx="154" cy="76" r="6" fill="#f472b6" />
      <circle cx="154" cy="76" r="2.5" fill="#fef08a" />
    </g>`,
  'bong-tai-cau-vong': `
    <g class="cat-accessory-ear-rainbow" stroke-width="2" fill="none">
      <path d="M38 80 C38 72 54 72 54 80" stroke="#ef4444" />
      <path d="M40 80 C40 74 52 74 52 80" stroke="#facc15" />
      <path d="M146 80 C146 72 162 72 162 80" stroke="#ef4444" />
      <path d="M148 80 C148 74 160 74 160 80" stroke="#facc15" />
    </g>`,
  'bong-tai-mat-trang': `
    <g class="cat-accessory-ear-moon" fill="#fde047" stroke="#ca8a04" stroke-width="1.5">
      <path d="M48 68 C44 72 44 80 50 84 C42 82 42 70 48 68 Z" />
      <path d="M152 68 C156 72 156 80 150 84 C158 82 158 70 152 68 Z" />
    </g>`,
  'bong-tai-not-nhac': `
    <g class="cat-accessory-ear-music" fill="#1e1b4b" stroke="#312e81" stroke-width="1.5">
      <circle cx="44" cy="80" r="3.5" />
      <line x1="47" y1="80" x2="47" y2="70" />
      <circle cx="156" cy="80" r="3.5" />
      <line x1="159" y1="80" x2="159" y2="70" />
    </g>`,
  'bong-tai-giot-nuoc': `
    <g class="cat-accessory-ear-drop" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5">
      <path d="M46 68 C46 68 41 75 41 79 C41 82 43 84 46 84 C49 84 51 82 51 79 C51 75 46 68 46 68 Z" />
      <path d="M154 68 C154 68 149 75 149 79 C149 82 151 84 154 84 C157 84 159 82 159 79 C159 75 154 68 154 68 Z" />
    </g>`,
  'bong-tai-cherry': `
    <g class="cat-accessory-ear-cherry">
      <circle cx="43" cy="80" r="3.5" fill="#dc2626" />
      <circle cx="49" cy="80" r="3.5" fill="#dc2626" />
      <path d="M43 80 Q46 72 46 68 M49 80 Q46 72 46 68" stroke="#15803d" stroke-width="1.5" fill="none" />
      <circle cx="151" cy="80" r="3.5" fill="#dc2626" />
      <circle cx="157" cy="80" r="3.5" fill="#dc2626" />
      <path d="M151 80 Q154 72 154 68 M157 80 Q154 72 154 68" stroke="#15803d" stroke-width="1.5" fill="none" />
    </g>`,
  'bong-tai-tia-chop': `
    <g class="cat-accessory-ear-bolt" fill="#facc15" stroke="#ca8a04" stroke-width="1">
      <polygon points="47,68 42,76 46,76 43,84 50,75 46,75" />
      <polygon points="155,68 150,76 154,76 151,84 158,75 154,75" />
    </g>`,
  'bong-tai-buom-xanh': `
    <g class="cat-accessory-ear-butterfly" fill="#38bdf8" stroke="#0284c7" stroke-width="1">
      <ellipse cx="44" cy="74" rx="4" ry="6" />
      <ellipse cx="48" cy="74" rx="4" ry="6" />
      <ellipse cx="152" cy="74" rx="4" ry="6" />
      <ellipse cx="156" cy="74" rx="4" ry="6" />
    </g>`,
  'bong-tai-keo-mut': `
    <g class="cat-accessory-ear-candy" stroke="#be185d" stroke-width="1.5">
      <circle cx="46" cy="76" r="5" fill="#f472b6" />
      <line x1="46" y1="81" x2="46" y2="86" stroke="#92400e" stroke-width="2" />
      <circle cx="154" cy="76" r="5" fill="#f472b6" />
      <line x1="154" y1="81" x2="154" y2="86" stroke="#92400e" stroke-width="2" />
    </g>`,
  'bong-tai-chuong-vang': `
    <g class="cat-accessory-ear-bell" fill="#facc15" stroke="#ca8a04" stroke-width="1.5">
      <circle cx="46" cy="77" r="4.5" />
      <circle cx="154" cy="77" r="4.5" />
    </g>`,
};

const FACE_ACCESSORIES: Record<string, string> = {
  'kinh-tri-thuc': `
    <g class="cat-accessory-glasses" stroke="#0369a1" stroke-width="3.5" fill="none">
      <circle cx="76" cy="92" r="18" fill="#e0f2fe" fill-opacity="0.4" />
      <circle cx="124" cy="92" r="18" fill="#e0f2fe" fill-opacity="0.4" />
      <path d="M94 92 Q100 88 106 92" />
      <path d="M58 90 L46 86" />
      <path d="M142 90 L154 86" />
    </g>`,
  'kinh-ram-ngau': `
    <g class="cat-accessory-sunglasses" stroke="#0f172a" stroke-width="3" fill="#0f172a">
      <polygon points="56,82 94,82 90,102 60,102" />
      <polygon points="106,82 144,82 140,102 110,102" />
      <line x1="94" y1="86" x2="106" y2="86" stroke="#0f172a" stroke-width="4" />
      <line x1="56" y1="84" x2="44" y2="80" stroke="#0f172a" stroke-width="3" />
      <line x1="144" y1="84" x2="156" y2="80" stroke="#0f172a" stroke-width="3" />
      <line x1="64" y1="86" x2="72" y2="98" stroke="#fff" stroke-width="2" />
      <line x1="114" y1="86" x2="122" y2="98" stroke="#fff" stroke-width="2" />
    </g>`,
  'kinh-tim': `
    <g class="cat-accessory-heart-glasses" stroke="#be185d" stroke-width="3" fill="none">
      <path d="M60 84 C60 78 68 74 76 80 C84 74 92 78 92 84 C92 92 76 102 76 102 C76 102 60 92 60 84 Z" fill="#fce7f3" fill-opacity="0.5" />
      <path d="M108 84 C108 78 116 74 124 80 C132 74 140 78 140 84 C140 92 124 102 124 102 C124 102 108 92 108 84 Z" fill="#fce7f3" fill-opacity="0.5" />
      <line x1="92" y1="86" x2="108" y2="86" />
    </g>`,
  'kinh-ngoi-sao': `
    <g class="cat-accessory-star-glasses" stroke="#713f12" stroke-width="2.5" fill="none">
      <polygon points="76,74 79,83 89,84 82,91 84,100 76,96 68,100 70,91 63,84 73,83" fill="#fef08a" fill-opacity="0.5" />
      <polygon points="124,74 127,83 137,84 130,91 132,100 124,96 116,100 118,91 111,84 121,83" fill="#fef08a" fill-opacity="0.5" />
      <line x1="89" y1="84" x2="111" y2="84" />
    </g>`,
  'kinh-cat-keo': `
    <g class="cat-accessory-candy-glasses" stroke="#0f172a" stroke-width="3" fill="none">
      <rect x="56" y="80" width="38" height="22" rx="8" fill="#f43f5e" fill-opacity="0.35" />
      <rect x="106" y="80" width="38" height="22" rx="8" fill="#38bdf8" fill-opacity="0.35" />
      <line x1="94" y1="88" x2="106" y2="88" stroke="#0f172a" stroke-width="3" />
    </g>`,
  'kinh-boi-lan': `
    <g class="cat-accessory-goggles" stroke="#0284c7" stroke-width="3" fill="#0284c7" fill-opacity="0.25">
      <rect x="54" y="80" width="92" height="24" rx="12" />
      <line x1="44" y1="88" x2="54" y2="88" stroke="#0284c7" stroke-width="4" />
      <line x1="146" y1="88" x2="156" y2="88" stroke="#0284c7" stroke-width="4" />
    </g>`,
  'kinh-mat-meo': `
    <g class="cat-accessory-cateye" stroke="#db2777" stroke-width="3" fill="#fdf2f8" fill-opacity="0.4">
      <path d="M54 78 Q76 80 94 90 Q76 102 54 78 Z" />
      <path d="M146 78 Q124 80 106 90 Q124 102 146 78 Z" />
      <line x1="94" y1="86" x2="106" y2="86" stroke="#db2777" stroke-width="2" />
    </g>`,
  'kinh-3d': `
    <g class="cat-accessory-3d" stroke="#1e293b" stroke-width="3">
      <rect x="58" y="82" width="34" height="20" rx="3" fill="#ef4444" fill-opacity="0.6" />
      <rect x="108" y="82" width="34" height="20" rx="3" fill="#0ea5e9" fill-opacity="0.6" />
      <line x1="92" y1="88" x2="108" y2="88" stroke="#1e293b" stroke-width="3" />
    </g>`,
  'kinh-hoa-cuc': `
    <g class="cat-accessory-daisy-glasses" stroke="#eab308" stroke-width="2">
      <circle cx="76" cy="92" r="16" fill="#fef08a" fill-opacity="0.5" />
      <circle cx="124" cy="92" r="16" fill="#fef08a" fill-opacity="0.5" />
      <circle cx="76" cy="74" r="4" fill="#ffffff" />
      <circle cx="124" cy="74" r="4" fill="#ffffff" />
      <line x1="92" y1="92" x2="108" y2="92" stroke="#eab308" stroke-width="3" />
    </g>`,
  'kinh-cyberpunk': `
    <g class="cat-accessory-cyber" stroke="#06b6d4" stroke-width="2.5">
      <polygon points="50,84 150,84 144,98 56,98" fill="#22d3ee" fill-opacity="0.4" />
      <line x1="60" y1="91" x2="140" y2="91" stroke="#f43f5e" stroke-width="1.5" />
    </g>`,
  'kinh-nobita': `
    <g class="cat-accessory-nobita" stroke="#0f172a" stroke-width="4" fill="#fff" fill-opacity="0.2">
      <circle cx="74" cy="92" r="20" />
      <circle cx="126" cy="92" r="20" />
      <line x1="94" y1="92" x2="106" y2="92" stroke="#0f172a" stroke-width="4" />
    </g>`,
  'kinh-phi-cong': `
    <g class="cat-accessory-aviator" stroke="#ca8a04" stroke-width="2.5" fill="#713f12" fill-opacity="0.3">
      <path d="M58 82 Q76 80 92 82 Q92 102 75 104 Q58 102 58 82 Z" />
      <path d="M108 82 Q124 80 142 82 Q142 102 125 104 Q108 102 108 82 Z" />
      <line x1="92" y1="84" x2="108" y2="84" stroke="#ca8a04" stroke-width="3" />
    </g>`,
  'kinh-ngan-ha': `
    <g class="cat-accessory-galaxy" stroke="#7c3aed" stroke-width="2.5">
      <rect x="56" y="82" width="38" height="20" rx="6" fill="#312e81" />
      <rect x="106" y="82" width="38" height="20" rx="6" fill="#312e81" />
      <circle cx="70" cy="90" r="2" fill="#f472b6" />
      <circle cx="120" cy="90" r="2" fill="#38bdf8" />
      <line x1="94" y1="88" x2="106" y2="88" stroke="#7c3aed" stroke-width="3" />
    </g>`,
  'kinh-doc-sach': `
    <g class="cat-accessory-reading" stroke="#92400e" stroke-width="2.5" fill="none">
      <path d="M60 92 Q76 102 92 92" />
      <path d="M108 92 Q124 102 140 92" />
      <line x1="92" y1="92" x2="108" y2="92" stroke="#92400e" stroke-width="2" />
    </g>`,

  // Ngậm miệng
  'co-bon-la': `
    <g class="cat-accessory-clover" stroke="#166534" stroke-width="2" fill="#22c55e">
      <path d="M106 114 Q124 116 130 124" fill="none" stroke="#15803d" stroke-width="2.5" />
      <circle cx="130" cy="120" r="4" /><circle cx="136" cy="122" r="4" /><circle cx="132" cy="126" r="4" /><circle cx="126" cy="124" r="4" />
    </g>`,
  'ken-sao': `
    <g class="cat-accessory-flute" stroke="#713f12" stroke-width="2">
      <rect x="104" y="113" width="40" height="6" rx="3" fill="#d97706" />
      <circle cx="114" cy="116" r="1.5" fill="#92400e" /><circle cx="122" cy="116" r="1.5" fill="#92400e" /><circle cx="130" cy="116" r="1.5" fill="#92400e" />
    </g>`,
  'keo-棒': `
    <g class="cat-accessory-lollipop" stroke="#7f1d1d" stroke-width="2">
      <line x1="108" y1="116" x2="136" y2="126" stroke="#92400e" stroke-width="3" stroke-linecap="round" />
      <circle cx="108" cy="114" r="9" fill="#f43f5e" />
      <path d="M102 110 Q108 104 114 110 Q108 116 102 110 Z" fill="#fb923c" />
    </g>`,
  'bong-hong': `
    <g class="cat-accessory-rose" stroke="#9f1239" stroke-width="2">
      <line x1="108" y1="116" x2="134" y2="124" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="106" cy="113" r="7" fill="#f43f5e" /><circle cx="100" cy="116" r="5" fill="#fb7185" />
    </g>`,
  'ngam-banh-quy': `
    <g class="cat-accessory-cookie" stroke="#78350f" stroke-width="2">
      <circle cx="114" cy="116" r="9" fill="#d97706" />
      <circle cx="111" cy="114" r="1.5" fill="#451a03" /><circle cx="116" cy="113" r="1.5" fill="#451a03" /><circle cx="114" cy="119" r="1.5" fill="#451a03" />
    </g>`,
  'ngam-ca-vang': `
    <g class="cat-accessory-fish" stroke="#c2410c" stroke-width="2">
      <ellipse cx="116" cy="116" rx="10" ry="6" fill="#fb923c" />
      <polygon points="126,116 132,112 132,120" fill="#f97316" />
      <circle cx="110" cy="115" r="1.5" fill="#0f172a" />
    </g>`,
  'ngam-que-kem': `
    <g class="cat-accessory-icecream" stroke="#9f1239" stroke-width="1.5">
      <line x1="106" y1="116" x2="126" y2="128" stroke="#ca8a04" stroke-width="3" />
      <circle cx="104" cy="114" r="8" fill="#f472b6" />
    </g>`,
  'ngam-la-phong': `
    <g class="cat-accessory-maple" stroke="#7f1d1d" stroke-width="1.5" fill="#ef4444">
      <path d="M106 116 L124 110 L120 120 L130 122 L118 126 Z" />
    </g>`,
  'ngam-keo-bong': `
    <g class="cat-accessory-cottoncandy">
      <line x1="106" y1="116" x2="126" y2="128" stroke="#94a3b8" stroke-width="2" />
      <circle cx="104" cy="112" r="9" fill="#fbcfe8" />
      <circle cx="109" cy="115" r="7" fill="#bae6fd" />
    </g>`,
  'ngam-but-chi': `
    <g class="cat-accessory-pencil" stroke="#713f12" stroke-width="1.5">
      <rect x="106" y="114" width="28" height="5" rx="1" fill="#facc15" />
      <polygon points="106,114 100,116.5 106,119" fill="#fed7aa" />
      <polygon points="102,115.5 100,116.5 102,117.5" fill="#1e293b" />
    </g>`,
  'ngam-thu-tinh': `
    <g class="cat-accessory-letter" stroke="#1e293b" stroke-width="1.5">
      <rect x="106" y="112" width="22" height="15" rx="2" fill="#f8fafc" />
      <polyline points="106,112 117,120 128,112" fill="none" stroke="#64748b" />
      <circle cx="117" cy="120" r="2.5" fill="#ef4444" />
    </g>`,
  'ngam-banh-donut': `
    <g class="cat-accessory-donut" stroke="#78350f" stroke-width="2">
      <circle cx="114" cy="116" r="9" fill="#d97706" />
      <circle cx="114" cy="116" r="4" fill="#ffedd5" />
      <circle cx="111" cy="112" r="1" fill="#f43f5e" /><circle cx="117" cy="114" r="1" fill="#38bdf8" />
    </g>`,
  'ngam-nhanh-o-liu': `
    <g class="cat-accessory-olive" stroke="#15803d" stroke-width="2" fill="none">
      <path d="M104 114 Q120 114 134 122" />
      <ellipse cx="118" cy="112" rx="4" ry="2" fill="#22c55e" />
      <ellipse cx="128" cy="116" rx="4" ry="2" fill="#22c55e" />
    </g>`,
};

const BOW_ACCESSORIES: Record<string, string> = {
  'no-hong': `
    <g class="cat-accessory-bow-pink" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
      <path d="M132 40 L112 26 L114 54 Z" fill="#ff5c9a" />
      <path d="M132 40 L154 28 L150 56 Z" fill="#ff5c9a" />
      <circle cx="132" cy="41" r="7" fill="#ffb3cf" />
    </g>`,
  'no-do': `
    <g class="cat-accessory-bow-red" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
      <path d="M68 40 L48 26 L50 54 Z" fill="#ef4444" />
      <path d="M68 40 L90 28 L86 56 Z" fill="#ef4444" />
      <circle cx="68" cy="41" r="7" fill="#fca5a5" />
      <circle cx="56" cy="38" r="2" fill="#fff" />
      <circle cx="80" cy="40" r="2" fill="#fff" />
    </g>`,
  'no-xanh': `
    <g class="cat-accessory-bow-green" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
      <path d="M132 40 L112 26 L114 54 Z" fill="#22c55e" />
      <path d="M132 40 L154 28 L150 56 Z" fill="#22c55e" />
      <circle cx="132" cy="41" r="7" fill="#86efac" />
    </g>`,
  'no-tim': `
    <g class="cat-accessory-bow-purple" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
      <path d="M68 40 L48 26 L50 54 Z" fill="#a855f7" />
      <path d="M68 40 L90 28 L86 56 Z" fill="#a855f7" />
      <circle cx="68" cy="41" r="7" fill="#d8b4fe" />
    </g>`,
  'no-vang': `
    <g class="cat-accessory-bow-gold" stroke="#92400e" stroke-width="4" stroke-linejoin="round">
      <path d="M132 40 L112 26 L114 54 Z" fill="#fbbf24" />
      <path d="M132 40 L154 28 L150 56 Z" fill="#fbbf24" />
      <circle cx="132" cy="41" r="7" fill="#fef08a" />
    </g>`,
  'no-bac-ha': `
    <g class="cat-accessory-bow-mint" stroke="${ink}" stroke-width="4" stroke-linejoin="round">
      <path d="M68 40 L48 26 L50 54 Z" fill="#6ee7b7" />
      <path d="M68 40 L90 28 L86 56 Z" fill="#6ee7b7" />
      <circle cx="68" cy="41" r="7" fill="#a7f3d0" />
    </g>`,
  'no-cau-vong': `
    <g class="cat-accessory-bow-rainbow" stroke="${ink}" stroke-width="3">
      <path d="M132 40 L112 26 L114 54 Z" fill="#ef4444" />
      <path d="M132 40 L154 28 L150 56 Z" fill="#3b82f6" />
      <circle cx="132" cy="41" r="7" fill="#facc15" />
    </g>`,
  'no-da-quang': `
    <g class="cat-accessory-bow-neon" stroke="#047857" stroke-width="3">
      <path d="M68 40 L48 26 L50 54 Z" fill="#10b981" />
      <path d="M68 40 L90 28 L86 56 Z" fill="#10b981" />
      <circle cx="68" cy="41" r="7" fill="#6ee7b7" />
    </g>`,
  'no-kep-buom': `
    <g class="cat-accessory-bow-butterfly" stroke="#7c3aed" stroke-width="3">
      <path d="M132 40 C116 20 110 44 132 40 C146 20 152 44 132 40 Z" fill="#c084fc" />
      <circle cx="132" cy="40" r="4" fill="#a855f7" />
    </g>`,
  'no-hoa-tuyet': `
    <g class="cat-accessory-bow-snow" stroke="#0284c7" stroke-width="3">
      <path d="M68 40 L48 26 L50 54 Z" fill="#e0f2fe" />
      <path d="M68 40 L90 28 L86 56 Z" fill="#e0f2fe" />
      <circle cx="68" cy="41" r="7" fill="#38bdf8" />
    </g>`,
  'no-caro': `
    <g class="cat-accessory-bow-caro" stroke="${ink}" stroke-width="3">
      <path d="M132 40 L112 26 L114 54 Z" fill="#dc2626" />
      <path d="M132 40 L154 28 L150 56 Z" fill="#dc2626" />
      <line x1="120" y1="30" x2="122" y2="50" stroke="#fef08a" stroke-width="2" />
      <circle cx="132" cy="41" r="6" fill="#1e293b" />
    </g>`,
  'no-trai-tim': `
    <g class="cat-accessory-bow-heart" stroke="#9f1239" stroke-width="3">
      <path d="M68 40 L48 26 L50 54 Z" fill="#f43f5e" />
      <path d="M68 40 L90 28 L86 56 Z" fill="#f43f5e" />
      <circle cx="68" cy="41" r="7" fill="#fb7185" />
    </g>`,
  'no-ren-trang': `
    <g class="cat-accessory-bow-lace" stroke="#94a3b8" stroke-width="3">
      <path d="M132 40 L112 26 L114 54 Z" fill="#ffffff" />
      <path d="M132 40 L154 28 L150 56 Z" fill="#ffffff" />
      <circle cx="132" cy="41" r="7" fill="#f1f5f9" />
    </g>`,
  'no-anh-kim': `
    <g class="cat-accessory-bow-gold-sparkle" stroke="#854d0e" stroke-width="3">
      <path d="M68 40 L48 26 L50 54 Z" fill="#fbbf24" />
      <path d="M68 40 L90 28 L86 56 Z" fill="#fbbf24" />
      <polygon points="68,36 70,40 74,41 71,44 72,48 68,46 64,48 65,44 62,41 66,40" fill="#fff" />
    </g>`,
};

const HEAD_ACCESSORIES: Record<string, string> = {
  'mu-cu-nhan': `
    <g class="cat-accessory-grad" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
      <polygon points="100,10 148,26 100,42 52,26" fill="#1e1b4b" />
      <rect x="76" y="28" width="48" height="18" rx="2" fill="#312e81" />
      <path d="M100 26 Q128 32 134 46" fill="none" stroke="#eab308" stroke-width="3" stroke-linecap="round" />
      <circle cx="134" cy="48" r="4" fill="#facc15" />
    </g>`,
  'mu-phot': `
    <g class="cat-accessory-fedora" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
      <ellipse cx="100" cy="38" rx="54" ry="12" fill="#78350f" />
      <path d="M68 34 C68 14 78 8 100 8 C122 8 132 14 132 34 Z" fill="#92400e" />
      <rect x="70" y="26" width="60" height="8" rx="2" fill="#ca8a04" />
    </g>`,
  'vuong-mien-sao': `
    <g class="cat-accessory-crown" stroke="#713f12" stroke-width="3" stroke-linejoin="round">
      <polygon points="68,36 74,16 88,28 100,10 112,28 126,16 132,36" fill="#facc15" />
      <circle cx="100" cy="10" r="4" fill="#f43f5e" />
      <circle cx="74" cy="16" r="3" fill="#38bdf8" />
      <circle cx="126" cy="16" r="3" fill="#38bdf8" />
    </g>`,
  'mu-len-bong': `
    <g class="cat-accessory-beanie" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
      <path d="M58 42 C58 16 142 16 142 42 Z" fill="#3b82f6" />
      <rect x="54" y="38" width="92" height="10" rx="3" fill="#93c5fd" />
      <circle cx="100" cy="12" r="10" fill="#f8fafc" stroke="${ink}" stroke-width="2.5" />
    </g>`,
  'mu-dau-bep': `
    <g class="cat-accessory-chef" stroke="${ink}" stroke-width="3" stroke-linejoin="round" fill="#ffffff">
      <rect x="74" y="30" width="52" height="14" rx="2" />
      <circle cx="78" cy="22" r="14" />
      <circle cx="100" cy="14" r="16" />
      <circle cx="122" cy="22" r="14" />
    </g>`,
  'sung-tuan-loc': `
    <g class="cat-accessory-antlers" stroke="#78350f" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M60 40 L50 16 M54 26 L42 22" />
      <path d="M140 40 L150 16 M146 26 L158 22" />
    </g>`,
  'mu-kowboy': `
    <g class="cat-accessory-cowboy" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
      <ellipse cx="100" cy="40" rx="60" ry="14" fill="#92400e" />
      <path d="M65 36 C65 12 78 6 100 6 C122 6 135 12 135 36 Z" fill="#a16207" />
      <rect x="67" y="28" width="66" height="10" rx="3" fill="#fbbf24" />
    </g>`,
  'mu-phap-su': `
    <g class="cat-accessory-witch" stroke="${ink}" stroke-width="3" stroke-linejoin="round">
      <polygon points="100,4 130,42 70,42" fill="#1e1b4b" />
      <ellipse cx="100" cy="42" rx="48" ry="11" fill="#312e81" />
      <circle cx="100" cy="28" r="5" fill="#facc15" />
    </g>`,
  'mu-beret': `
    <g class="cat-accessory-beret" stroke="${ink}" stroke-width="3">
      <ellipse cx="100" cy="30" rx="44" ry="22" fill="#dc2626" />
      <ellipse cx="100" cy="40" rx="50" ry="8" fill="#b91c1c" />
    </g>`,
  'mu-bao-hiem': `
    <g class="cat-accessory-helmet" stroke="${ink}" stroke-width="3">
      <path d="M44 60 C44 20 156 20 156 60 L154 78 L46 78 Z" fill="#e2e8f0" />
      <rect x="70" y="62" width="60" height="16" rx="4" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2" />
    </g>`,
  'mu-sinh-nhat': `
    <g class="cat-accessory-partyhat" stroke="${ink}" stroke-width="3">
      <polygon points="100,8 122,46 78,46" fill="#f43f5e" />
      <circle cx="100" cy="6" r="6" fill="#facc15" />
      <line x1="86" y1="28" x2="114" y2="28" stroke="#38bdf8" stroke-width="3" />
    </g>`,
  'vuong-mien-cong-chua': `
    <g class="cat-accessory-princess" stroke="#be185d" stroke-width="2.5">
      <polygon points="76,38 82,20 92,30 100,16 108,30 118,20 124,38" fill="#fbcfe8" />
      <circle cx="100" cy="16" r="3.5" fill="#ec4899" />
    </g>`,
  'mu-rom-mua-he': `
    <g class="cat-accessory-strawhat" stroke="#713f12" stroke-width="2.5">
      <ellipse cx="100" cy="40" rx="56" ry="12" fill="#fde047" />
      <path d="M72 38 C72 20 80 18 100 18 C120 18 128 20 128 38 Z" fill="#facc15" />
      <circle cx="120" cy="36" r="5" fill="#f97316" />
    </g>`,
  'mu-luoi-trai': `
    <g class="cat-accessory-cap" stroke="${ink}" stroke-width="3">
      <path d="M64 42 C64 20 136 20 136 42 Z" fill="#2563eb" />
      <path d="M60 42 Q100 46 148 38" stroke="#1d4ed8" stroke-width="6" fill="none" stroke-linecap="round" />
    </g>`,
  'sung-unicorn': `
    <g class="cat-accessory-unicorn" stroke="#d97706" stroke-width="2">
      <polygon points="100,4 93,42 107,42" fill="#fde047" />
      <line x1="95" y1="30" x2="105" y2="24" stroke="#ec4899" stroke-width="2" />
      <line x1="97" y1="18" x2="103" y2="12" stroke="#38bdf8" stroke-width="2" />
    </g>`,
  'mu-hai-tac': `
    <g class="cat-accessory-pirate" stroke="${ink}" stroke-width="3">
      <path d="M52 42 Q100 12 148 42 Q100 32 52 42 Z" fill="#18181b" />
      <circle cx="100" cy="30" r="3" fill="#fff" />
    </g>`,
  'mu-tho-bong': `
    <g class="cat-accessory-bunny-hat" stroke="${ink}" stroke-width="3" fill="#fff">
      <path d="M60 44 C60 22 140 22 140 44 Z" />
      <ellipse cx="76" cy="18" rx="8" ry="20" fill="#fff" />
      <ellipse cx="76" cy="18" rx="4" ry="14" fill="#fbcfe8" />
      <ellipse cx="124" cy="18" rx="8" ry="20" fill="#fff" />
      <ellipse cx="124" cy="18" rx="4" ry="14" fill="#fbcfe8" />
    </g>`,
  'vong-hoa-doi-dau': `
    <g class="cat-accessory-flower-crown">
      <circle cx="68" cy="40" r="6" fill="#f43f5e" />
      <circle cx="84" cy="34" r="6" fill="#fbbf24" />
      <circle cx="100" cy="32" r="7" fill="#ec4899" />
      <circle cx="116" cy="34" r="6" fill="#38bdf8" />
      <circle cx="132" cy="40" r="6" fill="#a855f7" />
    </g>`,

  // Tai nghe
  'tai-nghe-gamer': `
    <g class="cat-accessory-headset" stroke="${ink}" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#0f172a" stroke-width="6" />
      <ellipse cx="40" cy="92" rx="10" ry="16" fill="#f43f5e" />
      <ellipse cx="160" cy="92" rx="10" ry="16" fill="#f43f5e" />
    </g>`,
  'tai-nghe-nhac': `
    <g class="cat-accessory-pink-headset" stroke="${ink}" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#db2777" stroke-width="6" />
      <ellipse cx="40" cy="92" rx="10" ry="16" fill="#f9a8d4" />
      <ellipse cx="160" cy="92" rx="10" ry="16" fill="#f9a8d4" />
    </g>`,
  'tai-nghe-meo': `
    <g class="cat-accessory-cat-headset" stroke="${ink}" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#7c3aed" stroke-width="6" />
      <ellipse cx="40" cy="92" rx="9" ry="14" fill="#c084fc" />
      <ellipse cx="160" cy="92" rx="9" ry="14" fill="#c084fc" />
      <path d="M32 84 L28 70 L42 80 Z" fill="#f0abfc" stroke="#7c3aed" stroke-width="2" />
      <path d="M168 84 L172 70 L158 80 Z" fill="#f0abfc" stroke="#7c3aed" stroke-width="2" />
    </g>`,
  'tai-nghe-phi-cong': `
    <g class="cat-accessory-pilot-headset" stroke="${ink}" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#475569" stroke-width="6" />
      <ellipse cx="40" cy="92" rx="11" ry="17" fill="#1e293b" />
      <ellipse cx="160" cy="92" rx="11" ry="17" fill="#1e293b" />
      <path d="M40 92 Q60 114 80 112" fill="none" stroke="#0f172a" stroke-width="3" />
      <circle cx="80" cy="112" r="4" fill="#10b981" />
    </g>`,
  'tai-nghe-dj-neon': `
    <g class="cat-accessory-dj" stroke="#06b6d4" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#0891b2" stroke-width="6" />
      <ellipse cx="40" cy="92" rx="11" ry="16" fill="#22d3ee" />
      <ellipse cx="160" cy="92" rx="11" ry="16" fill="#22d3ee" />
      <circle cx="40" cy="92" r="5" fill="#f43f5e" />
      <circle cx="160" cy="92" r="5" fill="#f43f5e" />
    </g>`,
  'tai-nghe-gau-truc': `
    <g class="cat-accessory-panda-headset" stroke="${ink}" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#18181b" stroke-width="6" />
      <ellipse cx="40" cy="92" rx="10" ry="15" fill="#ffffff" />
      <ellipse cx="160" cy="92" rx="10" ry="15" fill="#ffffff" />
      <circle cx="36" cy="84" r="4" fill="#18181b" />
      <circle cx="164" cy="84" r="4" fill="#18181b" />
    </g>`,
  'tai-nghe-ngoi-sao': `
    <g class="cat-accessory-star-headset" stroke="#ca8a04" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#eab308" stroke-width="6" />
      <circle cx="40" cy="92" r="10" fill="#facc15" />
      <circle cx="160" cy="92" r="10" fill="#facc15" />
    </g>`,
  'tai-nghe-ech-xanh': `
    <g class="cat-accessory-frog-headset" stroke="#15803d" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#16a34a" stroke-width="6" />
      <ellipse cx="40" cy="92" rx="10" ry="15" fill="#4ade80" />
      <ellipse cx="160" cy="92" rx="10" ry="15" fill="#4ade80" />
      <circle cx="38" cy="82" r="3.5" fill="#fff" stroke="#15803d" stroke-width="1.5" />
      <circle cx="162" cy="82" r="3.5" fill="#fff" stroke="#15803d" stroke-width="1.5" />
    </g>`,
  'tai-nghe-retro': `
    <g class="cat-accessory-retro-headset" stroke="#854d0e" stroke-width="2.5">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#ca8a04" stroke-width="4" />
      <ellipse cx="40" cy="92" rx="10" ry="16" fill="#fef08a" />
      <ellipse cx="160" cy="92" rx="10" ry="16" fill="#fef08a" />
    </g>`,
  'tai-nghe-robot': `
    <g class="cat-accessory-robot-headset" stroke="#334155" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#64748b" stroke-width="6" />
      <rect x="32" y="82" width="16" height="20" rx="3" fill="#cbd5e1" />
      <rect x="152" y="82" width="16" height="20" rx="3" fill="#cbd5e1" />
      <circle cx="40" cy="92" r="4" fill="#06b6d4" />
      <circle cx="160" cy="92" r="4" fill="#06b6d4" />
    </g>`,
  'tai-nghe-bong-tuyet': `
    <g class="cat-accessory-snow-headset" stroke="#94a3b8" stroke-width="2.5">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#cbd5e1" stroke-width="5" />
      <circle cx="40" cy="92" r="14" fill="#f8fafc" />
      <circle cx="160" cy="92" r="14" fill="#f8fafc" />
    </g>`,
  'tai-nghe-trai-tim': `
    <g class="cat-accessory-heart-headset" stroke="#9f1239" stroke-width="3">
      <path d="M42 92 C36 40 164 40 158 92" fill="none" stroke="#e11d48" stroke-width="6" />
      <path d="M34 90 C34 84 39 82 42 86 C45 82 50 84 50 90 C50 97 42 103 42 103 C42 103 34 97 34 90 Z" fill="#fb7185" />
      <path d="M154 90 C154 84 159 82 162 86 C165 82 170 84 170 90 C170 97 162 103 162 103 C162 103 154 97 154 90 Z" fill="#fb7185" />
    </g>`,
};

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
  const pink = color.earPink;
  const eyeColor = color.eyeColor ?? ink;

  // Lọc và chuẩn hoá phụ kiện
  const wornAccessories = normalizeAccessories(accessories);

  // Tập hợp các khối SVG theo từng lớp phân tầng (Layering)
  let accessoryTailSvg = '';
  let accessoryBackSvg = '';
  let accessoryBodySvg = '';
  let accessoryNeckSvg = '';
  let accessoryWristSvg = '';
  let accessoryEarSvg = '';
  let accessoryFaceSvg = '';
  let accessoryHeadSvg = '';
  let accessoryBowSvg = '';

  for (const id of wornAccessories) {
    if (TAIL_ACCESSORIES[id]) accessoryTailSvg += TAIL_ACCESSORIES[id];
    if (BACK_ACCESSORIES[id]) accessoryBackSvg += BACK_ACCESSORIES[id];
    if (BODY_ACCESSORIES[id]) accessoryBodySvg += BODY_ACCESSORIES[id];
    if (NECK_ACCESSORIES[id]) accessoryNeckSvg += NECK_ACCESSORIES[id];
    if (WRIST_ACCESSORIES[id]) accessoryWristSvg += WRIST_ACCESSORIES[id];
    if (EAR_ACCESSORIES[id]) accessoryEarSvg += EAR_ACCESSORIES[id];
    if (FACE_ACCESSORIES[id]) accessoryFaceSvg += FACE_ACCESSORIES[id];
    if (HEAD_ACCESSORIES[id]) accessoryHeadSvg += HEAD_ACCESSORIES[id];
    if (BOW_ACCESSORIES[id]) accessoryBowSvg += BOW_ACCESSORIES[id];
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
        <circle cx="152" cy="68" r="5" fill="#e0e7ff" stroke="#4338ca" stroke-width="2" />
        <circle cx="162" cy="56" r="8" fill="#e0e7ff" stroke="#4338ca" stroke-width="2.5" />
        <text class="cat-question-mark" x="168" y="38" font-family="'Nunito Variable', Nunito, sans-serif" font-size="36" font-weight="900" fill="#5a3fc0">?</text>
      </g>`;
  } else if (pose === 'vui') {
    pawsSvg = `
      <g class="cat-stars">
        <polygon points="24,44 29,54 40,56 32,64 34,75 24,70 14,75 16,64 8,56 19,54" fill="#ffcf3f" stroke="${ink}" stroke-width="2.5" />
        <polygon points="172,130 176,138 185,139 179,145 180,154 172,150 164,154 165,145 159,139 168,138" fill="#ffcf3f" stroke="${ink}" stroke-width="2.5" />
        <circle cx="36" cy="90" r="4" fill="#f43f5e" />
        <circle cx="164" cy="70" r="4" fill="#38bdf8" />
        <circle cx="140" cy="30" r="3.5" fill="#4ade80" />
      </g>`;
  } else if (pose === 'buon') {
    pawsSvg = `
      <path class="cat-teardrop" d="M152 86 C152 76 162 66 162 66 C162 66 172 76 172 86 C172 92 167 96 162 96 C157 96 152 92 152 86 Z" fill="#67e8f9" stroke="#0284c7" stroke-width="2.5" />
    `;
  } else if (pose === 'te') {
    pawsSvg = `
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
    <path class="cat-ear-left" d="M44 70 L40 16 L88 44 Z" fill="${color.fur}" stroke="${ink}" stroke-width="5" stroke-linejoin="round" />
    <path class="cat-ear-inner-left" d="M52 58 L50 30 L76 46 Z" fill="${pink}" />

    <path class="cat-ear-right" d="M156 70 L160 16 L112 44 Z" fill="${color.fur}" stroke="${ink}" stroke-width="5" stroke-linejoin="round" />
    <path class="cat-ear-inner-right" d="M148 58 L150 30 L124 46 Z" fill="${pink}" />

    <ellipse cx="100" cy="92" rx="68" ry="56" fill="${color.fur}" stroke="${ink}" stroke-width="5" />
    ${furPatternsSvg}

    <path d="M100 38 L100 54 M86 40 L90 54 M114 40 L110 54" stroke="${color.furDark}" stroke-width="5" stroke-linecap="round" />

    ${eyesSvg}
    ${accessoryFaceSvg}

    <ellipse cx="58" cy="112" rx="11" ry="7" fill="${pink}" opacity="0.75" />
    <ellipse cx="142" cy="112" rx="11" ry="7" fill="${pink}" opacity="0.75" />

    <path d="M94 104 L106 104 L100 111 Z" fill="${pink}" stroke="${ink}" stroke-width="3" stroke-linejoin="round" />
    ${mouthSvg}

    <g stroke="${ink}" stroke-width="3" stroke-linecap="round">
      <path d="M40 104 L64 108 M40 118 L64 116" />
      <path d="M160 104 L136 108 M160 118 L136 116" />
    </g>

    ${accessoryHeadSvg}
    ${accessoryBowSvg}
    ${accessoryEarSvg}
  </g>

  <!-- [Layer 4] Tay & Phụ ứng động tác -->
  ${pawsSvg}
</svg>
`.trim();
}
