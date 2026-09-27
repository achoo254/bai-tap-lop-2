import { Hono, type Context } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { EDITOR_MAX_MEDIA_BYTES, isValidLessonId } from 'lesson-core';
import type { EditorPaths } from './editor-paths';
import type { GitSyncService } from './git-sync-service';
import { EditorInputError, type LessonFileRepository, type SaveLessonInput } from './lesson-file-repository';
import { staticFileResponse } from './static-file-response';

export const EDITOR_PORT = 4321;
const ALLOWED_HOSTS = new Set([`127.0.0.1:${EDITOR_PORT}`, `localhost:${EDITOR_PORT}`]);

export interface EditorAppDependencies {
  paths: EditorPaths;
  repository: LessonFileRepository;
  git: GitSyncService;
  /** Địa chỉ web của bé, để tạo link xem trước (vd. https://bai-tap.pages.dev). */
  siteUrl?: string;
  /** Tắt kiểm tra Host/Origin trong test. */
  trustAllHosts?: boolean;
}

/** API và giao diện của trang Soạn bài; chỉ phục vụ máy của phụ huynh (127.0.0.1). */
export function createEditorApp(deps: EditorAppDependencies): Hono {
  const { paths, repository, git } = deps;
  const app = new Hono();

  // Chặn trang web lạ gọi API qua trình duyệt (DNS rebinding / CSRF).
  app.use('*', async (c, next) => {
    if (!deps.trustAllHosts) {
      // URL của request được dựng từ header Host.
      const host = new URL(c.req.url).host;
      if (!ALLOWED_HOSTS.has(host)) return c.text('Host không hợp lệ', 403);
      const origin = c.req.header('origin');
      if (c.req.method !== 'GET' && origin && !ALLOWED_HOSTS.has(origin.replace(/^https?:\/\//, ''))) {
        return c.text('Origin không hợp lệ', 403);
      }
    }
    await next();
  });

  app.onError((error, c) => {
    if (error instanceof EditorInputError) return c.json({ loi: error.message, chiTiet: error.issues }, 422);
    console.error('[soan-bai]', error);
    return c.json({ loi: 'Có lỗi không mong muốn, xem cửa sổ dòng lệnh.' }, 500);
  });

  app.get('/api/trang-thai', async (c) => {
    return c.json({ coGithub: await git.hasRemote(), siteUrl: deps.siteUrl ?? null });
  });

  app.post('/api/dong-bo', async (c) => c.json(await git.pull()));

  app.get('/api/bai', async (c) => c.json(await repository.list()));

  app.get('/api/bai/:id', async (c) => {
    const lesson = await repository.get(c.req.param('id'));
    return lesson ? c.json(lesson) : c.json({ loi: 'Không tìm thấy bài.' }, 404);
  });

  app.post(
    '/api/tai-len',
    bodyLimit({
      maxSize: EDITOR_MAX_MEDIA_BYTES + 1024 * 1024,
      onError: (c) => c.json({ loi: 'File quá lớn (tối đa 50MB).' }, 413),
    }),
    async (c) => {
      const form = await c.req.parseBody();
      const file = form.file;
      const draftKey = String(form.draftKey ?? '');
      const lessonId = form.lessonId ? String(form.lessonId) : null;
      if (!(file instanceof File)) throw new EditorInputError('Không nhận được file.');
      const fileName = await repository.stageUpload(draftKey, lessonId, file.name, new Uint8Array(await file.arrayBuffer()));
      return c.json({ fileName });
    },
  );

  app.put('/api/bai', async (c) => {
    const input = (await c.req.json()) as SaveLessonInput;
    const pulled = await git.pull();
    const result = await repository.save(input);
    const action = input.originalId ? 'cập nhật' : 'thêm';
    const state = result.frontmatter.nhap ? 'nháp' : 'đăng';
    const commit = await git.commitAndPush(`content/${result.id}`, `content: ${action} bài ${state} ${result.id}`);
    return c.json({
      ...result,
      dongBo: pulled,
      git: commit,
      linkXemTruoc: deps.siteUrl ? `${deps.siteUrl}/xem-truoc/${result.frontmatter.ma_xem_truoc}/` : null,
    });
  });

  app.delete('/api/bai/:id', async (c) => {
    const id = c.req.param('id');
    await git.pull();
    await repository.remove(id);
    const commit = await git.commitAndPush(`content/${id}`, `content: xoá bài ${id}`);
    return c.json({ git: commit });
  });

  // File media: bài đã lưu, file vừa tải lên, hình minh hoạ và font của web.
  const sendOr404 = async (c: Context, response: Promise<Response | null>) => (await response) ?? c.notFound();
  app.get('/media/:id/:file', (c) => {
    const id = c.req.param('id');
    if (!isValidLessonId(id)) return c.notFound();
    return sendOr404(c, staticFileResponse(paths.contentDir, `${id}/${c.req.param('file')}`));
  });
  app.get('/media-tam/:key/:file', (c) => {
    const filePath = repository.stagedFilePath(c.req.param('key'), decodeURIComponent(c.req.param('file')));
    return filePath ? sendOr404(c, staticFileResponse(paths.stagingDir, filePath.slice(paths.stagingDir.length + 1))) : c.notFound();
  });
  app.get('/illustrations/*', (c) => sendOr404(c, staticFileResponse(paths.sitePublicDir, c.req.path)));
  app.get('/fonts/*', (c) => sendOr404(c, staticFileResponse(paths.sitePublicDir, c.req.path)));
  app.get('/*', (c) => {
    const requested = c.req.path === '/' ? '/index.html' : c.req.path;
    return sendOr404(c, staticFileResponse(paths.uiDistDir, requested));
  });

  return app;
}
