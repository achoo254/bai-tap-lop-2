import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
};

/**
 * Trả file nằm trong `baseDir`. Chặn mọi đường dẫn thoát ra ngoài thư mục gốc (../).
 * Trả null khi không có file để route trả 404.
 */
export async function staticFileResponse(
  baseDir: string,
  relativePath: string,
): Promise<Response | null> {
  let decoded: string;
  try {
    decoded = decodeURIComponent(relativePath);
  } catch {
    return null;
  }
  const root = path.resolve(baseDir);
  const target = path.resolve(root, `.${path.sep}${decoded}`);
  if (target !== root && !target.startsWith(root + path.sep)) return null;
  const info = await stat(target).catch(() => null);
  if (!info?.isFile()) return null;
  const body = await readFile(target);
  return new Response(body, {
    headers: {
      'content-type':
        CONTENT_TYPES[path.extname(target).toLowerCase()] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    },
  });
}
