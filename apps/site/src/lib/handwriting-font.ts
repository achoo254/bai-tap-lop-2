import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Font chữ mẫu tiểu học (HP001) chỉ có khi phụ huynh thêm file vào public/fonts/.
 * Chưa có file thì ẩn nút "Chữ viết tay" để bé không tập theo nét chữ sai mẫu.
 */
export const HANDWRITING_FONT_FILES = [
  'chu-mau-tieu-hoc.woff2',
  'chu-mau-tieu-hoc.ttf',
  // Bản nét thanh nét đậm (HP001 Bold) giống bảng chữ mẫu treo lớp.
  'chu-mau-tieu-hoc-dam.woff2',
  'chu-mau-tieu-hoc-dam.ttf',
];

export function hasHandwritingFont(publicDir = path.join(process.cwd(), 'public')): boolean {
  return HANDWRITING_FONT_FILES.some((file) => existsSync(path.join(publicDir, 'fonts', file)));
}
