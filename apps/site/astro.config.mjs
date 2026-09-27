import { defineConfig } from 'astro/config';

// Web tĩnh cho bé. SITE_URL chỉ cần khi deploy (dùng cho link tuyệt đối).
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  server: { port: 4330, host: '127.0.0.1' },
  devToolbar: { enabled: false },
  vite: {
    // Cho phép Vite đọc package lesson-core nằm ngoài apps/site.
    server: { fs: { allow: ['../..'] } },
  },
});
