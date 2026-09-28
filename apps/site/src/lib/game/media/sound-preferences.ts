/**
 * apps/site/src/lib/game/media/sound-preferences.ts
 *
 * Tuỳ chọn âm thanh riêng từng phần, lưu trên thiết bị (localStorage) để tải lại trang không mất:
 * - Nhạc nền bật/tắt và âm lượng nhạc
 * - Giọng đọc bật/tắt
 * (Nút tắt TẤT CẢ âm thanh vẫn là `setMuted` trong audio.ts.)
 *
 * Đổi tuỳ chọn thì phát sự kiện PREFS_EVENT để nhạc nền đang chạy áp dụng ngay.
 */
export const PREFS_EVENT = 'miu-audio:prefs';

const MUSIC_ENABLED_KEY = 'the-gioi:nhac-nen-bat';
const MUSIC_VOLUME_KEY = 'the-gioi:am-luong-nhac';
const VOICE_ENABLED_KEY = 'the-gioi:giong-doc-bat';

export const DEFAULT_MUSIC_VOLUME = 0.55;

function read(key: string): string | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Không lưu được: chỉ áp dụng trong phiên này.
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(PREFS_EVENT));
}

export function isMusicEnabled(): boolean {
  return read(MUSIC_ENABLED_KEY) !== '0';
}

export function setMusicEnabled(enabled: boolean): void {
  write(MUSIC_ENABLED_KEY, enabled ? '1' : '0');
}

/** Âm lượng nhạc nền từ 0 đến 1. */
export function getMusicVolume(): number {
  const value = Number(read(MUSIC_VOLUME_KEY));
  return read(MUSIC_VOLUME_KEY) !== null && value >= 0 && value <= 1 ? value : DEFAULT_MUSIC_VOLUME;
}

export function setMusicVolume(volume: number): void {
  write(MUSIC_VOLUME_KEY, String(Math.min(1, Math.max(0, volume))));
}

export function isVoiceEnabled(): boolean {
  return read(VOICE_ENABLED_KEY) !== '0';
}

export function setVoiceEnabled(enabled: boolean): void {
  write(VOICE_ENABLED_KEY, enabled ? '1' : '0');
}

/*
 * Tinh chỉnh giọng đọc: hệ số nhân lên tốc độ / cao độ gốc của từng giọng điệu.
 * 1 = giữ nguyên; tốc độ 0,6–1,4 lần, cao độ 0,6–1,5 lần.
 */
const SPEECH_RATE_KEY = 'the-gioi:toc-do-giong';
const SPEECH_PITCH_KEY = 'the-gioi:cao-do-giong';
export const SPEECH_RATE_RANGE = { min: 0.6, max: 1.4 } as const;
export const SPEECH_PITCH_RANGE = { min: 0.6, max: 1.5 } as const;

function readScale(key: string, range: { min: number; max: number }): number {
  const raw = read(key);
  const value = Number(raw);
  return raw !== null && value >= range.min && value <= range.max ? value : 1;
}

export function getSpeechRateScale(): number {
  return readScale(SPEECH_RATE_KEY, SPEECH_RATE_RANGE);
}

export function setSpeechRateScale(scale: number): void {
  write(
    SPEECH_RATE_KEY,
    String(Math.min(SPEECH_RATE_RANGE.max, Math.max(SPEECH_RATE_RANGE.min, scale))),
  );
}

export function getSpeechPitchScale(): number {
  return readScale(SPEECH_PITCH_KEY, SPEECH_PITCH_RANGE);
}

export function setSpeechPitchScale(scale: number): void {
  write(
    SPEECH_PITCH_KEY,
    String(Math.min(SPEECH_PITCH_RANGE.max, Math.max(SPEECH_PITCH_RANGE.min, scale))),
  );
}
