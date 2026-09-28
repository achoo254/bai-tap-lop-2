/**
 * apps/site/src/lib/game/media/background-music.ts
 *
 * Nhạc nền nhẹ nhàng, không lời (CC0) cho các màn ngoài bài học: trang chủ, cổng thế giới,
 * bản đồ, tạo nhân vật. Vào bài học thì trang đó không gọi nhạc nên nhạc tự dừng.
 *
 * - Phát nối tiếp giữa các trang: nhớ bài đang phát và vị trí trong sessionStorage.
 * - Hết bài thì chuyển bài kế tiếp trong danh sách.
 * - Nhỏ lại khi có giọng đọc, tắt theo nút 🔊/🔇 chung.
 * - Trình duyệt chặn tự phát thì chờ lần chạm đầu tiên của bé.
 */
import { isMuted, MUTED_EVENT, SPEECH_EVENT } from './audio';

export interface BackgroundTrack {
  id: string;
  url: string;
}

/** Nguồn gốc & giấy phép ghi tại public/game/licenses.json và trang Ghi nguồn. */
export const BACKGROUND_TRACKS: BackgroundTrack[] = [
  { id: 'buoi-sang-vui-ve', url: '/game/audio/nhac-nen/buoi-sang-vui-ve.mp3' },
  { id: 'dao-xanh-thu-gian', url: '/game/audio/nhac-nen/dao-xanh-thu-gian.mp3' },
  { id: 'gau-con-cau-ca', url: '/game/audio/nhac-nen/gau-con-cau-ca.mp3' },
];

const NORMAL_VOLUME = 0.28;
const DUCKED_VOLUME = 0.08;
const SESSION_KEY = 'the-gioi:nhac-nen';

interface SavedPosition {
  trackIndex: number;
  time: number;
}

let audio: HTMLAudioElement | null = null;
let trackIndex = 0;
let started = false;

function readSaved(): SavedPosition | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SavedPosition) : null;
  } catch {
    return null;
  }
}

function savePosition(): void {
  if (!audio) return;
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ trackIndex, time: audio.currentTime } satisfies SavedPosition),
    );
  } catch {
    // Không lưu được thì lần sau phát lại từ đầu bài.
  }
}

function loadTrack(index: number, startAt = 0): void {
  if (!audio) return;
  trackIndex = ((index % BACKGROUND_TRACKS.length) + BACKGROUND_TRACKS.length) % BACKGROUND_TRACKS.length;
  audio.src = BACKGROUND_TRACKS[trackIndex].url;
  if (startAt > 0) {
    audio.addEventListener(
      'loadedmetadata',
      () => {
        if (audio && startAt < audio.duration) audio.currentTime = startAt;
      },
      { once: true },
    );
  }
}

/** Thử phát; bị chặn tự phát thì phát ở lần chạm/bấm phím đầu tiên. */
function tryPlay(): void {
  if (!audio || isMuted()) return;
  audio.play().catch(() => {
    const resume = () => {
      if (audio && !isMuted()) void audio.play().catch(() => undefined);
    };
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  });
}

/** Bật nhạc nền cho màn hiện tại (gọi một lần mỗi trang). */
export function startBackgroundMusic(): void {
  if (started || typeof window === 'undefined') return;
  started = true;

  audio = new Audio();
  audio.preload = 'auto';
  audio.volume = NORMAL_VOLUME;

  const saved = readSaved();
  if (saved) {
    loadTrack(saved.trackIndex, saved.time);
  } else {
    // Phiên mới: chọn ngẫu nhiên một bài để mỗi lần mở web nghe khác nhau.
    loadTrack(Math.floor(Math.random() * BACKGROUND_TRACKS.length));
  }

  audio.addEventListener('ended', () => {
    loadTrack(trackIndex + 1);
    tryPlay();
  });

  window.addEventListener(MUTED_EVENT, (event) => {
    if (!audio) return;
    if ((event as CustomEvent<boolean>).detail) audio.pause();
    else tryPlay();
  });

  window.addEventListener(SPEECH_EVENT, (event) => {
    if (audio) audio.volume = (event as CustomEvent<boolean>).detail ? DUCKED_VOLUME : NORMAL_VOLUME;
  });

  // Chuyển tab/khóa màn hình thì dừng; rời trang thì nhớ vị trí để trang sau phát tiếp.
  document.addEventListener('visibilitychange', () => {
    if (!audio) return;
    if (document.hidden) {
      savePosition();
      audio.pause();
    } else {
      tryPlay();
    }
  });
  window.addEventListener('pagehide', savePosition);

  tryPlay();
}
