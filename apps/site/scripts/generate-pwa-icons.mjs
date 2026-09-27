// Tạo icon PNG cho PWA từ hình mèo con: node scripts/generate-pwa-icons.mjs
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8');
const outDir = new URL('../public/icons/', import.meta.url);
const variants = [
  { name: 'icon-192.png', size: 192, padding: 0.1 },
  { name: 'icon-512.png', size: 512, padding: 0.1 },
  // Icon "maskable": chừa vùng an toàn 20% để Android cắt tròn không mất tai mèo.
  { name: 'icon-maskable-512.png', size: 512, padding: 0.22 },
  { name: 'apple-touch-icon.png', size: 180, padding: 0.12 },
];
const browser = await chromium.launch();
const page = await browser.newPage();
for (const { name, size, padding } of variants) {
  const inner = Math.round(size * (1 - padding * 2));
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:#ffcf3f">` +
      `<div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div></body>`,
  );
  await page.screenshot({ path: fileURLToPath(new URL(name, outDir)), omitBackground: false });
}
await browser.close();
console.log('Đã tạo icon PWA');
