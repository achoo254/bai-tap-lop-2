/**
 * apps/site/src/minigames/minigame-types.ts
 *
 * Giao diện Plugin cho các Mini-game trong Thế giới học tập của Miu.
 * Mini-game gắn liền với cơ chế thao tác (kéo-thả, chọn, nối, xoay, cân...)
 * chứ không gắn liền với nơi chơi. Cả Base curriculum và Sự kiện (TIMO)
 * đều dùng chung các mini-game này.
 */
import type { SfxName } from '../lib/game/media/audio';

export type HintTier = 1 | 2 | 3;

export interface Challenge {
  id: string;
  prompt: string;
  speakText?: string;
  difficulty: number;
  data: unknown;
  expectedAnswer: unknown;
}

export interface QuestApi {
  /** Nộp câu trả lời để kiểm tra. */
  submit(answer: unknown): { correct: boolean; message?: string };
  /** Đọc to một đoạn văn bản bằng giọng truyền cảm. */
  speak(text: string, lang?: 'vi' | 'en'): void;
  /** Phát hiệu ứng âm thanh (đúng, sai, click, level up...). */
  sfx(name: SfxName): void;
  /** Báo hoàn thành toàn bộ nhiệm vụ. */
  completeQuest(stars: number): void;
}

export interface MiniGame<C extends Challenge = Challenge> {
  id: string;
  name: string;
  /** Gắn mini-game vào phần tử DOM trên sân khấu. */
  mount(stage: HTMLElement, challenge: C, api: QuestApi): void;
  /** Hiển thị gợi ý theo bậc (1: gợi ý hướng, 2: chi tiết, 3: lộ đáp án). */
  showHint(tier: HintTier): void;
  /** Chạy hoạt ảnh hệ quả tương tác trong cảnh (cửa mở, kẹo nhảy vào giỏ...). */
  playOutcome(correct: boolean): Promise<void>;
  /** Bé quay lại câu đã làm đúng: tô sáng đáp án đúng (và mẫu viết vở nếu có) để bé chép lại. */
  showSolved?(): void;
  /** Dọn dẹp DOM và sự kiện khi thoát hoặc chuyển câu. */
  unmount(): void;
}
