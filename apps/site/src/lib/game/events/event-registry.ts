/**
 * apps/site/src/lib/game/events/event-registry.ts
 *
 * Sổ đăng ký sự kiện và cơ chế kiểm tra (validation) lúc nạp/build.
 *
 * QUY TẮC BẤT BIẾN:
 * 1. Sự kiện là plug-in vào một Thế giới (World).
 * 2. Mọi kỹ năng trong sự kiện PHẢI nằm trong danh mục kỹ năng của chính thế giới đó (SKILLS[grade/*]).
 * 3. Tuyệt đối không khai báo kỹ năng riêng biệt trong sự kiện.
 * 4. Thêm hoặc xoá sự kiện không làm thay đổi hay phá vỡ cấu trúc Base.
 */
import { GRADES, SKILLS, type GradeId } from '../skills/skill-types';
import type { EventDefinition } from './event-types';
import { isEventActive } from './event-schedule';
import { TIMO_EVENT_LOP_2 } from '../../../worlds/lop-2/events/timo/event';

export interface EventValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Kiểm tra tính hợp lệ của một định nghĩa sự kiện.
 */
export function validateEvent(event: EventDefinition): EventValidationResult {
  const errors: string[] = [];

  if (!event.metadata?.id || typeof event.metadata.id !== 'string') {
    errors.push('Event ID không hợp lệ hoặc bị trống');
  }

  const validGrades = Object.keys(GRADES) as GradeId[];
  if (!validGrades.includes(event.metadata.grade)) {
    errors.push(
      `Grade "${event.metadata.grade}" không tồn tại trong danh mục GRADES (${validGrades.join(', ')})`,
    );
  }

  // Kiểm tra lịch trình
  if (event.schedule.recurring) {
    const { month, day, durationDays } = event.schedule.recurring;
    if (month < 1 || month > 12) errors.push(`Tháng định kỳ ${month} không hợp lệ (1-12)`);
    if (day < 1 || day > 31) errors.push(`Ngày định kỳ ${day} không hợp lệ (1-31)`);
    if (durationDays <= 0) errors.push(`Thời lượng định kỳ ${durationDays} phải lớn hơn 0`);
  } else {
    if (!event.schedule.startsOn || !event.schedule.endsOn) {
      errors.push('Sự kiện phải có startsOn và endsOn');
    } else if (event.schedule.startsOn > event.schedule.endsOn) {
      errors.push(
        `startsOn (${event.schedule.startsOn}) không được lớn hơn endsOn (${event.schedule.endsOn})`,
      );
    }
  }

  // Kiểm tra kỹ năng trong nhiệm vụ (RÀNG BUỘC CỐT LÕI)
  const gradePrefix = `${event.metadata.grade}/`;
  const knownSkillIds = new Set(Object.keys(SKILLS));

  for (const quest of event.quests) {
    if (!quest.skill) {
      errors.push(`Nhiệm vụ "${quest.id}" thiếu kỹ năng (skill)`);
      continue;
    }

    if (!knownSkillIds.has(quest.skill)) {
      errors.push(
        `Nhiệm vụ "${quest.id}" sử dụng kỹ năng lạ "${quest.skill}" không nằm trong danh mục kỹ năng hệ thống`,
      );
    }

    if (!quest.skill.startsWith(gradePrefix)) {
      errors.push(
        `Nhiệm vụ "${quest.id}" có kỹ năng "${quest.skill}" không thuộc thế giới "${event.metadata.grade}" (phải bắt đầu bằng "${gradePrefix}")`,
      );
    }
  }

  // Kiểm tra kỹ năng trong thử thách (challenges) nếu có
  if (event.challenges) {
    for (const challenge of event.challenges) {
      for (const skill of challenge.skills) {
        if (!knownSkillIds.has(skill)) {
          errors.push(
            `Thử thách "${challenge.id}" sử dụng kỹ năng lạ "${skill}" không nằm trong danh mục`,
          );
        }
        if (!skill.startsWith(gradePrefix)) {
          errors.push(
            `Thử thách "${challenge.id}" có kỹ năng "${skill}" không thuộc thế giới "${event.metadata.grade}"`,
          );
        }
      }
    }
  }

  // Kiểm tra boss nếu có
  if (event.finalBoss) {
    const questExists = event.quests.some((q) => q.id === event.finalBoss?.questId);
    if (!questExists) {
      errors.push(
        `finalBoss questId "${event.finalBoss.questId}" không tồn tại trong danh sách quests của sự kiện`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

class EventRegistry {
  private events = new Map<string, EventDefinition>();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.registerEvent(TIMO_EVENT_LOP_2);
  }

  private getFullKey(grade: GradeId, eventId: string): string {
    return `${grade}/${eventId}`;
  }

  public registerEvent(event: EventDefinition): void {
    const validation = validateEvent(event);
    if (!validation.valid) {
      throw new Error(
        `Lỗi đăng ký sự kiện "${event.metadata?.id}":\n- ${validation.errors.join('\n- ')}`,
      );
    }

    const key = this.getFullKey(event.metadata.grade, event.metadata.id);
    this.events.set(key, event);
  }

  public getEvent(grade: GradeId, eventId: string): EventDefinition | undefined {
    return this.events.get(this.getFullKey(grade, eventId));
  }

  public getAllEvents(): EventDefinition[] {
    return Array.from(this.events.values());
  }

  public getEventsForWorld(grade: GradeId): EventDefinition[] {
    return this.getAllEvents().filter((e) => e.metadata.grade === grade);
  }

  public getActiveEventsForWorld(grade: GradeId, now?: Date | string): EventDefinition[] {
    return this.getEventsForWorld(grade).filter((e) => isEventActive(e.schedule, now));
  }

  public clearForTesting(): void {
    this.events.clear();
  }

  public resetDefaultsForTesting(): void {
    this.events.clear();
    this.registerDefaults();
  }
}

export const eventRegistry = new EventRegistry();

export function registerEvent(event: EventDefinition): void {
  eventRegistry.registerEvent(event);
}

export function getEvent(grade: GradeId, eventId: string): EventDefinition | undefined {
  return eventRegistry.getEvent(grade, eventId);
}

export function getAllEvents(): EventDefinition[] {
  return eventRegistry.getAllEvents();
}

export function getEventsForWorld(grade: GradeId): EventDefinition[] {
  return eventRegistry.getEventsForWorld(grade);
}

export function getActiveEventsForWorld(grade: GradeId, now?: Date | string): EventDefinition[] {
  return eventRegistry.getActiveEventsForWorld(grade, now);
}
