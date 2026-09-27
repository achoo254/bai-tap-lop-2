/**
 * Chép file ảnh/video của từng bài từ content/<mã-bài>/ sang public/media/<mã-bài>/
 * để Astro phục vụ khi dev và đưa vào bản build. Chạy trước `astro dev` và `astro build`.
 * Viết độc lập (không import lesson-core) để Node chạy thẳng file .ts.
 */
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const LESSON_ID_PATTERN = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const contentDir = path.resolve(process.env.CONTENT_DIR ?? path.join(process.cwd(), '../../content'));
const mediaDir = path.join(process.cwd(), 'public', 'media');

await rm(mediaDir, { recursive: true, force: true });
await mkdir(mediaDir, { recursive: true });

let copied = 0;
const lessonDirs = await readdir(contentDir, { withFileTypes: true }).catch(() => []);
for (const lessonDir of lessonDirs) {
  if (!lessonDir.isDirectory() || !LESSON_ID_PATTERN.test(lessonDir.name)) continue;
  const source = path.join(contentDir, lessonDir.name);
  for (const file of await readdir(source, { withFileTypes: true })) {
    if (!file.isFile() || file.name === 'bai.md' || file.name.startsWith('.')) continue;
    const target = path.join(mediaDir, lessonDir.name);
    await mkdir(target, { recursive: true });
    await cp(path.join(source, file.name), path.join(target, file.name));
    copied++;
  }
}
console.log(`[sync-media] ${copied} file media từ ${contentDir}`);
