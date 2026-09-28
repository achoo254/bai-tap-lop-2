/**
 * apps/site/tests/unit/game/audio.test.ts
 *
 * Kiểm tra hệ thống âm thanh & giọng đọc truyền cảm:
 * - Ưu tiên chuẩn giọng Miền Bắc (Hà Nội)
 * - Phân loại chính xác giọng vùng miền: Linh (Apple) là Miền Nam, Hoài My/Nam Minh là Miền Bắc
 * - Các preset phong cách (story, guide, cheer, calm, teacher, normal)
 * - Khả năng lưu trữ tùy chọn giọng nói, vùng miền và phong cách
 * - Tương thích ngược với các hàm gọi speak(text, 'vi' | 'en')
 */
import { describe, expect, it, beforeEach } from 'vitest';
import {
  VOICE_TONES,
  NORTHERN_AUDIO_CLIPS,
  rateVoiceQuality,
  getVoiceAccent,
  getPreferredAccent,
  setPreferredAccent,
  getPreferredTone,
  setPreferredTone,
  getPreferredVoice,
  setPreferredVoice,
  isMuted,
  setMuted,
  stopAudio,
  playAudioClip,
  playSfx,
} from '../../../src/lib/game/media/audio';

describe('hệ thống âm thanh & giọng đọc (audio.ts)', () => {
  const storageMap = new Map<string, string>();

  beforeEach(() => {
    storageMap.clear();
    // Giả lập localStorage trong môi trường Node/Vitest
    globalThis.localStorage = {
      getItem: (key: string) => storageMap.get(key) ?? null,
      setItem: (key: string, val: string) => storageMap.set(key, String(val)),
      removeItem: (key: string) => storageMap.delete(key),
      clear: () => storageMap.clear(),
      key: () => null,
      length: 0,
    } as unknown as Storage;
  });

  describe('chất giọng vùng miền (VietnameseAccent)', () => {
    it('mặc định chất giọng là miền Bắc (Hà Nội)', () => {
      expect(getPreferredAccent()).toBe('bac');
    });

    it('cho phép đổi và lưu chất giọng vùng miền', () => {
      setPreferredAccent('nam');
      expect(getPreferredAccent()).toBe('nam');
      setPreferredAccent('bac');
      expect(getPreferredAccent()).toBe('bac');
    });

    it('phân loại chính xác vùng miền: Linh/Nam Minh/Mai/Siri 1 là Miền Bắc, Hoài My/Siri 2 là Miền Nam', () => {
      // Giọng Apple Linh là miền Bắc chuẩn Hà Nội
      expect(getVoiceAccent({ name: 'Linh' } as SpeechSynthesisVoice)).toBe('bac');
      expect(getVoiceAccent({ name: 'Linh (Enhanced)' } as SpeechSynthesisVoice)).toBe('bac');

      // Giọng miền Bắc chuẩn khác
      expect(
        getVoiceAccent({ name: 'Microsoft NamMinh Online (Natural)' } as SpeechSynthesisVoice),
      ).toBe('bac');
      expect(getVoiceAccent({ name: 'Siri Voice 1' } as SpeechSynthesisVoice)).toBe('bac');
      expect(getVoiceAccent({ name: 'Mai' } as SpeechSynthesisVoice)).toBe('bac');

      // Giọng miền Nam
      expect(
        getVoiceAccent({ name: 'Microsoft HoaiMy Online (Natural)' } as SpeechSynthesisVoice),
      ).toBe('nam');
      expect(getVoiceAccent({ name: 'Microsoft Hoài My Online' } as SpeechSynthesisVoice)).toBe(
        'nam',
      );
      expect(getVoiceAccent({ name: 'Siri Voice 2' } as SpeechSynthesisVoice)).toBe('nam');
      expect(getVoiceAccent({ name: 'Google tiếng Việt' } as SpeechSynthesisVoice)).toBe('chung');
    });

    it('chấm điểm ưu tiên vượt trội cho giọng miền Bắc (Linh) khi chọn bac', () => {
      const hoaimyVoice = {
        name: 'Microsoft HoaiMy Online (Natural)',
        lang: 'vi-VN',
        default: false,
        localService: true,
        voiceURI: 'hoaimy',
      } as SpeechSynthesisVoice;

      const linhVoice = {
        name: 'Linh',
        lang: 'vi-VN',
        default: false,
        localService: true,
        voiceURI: 'linh',
      } as SpeechSynthesisVoice;

      const scoreLinh = rateVoiceQuality(linhVoice, 'bac');
      const scoreHoaiMy = rateVoiceQuality(hoaimyVoice, 'bac');

      expect(scoreLinh).toBeGreaterThan(scoreHoaiMy);
    });
  });

  describe('tệp âm thanh thu âm giọng Miền Bắc (NORTHERN_AUDIO_CLIPS)', () => {
    it('có đủ các tệp âm thanh bản thu cho các lời thoại chính', () => {
      expect(NORTHERN_AUDIO_CLIPS.owlGreeting).toBe('/game/audio/owl-greeting.mp3');
      expect(NORTHERN_AUDIO_CLIPS.storyIntro).toBe('/game/audio/story-intro.mp3');
      expect(NORTHERN_AUDIO_CLIPS.rewardCheer).toBe('/game/audio/reward-cheer.mp3');
      expect(NORTHERN_AUDIO_CLIPS.calmEncourage).toBe('/game/audio/calm-encourage.mp3');
      expect(NORTHERN_AUDIO_CLIPS.sampleNorth).toBe('/game/audio/sample-north.mp3');
    });

    it('gọi stopAudio và playAudioClip không gây lỗi trong môi trường không có DOM audio', async () => {
      expect(() => stopAudio()).not.toThrow();
      await expect(playAudioClip(NORTHERN_AUDIO_CLIPS.owlGreeting)).resolves.toBeUndefined();
    });
  });

  describe('bộ preset phong cách giọng đọc (VOICE_TONES)', () => {
    it('có đủ 6 phong cách chuẩn với thông số rate và pitch hợp lý cho trẻ nhỏ', () => {
      expect(VOICE_TONES.story).toBeDefined();
      expect(VOICE_TONES.guide).toBeDefined();
      expect(VOICE_TONES.cheer).toBeDefined();
      expect(VOICE_TONES.calm).toBeDefined();
      expect(VOICE_TONES.teacher).toBeDefined();
      expect(VOICE_TONES.normal).toBeDefined();

      expect(VOICE_TONES.story.rate).toBeLessThanOrEqual(0.85);
      expect(VOICE_TONES.story.pitch).toBeLessThanOrEqual(1.0);
      expect(VOICE_TONES.calm.rate).toBeLessThanOrEqual(0.82);
      expect(VOICE_TONES.cheer.rate).toBeGreaterThan(VOICE_TONES.story.rate);
    });

    it('mặc định phong cách ưu tiên là story (kể chuyện)', () => {
      expect(getPreferredTone()).toBe('story');
    });

    it('cho phép lưu và đọc lại phong cách ưu tiên', () => {
      setPreferredTone('guide');
      expect(getPreferredTone()).toBe('guide');
      setPreferredTone('cheer');
      expect(getPreferredTone()).toBe('cheer');
    });
  });

  describe('lưu và khôi phục lựa chọn giọng', () => {
    it('nhớ giọng ưu tiên của người dùng', () => {
      expect(getPreferredVoice('vi')).toBeNull();
      setPreferredVoice('vi', 'Microsoft HoaiMy Online (Natural)');
      expect(getPreferredVoice('vi')).toBe('Microsoft HoaiMy Online (Natural)');
    });
  });

  describe('trạng thái tắt tiếng (muted)', () => {
    it('bật tắt tiếng chính xác', () => {
      setMuted(true);
      expect(isMuted()).toBe(true);
      setMuted(false);
      expect(isMuted()).toBe(false);
    });
  });

  describe('phát âm thanh hiệu ứng (playSfx)', () => {
    it('hỗ trợ mọi loại hiệu ứng âm thanh bao gồm magic mà không lỗi', () => {
      expect(() => {
        playSfx('correct');
        playSfx('wrong');
        playSfx('pop');
        playSfx('reward');
        playSfx('magic');
      }).not.toThrow();
    });
  });
});
