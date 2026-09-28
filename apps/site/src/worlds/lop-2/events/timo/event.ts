/**
 * apps/site/src/worlds/lop-2/events/timo/event.ts
 *
 * Cấu hình Sự kiện TIMO Khối 2 — "Quần Đảo TIMO" (Olympic Toán Quốc Tế).
 * Là một module sự kiện cắm vào Thế giới Lớp 2 (grade: 'lop-2').
 *
 * QUY TẮC BẤT BIẾN:
 * - Chỉ sử dụng kỹ năng có sẵn trong Thế giới Lớp 2 ('lop-2/*').
 * - Thêm difficultyBoost (+1) vào nhiệm vụ để tạo thử thách Olympic.
 */
import type { EventDefinition } from '../../../../lib/game/events/event-types';

export const TIMO_EVENT_LOP_2: EventDefinition = {
  metadata: {
    id: 'timo',
    grade: 'lop-2',
    name: 'Quần Đảo TIMO',
    subtitle: 'Đấu Trường Toán Học Olympic Quốc Tế Khối 2',
    description:
      'Chào mừng bé Miu đến với Quần Đảo TIMO! Hãy vượt qua các hòn đảo câu đố số học để thu thập huy hiệu danh dự và vương miện sao vàng!',
    guideNpc: 'bac-cu',
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#d97706',
      accentColor: '#ef4444',
      bgColor: '#fffbeb',
      cardBg: '#ffffff',
      borderColor: '#fde68a',
      icon: '🎪',
      bannerTitle: 'Sự Kiện Đặc Biệt: Quần Đảo TIMO Khối 2',
    },
    badgeIcon: '🏅',
  },
  schedule: {
    startsOn: '2026-09-28',
    endsOn: '2026-12-31',
    timeZone: 'Asia/Ho_Chi_Minh',
  },
  location: {
    worldAnchor: { x: 80, y: 72 },
    anchorName: 'Quần Đảo TIMO',
    islandGraphic: '🏝️',
  },
  quests: [
    {
      id: 'q1-dem-sao',
      title: 'Đảo San Hô: Đếm Sao Biển Diệu Kỳ',
      npc: 'bac-cu',
      intro:
        'Bác Cú chào Miu! Tại Quần Đảo TIMO, các con số bay lượn như đàn cá nhỏ. Hãy cùng đếm xem có bao nhiêu ngôi sao biển nhé!',
      minigame: 'demo',
      skill: 'lop-2/so-den-1000',
      questions: 3,
      difficultyBoost: 1,
      unlock: { type: 'always' },
      mapCoordinates: { x: 22, y: 75 },
    },
    {
      id: 'q2-tinh-nhanh-chan-le',
      title: 'Vịnh Ngọc Trai: Thử Thách Chẵn Lẻ',
      npc: 'bac-cu',
      intro:
        'Tuyệt vời lắm Miu ơi! Thử thách tiếp theo đòi hỏi tư duy nhanh nhạy: phân loại các viên ngọc chẵn và lẻ vào đúng rương nào!',
      minigame: 'demo',
      skill: 'lop-2/chan-le',
      questions: 3,
      difficultyBoost: 1,
      unlock: { type: 'quest-completed', questId: 'q1-dem-sao' },
      mapCoordinates: { x: 50, y: 50 },
    },
    {
      id: 'q3-dai-chien-rong-so',
      title: 'Đỉnh Hải Đăng: Đại Chiến Rồng Số Biển Sâu',
      npc: 'bac-cu',
      intro:
        'Cảnh báo! Rồng Số Biển Sâu đã thức giấc với những câu đố hóc búa của vòng loại TIMO! Miu hãy dùng sức mạnh tư duy để vượt qua nào!',
      minigame: 'demo',
      skill: 'lop-2/chan-le',
      questions: 3,
      difficultyBoost: 1,
      isBoss: true,
      unlock: { type: 'quest-completed', questId: 'q2-tinh-nhanh-chan-le' },
      mapCoordinates: { x: 78, y: 25 },
    },
  ],
  rewards: {
    badgeId: 'huy-hieu-timo-dong',
    badgeName: 'Chiến Binh Quần Đảo TIMO',
    badgeIcon: '🏅',
    badgeDescription: 'Đã hoàn thành xuất sắc các thử thách tại Quần Đảo TIMO Lớp 2!',
    accessoryId: 'vuong-mien-sao',
    bonusCoins: 100,
  },
  finalBoss: {
    name: 'Rồng Số Biển Sâu',
    title: 'Chúa Tể Đáy Đại Dương TIMO',
    avatar: '🐉',
    intro:
      'Grừừừ! Ngươi có phải chú mèo Miu can đảm không? Hãy giải các câu đố của ta nếu muốn thắp sáng ngọn hải đăng!',
    victoryMessage: 'Miu thật phi thường! Ngươi đã giải được câu đố số học của biển sâu!',
    questId: 'q3-dai-chien-rong-so',
  },
};
