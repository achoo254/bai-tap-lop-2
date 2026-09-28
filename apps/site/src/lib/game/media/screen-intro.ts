/**
 * apps/site/src/lib/game/media/screen-intro.ts
 *
 * Lời giới thiệu đọc to khi bé vào mỗi màn (trang chủ, cổng thế giới, bản đồ, vùng môn học...).
 * Trình duyệt thường chặn đọc khi chưa có lượt chạm, nên nếu chưa đọc được thì
 * đọc ở lần chạm đầu tiên (trừ khi lúc đó đã có giọng khác đang đọc).
 */
import { speak, SPEECH_EVENT, type VoiceTone } from './audio';

const RETRY_CHECK_MS = 400;

export function introduceScreen(text: string, tone: VoiceTone = 'guide'): void {
  if (typeof window === 'undefined' || !text.trim()) return;

  let spoken = false;
  const markSpoken = () => {
    spoken = true;
  };
  window.addEventListener(SPEECH_EVENT, markSpoken, { once: true });

  speak(text, { tone });

  window.setTimeout(() => {
    if (spoken) return;
    const speakOnFirstTouch = () => {
      if (spoken || window.speechSynthesis?.speaking) return;
      speak(text, { tone });
    };
    window.addEventListener('pointerdown', speakOnFirstTouch, { once: true });
  }, RETRY_CHECK_MS);
}
