/**
 * apps/site/src/worlds/lop-2/world.ts
 *
 * Cấu hình Thế giới Lớp 2 (Năm học 2026–2027) của Miu:
 * Gồm 3 vùng môn học (Toán, Tiếng Việt, Tiếng Anh) và điểm neo Sự kiện (TIMO).
 */
import type { World } from '../../lib/game/world/world-types';

export const WORLD_LOP_2: World = {
  grade: 'lop-2',
  name: 'Thế giới Lớp 2',
  schoolYear: '2026–2027',
  opensOn: '2026-09-05',
  description:
    'Vùng đất kỳ diệu nơi bé Miu bắt đầu hành trình chinh phục kiến thức Lớp 2 cùng Bác Cú và những người bạn đồng hành.',
  regions: [
    {
      id: 'toan',
      name: 'Vùng Toán',
      tagline: 'Thung Lũng Con Số & Vương Quốc Phép Tính',
      theme: {
        primaryColor: '#0284c7',
        secondaryColor: '#0369a1',
        accentColor: '#f59e0b',
        bgColor: '#f0f9ff',
        cardBg: '#ffffff',
        borderColor: '#bae6fd',
        icon: '📐',
        bannerTitle: 'Vùng Toán Học Kỳ Thú',
      },
      guideNpc: 'bac-cu',
      status: 'open',
      chapters: [
        {
          id: 'ch1-thung-lung-so',
          name: 'Chương 1: Thung Lũng Con Số',
          description: 'Làm quen với các con số kỳ diệu trong phạm vi 100 và quy luật chẵn lẻ.',
          order: 1,
          status: 'open',
          lessons: [
            {
              id: 'les1-so-va-chan-le',
              name: 'Bài 1: Cửa ngõ Số Học',
              skills: ['lop-2/so-den-1000', 'lop-2/chan-le'],
              quests: [
                {
                  id: 'lop-2/toan/ch1/q1-dem-so',
                  title: 'Thu Thập Kẹo Ngọt',
                  npc: 'bac-cu',
                  intro:
                    'Mến chào bé Miu! Bác Cú có những viên kẹo số học diệu kỳ. Cùng đếm xem có bao nhiêu viên nhé!',
                  minigame: 'demo',
                  skill: 'lop-2/so-den-1000',
                  questions: 3,
                  unlock: { type: 'always' },
                  mapCoordinates: { x: 20, y: 78 },
                },
                {
                  id: 'lop-2/toan/ch1/q2-chan-le',
                  title: 'Phân Loại Chẵn Lẻ',
                  npc: 'bac-cu',
                  intro:
                    'Rất xuất sắc! Giờ hãy giúp bác Cú xếp các số chẵn vào giỏ xanh và số lẻ vào giỏ cam nào.',
                  minigame: 'demo',
                  skill: 'lop-2/chan-le',
                  questions: 3,
                  unlock: { type: 'quest-completed', questId: 'lop-2/toan/ch1/q1-dem-so' },
                  mapCoordinates: { x: 48, y: 55 },
                },
                {
                  id: 'lop-2/toan/ch1/q3-thu-thach-bac-cu',
                  title: 'Thử Thách Bác Cú',
                  npc: 'bac-cu',
                  intro:
                    'Bác Cú Thông Thái có câu đố đặc biệt trước khi vượt qua cánh cổng thung lũng!',
                  minigame: 'demo',
                  skill: 'lop-2/chan-le',
                  questions: 3,
                  isBoss: true,
                  unlock: { type: 'quest-completed', questId: 'lop-2/toan/ch1/q2-chan-le' },
                  mapCoordinates: { x: 78, y: 32 },
                },
              ],
            },
          ],
        },
        {
          id: 'ch2-phep-cong-tru',
          name: 'Chương 2: Rừng Cây Phép Cộng & Phép Trừ',
          description: 'Chinh phục phép cộng và trừ có nhớ trong phạm vi 20 và 100.',
          order: 2,
          status: 'locked',
          lessons: [],
        },
      ],
    },
    {
      id: 'tieng-viet',
      name: 'Vùng Tiếng Việt',
      tagline: 'Khu Vườn Cổ Tích & Lâu Đài Từ Vựng',
      theme: {
        primaryColor: '#ec4899',
        secondaryColor: '#db2777',
        accentColor: '#f97316',
        bgColor: '#fdf2f8',
        cardBg: '#ffffff',
        borderColor: '#fbcfe8',
        icon: '📖',
        bannerTitle: 'Vùng Tiếng Việt Thơ Mộng',
      },
      guideNpc: 'soc-nau',
      status: 'open',
      chapters: [
        {
          id: 'ch1-vuon-doc-hieu',
          name: 'Chương 1: Khu Vườn Đọc Hiểu & Từ Vựng',
          description: 'Luyện đọc các câu chuyện ý nghĩa, trả lời câu hỏi và mở rộng vốn từ.',
          order: 1,
          status: 'open',
          lessons: [
            {
              id: 'les1-cau-thu-du-bi',
              name: 'Bài 8: Cầu thủ dự bị',
              skills: ['lop-2/doc-hieu'],
              quests: [
                {
                  id: 'lop-2/tieng-viet/ch1/q1-doc-hieu',
                  title: 'Đọc hiểu: Cầu thủ dự bị',
                  npc: 'soc-nau',
                  intro:
                    'Chào bé Miu! Hãy cùng Sóc Nâu đọc bài "Cầu thủ dự bị" và trả lời các câu hỏi trang 35 nhé!',
                  minigame: 'doc-hieu',
                  skill: 'lop-2/doc-hieu',
                  questions: 4,
                  unlock: { type: 'always' },
                  mapCoordinates: { x: 28, y: 70 },
                },
                {
                  id: 'lop-2/tieng-viet/ch1/q2-luyen-tap',
                  title: 'Luyện tập: Lời khen & Chúc mừng',
                  npc: 'soc-nau',
                  intro:
                    'Rất tuyệt vời! Giờ hãy cùng Sóc Nâu tìm câu khen trong bài và gửi lời chúc mừng gấu con nhé!',
                  minigame: 'doc-hieu',
                  skill: 'lop-2/doc-hieu',
                  questions: 2,
                  unlock: { type: 'quest-completed', questId: 'lop-2/tieng-viet/ch1/q1-doc-hieu' },
                  mapCoordinates: { x: 68, y: 38 },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'tieng-anh',
      name: 'Vùng Tiếng Anh',
      tagline: 'Hòn Đảo Phiêu Lưu ABC Adventure',
      theme: {
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        accentColor: '#8b5cf6',
        bgColor: '#ecfdf5',
        cardBg: '#ffffff',
        borderColor: '#a7f3d0',
        icon: '🇬🇧',
        bannerTitle: 'Vùng Tiếng Anh Khám Phá',
      },
      guideNpc: 'chim-sau',
      status: 'coming-soon',
      chapters: [],
    },
  ],
  eventAnchors: [
    {
      id: 'su-kien-timo',
      name: 'Quần Đảo TIMO',
      themeTag: 'Toán Olympic Quốc Tế',
      coordinates: { x: 80, y: 72 },
      status: 'active',
      opensOn: '2026-09-28',
    },
  ],
};
