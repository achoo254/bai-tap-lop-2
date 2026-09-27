import path from 'node:path';

/** Các đường dẫn trang Soạn bài dùng; mặc định tính từ vị trí mã nguồn trong monorepo. */
export interface EditorPaths {
  /** Repo git chứa thư mục content/ (mặc định chính là monorepo này). */
  repoRoot: string;
  contentDir: string;
  /** Nơi giữ tạm file tải lên trước khi bài được lưu (bị git bỏ qua). */
  stagingDir: string;
  sitePublicDir: string;
  uiDistDir: string;
}

/** `EDITOR_REPO_ROOT` cho phép trỏ sang repo khác (dùng khi chạy thử). */
export function resolveEditorPaths(repoRoot = process.env.EDITOR_REPO_ROOT): EditorPaths {
  const monorepoRoot = path.resolve(import.meta.dirname, '../../../..');
  const root = path.resolve(repoRoot ?? monorepoRoot);
  const contentDir = path.join(root, 'content');
  return {
    repoRoot: root,
    contentDir,
    stagingDir: path.join(contentDir, '.soan-tam'),
    sitePublicDir: path.join(monorepoRoot, 'apps/site/public'),
    uiDistDir: path.join(monorepoRoot, 'apps/editor/dist-ui'),
  };
}
