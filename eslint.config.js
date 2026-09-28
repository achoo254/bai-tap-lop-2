import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    // ESLint luôn bỏ qua thư mục cài gói; chỉ cần liệt kê output build và nội dung bài.
    ignores: [
      '**/dist/**',
      '**/dist-ui/**',
      '**/dist-e2e/**',
      'apps/site/public/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '**/.astro/**',
      '**/.wrangler/**',
      '**/worker-configuration.d.ts',
      'content/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // File chép nguyên từ mẫu của Cloudflare; giữ đúng bản gốc để dễ cập nhật.
    files: ['apps/mcp-worker/src/auth/workers-oauth-utils.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
