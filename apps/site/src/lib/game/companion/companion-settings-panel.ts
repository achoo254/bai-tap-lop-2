/**
 * apps/site/src/lib/game/companion/companion-settings-panel.ts
 *
 * Bảng cài đặt mở ra khi bấm vào nhân vật đồng hành:
 * - Nhân vật: tên, màu lông, phụ kiện theo loại (lưu ngay vào tiến độ game)
 * - Âm thanh: tắt tất cả, nhạc nền + âm lượng, giọng đọc, chọn giọng, vùng miền,
 *   phong cách, tốc độ, cao độ, nghe thử
 * - Mèo tự nói chuyện, kiểu chữ đọc bài
 * Mọi lựa chọn lưu trên thiết bị (localStorage) nên tải lại trang không mất.
 */
import { normalizeAccessories, type CatAccessoryId } from '../../../components/game/characters/cat-character';
import { bindAccessoryPicker } from '../avatar/accessory-picker';
import type { GameStore } from '../state/game-store';
import {
  getAvailableVoices,
  getPreferredAccent,
  getPreferredTone,
  getPreferredVoice,
  isMuted,
  setMuted,
  setPreferredAccent,
  setPreferredTone,
  setPreferredVoice,
  speak,
  VOICE_TONES,
  type VietnameseAccent,
  type VoiceTone,
} from '../media/audio';
import {
  getMusicVolume,
  getSpeechPitchScale,
  getSpeechRateScale,
  isMusicEnabled,
  isVoiceEnabled,
  setMusicEnabled,
  setMusicVolume,
  setSpeechPitchScale,
  setSpeechRateScale,
  setVoiceEnabled,
} from '../media/sound-preferences';
import { isChatterEnabled, setChatterEnabled } from './companion-chatter';

const AUTO_VOICE = '';

function field<T extends HTMLElement>(panel: HTMLElement, name: string): T | null {
  return panel.querySelector<T>(`[data-setting="${name}"]`);
}

export interface SettingsPanelCallbacks {
  onChatterChange(): void;
}

export function bindCompanionSettingsPanel(
  panel: HTMLElement,
  store: GameStore,
  callbacks: SettingsPanelCallbacks,
): void {
  // --- Nhân vật ---
  const nameInput = field<HTMLInputElement>(panel, 'name');
  const saveAvatar = (change: Partial<ReturnType<GameStore['getState']>['avatar']>) => {
    store.update((state) => ({ ...state, avatar: { ...state.avatar, ...change } }));
  };

  if (nameInput) {
    nameInput.value = store.getState().avatar.name;
    nameInput.addEventListener('input', () => {
      const name = nameInput.value.trim().slice(0, 20);
      if (name) saveAvatar({ name });
    });
  }

  const furChips = panel.querySelectorAll<HTMLElement>('[data-fur-id]');
  const syncFur = () =>
    furChips.forEach((chip) => {
      const selected = chip.dataset.furId === store.getState().avatar.furColor;
      chip.classList.toggle('active', selected);
      chip.setAttribute('aria-checked', String(selected));
    });
  furChips.forEach((chip) =>
    chip.addEventListener('click', () => {
      saveAvatar({ furColor: chip.dataset.furId ?? 'vang-cam' });
      syncFur();
    }),
  );
  syncFur();

  const picker = bindAccessoryPicker(
    panel,
    () => normalizeAccessories(store.getState().avatar.accessories),
    (next: CatAccessoryId[]) => saveAvatar({ accessories: next }),
  );

  // --- Âm thanh ---
  const allSound = field<HTMLInputElement>(panel, 'all-sound');
  const music = field<HTMLInputElement>(panel, 'music');
  const musicVolume = field<HTMLInputElement>(panel, 'music-volume');
  const voice = field<HTMLInputElement>(panel, 'voice');
  const voiceName = field<HTMLSelectElement>(panel, 'voice-name');
  const accent = field<HTMLSelectElement>(panel, 'accent');
  const tone = field<HTMLSelectElement>(panel, 'tone');
  const rate = field<HTMLInputElement>(panel, 'rate');
  const pitch = field<HTMLInputElement>(panel, 'pitch');
  const chatter = field<HTMLInputElement>(panel, 'chatter');
  const handwriting = field<HTMLInputElement>(panel, 'handwriting');

  const percent = (value: number) => String(Math.round(value * 100));
  const showValue = (input: HTMLInputElement | null, suffix: string) => {
    const out = input && panel.querySelector(`[data-value-for="${input.dataset.setting}"]`);
    if (out) out.textContent = `${input.value}${suffix}`;
  };

  function fillVoices(): void {
    if (!voiceName) return;
    const voices = getAvailableVoices('vi');
    const preferred = getPreferredVoice('vi') ?? AUTO_VOICE;
    voiceName.replaceChildren(
      new Option(voices.length ? 'Tự chọn giọng hay nhất' : 'Máy chưa có giọng tiếng Việt', AUTO_VOICE),
      ...voices.map((v) => new Option(`${v.name} (${v.lang})`, v.name)),
    );
    voiceName.value = voices.some((v) => v.name === preferred) ? preferred : AUTO_VOICE;
  }

  function syncSound(): void {
    if (allSound) allSound.checked = !isMuted();
    if (music) music.checked = isMusicEnabled();
    if (musicVolume) musicVolume.value = percent(getMusicVolume());
    if (voice) voice.checked = isVoiceEnabled();
    if (accent) accent.value = getPreferredAccent();
    if (tone) tone.value = getPreferredTone();
    if (rate) rate.value = percent(getSpeechRateScale());
    if (pitch) pitch.value = percent(getSpeechPitchScale());
    if (chatter) chatter.checked = isChatterEnabled();
    if (handwriting) handwriting.checked = document.documentElement.dataset.font === 'viet-tay';
    showValue(musicVolume, '%');
    showValue(rate, '%');
    showValue(pitch, '%');
    fillVoices();
  }

  if (tone) {
    tone.replaceChildren(
      ...Object.values(VOICE_TONES).map((t) => new Option(t.name, t.id)),
    );
  }

  const tryVoice = () => speak(`Xin chào ${store.getState().avatar.name}! Giọng mình nghe thế này nè.`);

  allSound?.addEventListener('change', () => setMuted(!allSound.checked));
  music?.addEventListener('change', () => setMusicEnabled(music.checked));
  musicVolume?.addEventListener('input', () => {
    setMusicVolume(Number(musicVolume.value) / 100);
    showValue(musicVolume, '%');
  });
  voice?.addEventListener('change', () => setVoiceEnabled(voice.checked));
  voiceName?.addEventListener('change', () => {
    setPreferredVoice('vi', voiceName.value);
    tryVoice();
  });
  accent?.addEventListener('change', () => {
    setPreferredAccent(accent.value as VietnameseAccent);
    fillVoices();
  });
  tone?.addEventListener('change', () => setPreferredTone(tone.value as VoiceTone));
  rate?.addEventListener('input', () => {
    setSpeechRateScale(Number(rate.value) / 100);
    showValue(rate, '%');
  });
  pitch?.addEventListener('input', () => {
    setSpeechPitchScale(Number(pitch.value) / 100);
    showValue(pitch, '%');
  });
  rate?.addEventListener('change', tryVoice);
  pitch?.addEventListener('change', tryVoice);
  panel.querySelector('[data-action="try-voice"]')?.addEventListener('click', tryVoice);
  panel.querySelector('[data-action="reset-voice"]')?.addEventListener('click', () => {
    setSpeechRateScale(1);
    setSpeechPitchScale(1);
    setPreferredVoice('vi', AUTO_VOICE);
    syncSound();
    tryVoice();
  });

  chatter?.addEventListener('change', () => {
    setChatterEnabled(chatter.checked);
    callbacks.onChatterChange();
  });

  // Kiểu chữ đọc bài: cùng khoá với nút "Chữ in / Chữ viết tay" trên thanh công cụ bài học
  handwriting?.addEventListener('change', () => {
    const root = document.documentElement;
    if (handwriting.checked) root.dataset.font = 'viet-tay';
    else delete root.dataset.font;
    try {
      localStorage.setItem('kieu-chu', handwriting.checked ? 'viet-tay' : 'in');
    } catch {
      // Không lưu được: chỉ áp dụng trong phiên này.
    }
  });

  window.speechSynthesis?.addEventListener('voiceschanged', fillVoices);

  /** Gọi mỗi lần mở bảng để hiện đúng trạng thái mới nhất. */
  panel.addEventListener('companion:open', () => {
    if (nameInput) nameInput.value = store.getState().avatar.name;
    syncFur();
    picker.sync();
    syncSound();
  });
  syncSound();
}
