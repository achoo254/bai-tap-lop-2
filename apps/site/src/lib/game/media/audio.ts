/**
 * Âm thanh của game:
 * - Giọng đọc có sẵn trong máy (Web Speech API) đọc đề và lời thoại: tiếng Việt cho mọi vùng,
 *   tiếng Anh cho Vùng Tiếng Anh và dòng song ngữ của sự kiện — để bé không phải tự đọc.
 * - Tiếng "ting" khi đúng, "bụp" khi sai, "pop" khi chạm: tạo bằng Web Audio, không cần file âm thanh.
 * Safari trên iPad chỉ cho phát tiếng sau khi bé chạm màn hình, nên gọi unlockAudio() trong lượt chạm đầu.
 */

export type SpeechLanguage = 'vi' | 'en';

const MUTED_KEY = 'the-gioi:tat-tieng';

const SPEECH_SETTINGS: Record<SpeechLanguage, { lang: string; rate: number; pitch: number }> = {
  vi: { lang: 'vi-VN', rate: 0.9, pitch: 1.1 },
  // Tiếng Anh đọc chậm hơn cho bé lớp 2 nghe rõ từng từ.
  en: { lang: 'en-US', rate: 0.8, pitch: 1.1 },
};

let audioContext: AudioContext | null = null;
const voices: Record<SpeechLanguage, SpeechSynthesisVoice | null> = { vi: null, en: null };
let muted = readMuted();

function readMuted(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(MUTED_KEY) === '1';
  } catch {
    return false;
  }
}

export function isMuted(): boolean {
  return muted;
}

/** Tắt/bật mọi âm thanh (giọng đọc và tiếng động); nhớ lựa chọn trên máy. */
export function setMuted(value: boolean): void {
  muted = value;
  if (value && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  try {
    localStorage.setItem(MUTED_KEY, value ? '1' : '0');
  } catch {
    // Không lưu được: chỉ áp dụng trong phiên này.
  }
}

function findVoice(language: SpeechLanguage): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const available = window.speechSynthesis.getVoices();
  const exact = SPEECH_SETTINGS[language].lang.toLowerCase();
  return (
    available.find((voice) => voice.lang.toLowerCase().replace('_', '-') === exact) ??
    available.find((voice) => voice.lang.toLowerCase().startsWith(language)) ??
    null
  );
}

/** Máy có giọng đọc cho ngôn ngữ này không (danh sách giọng có thể nạp muộn vài trăm ms). */
export function waitForVoice(language: SpeechLanguage, timeoutMs = 1500): Promise<boolean> {
  if (!('speechSynthesis' in window)) return Promise.resolve(false);
  voices[language] = findVoice(language);
  if (voices[language]) return Promise.resolve(true);
  return new Promise((resolve) => {
    const done = (): void => {
      voices[language] = findVoice(language);
      resolve(voices[language] !== null);
    };
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    window.setTimeout(done, timeoutMs);
  });
}

export function waitForVietnameseVoice(timeoutMs = 1500): Promise<boolean> {
  return waitForVoice('vi', timeoutMs);
}

export function unlockAudio(): void {
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === 'suspended') void audioContext.resume();
  } catch {
    audioContext = null;
  }
  // Phát một câu rỗng trong lượt chạm để Safari cho phép đọc về sau.
  if ('speechSynthesis' in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
}

/** Đọc to một câu (mặc định tiếng Việt); câu mới thay câu đang đọc. */
export function speak(text: string, language: SpeechLanguage = 'vi'): void {
  if (muted || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const settings = SPEECH_SETTINGS[language];
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = settings.lang;
  const voice = voices[language] ?? findVoice(language);
  if (voice) utterance.voice = voice;
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  synth.speak(utterance);
}

function playNotes(
  notes: { frequency: number; start: number; duration: number }[],
  type: OscillatorType,
): void {
  const context = audioContext;
  if (!context || muted) return;
  const now = context.currentTime;
  for (const note of notes) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = note.frequency;
    gain.gain.setValueAtTime(0.0001, now + note.start);
    gain.gain.exponentialRampToValueAtTime(0.25, now + note.start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + 0.05);
  }
}

export function playCorrectSound(): void {
  playNotes(
    [
      { frequency: 660, start: 0, duration: 0.15 },
      { frequency: 880, start: 0.12, duration: 0.15 },
      { frequency: 1320, start: 0.24, duration: 0.3 },
    ],
    'triangle',
  );
}

export function playWrongSound(): void {
  playNotes([{ frequency: 220, start: 0, duration: 0.25 }], 'sine');
}

export function playPopSound(): void {
  playNotes([{ frequency: 520, start: 0, duration: 0.08 }], 'square');
}
