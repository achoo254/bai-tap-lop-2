import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditorApp } from '../src/server/editor-http-server';
import type { EditorPaths } from '../src/server/editor-paths';
import { GitSyncService } from '../src/server/git-sync-service';
import { LessonFileRepository } from '../src/server/lesson-file-repository';

const DRAFT = 'phiensoanthu01';
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function git(cwd: string, ...args: string[]) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

let workDir: string;
let repoDir: string;
let remoteDir: string;
let paths: EditorPaths;
let app: ReturnType<typeof createEditorApp>;

beforeEach(() => {
  workDir = mkdtempSync(path.join(tmpdir(), 'soan-bai-'));
  remoteDir = path.join(workDir, 'remote.git');
  repoDir = path.join(workDir, 'repo');
  git(workDir, 'init', '--bare', '-b', 'main', remoteDir);
  git(workDir, 'init', '-b', 'main', repoDir);
  git(repoDir, 'config', 'user.name', 'Kiem thu');
  git(repoDir, 'config', 'user.email', 'kiemthu@example.com');
  mkdirSync(path.join(repoDir, 'content'));
  writeFileSync(path.join(repoDir, 'content/.gitkeep'), '');
  writeFileSync(path.join(repoDir, '.gitignore'), 'content/.soan-tam/\n');
  git(repoDir, 'add', '-A');
  git(repoDir, 'commit', '-m', 'khoi tao');
  git(repoDir, 'remote', 'add', 'origin', remoteDir);

  paths = {
    repoRoot: repoDir,
    contentDir: path.join(repoDir, 'content'),
    stagingDir: path.join(repoDir, 'content/.soan-tam'),
    sitePublicDir: path.join(repoDir, 'public'),
    uiDistDir: path.join(repoDir, 'ui'),
  };
  app = createEditorApp({
    paths,
    repository: new LessonFileRepository(paths.contentDir, paths.stagingDir),
    git: new GitSyncService(repoDir),
    siteUrl: 'https://bai.example',
    trustAllHosts: true,
  });
});

afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

async function upload(name: string, bytes: Uint8Array<ArrayBuffer> = PNG, draftKey = DRAFT) {
  const form = new FormData();
  form.set('file', new File([bytes], name));
  form.set('draftKey', draftKey);
  return app.request('/api/tai-len', { method: 'POST', body: form });
}

function saveBody(overrides: Record<string, unknown> = {}) {
  return {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      originalId: null,
      draftKey: DRAFT,
      tieu_de: 'Cộng có nhớ',
      ngay: '2026-09-28',
      mon: 'toan',
      nhap: false,
      deBai: 'Bài 1. Tính 37 + 25.\n\n![Hình](hinh-bai-1.png)',
      loiGiai: 'Đáp số: 62.',
      ...overrides,
    }),
  };
}

describe('trang Soạn bài', () => {
  it('tải ảnh lên, lưu & đăng: tạo thư mục bài, commit và đẩy lên remote', async () => {
    const uploaded = await upload('Hình Bài 1.PNG');
    expect(await uploaded.json()).toEqual({ fileName: 'hinh-bai-1.png' });

    const response = await app.request('/api/bai', saveBody());
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.id).toBe('2026-09-28-cong-co-nho');
    expect(result.git).toMatchObject({ committed: true, pushed: true });
    expect(result.linkXemTruoc).toMatch(/^https:\/\/bai\.example\/xem-truoc\/[a-z0-9]{12}\/$/);

    const lessonDir = path.join(paths.contentDir, result.id);
    expect(existsSync(path.join(lessonDir, 'hinh-bai-1.png'))).toBe(true);
    expect(readFileSync(path.join(lessonDir, 'bai.md'), 'utf8')).toContain('nhap: false');
    expect(existsSync(path.join(paths.stagingDir, DRAFT))).toBe(false);
    expect(git(remoteDir, 'log', '--oneline', 'main')).toContain('content: thêm bài đăng 2026-09-28-cong-co-nho');
  });

  it('từ chối lưu bài có lỗi và không ghi gì', async () => {
    const response = await app.request('/api/bai', saveBody({ deBai: 'bài viết thường.' }));
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.chiTiet.map((issue: { code: string }) => issue.code)).toContain('dau-cau-chu-thuong');
    expect(existsSync(path.join(paths.contentDir, '2026-09-28-cong-co-nho'))).toBe(false);
  });

  it('báo lỗi khi bài dùng ảnh chưa tải lên', async () => {
    const response = await app.request('/api/bai', saveBody());
    expect(response.status).toBe(422);
  });

  it('sửa bài giữ nguyên mã xem trước và bỏ file không còn dùng', async () => {
    await upload('hinh-bai-1.png');
    const first = await (await app.request('/api/bai', saveBody())).json();
    const updated = await app.request(
      '/api/bai',
      saveBody({ originalId: first.id, draftKey: 'phiensoanthu02', deBai: 'Bài 1. Tính 37 + 25.', nhap: true }),
    );
    const second = await updated.json();
    expect(second.id).toBe(first.id);
    expect(second.frontmatter.ma_xem_truoc).toBe(first.frontmatter.ma_xem_truoc);
    expect(existsSync(path.join(paths.contentDir, first.id, 'hinh-bai-1.png'))).toBe(false);

    const detail = await (await app.request(`/api/bai/${first.id}`)).json();
    expect(detail.frontmatter.nhap).toBe(true);
    expect(detail.deBai).toBe('Bài 1. Tính 37 + 25.');
  });

  it('tên trùng thì thêm hậu tố cho mã bài', async () => {
    const body = saveBody({ deBai: 'Bài 1. Tính.' });
    const first = await (await app.request('/api/bai', body)).json();
    const second = await (await app.request('/api/bai', saveBody({ deBai: 'Bài 2. Tính.' }))).json();
    expect(first.id).toBe('2026-09-28-cong-co-nho');
    expect(second.id).toBe('2026-09-28-cong-co-nho-2');
  });

  it('xoá bài và commit việc xoá', async () => {
    const saved = await (await app.request('/api/bai', saveBody({ deBai: 'Bài 1. Tính.' }))).json();
    const response = await app.request(`/api/bai/${saved.id}`, { method: 'DELETE' });
    expect(response.status).toBe(200);
    expect(existsSync(path.join(paths.contentDir, saved.id))).toBe(false);
    expect(git(repoDir, 'log', '-1', '--format=%s')).toBe(`content: xoá bài ${saved.id}`);
  });

  it('chặn file sai loại, mã phiên và mã bài nguy hiểm', async () => {
    expect((await upload('virus.exe')).status).toBe(422);
    expect((await upload('anh.png', PNG, '../../etc')).status).toBe(422);
    expect((await app.request('/api/bai/..%2F..%2Fetc', { method: 'DELETE' })).status).toBe(422);
    expect((await app.request('/media/..%2F..%2F.git/config')).status).toBe(404);
    expect((await app.request('/illustrations/..%2F..%2Fcontent/.gitkeep')).status).toBe(404);
  });

  it('danh sách bài hiện bài mới nhất trước', async () => {
    await app.request('/api/bai', saveBody({ deBai: 'Bài 1. Tính.', ngay: '2026-09-01' }));
    await app.request('/api/bai', saveBody({ deBai: 'Bài 2. Tính.', ngay: '2026-09-30' }));
    const list = await (await app.request('/api/bai')).json();
    expect(list.map((item: { ngay: string }) => item.ngay)).toEqual(['2026-09-30', '2026-09-01']);
  });

  it('lấy bài Claude vừa đăng từ remote trước khi lưu', async () => {
    const otherClone = path.join(workDir, 'claude-clone');
    await app.request('/api/bai', saveBody({ deBai: 'Bài 1. Tính.' }));
    git(workDir, 'clone', remoteDir, otherClone);
    git(otherClone, 'config', 'user.name', 'MCP');
    git(otherClone, 'config', 'user.email', 'mcp@example.com');
    const mcpLesson = path.join(otherClone, 'content/2026-10-01-bai-tu-mcp');
    mkdirSync(mcpLesson, { recursive: true });
    writeFileSync(path.join(mcpLesson, 'bai.md'), '---\ntieu_de: Bài từ MCP\nngay: 2026-10-01\nmon: khac\nnhap: true\nma_xem_truoc: tumcp123456\n---\n\n## Đề bài\n\nBài.\n');
    git(otherClone, 'add', '-A');
    git(otherClone, 'commit', '-m', 'mcp');
    git(otherClone, 'push', 'origin', 'main');

    const response = await app.request('/api/bai', saveBody({ deBai: 'Bài 3. Tính.', tieu_de: 'Bài khác' }));
    expect((await response.json()).git.pushed).toBe(true);
    expect(existsSync(path.join(paths.contentDir, '2026-10-01-bai-tu-mcp/bai.md'))).toBe(true);
  });
});

describe('bảo vệ Host/Origin', () => {
  it('từ chối Host lạ và Origin lạ', async () => {
    const guarded = createEditorApp({
      paths,
      repository: new LessonFileRepository(paths.contentDir, paths.stagingDir),
      git: new GitSyncService(repoDir),
    });
    expect((await guarded.request('http://evil.example/api/bai')).status).toBe(403);
    const crossSite = await guarded.request('http://127.0.0.1:4321/api/bai/2026-09-28-x', {
      method: 'DELETE',
      headers: { origin: 'https://evil.example' },
    });
    expect(crossSite.status).toBe(403);
    expect((await guarded.request('http://127.0.0.1:4321/api/bai')).status).toBe(200);
  });
});
