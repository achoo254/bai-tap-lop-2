import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { isValidLessonId } from '../lesson-slug-and-id';
import { validateLessonSource, type LessonValidationResult } from '../lesson-validator';

/**
 * Đọc thư mục bài trên đĩa (chỉ dùng trong Node: web build và trang Soạn bài).
 * Worker không import file này vì không có hệ thống file.
 */
export const LESSON_FILE_NAME = 'bai.md';

export interface LessonFileInfo {
  name: string;
  size: number;
}

export interface LessonFolder {
  id: string;
  dir: string;
  source: string;
  /** Các file đính kèm (không gồm bai.md). */
  files: LessonFileInfo[];
  validation: LessonValidationResult;
}

export async function readLessonFolder(
  contentDir: string,
  id: string,
): Promise<LessonFolder | null> {
  if (!isValidLessonId(id)) return null;
  const dir = path.join(contentDir, id);
  let source: string;
  try {
    source = await readFile(path.join(dir, LESSON_FILE_NAME), 'utf8');
  } catch {
    return null;
  }
  const files: LessonFileInfo[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name === LESSON_FILE_NAME || entry.name.startsWith('.')) continue;
    files.push({ name: entry.name, size: (await stat(path.join(dir, entry.name))).size });
  }
  const validation = validateLessonSource(source, {
    availableFiles: files.map((file) => file.name),
    fileSizes: Object.fromEntries(files.map((file) => [file.name, file.size])),
  });
  return { id, dir, source, files, validation };
}

/** Đọc mọi bài trong thư mục nội dung, sắp theo mã bài (ngày tăng dần). */
export async function readAllLessonFolders(contentDir: string): Promise<LessonFolder[]> {
  let entries: string[];
  try {
    entries = (await readdir(contentDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && isValidLessonId(entry.name))
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
  const folders = await Promise.all(entries.map((id) => readLessonFolder(contentDir, id)));
  return folders.filter((folder): folder is LessonFolder => folder !== null);
}
