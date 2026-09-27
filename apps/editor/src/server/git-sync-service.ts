import { simpleGit, type SimpleGit } from 'simple-git';

/**
 * Đồng bộ thư mục nội dung với GitHub: lấy bài mới (kể cả bài Claude vừa đăng qua MCP)
 * trước khi ghi, rồi commit và đẩy lên. Mọi thao tác chạy tuần tự để không giẫm lên nhau.
 */
export interface GitSyncResult {
  ok: boolean;
  message: string;
}

export interface CommitResult {
  committed: boolean;
  pushed: boolean;
  message: string;
}

export class GitSyncService {
  private readonly git: SimpleGit;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(repoRoot: string) {
    this.git = simpleGit({ baseDir: repoRoot });
  }

  async hasRemote(): Promise<boolean> {
    return (await this.git.getRemotes()).some((remote) => remote.name === 'origin');
  }

  /** Lấy thay đổi mới nhất từ GitHub. Không có remote thì bỏ qua. */
  pull(): Promise<GitSyncResult> {
    return this.enqueue(() => this.pullUnlocked());
  }

  /** Commit các thay đổi trong `pathspec` rồi đẩy lên GitHub (nếu đã có remote). */
  commitAndPush(pathspec: string, message: string): Promise<CommitResult> {
    return this.enqueue(async () => {
      await this.git.add(['-A', '--', pathspec]);
      const staged = await this.git.diff(['--cached', '--name-only', '--', pathspec]);
      const committed = staged.trim() !== '';
      if (committed) await this.git.commit(message, [pathspec]);
      if (!(await this.hasRemote())) {
        return { committed, pushed: false, message: 'Đã lưu trên máy. Chưa kết nối GitHub nên chưa đăng lên mạng.' };
      }
      try {
        await this.pushWithRetry();
        return { committed, pushed: true, message: 'Đã lưu và gửi lên GitHub. Web sẽ cập nhật sau vài phút.' };
      } catch (error) {
        return {
          committed,
          pushed: false,
          message: `Đã lưu trên máy nhưng chưa gửi lên GitHub được (${shortError(error)}). Lần lưu sau sẽ tự gửi lại.`,
        };
      }
    });
  }

  private async pullUnlocked(): Promise<GitSyncResult> {
    if (!(await this.hasRemote())) return { ok: true, message: 'Chưa kết nối GitHub (làm việc trên máy).' };
    try {
      const branch = (await this.git.revparse(['--abbrev-ref', 'HEAD'])).trim();
      await this.git.pull('origin', branch, ['--rebase', '--autostash']);
      return { ok: true, message: 'Đã lấy bài mới nhất từ GitHub.' };
    } catch (error) {
      // Repo GitHub còn trống (chưa đẩy lần nào) thì không có gì để lấy.
      if (/couldn't find remote ref/i.test(String(error))) {
        return { ok: true, message: 'GitHub chưa có bài nào.' };
      }
      await this.git.rebase(['--abort']).catch(() => undefined);
      return { ok: false, message: `Không lấy được bài mới từ GitHub: ${shortError(error)}` };
    }
  }

  private async pushWithRetry(): Promise<void> {
    try {
      await this.git.push(['-u', 'origin', 'HEAD']);
    } catch {
      // Có người (vd. Claude qua MCP) vừa đẩy bài lên: lấy về rồi đẩy lại một lần.
      const pulled = await this.pullUnlocked();
      if (!pulled.ok) throw new Error(pulled.message);
      await this.git.push(['-u', 'origin', 'HEAD']);
    }
  }

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = this.queue.then(task, task);
    this.queue = run.catch(() => undefined);
    return run;
  }
}

function shortError(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error);
  return text.split('\n').find((line) => line.trim())?.trim().slice(0, 160) ?? 'lỗi không rõ';
}
