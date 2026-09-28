import { describe, expect, it } from 'vitest';
import {
  ContentConflictError,
  type CommitRequest,
  type LessonFileStore,
} from '../src/github/github-content-store';
import { isPrivateHost } from '../src/github/media-fetcher';
import { LessonService, LessonServiceError } from '../src/lessons/lesson-service';

/** Kho giả trong bộ nhớ, ghi lại từng commit và phát hiện xung đột giống GitHubContentStore. */
class MemoryStore implements LessonFileStore {
  files = new Map<string, string | Uint8Array>();
  commits: CommitRequest[] = [];
  /** Đường dẫn bị đổi ở mỗi phiên bản (phiên bản = số commit). */
  private changes: string[][] = [];

  async headSha() {
    return String(this.changes.length);
  }
  async listLessonFiles() {
    const lessons = new Map<string, string[]>();
    for (const path of this.files.keys()) {
      const [, id, file] = path.split('/');
      lessons.set(id!, [...(lessons.get(id!) ?? []), file!]);
    }
    return lessons;
  }
  async readText(path: string) {
    const value = this.files.get(path);
    return typeof value === 'string' ? value : null;
  }
  async readTexts(paths: string[]) {
    return new Map(
      await Promise.all(paths.map(async (path) => [path, await this.readText(path)] as const)),
    );
  }
  async commit(request: CommitRequest) {
    if (request.baseSha !== undefined && request.guardPaths) {
      const changedSince = this.changes.slice(Number(request.baseSha)).flat();
      const touched = changedSince.filter((path) =>
        request.guardPaths!.some((guard) => path.startsWith(guard)),
      );
      if (touched.length > 0) throw new ContentConflictError(touched);
    }
    this.commits.push(request);
    this.write(request.upserts, request.deletes);
  }
  /** Mô phỏng nơi khác (trang Soạn bài) ghi thẳng vào repo. */
  write(upserts: { path: string; content: string | Uint8Array }[], deletes: string[] = []) {
    for (const file of upserts) this.files.set(file.path, file.content);
    for (const path of deletes) this.files.delete(path);
    this.changes.push([...upserts.map((file) => file.path), ...deletes]);
  }
}

const SITE = 'https://bai.example';
const input = {
  tieu_de: 'Cộng có nhớ',
  ngay: '2026-09-28',
  mon: 'toan' as const,
  de_bai: 'Bài 1. Tính 37 + 25.\n\n::hinh{loai=tao so-luong=3}',
  loi_giai: 'Đáp số: 62.',
};

function setup() {
  const store = new MemoryStore();
  return { store, service: new LessonService(store, SITE) };
}

describe('LessonService', () => {
  it('tạo bài nháp trong một commit, kèm link xem trước', async () => {
    const { store, service } = setup();
    const lesson = await service.create(input);
    expect(lesson.id).toBe('2026-09-28-cong-co-nho');
    expect(lesson.frontmatter.nhap).toBe(true);
    expect(lesson.links.xemTruoc).toMatch(/^https:\/\/bai\.example\/xem-truoc\/[a-z0-9]{12}\/$/);
    expect(lesson.links.bai).toBeNull();
    expect(store.commits).toHaveLength(1);
    expect(store.files.get('content/2026-09-28-cong-co-nho/bai.md')).toContain('nhap: true');
  });

  it('không lưu bài sai quy tắc và trả danh sách lỗi', async () => {
    const { store, service } = setup();
    const error = await service
      .create({ ...input, de_bai: 'bài viết thường.' })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(LessonServiceError);
    expect((error as LessonServiceError).issues.map((issue) => issue.code)).toContain(
      'dau-cau-chu-thuong',
    );
    expect(store.commits).toHaveLength(0);
  });

  it('tự chuẩn hoá dấu kiểu cũ và NFC', async () => {
    const { store, service } = setup();
    await service.create({ ...input, de_bai: 'Bạn Hòa rất khỏe.'.normalize('NFD') });
    const source = store.files.get('content/2026-09-28-cong-co-nho/bai.md') as string;
    expect(source).toContain('Bạn Hoà rất khoẻ.');
    expect(source).toBe(source.normalize('NFC'));
  });

  it('đăng bài: bỏ nháp, trả link trang của bé', async () => {
    const { service } = setup();
    const created = await service.create(input);
    const published = await service.publish(created.id);
    expect(published.frontmatter.nhap).toBe(false);
    expect(published.links.bai).toBe(`${SITE}/bai/${created.id}/`);
    expect((await service.get(created.id)).frontmatter.nhap).toBe(false);
  });

  it('chặn đăng bài đang có lỗi', async () => {
    const { store, service } = setup();
    const created = await service.create(input);
    const path = `content/${created.id}/bai.md`;
    store.files.set(path, (store.files.get(path) as string).replace('Bài 1. Tính', 'bài 1. tính'));
    await expect(service.publish(created.id)).rejects.toThrow('chưa đăng được');
    expect((await service.get(created.id)).frontmatter.nhap).toBe(true);
  });

  it('sửa bài giữ mã bài và mã xem trước', async () => {
    const { service } = setup();
    const created = await service.create(input);
    const updated = await service.update(created.id, {
      tieu_de: 'Cộng có nhớ (sửa)',
      loi_giai: 'Đáp số: 62 quả.',
    });
    expect(updated.id).toBe(created.id);
    expect(updated.frontmatter.ma_xem_truoc).toBe(created.frontmatter.ma_xem_truoc);
    expect((await service.get(created.id)).loiGiai).toBe('Đáp số: 62 quả.');
  });

  it('xoá cần xác nhận', async () => {
    const { store, service } = setup();
    const created = await service.create(input);
    const preview = await service.remove(created.id, false);
    expect(preview.deleted).toBe(false);
    expect(preview.summary).toContain('Cộng có nhớ');
    expect(store.files.size).toBe(1);
    await service.remove(created.id, true);
    expect(store.files.size).toBe(0);
  });

  it('thêm ảnh và tự chèn vào đề bài trong cùng một commit', async () => {
    const { store, service } = setup();
    const created = await service.create(input);
    const result = await service.addMedia(created.id, {
      bytes: new Uint8Array([1, 2, 3]),
      fileName: 'Ảnh Bài 1.PNG',
      moTa: 'Hình minh hoạ',
      chenVao: 'de-bai',
    });
    expect(result.fileName).toBe('anh-bai-1.png');
    expect(result.record.deBai.endsWith('![Hình minh hoạ](anh-bai-1.png)')).toBe(true);
    expect(store.commits.at(-1)?.upserts.map((file) => file.path)).toEqual([
      `content/${created.id}/anh-bai-1.png`,
      `content/${created.id}/bai.md`,
    ]);
  });

  it('từ chối file sai loại và mã bài lạ', async () => {
    const { service } = setup();
    const created = await service.create(input);
    await expect(
      service.addMedia(created.id, { bytes: new Uint8Array(1), fileName: 'x.exe' }),
    ).rejects.toThrow('Chỉ nhận');
    await expect(service.get('../../etc')).rejects.toThrow('không hợp lệ');
    await expect(service.get('2026-01-01-khong-co')).rejects.toThrow('Không tìm thấy');
  });

  it('danh sách lọc theo trạng thái và ngày, mới nhất trước', async () => {
    const { service } = setup();
    const a = await service.create({ ...input, ngay: '2026-09-01', tieu_de: 'Bài A' });
    await service.create({ ...input, ngay: '2026-09-20', tieu_de: 'Bài B' });
    await service.publish(a.id);
    expect((await service.list()).lessons.map((l) => l.frontmatter.tieu_de)).toEqual([
      'Bài B',
      'Bài A',
    ]);
    expect((await service.list({ nhap: false })).lessons.map((l) => l.id)).toEqual([a.id]);
    expect((await service.list({ tu_ngay: '2026-09-10' })).lessons).toHaveLength(1);
  });

  it('danh sách lọc theo ngày học trong bài, không theo mã bài; báo bài hỏng', async () => {
    const { store, service } = setup();
    const lesson = await service.create({ ...input, ngay: '2026-09-01' });
    await service.update(lesson.id, { ngay: '2026-10-15' });
    store.write([{ path: 'content/2026-09-02-hong/bai.md', content: 'không phải bài' }]);
    const result = await service.list({ tu_ngay: '2026-10-01' });
    expect(result.lessons.map((l) => l.id)).toEqual([lesson.id]);
    expect(result.broken).toEqual(['2026-09-02-hong']);
  });

  it('không ghi đè khi bài vừa bị sửa ở nơi khác giữa lúc đọc và lúc ghi', async () => {
    const { store, service } = setup();
    const created = await service.create(input);
    const path = `content/${created.id}/bai.md`;
    // Trang Soạn bài sửa bài ngay khi Claude đang chuẩn bị ghi.
    const realGet = service.get.bind(service);
    service.get = async (id) => {
      const record = await realGet(id);
      store.write([
        {
          path,
          content: (store.files.get(path) as string).replace(
            'Đáp số: 62.',
            'Đáp số: 62 (phụ huynh sửa).',
          ),
        },
      ]);
      return record;
    };
    await expect(
      service.update(created.id, { loi_giai: 'Đáp số: 62 (Claude sửa).' }),
    ).rejects.toBeInstanceOf(ContentConflictError);
    expect(store.files.get(path)).toContain('phụ huynh sửa');
  });

  it('bài khác thay đổi thì vẫn ghi bình thường', async () => {
    const { store, service } = setup();
    const created = await service.create(input);
    const realGet = service.get.bind(service);
    service.get = async (id) => {
      const record = await realGet(id);
      store.write([{ path: 'content/2026-10-01-bai-khac/bai.md', content: 'x' }]);
      return record;
    };
    await expect(service.publish(created.id)).resolves.toMatchObject({
      frontmatter: { nhap: false },
    });
  });
});

describe('chống SSRF khi tải media', () => {
  it('chặn địa chỉ nội bộ', () => {
    for (const host of [
      'localhost',
      '127.0.0.1',
      '10.1.2.3',
      '192.168.1.1',
      '172.20.0.1',
      '169.254.169.254',
      '[::1]',
      'nas.local',
    ]) {
      expect(isPrivateHost(host)).toBe(true);
    }
    expect(isPrivateHost('upload.wikimedia.org')).toBe(false);
    expect(isPrivateHost('8.8.8.8')).toBe(false);
  });
});
