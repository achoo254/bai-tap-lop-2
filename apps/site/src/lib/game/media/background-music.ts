/**
 * apps/site/src/lib/game/media/background-music.ts
 *
 * Nhạc nền không lời vui nhộn (CC0) cho các màn ngoài bài học: trang chủ, cổng thế giới,
 * bản đồ, tạo nhân vật. Vào bài học thì trang đó không gọi nhạc nên nhạc tự dừng.
 *
 * - Phát nối tiếp giữa các trang: nhớ bài đang phát và vị trí trong sessionStorage.
 * - Hết bài thì chuyển bài kế tiếp trong danh sách.
 * - Nhỏ lại khi có giọng đọc, tắt theo nút 🔊/🔇 chung.
 * - Trình duyệt chặn tự phát thì chờ lần chạm đầu tiên của bé.
 * - iPad/iPhone bỏ qua audio.volume: chỉnh âm lượng qua Web Audio (GainNode).
 */
import { isMuted, MUTED_EVENT, SPEECH_EVENT } from './audio';
import { getMusicVolume, isMusicEnabled, PREFS_EVENT } from './sound-preferences';

export interface BackgroundTrack {
  id: string;
  url: string;
}

/** Nguồn gốc & giấy phép ghi tại public/game/licenses.json và trang Ghi nguồn. */
/** `?v=` đổi mỗi khi thay nội dung file (thư mục /game được trình duyệt lưu cache lâu dài). */
const TRACK_VERSION = 2;
const track = (id: string): BackgroundTrack => ({
  id,
  url: `/game/audio/nhac-nen/${id}.mp3?v=${TRACK_VERSION}`,
});

/** Bài sôi động xen kẽ bài nhẹ nhàng. */
export const BACKGROUND_TRACKS: BackgroundTrack[] = [
  track('vo-tay-vui-nhon'),
  track('buoi-sang-vui-ve'),
  track('cac-ban-nho-dieu-hanh'),
  track('dao-xanh-thu-gian'),
  track('nhay-nhot-tung-bung'),
  track('gau-con-cau-ca'),
];

/** Khi có giọng đọc, nhạc nhỏ còn khoảng 1/3 âm lượng bé chọn. */
const DUCK_RATIO = 0.3;
const SESSION_KEY = 'the-gioi:nhac-nen';

interface SavedPosition {
  trackIndex: number;
  time: number;
}

let audio: HTMLAudioElement | null = null;
let trackIndex = 0;
let started = false;
let speaking = false;
/** Chỉ dùng trên máy bỏ qua audio.volume (Safari iOS/iPadOS). */
let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;

function volumeIsIgnored(): boolean {
  const probe = new Audio();
  probe.volume = 0.5;
  return probe.volume !== 0.5;
}

function setupGain(element: HTMLAudioElement): void {
  try {
    audioContext = new AudioContext();
    gainNode = audioContext.createGain();
    audioContext
      .createMediaElementSource(element)
      .connect(gainNode)
      .connect(audioContext.destination);
  } catch {
    audioContext = null;
    gainNode = null;
  }
}

function applyVolume(): void {
  const volume = getMusicVolume() * (speaking ? DUCK_RATIO : 1);
  if (gainNode) gainNode.gain.value = volume;
  else if (audio) audio.volume = volume;
}

const canPlay = () => !isMuted() && isMusicEnabled();

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
  trackIndex =
    ((index % BACKGROUND_TRACKS.length) + BACKGROUND_TRACKS.length) % BACKGROUND_TRACKS.length;
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
  if (!audio || !canPlay()) return;
  const resume = () => {
    if (!audio || !canPlay()) return;
    void audioContext?.resume();
    void audio.play().catch(() => undefined);
  };
  // Web Audio chỉ chạy sau lượt chạm: chờ chạm để mở tiếng dù play() không báo lỗi
  if (audioContext && audioContext.state !== 'running') {
    void audioContext.resume().catch(() => undefined);
    window.addEventListener('pointerdown', resume, { once: true });
  }
  audio.play().catch(() => {
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
  if (volumeIsIgnored()) setupGain(audio);
  applyVolume();

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
    speaking = (event as CustomEvent<boolean>).detail;
    applyVolume();
  });

  // Bé đổi âm lượng / tắt nhạc trong bảng cài đặt nhân vật: áp dụng ngay
  window.addEventListener(PREFS_EVENT, () => {
    if (!audio) return;
    applyVolume();
    if (canPlay()) {
      if (audio.paused) tryPlay();
    } else {
      audio.pause();
    }
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
