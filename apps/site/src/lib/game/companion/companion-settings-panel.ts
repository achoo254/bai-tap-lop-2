/**
 * apps/site/src/lib/game/companion/companion-settings-panel.ts
 *
 * Bảng cài đặt mở ra khi bấm vào nhân vật đồng hành:
 * - Nhân vật: tên, màu lông, phụ kiện theo loại (lưu ngay vào tiến độ game)
 * - Âm thanh: tắt tất cả, nhạc nền + âm lượng, giọng đọc, chọn người đọc
 *   (người đọc gồm cả giọng Zalo miền Nam), phong cách, tốc độ, cao độ, nghe thử
 * - Mèo tự nói chuyện, kiểu chữ đọc bài
 * Mọi lựa chọn lưu trên thiết bị (localStorage) nên tải lại trang không mất.
 */
import {
  normalizeAccessories,
  type CatAccessoryId,
} from '../../../components/game/characters/cat-character';
import { bindAccessoryPicker } from '../avatar/accessory-picker';
import type { GameStore } from '../state/game-store';
import {
  getAvailableVoices,
  getPreferredTone,
  getPreferredVoice,
  isMuted,
  setMuted,
  setPreferredTone,
  setPreferredVoice,
  speak,
  VOICE_TONES,
  type VoiceTone,
} from '../media/audio';
import { ZALO_VOICES } from '../media/zalo-voice';
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

  // --- Chuyển Tab trong bảng cài đặt ---
  const tabBtns = panel.querySelectorAll<HTMLButtonElement>('[data-companion-tab]');
  const tabPanes = panel.querySelectorAll<HTMLElement>('[data-tab-pane]');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.companionTab;
      tabBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });
      tabPanes.forEach((pane) => {
        pane.hidden = pane.dataset.tabPane !== target;
      });
      if (target === 'accessories') {
        picker.sync();
      }
    });
  });

  // --- Âm thanh ---
  const allSound = field<HTMLInputElement>(panel, 'all-sound');
  const music = field<HTMLInputElement>(panel, 'music');
  const musicVolume = field<HTMLInputElement>(panel, 'music-volume');
  const voice = field<HTMLInputElement>(panel, 'voice');
  const voiceName = field<HTMLSelectElement>(panel, 'voice-name');
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

  /** Danh sách người đọc: giọng Zalo (có miền Nam) + mọi giọng tiếng Việt cài sẵn trong máy. */
  function fillVoices(): void {
    if (!voiceName) return;
    const deviceVoices = getAvailableVoices('vi', 'all');
    const preferred = getPreferredVoice('vi') ?? AUTO_VOICE;
    const zaloGroup = document.createElement('optgroup');
    zaloGroup.label = 'Giọng Zalo (cần mạng)';
    zaloGroup.append(...ZALO_VOICES.map((v) => new Option(v.label, v.id)));
    const deviceGroup = document.createElement('optgroup');
    deviceGroup.label = 'Giọng có sẵn trong máy';
    deviceGroup.append(...deviceVoices.map((v) => new Option(`${v.name} (${v.lang})`, v.name)));
    voiceName.replaceChildren(
      new Option('Tự chọn giọng máy hay nhất', AUTO_VOICE),
      zaloGroup,
      ...(deviceVoices.length ? [deviceGroup] : []),
    );
    const known = [...ZALO_VOICES.map((v) => v.id), ...deviceVoices.map((v) => v.name)];
    voiceName.value = known.includes(preferred) ? preferred : AUTO_VOICE;
  }

  function syncSound(): void {
    if (allSound) allSound.checked = !isMuted();
    if (music) music.checked = isMusicEnabled();
    if (musicVolume) musicVolume.value = percent(getMusicVolume());
    if (voice) voice.checked = isVoiceEnabled();
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
    tone.replaceChildren(...Object.values(VOICE_TONES).map((t) => new Option(t.name, t.id)));
  }

  const tryVoice = () =>
    speak(`Xin chào ${store.getState().avatar.name}! Giọng mình nghe thế này nè.`);

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
