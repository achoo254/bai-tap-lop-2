// Chụp màn hình các trang chính để duyệt giao diện: node scripts/capture-screenshots.mjs <thư-mục-ra> [baseURL]
import { chromium } from '@playwright/test';
const outDir = process.argv[2] ?? 'screenshots';
const base = process.argv[3] ?? 'http://127.0.0.1:4331';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 1, timezoneId: 'Asia/Ho_Chi_Minh' });
await page.clock.setFixedTime(new Date('2026-09-26T09:00:00+07:00'));
const shots = [
  ['01-trang-chu', '/'],
  ['02-bai-toan', '/bai/2026-09-25-cong-co-nho/'],
  ['04-bai-tieng-viet', '/bai/2026-09-26-dien-van-an-ang/'],
  ['06-tat-ca-bai', '/cac-bai/'],
  ['07-xem-truoc-nhap', '/xem-truoc/nhapthu20260928/'],
];
for (const [name, url] of shots) {
  await page.goto(base + url);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
}
await page.goto(base + '/bai/2026-09-25-cong-co-nho/');
await page.getByText('Xem lời giải').click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${outDir}/03-bai-toan-loi-giai.png`, fullPage: true });
await page.goto(base + '/bai/2026-09-26-dien-van-an-ang/');
await page.locator('[data-font-toggle]').click();
await page.getByText('Xem lời giải').click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/05-bai-tieng-viet-chu-viet-tay.png`, fullPage: true });
await browser.close();
