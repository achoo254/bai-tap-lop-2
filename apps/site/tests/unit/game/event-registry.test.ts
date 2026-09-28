import { beforeEach, describe, expect, it } from 'vitest';
import {
  eventRegistry,
  getActiveEventsForWorld,
  getEvent,
  getEventsForWorld,
  registerEvent,
  validateEvent,
} from '../../../src/lib/game/events/event-registry';
import type { EventDefinition } from '../../../src/lib/game/events/event-types';
import { WORLD_LOP_2 } from '../../../src/worlds/lop-2/world';

describe('event-registry: Kiểm tra tính hợp lệ (Validation & Invariants)', () => {
  beforeEach(() => {
    eventRegistry.resetDefaultsForTesting();
  });

  const validSampleEvent: EventDefinition = {
    metadata: {
      id: 'le-hoi-do-vui',
      grade: 'lop-2',
      name: 'Lễ Hội Đố Vui',
      subtitle: 'Sự kiện toán học mùa thu',
      description: 'Cùng Miu tham gia giải đố!',
      guideNpc: 'soc-nau',
      theme: {
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        accentColor: '#f59e0b',
        bgColor: '#ecfdf5',
        cardBg: '#ffffff',
        borderColor: '#a7f3d0',
        icon: '🎪',
        bannerTitle: 'Lễ Hội Đố Vui',
      },
      badgeIcon: '🍂',
    },
    schedule: {
      startsOn: '2026-10-01',
      endsOn: '2026-10-15',
    },
    location: {
      worldAnchor: { x: 45, y: 80 },
      anchorName: 'Bãi Cỏ Đố Vui',
    },
    quests: [
      {
        id: 'q1-do-vui',
        title: 'Đố Vui Đếm Số',
        npc: 'soc-nau',
        intro: 'Đố bé đếm đúng số hạt dẻ nhé!',
        minigame: 'demo',
        skill: 'lop-2/so-den-1000',
        questions: 3,
        difficultyBoost: 1,
        unlock: { type: 'always' },
        mapCoordinates: { x: 30, y: 60 },
      },
    ],
    rewards: {
      badgeId: 'huy-hieu-mua-thu',
      badgeName: 'Thám Tử Mùa Thu',
      badgeIcon: '🍂',
      badgeDescription: 'Bé đã hoàn thành lễ hội mùa thu!',
      bonusCoins: 50,
    },
  };

  it('định nghĩa sự kiện chuẩn vượt qua khâu kiểm tra (valid = true)', () => {
    const result = validateEvent(validSampleEvent);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('chặn sự kiện sử dụng kỹ năng lạ không có trong danh mục hệ thống (Hard Invariant #4)', () => {
    const invalidEvent: EventDefinition = {
      ...validSampleEvent,
      quests: [
        {
          ...validSampleEvent.quests[0]!,
          // @ts-expect-error: Cố tình truyền kỹ năng giả
          skill: 'lop-2/ky-nang-tu-che-khong-ton-tai',
        },
      ],
    };

    const result = validateEvent(invalidEvent);
    expect(result.valid).toBe(false);
    expect(result.errors.some((err) => err.includes('không nằm trong danh mục'))).toBe(true);
  });

  it('chặn sự kiện mượn kỹ năng của khối lớp khác (ví dụ Lớp 2 dùng kỹ năng Lớp 3)', () => {
    const crossGradeEvent: EventDefinition = {
      ...validSampleEvent,
      quests: [
        {
          ...validSampleEvent.quests[0]!,
          // @ts-expect-error: Cố tình truyền kỹ năng lớp khác
          skill: 'lop-3/phan-so-co-ban',
        },
      ],
    };

    const result = validateEvent(crossGradeEvent);
    expect(result.valid).toBe(false);
    expect(result.errors.some((err) => err.includes('không thuộc thế giới'))).toBe(true);
  });

  it('chặn sự kiện có lịch trình sai (startsOn > endsOn)', () => {
    const badScheduleEvent: EventDefinition = {
      ...validSampleEvent,
      schedule: {
        startsOn: '2026-10-20',
        endsOn: '2026-10-10',
      },
    };

    const result = validateEvent(badScheduleEvent);
    expect(result.valid).toBe(false);
    expect(result.errors.some((err) => err.includes('không được lớn hơn'))).toBe(true);
  });

  it('chặn sự kiện có boss questId không tồn tại trong danh sách quests', () => {
    const badBossEvent: EventDefinition = {
      ...validSampleEvent,
      finalBoss: {
        name: 'Trùm Bí Ẩn',
        title: 'Chúa tể',
        avatar: '👾',
        intro: 'Haha!',
        victoryMessage: 'Tuyệt!',
        questId: 'quest-ma-khong-co-that',
      },
    };

    const result = validateEvent(badBossEvent);
    expect(result.valid).toBe(false);
    expect(result.errors.some((err) => err.includes('finalBoss questId'))).toBe(true);
  });

  it('registerEvent ném lỗi khi đăng ký sự kiện không hợp lệ', () => {
    const badEvent: EventDefinition = {
      ...validSampleEvent,
      metadata: { ...validSampleEvent.metadata, id: '' },
    };

    expect(() => registerEvent(badEvent)).toThrow(/Lỗi đăng ký sự kiện/);
  });
});

describe('event-registry: Tra cứu và lọc sự kiện theo thế giới và ngày', () => {
  beforeEach(() => {
    eventRegistry.resetDefaultsForTesting();
  });

  it('mặc định nạp sẵn sự kiện Quần Đảo TIMO cho Lớp 2', () => {
    const timo = getEvent('lop-2', 'timo');
    expect(timo).toBeDefined();
    expect(timo?.metadata.name).toBe('Quần Đảo TIMO');
    expect(timo?.quests.length).toBeGreaterThanOrEqual(3);
  });

  it('getActiveEventsForWorld trả về sự kiện đang trong khoảng thời gian diễn ra', () => {
    // TIMO diễn ra từ 2026-09-28 đến 2026-12-31
    const activeList = getActiveEventsForWorld('lop-2', '2026-10-15');
    expect(activeList.some((e) => e.metadata.id === 'timo')).toBe(true);

    // Ngày 2027-01-05 sự kiện đã kết thúc
    const expiredList = getActiveEventsForWorld('lop-2', '2027-01-05');
    expect(expiredList.some((e) => e.metadata.id === 'timo')).toBe(false);
  });

  it('thêm sự kiện mới vào hệ thống không làm biến đổi Base World (Tính biệt lập)', () => {
    // Chụp lại trạng thái Base World trước khi thêm sự kiện
    const baseWorldBefore = JSON.stringify(WORLD_LOP_2);

    const testEvent: EventDefinition = {
      metadata: {
        id: 'su-kien-thu-nghiem',
        grade: 'lop-2',
        name: 'Thử Nghiệm Cách Ly',
        subtitle: 'Sự kiện kiểm tra tính độc lập',
        description: 'Kiểm tra',
        guideNpc: 'chim-sau',
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#1d4ed8',
          accentColor: '#f59e0b',
          bgColor: '#eff6ff',
          cardBg: '#ffffff',
          borderColor: '#bfdbfe',
          icon: '🧪',
          bannerTitle: 'Thử Nghiệm',
        },
        badgeIcon: '🧪',
      },
      schedule: {
        startsOn: '2026-09-28',
        endsOn: '2026-10-10',
      },
      location: {
        worldAnchor: { x: 50, y: 50 },
        anchorName: 'Phòng Thí Nghiệm',
      },
      quests: [
        {
          id: 'q-test-1',
          title: 'Thử Thách Phép Đếm',
          npc: 'chim-sau',
          intro: 'Đếm số!',
          minigame: 'demo',
          skill: 'lop-2/so-den-1000',
          questions: 3,
          difficultyBoost: 1,
          unlock: { type: 'always' },
          mapCoordinates: { x: 50, y: 50 },
        },
      ],
      rewards: {
        badgeId: 'huy-hieu-test',
        badgeName: 'Huy hiệu Test',
        badgeIcon: '🧪',
        badgeDescription: 'Đã test thành công',
        bonusCoins: 10,
      },
    };

    registerEvent(testEvent);

    // Sự kiện xuất hiện trong danh sách sự kiện lớp 2
    const eventsLop2 = getEventsForWorld('lop-2');
    expect(eventsLop2.some((e) => e.metadata.id === 'su-kien-thu-nghiem')).toBe(true);

    // Base World Lớp 2 hoàn toàn không bị ảnh hưởng, không bị đột biến
    const baseWorldAfter = JSON.stringify(WORLD_LOP_2);
    expect(baseWorldAfter).toBe(baseWorldBefore);
  });
});
