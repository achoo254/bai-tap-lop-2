import { spawn } from 'node:child_process';
import { serve } from '@hono/node-server';
import { resolveEditorPaths } from './editor-paths';
import { createEditorApp, EDITOR_PORT } from './editor-http-server';
import { GitSyncService } from './git-sync-service';
import { LessonFileRepository } from './lesson-file-repository';

/** Khởi động trang Soạn bài: http://127.0.0.1:4321 và mở trình duyệt. */
const paths = resolveEditorPaths();
const git = new GitSyncService(paths.repoRoot);
const repository = new LessonFileRepository(paths.contentDir, paths.stagingDir);
const siteUrl = process.env.SITE_URL?.replace(/\/+$/, '');
const app = createEditorApp({ paths, repository, git, siteUrl });

const url = `http://127.0.0.1:${EDITOR_PORT}`;
const server = serve({ fetch: app.fetch, hostname: '127.0.0.1', port: EDITOR_PORT }, () => {
  console.log(`\n  Trang Soạn bài đang chạy: ${url}\n  Đóng cửa sổ này để tắt.\n`);
  git.pull().then((result) => console.log(`  ${result.message}`));
  if (process.env.EDITOR_NO_BROWSER !== '1') openBrowser(url);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n  Cổng ${EDITOR_PORT} đang bận: có thể trang Soạn bài đã mở sẵn ở ${url}.`);
    console.error('  Hãy dùng cửa sổ đó, hoặc tắt nó rồi chạy lại.\n');
  } else {
    console.error(error);
  }
  process.exit(1);
});

function openBrowser(target: string) {
  const command =
    process.platform === 'win32'
      ? ['cmd', ['/c', 'start', '', target]]
      : process.platform === 'darwin'
        ? ['open', [target]]
        : ['xdg-open', [target]];
  spawn(command[0] as string, command[1] as string[], { stdio: 'ignore', detached: true }).unref();
}
