/**
 * apps/site/src/lib/game/media/audio.ts
 *
 * Hệ thống âm thanh & giọng đọc truyền cảm của game:
 * - Giọng đọc KỂ CHUYỆN (Storytelling) & chất giọng MIỀN BẮC (Hà Nội):
 *   + Hỗ trợ các bản thu âm AI Neural chuẩn Miền Bắc (Hoài My, Nam Minh) cho câu chuyện & NPC.
 *   + Phân loại chính xác giọng hệ thống:
 *     - Miền Bắc: Microsoft Hoài My, Microsoft Nam Minh, Siri Giọng 1, Mai.
 *     - Miền Nam: Apple Linh (VoiceOver trên iPad/macOS), Siri Giọng 2, An.
 *   + Bộ preset phong cách: Kể chuyện cổ tích (chậm rãi, trầm ấm), Bác Cú Thông Thái (ân cần, từ tốn),
 *     Vui tươi khích lệ (hào hứng), Dỗ dành (dịu dàng khi làm sai), Cô giáo mẫu mực.
 * - Âm thanh tương tác Web Audio tổng hợp không cần tải file ngoài:
 *   + "ting" (đúng), "bụp" (sai), "pop" (chạm/nhảy), "rủng rỉnh" (xu thưởng), "bụi tiên" (phép thuật/mở cổng).
 * - Tương thích chuẩn Safari/iPad (unlockAudio trong tương tác đầu tiên).
 */
import { getSpeechPitchScale, getSpeechRateScale, isVoiceEnabled } from './sound-preferences';
import { findZaloVoice, splitForSpeech, toZaloSpeed, zaloAudioUrl } from './zalo-voice';

export type SpeechLanguage = 'vi' | 'en';

export type VietnameseAccent = 'bac' | 'nam' | 'all';

export type VoiceTone = 'story' | 'guide' | 'cheer' | 'calm' | 'teacher' | 'normal';

export interface VoiceToneConfig {
  id: VoiceTone;
  name: string;
  description: string;
  rate: number;
  pitch: number;
}

export const VOICE_TONES: Record<VoiceTone, VoiceToneConfig> = {
  story: {
    id: 'story',
    name: 'Kể chuyện cổ tích',
    description: 'Trầm ấm, chậm rãi, truyền cảm, nhả chữ tròn vành, thích hợp dẫn dắt cốt truyện',
    rate: 0.82,
    pitch: 0.98,
  },
  guide: {
    id: 'guide',
    name: 'Bác Cú Thông Thái',
    description: 'Từ tốn, ân cần, điềm đạm, dẫn dắt chỉ lối cho bé',
    rate: 0.84,
    pitch: 0.95,
  },
  cheer: {
    id: 'cheer',
    name: 'Vui tươi khích lệ',
    description: 'Hào hứng, rộn ràng khi làm đúng hoặc nhận sao thưởng',
    rate: 0.92,
    pitch: 1.04,
  },
  calm: {
    id: 'calm',
    name: 'Thủ thỉ dỗ dành',
    description: 'Dịu dàng, kiên nhẫn khi bé gặp câu khó hoặc làm chưa đúng, không áp lực',
    rate: 0.8,
    pitch: 0.97,
  },
  teacher: {
    id: 'teacher',
    name: 'Cô giáo mẫu mực',
    description: 'Rõ ràng, dứt khoát, sư phạm, chuẩn phát âm tiếng Việt',
    rate: 0.86,
    pitch: 1.0,
  },
  normal: {
    id: 'normal',
    name: 'Tự nhiên mặc định',
    description: 'Tốc độ vừa phải, giọng đọc chuẩn hệ thống',
    rate: 0.85,
    pitch: 1.0,
  },
};

/** Các bản thu âm giọng đọc Miền Bắc chuẩn Hà Nội chính xác 100% cho các đoạn đối thoại chính */
export const NORTHERN_AUDIO_CLIPS = {
  owlGreeting: '/game/audio/owl-greeting.mp3',
  storyIntro: '/game/audio/story-intro.mp3',
  rewardCheer: '/game/audio/reward-cheer.mp3',
  calmEncourage: '/game/audio/calm-encourage.mp3',
  sampleNorth: '/game/audio/sample-north.mp3',
  sampleSouth: '/game/audio/sample-south.mp3',
};

export interface SpeakOptions {
  language?: SpeechLanguage;
  accent?: VietnameseAccent;
  tone?: VoiceTone;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
  audioClipUrl?: string;
}

const MUTED_KEY = 'the-gioi:tat-tieng';
const PREFERRED_VOICE_PREFIX = 'the-gioi:giong-uu-tien:';
const PREFERRED_TONE_KEY = 'the-gioi:phong-cach-giong';
const PREFERRED_ACCENT_KEY = 'the-gioi:giong-vung-mien';

const BASE_SPEECH_SETTINGS: Record<SpeechLanguage, { lang: string; rate: number; pitch: number }> =
  {
    vi: { lang: 'vi-VN', rate: 0.85, pitch: 0.98 },
    // Tiếng Anh đọc chậm vừa phải cho bé lớp 2 nghe rõ từng âm vị.
    en: { lang: 'en-US', rate: 0.82, pitch: 1.0 },
  };

let audioContext: AudioContext | null = null;
let currentAudioElement: HTMLAudioElement | null = null;
const cachedVoices: Record<SpeechLanguage, SpeechSynthesisVoice | null> = { vi: null, en: null };
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

/** Tăng mỗi lần dừng/đọc mới để huỷ hàng đợi giọng Zalo đang phát dở. */
let speechToken = 0;

/** Dừng mọi âm thanh đang đọc (cả tệp MP3 và Web Speech API). */
export function stopAudio(): void {
  speechToken++;
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/** Sự kiện phát ra khi bật/tắt tiếng hoặc khi bắt đầu/kết thúc giọng đọc (nhạc nền lắng nghe để tắt/nhỏ lại). */
export const MUTED_EVENT = 'miu-audio:muted';
export const SPEECH_EVENT = 'miu-audio:speech';
/** Phát khi có tiếng hiệu ứng (đúng/sai/thưởng...) để nhân vật đồng hành phản ứng theo. */
export const SFX_EVENT = 'miu-audio:sfx';

function emitSpeaking(speaking: boolean): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SPEECH_EVENT, { detail: speaking }));
  }
}

/** Tắt/bật mọi âm thanh (giọng đọc, tiếng động, nhạc nền); nhớ lựa chọn trên máy. */
export function setMuted(value: boolean): void {
  muted = value;
  if (value) {
    stopAudio();
  }
  try {
    localStorage.setItem(MUTED_KEY, value ? '1' : '0');
  } catch {
    // Không lưu được: chỉ áp dụng trong phiên này.
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(MUTED_EVENT, { detail: value }));
  }
}

/** Phát một tệp âm thanh thu sẵn (ví dụ giọng Miền Bắc chuẩn Hà Nội). */
export function playAudioClip(url: string): Promise<void> {
  stopAudio();
  if (muted || typeof window === 'undefined' || !isVoiceEnabled()) return Promise.resolve();

  return new Promise((resolve) => {
    try {
      const audio = new Audio(url);
      currentAudioElement = audio;
      const finish = () => {
        currentAudioElement = null;
        emitSpeaking(false);
        resolve();
      };
      audio.onended = finish;
      audio.onerror = finish;
      // Chỉ báo "đang đọc" khi thật sự phát (trình duyệt có thể chặn tự phát)
      audio.onplaying = () => emitSpeaking(true);
      audio.play().catch(finish);
    } catch {
      resolve();
    }
  });
}

/** Lấy vùng miền / chất giọng ưu tiên (mặc định 'bac' - Giọng miền Bắc Hà Nội). */
export function getPreferredAccent(): VietnameseAccent {
  try {
    const val =
      typeof localStorage !== 'undefined' ? localStorage.getItem(PREFERRED_ACCENT_KEY) : null;
    if (val === 'bac' || val === 'nam' || val === 'all') return val;
  } catch {
    // ignore
  }
  return 'bac'; // Mặc định luôn là Giọng Miền Bắc!
}

/** Lưu lựa chọn vùng miền / chất giọng. */
export function setPreferredAccent(accent: VietnameseAccent): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PREFERRED_ACCENT_KEY, accent);
      cachedVoices.vi = null; // Xóa cache để tự động chọn lại giọng phù hợp vùng miền
    }
  } catch {
    // ignore
  }
}

/** Lấy giọng đọc ưu tiên đã lưu theo ngôn ngữ. */
export function getPreferredVoice(language: SpeechLanguage = 'vi'): string | null {
  try {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem(PREFERRED_VOICE_PREFIX + language)
      : null;
  } catch {
    return null;
  }
}

/** Lưu lựa chọn giọng đọc cụ thể cho ngôn ngữ. */
export function setPreferredVoice(language: SpeechLanguage, voiceName: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PREFERRED_VOICE_PREFIX + language, voiceName);
      cachedVoices[language] = null; // Xóa cache để áp dụng giọng mới
    }
  } catch {
    // ignore
  }
}

/** Lấy phong cách đọc ưu tiên đã lưu. */
export function getPreferredTone(): VoiceTone {
  try {
    const val =
      typeof localStorage !== 'undefined' ? localStorage.getItem(PREFERRED_TONE_KEY) : null;
    if (val && val in VOICE_TONES) return val as VoiceTone;
  } catch {
    // ignore
  }
  return 'story'; // Mặc định là phong cách kể chuyện truyền cảm!
}

/** Lưu phong cách đọc ưu tiên. */
export function setPreferredTone(tone: VoiceTone): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PREFERRED_TONE_KEY, tone);
    }
  } catch {
    // ignore
  }
}

/**
 * Xác định chính xác vùng miền của một giọng đọc tiếng Việt dựa trên đặc tính hệ thống:
 * - Miền Bắc: Linh (Apple VoiceOver trên iOS/macOS chuẩn Hà Nội), Nam Minh (Microsoft Online), Mai (Google), Siri 1.
 * - Miền Nam: Hoài My (Microsoft Online), Siri Giọng 2, An.
 */
export function getVoiceAccent(voice: SpeechSynthesisVoice): 'bac' | 'nam' | 'chung' {
  const name = voice.name.toLowerCase();

  // Giọng miền Bắc: Linh (Apple VoiceOver trên macOS/iOS), Nam Minh (Microsoft), Mai (Google), Siri 1
  if (
    name.includes('linh') ||
    name.includes('namminh') ||
    name.includes('nam minh') ||
    name.includes('mai') ||
    (name.includes('siri') && (name.includes('1') || name.includes('voice 1')))
  ) {
    return 'bac';
  }

  // Giọng miền Nam: Hoài My (Microsoft Online giọng Nam), Siri 2, An
  if (
    name.includes('hoaimy') ||
    name.includes('hoài my') ||
    name.includes('an') ||
    (name.includes('siri') && (name.includes('2') || name.includes('voice 2')))
  ) {
    return 'nam';
  }

  return 'chung';
}

/** Đánh giá độ truyền cảm/chất lượng của giọng nói trên hệ thống theo vùng miền yêu cầu. */
export function rateVoiceQuality(
  voice: SpeechSynthesisVoice,
  preferredAccent: VietnameseAccent = 'bac',
): number {
  const name = voice.name.toLowerCase();
  const accent = getVoiceAccent(voice);
  let score = 0;

  // Ưu tiên hàng đầu theo chất giọng vùng miền
  if (preferredAccent === 'bac') {
    if (accent === 'bac')
      score += 150; // Ưu tiên rất cao cho giọng miền Bắc!
    else if (accent === 'nam') score -= 30;
  } else if (preferredAccent === 'nam') {
    if (accent === 'nam')
      score += 150; // Ưu tiên cho giọng miền Nam
    else if (accent === 'bac') score -= 30;
  }

  // Giọng Neural, Enhanced hoặc Premium có chất lượng truyền cảm vượt trội
  if (name.includes('enhanced') || name.includes('nâng cao') || name.includes('premium'))
    score += 100;
  if (name.includes('natural') || name.includes('online')) score += 90;
  if (name.includes('linh')) score += 85; // Linh trên Apple chuẩn Hà Nội rất truyền cảm
  if (name.includes('namminh')) score += 80; // Microsoft Nam Minh giọng Bắc
  if (name.includes('hoaimy')) score += 80; // Microsoft Hoài My giọng Nam
  if (name.includes('siri')) score += 60;
  if (name.includes('mai')) score += 50;
  if (name.includes('google')) score += 30;

  // Ưu tiên khớp chính xác mã vùng vi-VN / en-US
  const lang = voice.lang.toLowerCase().replace('_', '-');
  if (lang === 'vi-vn' || lang === 'en-us') score += 20;

  // Giọng mặc định hệ thống
  if (voice.default) score += 5;

  // Trừ điểm giọng compact cơ bản (thường phẳng, hơi robot) nếu có giọng nâng cao
  if (name.includes('compact')) score -= 15;

  return score;
}

/** Lấy danh sách giọng đọc khả dụng trên máy đã lọc theo ngôn ngữ và sắp xếp theo độ truyền cảm. */
export function getAvailableVoices(
  language: SpeechLanguage = 'vi',
  accent?: VietnameseAccent,
): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const allVoices = window.speechSynthesis.getVoices();
  const langPrefix = language.toLowerCase();
  const exact = language === 'vi' ? 'vi-vn' : 'en-us';

  const filtered = allVoices.filter((v) => {
    const l = v.lang.toLowerCase().replace('_', '-');
    return l === exact || l.startsWith(langPrefix);
  });

  const accentToUse = accent ?? (language === 'vi' ? getPreferredAccent() : 'all');
  return filtered.sort(
    (a, b) => rateVoiceQuality(b, accentToUse) - rateVoiceQuality(a, accentToUse),
  );
}

/** Tìm giọng đọc tốt nhất cho ngôn ngữ (hoặc theo tên chỉ định). */
export function findVoice(
  language: SpeechLanguage,
  preferredName?: string,
  accent?: VietnameseAccent,
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const accentToUse = accent ?? (language === 'vi' ? getPreferredAccent() : 'all');
  const available = getAvailableVoices(language, accentToUse);
  if (available.length === 0) return null;

  const targetName = preferredName ?? getPreferredVoice(language);
  if (targetName) {
    const found = available.find((v) => v.name === targetName);
    if (found) return found;
  }

  // Nếu không chỉ định tên, trả về giọng đứng đầu bảng xếp hạng chất lượng
  return available[0] ?? null;
}

/** Máy có giọng đọc cho ngôn ngữ này không (danh sách giọng có thể nạp muộn vài trăm ms). */
export function waitForVoice(language: SpeechLanguage, timeoutMs = 1500): Promise<boolean> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window))
    return Promise.resolve(false);
  cachedVoices[language] = findVoice(language);
  if (cachedVoices[language]) return Promise.resolve(true);

  return new Promise((resolve) => {
    const done = (): void => {
      cachedVoices[language] = findVoice(language);
      resolve(cachedVoices[language] !== null);
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
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
  }
}

/**
 * Đọc to một câu với giọng điệu truyền cảm (ưu tiên tệp âm thanh bản thu nếu có, hoặc Web Speech API).
 * Hỗ trợ tham số linh hoạt:
 * - speak('Chào Miu')
 * - speak('Chào Miu', 'vi')
 * - speak('Ngày xửa ngày xưa...', { audioClipUrl: '/game/audio/story-intro.mp3' })
 */
export function speak(text: string, optionsOrLanguage?: SpeechLanguage | SpeakOptions): void {
  if (muted || typeof window === 'undefined' || !isVoiceEnabled()) return;

  const options: SpeakOptions =
    typeof optionsOrLanguage === 'string'
      ? { language: optionsOrLanguage }
      : (optionsOrLanguage ?? {});

  // Nếu có đường dẫn file âm thanh thu âm chất lượng cao, ưu tiên phát trực tiếp
  if (options.audioClipUrl) {
    void playAudioClip(options.audioClipUrl);
    return;
  }

  const language = options.language ?? 'vi';
  const toneId = options.tone ?? getPreferredTone();
  const toneConfig = VOICE_TONES[toneId] ?? VOICE_TONES.story;

  // Giọng Zalo (có giọng miền Nam): phát file âm thanh từ Worker, lỗi thì quay về giọng của máy
  const zaloVoice =
    language === 'vi' ? findZaloVoice(options.voiceName ?? getPreferredVoice('vi')) : undefined;
  if (zaloVoice) {
    stopAudio();
    const speed = toZaloSpeed((options.rate ?? toneConfig.rate) * getSpeechRateScale());
    const urls = splitForSpeech(text).map((chunk) => zaloAudioUrl(zaloVoice.speaker, speed, chunk));
    void playZaloQueue(urls, speechToken).then((ok) => {
      if (!ok) speakWithDevice(text, { ...options, voiceName: undefined, deviceOnly: true });
    });
    return;
  }

  speakWithDevice(text, options);
}

/**
 * Phát lần lượt các đoạn âm thanh giọng Zalo. Trả false nếu đoạn ĐẦU không phát được
 * (mất mạng, chưa cấu hình) để đọc lại bằng giọng của máy; lỗi giữa chừng thì dừng.
 */
function playZaloQueue(urls: string[], token: number): Promise<boolean> {
  return new Promise((resolve) => {
    let index = 0;
    let started = false;
    const playNext = () => {
      if (token !== speechToken || index >= urls.length) {
        currentAudioElement = null;
        if (started) emitSpeaking(false);
        resolve(started || urls.length === 0);
        return;
      }
      const audio = new Audio(urls[index++]);
      currentAudioElement = audio;
      audio.onplaying = () => {
        if (!started) emitSpeaking(true);
        started = true;
      };
      audio.onended = playNext;
      audio.onerror = () => {
        index = urls.length;
        playNext();
      };
      audio.play().catch(() => {
        index = urls.length;
        playNext();
      });
    };
    playNext();
  });
}

function speakWithDevice(text: string, options: SpeakOptions & { deviceOnly?: boolean }): void {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  if (!options.deviceOnly) stopAudio();

  const language = options.language ?? 'vi';
  const accent = options.accent ?? (language === 'vi' ? getPreferredAccent() : 'all');
  const toneId = options.tone ?? getPreferredTone();
  const toneConfig = VOICE_TONES[toneId] ?? VOICE_TONES.story;
  const baseSettings = BASE_SPEECH_SETTINGS[language];
  // Giọng máy không có tên Zalo: bỏ qua lựa chọn Zalo, để findVoice chọn giọng máy tốt nhất
  const deviceVoiceName = findZaloVoice(options.voiceName) ? undefined : options.voiceName;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = baseSettings.lang;

  const voice = findVoice(language, deviceVoiceName, accent);
  if (voice) utterance.voice = voice;

  // Tốc độ & cao độ bé/bố mẹ tinh chỉnh trong bảng cài đặt nhân vật nhân lên giọng điệu gốc
  utterance.rate = Math.min(10, (options.rate ?? toneConfig.rate) * getSpeechRateScale());
  utterance.pitch = Math.min(2, (options.pitch ?? toneConfig.pitch) * getSpeechPitchScale());
  utterance.volume = options.volume ?? 1.0;
  utterance.onstart = () => emitSpeaking(true);
  utterance.onend = () => emitSpeaking(false);
  utterance.onerror = () => emitSpeaking(false);

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

/** Tiếng "ting" khi làm đúng câu hỏi. */
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

/** Tiếng "bụp" trầm nhẹ khi chọn sai, không gây giật mình cho bé. */
export function playWrongSound(): void {
  playNotes([{ frequency: 220, start: 0, duration: 0.25 }], 'sine');
}

/** Tiếng "pop" khi chạm màn hình hoặc nhảy bật. */
export function playPopSound(): void {
  playNotes([{ frequency: 520, start: 0, duration: 0.08 }], 'square');
}

/** Tiếng "rủng rỉnh" vui nhộn khi nhận xu hoặc thăng cấp. */
export function playRewardSound(): void {
  playNotes(
    [
      { frequency: 523.25, start: 0, duration: 0.12 }, // C5
      { frequency: 659.25, start: 0.1, duration: 0.12 }, // E5
      { frequency: 783.99, start: 0.2, duration: 0.15 }, // G5
      { frequency: 1046.5, start: 0.32, duration: 0.35 }, // C6
    ],
    'triangle',
  );
}

/** Tiếng "chuông tiên lấp lánh" (magic shimmer) khi mở cổng diệu kỳ hoặc khám phá điều bất ngờ. */
export function playMagicSound(): void {
  playNotes(
    [
      { frequency: 659.25, start: 0, duration: 0.12 }, // E5
      { frequency: 830.61, start: 0.08, duration: 0.12 }, // G#5
      { frequency: 987.77, start: 0.16, duration: 0.14 }, // B5
      { frequency: 1318.51, start: 0.24, duration: 0.16 }, // E6
      { frequency: 1661.22, start: 0.32, duration: 0.35 }, // G#6
    ],
    'sine',
  );
}

export type SfxType =
  'correct' | 'wrong' | 'pop' | 'reward' | 'magic' | 'click' | 'fail' | 'levelUp' | 'cheer';

export type SfxName = SfxType;

export function playSfx(type: SfxType): void {
  if (typeof window !== 'undefined')
    window.dispatchEvent(new CustomEvent(SFX_EVENT, { detail: type }));
  unlockAudio();
  switch (type) {
    case 'correct':
      playCorrectSound();
      break;
    case 'wrong':
    case 'fail':
      playWrongSound();
      break;
    case 'pop':
    case 'click':
      playPopSound();
      break;
    case 'reward':
    case 'cheer':
      playRewardSound();
      break;
    case 'magic':
    case 'levelUp':
      playMagicSound();
      break;
  }
}
