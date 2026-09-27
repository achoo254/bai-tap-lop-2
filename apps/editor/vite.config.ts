import path from 'node:path';
import { defineConfig } from 'vite';

// Giao diện trang Soạn bài được build ra dist-ui rồi server Hono phục vụ.
export default defineConfig({
  root: path.resolve(import.meta.dirname, 'src/ui'),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist-ui'),
    emptyOutDir: true,
    // Font/ảnh dùng đường dẫn tuyệt đối (/fonts, /illustrations) do server phục vụ lúc chạy.
    rollupOptions: { external: [/^\/fonts\//] },
  },
  server: { fs: { allow: [path.resolve(import.meta.dirname, '../..')] } },
});
