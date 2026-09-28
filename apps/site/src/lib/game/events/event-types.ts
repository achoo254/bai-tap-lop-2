/**
 * apps/site/src/lib/game/events/event-types.ts
 *
 * Định nghĩa cấu trúc hệ thống Sự kiện (Event System) của Thế giới học tập:
 * Sự kiện là module cắm vào một Thế giới lớp (grade), có lịch bắt đầu/kết thúc,
 * địa điểm trên bản đồ thế giới, các nhiệm vụ (quests) với độ khó tăng cường (difficultyBoost),
 * thử thách đặc biệt, boss và phần thưởng độc quyền (huy hiệu, phụ kiện mèo, xu).
 *
 * QUY TẮC BẤT BIẾN:
 * - Sự kiện KHÔNG ĐƯỢC định nghĩa kỹ năng mới.
 * - Mọi nhiệm vụ trong sự kiện BẮT BUỘC phải tham chiếu kỹ năng có sẵn của thế giới đó.
 * - Thêm/gỡ sự kiện không làm thay đổi hay phá vỡ Base curriculum.
 */
import type { GradeId, SkillId } from '../skills/skill-types';
import type { UnlockRule } from '../world/world-types';

export type EventId = string;
export type EventFullId = `${GradeId}/${EventId}`;

export interface EventTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  cardBg: string;
  borderColor: string;
  icon: string;
  bannerTitle: string;
}

export interface EventMetadata {
  id: EventId;
  grade: GradeId;
  name: string;
  subtitle: string;
  description: string;
  guideNpc: 'bac-cu' | 'soc-nau' | 'chim-sau' | string;
  theme: EventTheme;
  badgeIcon: string;
}

export interface EventSchedule {
  /** Ngày bắt đầu theo định dạng YYYY-MM-DD */
  startsOn: string;
  /** Ngày kết thúc theo định dạng YYYY-MM-DD */
  endsOn: string;
  /** Múi giờ áp dụng, mặc định là Asia/Ho_Chi_Minh (UTC+7) */
  timeZone?: string;
  /** Sự kiện lặp lại hàng năm (tùy chọn) */
  recurring?: {
    type: 'annual';
    month: number; // 1-12
    day: number; // 1-31
    durationDays: number;
  };
}

export interface EventLocation {
  /** Tọa độ điểm neo trên bản đồ thế giới (%) */
  worldAnchor: { x: number; y: number };
  anchorName: string;
  islandGraphic?: string;
}

export interface EventQuest {
  id: string;
  title: string;
  npc: 'bac-cu' | 'soc-nau' | 'chim-sau' | string;
  intro: string;
  minigame: string;
  /** Kỹ năng phải thuộc danh mục kỹ năng của chính thế giới đó (ví dụ lop-2/*) */
  skill: SkillId;
  questions: number;
  /** Bậc tăng thêm so với mastery hiện tại của bé (ví dụ TIMO +1, tối đa bậc 5) */
  difficultyBoost: number;
  unlock: UnlockRule;
  mapCoordinates: { x: number; y: number };
  isBoss?: boolean;
}

export interface EventChallenge {
  id: string;
  title: string;
  description: string;
  type: 'speed' | 'exam-simulation' | 'boss-battle';
  timeLimitSeconds?: number;
  skills: SkillId[];
  questions: number;
  difficultyBoost: number;
  rewardBadge?: string;
  rewardCoins?: number;
}

export interface EventReward {
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  badgeDescription: string;
  accessoryId?: string;
  bonusCoins: number;
}

export interface EventFinalBoss {
  name: string;
  title: string;
  avatar: string;
  intro: string;
  victoryMessage: string;
  questId: string;
}

export interface EventDefinition {
  metadata: EventMetadata;
  schedule: EventSchedule;
  location: EventLocation;
  quests: EventQuest[];
  challenges?: EventChallenge[];
  rewards: EventReward;
  finalBoss?: EventFinalBoss;
}

export type EventStatus = 'upcoming' | 'active' | 'concluded';

export interface EventScheduleStatus {
  status: EventStatus;
  daysRemaining?: number;
  startsInDays?: number;
  activeToday: boolean;
}
