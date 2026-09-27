import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const setToday = (isoDate: string) => new Date(`${isoDate}T09:00:00+07:00`);

test.describe('trang chủ', () => {
  test('hiện bài của hôm nay theo giờ Việt Nam', async ({ page }) => {
    await page.clock.setFixedTime(setToday('2026-09-26'));
    await page.goto('/');
    await expect(page.locator('[data-greeting]')).toContainText('Bài hôm nay');
    const visibleCards = page.locator('[data-card]:not([hidden])');
    await expect(visibleCards).toHaveCount(1);
    await expect(visibleCards.first()).toContainText('Điền vần an hay ang');
  });

  test('chưa có bài hôm nay thì hiện bài gần nhất', async ({ page }) => {
    await page.clock.setFixedTime(setToday('2026-10-05'));
    await page.goto('/');
    await expect(page.locator('[data-greeting]')).toContainText('bài gần nhất');
    await expect(page.locator('[data-card]:not([hidden])')).toContainText('Xem giờ trên đồng hồ');
  });

  test('không hiện bài nháp ở trang chủ và danh sách', async ({ page }) => {
    await page.goto('/cac-bai/');
    await expect(page.locator('[data-card]')).toHaveCount(3);
    await expect(page.getByText('Bài nháp thử')).toHaveCount(0);
  });
});

test.describe('trang bài', () => {
  test('lời giải ẩn, bấm để xem và ẩn lại', async ({ page }) => {
    await page.goto('/bai/2026-09-25-cong-co-nho/');
    const solution = page.locator('[data-solution]');
    await expect(solution.locator('.lesson-blocks')).toBeHidden();
    await page.getByText('Xem lời giải').click();
    await expect(solution.locator('.lesson-blocks')).toBeVisible();
    await expect(solution).toContainText('Đáp số: 8 quả táo.');
    await page.getByText('Ẩn lời giải').click();
    await expect(solution.locator('.lesson-blocks')).toBeHidden();
  });

  test('hình minh hoạ hiện đúng số lượng', async ({ page }) => {
    await page.goto('/bai/2026-09-25-cong-co-nho/');
    const illustration = page.locator('.lesson-illustration').first();
    await expect(illustration).toHaveAttribute('aria-label', '5 quả táo');
    await expect(illustration.locator('img')).toHaveCount(5);
  });

  test('chuyển font viết tay và nhớ sau khi tải lại', async ({ page }) => {
    await page.goto('/bai/2026-09-26-dien-van-an-ang/');
    const toggle = page.locator('[data-font-toggle]');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-font', 'viet-tay');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-font', 'viet-tay');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.click();
    await expect(page.locator('html')).not.toHaveAttribute('data-font', 'viet-tay');
  });

  test('nút A+ tăng cỡ chữ và được nhớ', async ({ page }) => {
    await page.goto('/bai/2026-09-26-dien-van-an-ang/');
    const fontSize = () => page.locator('.lesson-text').first().evaluate((el) => getComputedStyle(el).fontSize);
    const before = await fontSize();
    await page.getByRole('button', { name: 'Chữ to hơn' }).click();
    const after = await fontSize();
    expect(parseFloat(after)).toBeGreaterThan(parseFloat(before));
    await page.reload();
    expect(await fontSize()).toBe(after);
  });

  test('ảnh phóng to và đóng lại', async ({ page }) => {
    await page.goto('/bai/2026-09-26-dien-van-an-ang/');
    await page.locator('.zoomable').first().click();
    const dialog = page.locator('[data-zoom-dialog]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('img')).toHaveAttribute('src', /tranh-con-ngan\.png$/);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('video và YouTube được nhúng', async ({ page }) => {
    await page.goto('/bai/2026-09-27-xem-gio-dong-ho/');
    await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/dQw4w9WgXcQ"]')).toHaveCount(1);
    await page.getByText('Xem lời giải').click();
    await expect(page.locator('video[src$="clip.mp4"]')).toHaveCount(1);
  });

  test('chuyển bài trước/sau', async ({ page }) => {
    await page.goto('/bai/2026-09-26-dien-van-an-ang/');
    await page.locator('[data-nav="sau"]').click();
    await expect(page).toHaveURL(/2026-09-27-xem-gio-dong-ho/);
    await page.locator('[data-nav="truoc"]').click();
    await expect(page).toHaveURL(/2026-09-26-dien-van-an-ang/);
  });
});

test.describe('xem trước bài nháp', () => {
  test('có dải BẢN NHÁP và noindex', async ({ page }) => {
    await page.goto('/xem-truoc/nhapthu20260928/');
    await expect(page.locator('.draft-banner')).toContainText('BẢN NHÁP');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('bài nháp không có trang /bai/', async ({ page }) => {
    const response = await page.goto('/bai/2026-09-28-bai-nhap-thu/');
    expect(response?.status()).toBe(404);
  });
});

test.describe('khả năng tiếp cận', () => {
  for (const url of ['/', '/bai/2026-09-25-cong-co-nho/', '/cac-bai/']) {
    test(`không có lỗi a11y nghiêm trọng ở ${url}`, async ({ page }) => {
      await page.goto(url);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  }
});
