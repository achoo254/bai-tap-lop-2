/**
 * apps/site/src/lib/game/world/world-types.ts
 *
 * Định nghĩa cấu trúc dữ liệu thế giới học tập của Miu:
 * Mỗi năm học là một Thế giới (World):
 * Thế giới (World) -> Vùng môn học (Region) -> Chương (Chapter) -> Bài học (Lesson) -> Nhiệm vụ (Quest) -> Mini-game.
 */
import type { GradeId, SubjectId, SkillId } from '../skills/skill-types';

export interface RegionTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  cardBg: string;
  borderColor: string;
  icon: string;
  bannerTitle: string;
}

export type UnlockRule =
  | { type: 'always' }
  | { type: 'quest-completed'; questId: string }
  | { type: 'stars-required'; count: number }
  | { type: 'chapter-completed'; chapterId: string };

export interface Quest {
  id: string;
  title: string;
  npc: 'bac-cu' | 'soc-nau' | 'chim-sau';
  intro: string;
  minigame: string;
  skill: SkillId;
  questions: number;
  isBoss?: boolean;
  unlock: UnlockRule;
  mapCoordinates: { x: number; y: number };
}

export interface Lesson {
  id: string;
  name: string;
  skills: SkillId[];
  quests: Quest[];
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  order: number;
  lessons: Lesson[];
  status?: 'open' | 'locked';
}

export interface Region {
  id: SubjectId;
  name: string;
  tagline: string;
  theme: RegionTheme;
  guideNpc: 'bac-cu' | 'soc-nau' | 'chim-sau';
  chapters: Chapter[];
  status: 'open' | 'coming-soon';
}

export interface EventAnchor {
  id: string;
  name: string;
  themeTag: string;
  coordinates: { x: number; y: number };
  status: 'active' | 'upcoming' | 'concluded';
  opensOn?: string;
  closesOn?: string;
}

export interface World {
  grade: GradeId;
  name: string;
  schoolYear: string;
  opensOn: string; // Định dạng YYYY-MM-DD
  description: string;
  regions: Region[];
  eventAnchors?: EventAnchor[];
}
