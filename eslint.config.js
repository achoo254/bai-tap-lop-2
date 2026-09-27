import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    // ESLint luôn bỏ qua thư mục cài gói; chỉ cần liệt kê output build và nội dung bài.
    ignores: [
      '**/dist/**',
      '**/dist-ui/**',
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
);
