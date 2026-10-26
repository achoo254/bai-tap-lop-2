import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Trang gắn noindex trong kid-page-layout không được đưa vào sitemap.
const NOINDEX_PATHS = ['/404/', '/offline/', '/xem-truoc/', '/luyen-timo/'];

// Web tĩnh cho bé. `site` dùng cho canonical và sitemap; SITE_URL cho phép ghi đè khi cần.
export default defineConfig({
  site: process.env.SITE_URL || 'https://lop2.hoandat.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  server: { port: 4330, host: '127.0.0.1' },
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((path) => new URL(page).pathname.startsWith(path)),
    }),
  ],
  vite: {
    // Cho phép Vite đọc package lesson-core nằm ngoài apps/site.
    server: { fs: { allow: ['../..'] } },
  },
});
