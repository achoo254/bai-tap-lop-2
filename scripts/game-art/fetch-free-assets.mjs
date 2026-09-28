#!/usr/bin/env node
/**
 * scripts/game-art/fetch-free-assets.mjs
 * Điều phối và đồng bộ các tài nguyên miễn phí vào public/game/
 * Đồng thời kiểm định tính đầy đủ theo licenses.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const sitePublic = path.join(repoRoot, 'apps/site/public');
const gameDir = path.join(sitePublic, 'game');
const illustrationsDir = path.join(sitePublic, 'illustrations');
const licensesPath = path.join(gameDir, 'licenses.json');

// Đảm bảo các thư mục đích tồn tại
fs.mkdirSync(path.join(gameDir, 'kenney'), { recursive: true });
fs.mkdirSync(path.join(gameDir, 'openmoji'), { recursive: true });

// Danh sách các emoji OpenMoji cần thiết cho trò chơi và bài học
const OPENMOJI_FILES = [
  '1F36C.svg', // Kẹo ngọt
  '1F34E.svg', // Táo đỏ
  '2B50.svg', // Ngôi sao vàng
  '1F4D6.svg', // Sách mở
  '1F308.svg', // Cầu vồng
  '23F0.svg', // Đồng hồ báo thức
  '1F4CF.svg', // Thước kẻ
  '1F96D.svg', // Quả xoài
];

console.log('🔄 Đang đồng bộ tài nguyên OpenMoji...');
for (const file of OPENMOJI_FILES) {
  const src = path.join(illustrationsDir, file);
  const dest = path.join(gameDir, 'openmoji', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ Đã chép ${file} sang public/game/openmoji/`);
  } else {
    console.warn(`  ⚠️ Không tìm thấy ${src}`);
  }
}

// Kiểm tra tính hợp lệ của licenses.json
console.log('📋 Đang kiểm tra licenses.json...');
if (!fs.existsSync(licensesPath)) {
  console.error('❌ Thiếu file public/game/licenses.json!');
  process.exit(1);
}

const licenses = JSON.parse(fs.readFileSync(licensesPath, 'utf8'));
let missingCount = 0;

for (const pkg of licenses.packages) {
  if (pkg.id === 'project-original-svg') continue; // Code component
  for (const relativeFile of pkg.files) {
    const fullPath = path.join(gameDir, relativeFile);
    if (!fs.existsSync(fullPath)) {
      console.warn(`  ⚠️ File được đăng ký nhưng chưa có trên đĩa: ${relativeFile}`);
      missingCount++;
    } else {
      console.log(`  ✓ Đã xác minh: ${relativeFile}`);
    }
  }
}

if (missingCount === 0) {
  console.log('✅ Hoàn tất đồng bộ! 100% tài nguyên đã được ghi nhận trong licenses.json.');
} else {
  console.log(`ℹ️ Cần bổ sung ${missingCount} file hình Kenney vào public/game/kenney/`);
}
