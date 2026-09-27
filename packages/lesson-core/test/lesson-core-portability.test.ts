import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Phần lõi dùng chung phải chạy được trong Cloudflare Worker nên không được dùng API riêng của Node.
describe('tính di động của lesson-core', () => {
  it('không file nào ngoài thư mục node/ import module node:*', () => {
    const srcDir = path.resolve(import.meta.dirname, '../src');
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node') walk(full);
        } else if (/from ['"](node:|fs|path)['"/]/.test(readFileSync(full, 'utf8'))) {
          offenders.push(path.relative(srcDir, full));
        }
      }
    };
    walk(srcDir);
    expect(offenders).toEqual([]);
  });
});
