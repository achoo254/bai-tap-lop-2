/**
 * Danh mục hình minh hoạ dùng trong cú pháp `::hinh{loai=<tên> so-luong=<n>}`.
 * Mỗi tên trỏ tới một biểu tượng OpenMoji (CC BY-SA 4.0) theo mã Unicode của emoji.
 */
export interface IllustrationEntry {
  /** Tên tiếng Việt hiển thị cho phụ huynh/AI. */
  label: string;
  /** Tên file SVG OpenMoji (mã hex của emoji). */
  openmoji: string;
}

export const ILLUSTRATION_CATALOG = {
  // Hoa quả, đồ ăn
  tao: { label: 'quả táo', openmoji: '1F34E' },
  cam: { label: 'quả cam', openmoji: '1F34A' },
  chuoi: { label: 'quả chuối', openmoji: '1F34C' },
  'dua-hau': { label: 'quả dưa hấu', openmoji: '1F349' },
  nho: { label: 'chùm nho', openmoji: '1F347' },
  'dau-tay': { label: 'quả dâu tây', openmoji: '1F353' },
  le: { label: 'quả lê', openmoji: '1F350' },
  xoai: { label: 'quả xoài', openmoji: '1F96D' },
  keo: { label: 'cái kẹo', openmoji: '1F36C' },
  'banh-quy': { label: 'cái bánh quy', openmoji: '1F36A' },
  'banh-kem': { label: 'cái bánh kem', openmoji: '1F382' },
  kem: { label: 'que kem', openmoji: '1F366' },
  trung: { label: 'quả trứng', openmoji: '1F95A' },
  'ca-rot': { label: 'củ cà rốt', openmoji: '1F955' },
  ngo: { label: 'bắp ngô', openmoji: '1F33D' },
  // Đồ dùng
  'but-chi': { label: 'bút chì', openmoji: '270F' },
  vo: { label: 'quyển vở', openmoji: '1F4D3' },
  sach: { label: 'quyển sách', openmoji: '1F4D6' },
  thuoc: { label: 'cái thước', openmoji: '1F4CF' },
  cap: { label: 'cặp sách', openmoji: '1F392' },
  'cai-keo': { label: 'cái kéo', openmoji: '2702' },
  bong: { label: 'quả bóng', openmoji: '26BD' },
  'bong-bay': { label: 'quả bóng bay', openmoji: '1F388' },
  qua: { label: 'hộp quà', openmoji: '1F381' },
  'o-to': { label: 'ô tô', openmoji: '1F697' },
  'xe-dap': { label: 'xe đạp', openmoji: '1F6B2' },
  'may-bay': { label: 'máy bay', openmoji: '2708' },
  thuyen: { label: 'con thuyền', openmoji: '26F5' },
  'dong-ho': { label: 'đồng hồ', openmoji: '23F0' },
  // Con vật
  meo: { label: 'con mèo', openmoji: '1F408' },
  cho: { label: 'con chó', openmoji: '1F415' },
  ga: { label: 'con gà', openmoji: '1F414' },
  'ga-con': { label: 'gà con', openmoji: '1F424' },
  vit: { label: 'con vịt', openmoji: '1F986' },
  ca: { label: 'con cá', openmoji: '1F41F' },
  tho: { label: 'con thỏ', openmoji: '1F407' },
  lon: { label: 'con lợn', openmoji: '1F416' },
  bo: { label: 'con bò', openmoji: '1F404' },
  ngua: { label: 'con ngựa', openmoji: '1F40E' },
  voi: { label: 'con voi', openmoji: '1F418' },
  khi: { label: 'con khỉ', openmoji: '1F412' },
  chim: { label: 'con chim', openmoji: '1F426' },
  buom: { label: 'con bướm', openmoji: '1F98B' },
  ong: { label: 'con ong', openmoji: '1F41D' },
  rua: { label: 'con rùa', openmoji: '1F422' },
  ech: { label: 'con ếch', openmoji: '1F438' },
  cua: { label: 'con cua', openmoji: '1F980' },
  gau: { label: 'con gấu', openmoji: '1F43B' },
  // Thiên nhiên, hình
  hoa: { label: 'bông hoa', openmoji: '1F338' },
  'hoa-hong': { label: 'bông hoa hồng', openmoji: '1F339' },
  'huong-duong': { label: 'hoa hướng dương', openmoji: '1F33B' },
  cay: { label: 'cái cây', openmoji: '1F333' },
  la: { label: 'chiếc lá', openmoji: '1F343' },
  sao: { label: 'ngôi sao', openmoji: '2B50' },
  'mat-troi': { label: 'mặt trời', openmoji: '2600' },
  'mat-trang': { label: 'mặt trăng', openmoji: '1F319' },
  may: { label: 'đám mây', openmoji: '2601' },
  'cau-vong': { label: 'cầu vồng', openmoji: '1F308' },
  'trai-tim': { label: 'trái tim', openmoji: '2764' },
  'hinh-tron': { label: 'hình tròn', openmoji: '1F534' },
  'hinh-vuong': { label: 'hình vuông', openmoji: '1F7E6' },
  'tam-giac': { label: 'hình tam giác', openmoji: '1F53A' },
} as const satisfies Record<string, IllustrationEntry>;

export type IllustrationName = keyof typeof ILLUSTRATION_CATALOG;

export const ILLUSTRATION_NAMES = Object.keys(ILLUSTRATION_CATALOG) as IllustrationName[];

export const MAX_ILLUSTRATION_COUNT = 20;

export function isIllustrationName(name: string): name is IllustrationName {
  return Object.hasOwn(ILLUSTRATION_CATALOG, name);
}
