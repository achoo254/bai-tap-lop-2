import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const setToday = (isoDate: string) => new Date(`${isoDate}T09:00:00+07:00`);

test.describe('trang chủ', () => {
  test('hiện lời chào theo buổi và cổng thế giới học tập', async ({ page }) => {
    await page.clock.setFixedTime(setToday('2026-09-26'));
    await page.goto('/');
    await expect(page.locator('[data-greeting]')).toContainText('Chào Miu buổi sáng');
    await expect(page.locator('[data-greeting]')).toContainText('Thế giới học tập');
    await expect(page.locator('a[href="/the-gioi/"]')).toBeVisible();
    await expect(page.locator('a[href="/the-gioi/"]')).toContainText('Thế giới học tập');
  });

  test('sinh nhật Miu và em Bo hiện lời chúc', async ({ page }) => {
    await page.clock.setFixedTime(setToday('2026-12-15'));
    await page.goto('/');
    await expect(page.locator('[data-birthday]')).toContainText('Chúc mừng sinh nhật Miu');
    await page.clock.setFixedTime(setToday('2027-03-19'));
    await page.goto('/');
    await expect(page.locator('[data-birthday]')).toContainText('sinh nhật em Bo');
  });

  test('không hiện bài nháp ở danh sách', async ({ page }) => {
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
    await page.getByText('Miu xem lời giải').click();
    await expect(solution.locator('.lesson-blocks')).toBeVisible();
    await expect(solution).toContainText('Đáp số: 8 quả táo.');
    await expect(solution.locator('[data-praise]')).toContainText('Miu');
    await page.getByText('Ẩn lời giải').click();
    await expect(solution.locator('.lesson-blocks')).toBeHidden();
  });

  test('hình minh hoạ hiện đúng số lượng', async ({ page }) => {
    await page.goto('/bai/2026-09-25-cong-co-nho/');
    const illustration = page.locator('.lesson-illustration').first();
    await expect(illustration).toHaveAttribute('aria-label', '5 quả táo');
    await expect(illustration.locator('img')).toHaveCount(5);
  });

  test('mặc định hiện chữ viết tay mẫu tiểu học, chọn chữ in thì được nhớ', async ({ page }) => {
    await page.goto('/bai/2026-09-26-dien-van-an-ang/');
    const html = page.locator('html');
    const toggle = page.locator('[data-font-toggle]');
    await expect(html).toHaveAttribute('data-font', 'viet-tay');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    const fontFamily = await page
      .locator('.lesson-text')
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fontFamily).toContain('Chu Mau Tieu Hoc');
    expect(
      await page.evaluate(() => document.fonts.check('700 40px "Chu Mau Tieu Hoc"', 'Miu')),
    ).toBe(true);
    await toggle.click();
    await expect(html).not.toHaveAttribute('data-font', 'viet-tay');
    await page.reload();
    await expect(html).not.toHaveAttribute('data-font', 'viet-tay');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('nút A+ tăng cỡ chữ và được nhớ', async ({ page }) => {
    await page.goto('/bai/2026-09-26-dien-van-an-ang/');
    const fontSize = () =>
      page
        .locator('.lesson-text')
        .first()
        .evaluate((el) => getComputedStyle(el).fontSize);
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
    await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/dQw4w9WgXcQ"]')).toHaveCount(
      1,
    );
    await page.getByText('Miu xem lời giải').click();
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
      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  }
});

test.describe('PWA', () => {
  test('có manifest hợp lệ và service worker hoạt động', async ({ page, request }) => {
    const manifest = await (await request.get('/manifest.webmanifest')).json();
    expect(manifest).toMatchObject({
      short_name: 'Miu học bài',
      display: 'standalone',
      start_url: '/?nguon=pwa',
    });
    for (const icon of manifest.icons) expect((await request.get(icon.src)).ok()).toBe(true);

    await page.goto('/');
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      'href',
      '/manifest.webmanifest',
    );
    const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
    expect(scope).toMatch(/\/$/);
  });

  test('mất mạng vẫn mở lại được bài đã xem, trang lạ thì hiện trang ngoại tuyến', async ({
    page,
    context,
  }) => {
    await page.goto('/');
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.reload();
    await page.goto('/bai/2026-09-25-cong-co-nho/');
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('.lesson-title')).toHaveText('Cộng có nhớ trong phạm vi 100');
    await page.goto('/bai/2026-09-26-dien-van-an-ang/');
    await expect(page.locator('.speech-bubble')).toContainText('mất mạng');
    await context.setOffline(false);
  });
});

test.describe('nhiệm vụ đọc hiểu', () => {
  test('trả lời đúng không tự chuyển câu, có nút câu tiếp và quay lại', async ({ page }) => {
    // Nút "Câu tiếp" nhấp nháy khi sẵn sàng; tắt hoạt ảnh để trình duyệt tự động bấm được
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/the-gioi/choi/?nv=lop-2%2Ftieng-viet%2Fch1%2Fq1-doc-hieu');
    const step = page.locator('#quest-step-text');
    const next = page.locator('#btn-next-question');
    const prev = page.locator('#btn-prev-question');
    await expect(next).toBeDisabled();
    await expect(prev).toBeDisabled();

    await page.locator('#opt-btn-a').click();
    await page.waitForTimeout(1200);
    // Vẫn ở câu 1 để bé kịp chép mẫu viết vở
    await expect(step).toContainText('Câu 1');
    await expect(page.getByText('Mẫu viết vào vở hướng dẫn học')).toBeVisible();
    await expect(next).toBeEnabled();

    await next.click();
    await expect(step).toContainText('Câu 2');
    await expect(next).toBeDisabled();

    await prev.click();
    await expect(step).toContainText('Câu 1');
    // Câu đã làm đúng: hiện lại mẫu viết vở, được đi tiếp ngay
    await expect(page.getByText('Mẫu viết vào vở hướng dẫn học')).toBeVisible();
    await expect(next).toBeEnabled();
  });
});

test.describe('thời khoá biểu trang chủ', () => {
  test('đổi ngày vẫn giữ nguyên kiểu ô tiết học', async ({ page }) => {
    await page.clock.setFixedTime(setToday('2026-09-28'));
    await page.goto('/');
    const firstPeriod = page.locator('#tt-morning-list .period-item').first();
    const before = await firstPeriod.evaluate((e) => getComputedStyle(e).borderRadius);
    await page.locator('[data-tt-day="2"]').click();
    await expect(page.locator('#tt-morning-list')).toContainText('Tiếng Việt');
    expect(await firstPeriod.evaluate((e) => getComputedStyle(e).borderRadius)).toBe(before);
    expect(before).not.toBe('0px');
  });
});
