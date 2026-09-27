import { defineConfig, devices } from '@playwright/test';

// Kiểm thử web trên bản build từ bài mẫu trong tests/fixtures/content.
const port = 4331;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
  },
  projects: [
    { name: 'may-tinh-bang', use: { ...devices['Desktop Chrome'], viewport: { width: 1180, height: 820 }, hasTouch: true } },
    { name: 'laptop', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 1024 } } },
  ],
  webServer: {
    command: `pnpm build && pnpm exec astro preview --port ${port} --host 127.0.0.1`,
    url: `http://127.0.0.1:${port}/`,
    env: { CONTENT_DIR: 'tests/fixtures/content' },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
