import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { hasHandwritingFont } from '../../src/lib/handwriting-font';

let dir: string;
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('hasHandwritingFont', () => {
  it('chưa có file font thì trả false', () => {
    dir = mkdtempSync(path.join(tmpdir(), 'font-'));
    expect(hasHandwritingFont(dir)).toBe(false);
  });

  it('có file .ttf hoặc .woff2 thì trả true', () => {
    dir = mkdtempSync(path.join(tmpdir(), 'font-'));
    mkdirSync(path.join(dir, 'fonts'));
    writeFileSync(path.join(dir, 'fonts', 'chu-mau-tieu-hoc.ttf'), 'x');
    expect(hasHandwritingFont(dir)).toBe(true);
  });
});
