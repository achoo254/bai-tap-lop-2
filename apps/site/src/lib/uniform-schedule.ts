/**
 * apps/site/src/lib/uniform-schedule.ts
 *
 * Lịch mặc đồng phục đi học của Miu:
 * - Thứ 2, 4, 6: Mặc đồng phục bộ sơ mi trắng 👔
 * - Thứ 3: Mặc bộ phông xanh 👕
 * - Thứ 5: Mặc bộ thể thao 🏃‍♀️
 * - Thứ 7 & Chủ Nhật: Trang phục tự do 👗 / 🌈
 */

export interface UniformDay {
  dayOfWeek: number; // 0 = CN, 1 = T2, 2 = T3, 3 = T4, 4 = T5, 5 = T6, 6 = T7
  dayName: string; // 'Thứ Hai', 'Thứ Ba', ...
  shortName: string; // 'T2', 'T3', ...
  title: string; // 'Bộ sơ mi trắng', 'Bộ phông xanh', 'Bộ thể thao', 'Trang phục tự do'
  description: string;
  badge: string;
  icon: string;
  color: string;
  bgLight: string;
  borderColor: string;
}

export const UNIFORM_SCHEDULE: Record<number, UniformDay> = {
  1: {
    dayOfWeek: 1,
    dayName: 'Thứ Hai',
    shortName: 'T2',
    title: 'Bộ sơ mi trắng',
    description: 'Áo sơ mi trắng có cổ tinh tươm, quần hoặc váy đồng phục trường.',
    badge: 'Đầu tuần trang nghiêm',
    icon: '👔',
    color: '#0369a1',
    bgLight: '#e0f2fe',
    borderColor: '#38bdf8',
  },
  2: {
    dayOfWeek: 2,
    dayName: 'Thứ Ba',
    shortName: 'T3',
    title: 'Bộ phông xanh',
    description: 'Áo phông đồng phục màu xanh mát mẻ, thoải mái vận động và vui chơi.',
    badge: 'Năng động sáng tạo',
    icon: '👕',
    color: '#047857',
    bgLight: '#d1fae5',
    borderColor: '#34d399',
  },
  3: {
    dayOfWeek: 3,
    dayName: 'Thứ Tư',
    shortName: 'T4',
    title: 'Bộ sơ mi trắng',
    description: 'Áo sơ mi trắng có cổ tinh tươm, giữ gìn sạch đẹp suốt ngày học.',
    badge: 'Chăm ngoan học tập',
    icon: '👔',
    color: '#0369a1',
    bgLight: '#e0f2fe',
    borderColor: '#38bdf8',
  },
  4: {
    dayOfWeek: 4,
    dayName: 'Thứ Năm',
    shortName: 'T5',
    title: 'Bộ thể thao',
    description: 'Bộ đồng phục thể thao co giãn, năng động cho các tiết thể dục và rèn luyện.',
    badge: 'Khỏe khoắn thể thao',
    icon: '🏃‍♀️',
    color: '#b45309',
    bgLight: '#fef3c7',
    borderColor: '#fbbf24',
  },
  5: {
    dayOfWeek: 5,
    dayName: 'Thứ Sáu',
    shortName: 'T6',
    title: 'Bộ sơ mi trắng',
    description: 'Áo sơ mi trắng có cổ tinh tươm, tổng kết một tuần học tập thật nhiều sao giỏi.',
    badge: 'Tươi vui cuối tuần',
    icon: '👔',
    color: '#0369a1',
    bgLight: '#e0f2fe',
    borderColor: '#38bdf8',
  },
  6: {
    dayOfWeek: 6,
    dayName: 'Thứ Bảy',
    shortName: 'T7',
    title: 'Trang phục tự do',
    description: 'Miu tự chọn bộ váy áo đáng yêu yêu thích nhất để đi chơi hoặc dã ngoại.',
    badge: 'Thư giãn cuối tuần',
    icon: '👗',
    color: '#be185d',
    bgLight: '#fce7f3',
    borderColor: '#f472b6',
  },
  0: {
    dayOfWeek: 0,
    dayName: 'Chủ Nhật',
    shortName: 'CN',
    title: 'Trang phục tự do',
    description: 'Trang phục thoải mái ở nhà hoặc dạo phố cùng bố Đạt, mẹ và em Bo.',
    badge: 'Gia đình yêu thương',
    icon: '🌈',
    color: '#6d28d9',
    bgLight: '#ede9fe',
    borderColor: '#a78bfa',
  },
};

/** Tuần học theo thứ tự từ Thứ 2 đến Chủ Nhật */
export const WEEK_DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function getUniformForDay(dayOfWeek: number): UniformDay {
  return UNIFORM_SCHEDULE[dayOfWeek] ?? UNIFORM_SCHEDULE[1];
}

/** Lấy thông tin đồng phục theo ngày ISO (YYYY-MM-DD) */
export function getUniformForDate(isoDate: string): UniformDay {
  const [year, month, day] = isoDate.split('-').map(Number);
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return getUniformForDay(dayOfWeek);
}

/** Lời nhắc mặc đồng phục ngọt ngào từ mèo con */
export function uniformReminderFor(
  hour: number,
  dayOfWeek: number,
): { text: string; icon: string; targetDay: string; outfit: string } {
  const todayUniform = getUniformForDay(dayOfWeek);
  const tomorrowDayOfWeek = (dayOfWeek + 1) % 7;
  const tomorrowUniform = getUniformForDay(tomorrowDayOfWeek);

  if (hour < 11) {
    // Buổi sáng: Nhắc mặc bộ hôm nay
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return {
        text: `Hôm nay ${todayUniform.dayName}, Miu nhớ mặc ${todayUniform.title} ${todayUniform.icon} thật tinh tươm đi học nhé!`,
        icon: todayUniform.icon,
        targetDay: todayUniform.dayName,
        outfit: todayUniform.title,
      };
    }
    return {
      text: `Hôm nay là ${todayUniform.dayName}, Miu diện ${todayUniform.title} ${todayUniform.icon} thoải mái và vui vẻ cùng cả nhà nhé!`,
      icon: todayUniform.icon,
      targetDay: todayUniform.dayName,
      outfit: todayUniform.title,
    };
  }

  if (hour >= 18) {
    // Buổi tối: Nhắc soạn đồ cho ngày mai
    if (tomorrowDayOfWeek >= 1 && tomorrowDayOfWeek <= 5) {
      return {
        text: `Tối nay Miu nhớ soạn sẵn ${tomorrowUniform.title} ${tomorrowUniform.icon} cho ngày mai ${tomorrowUniform.dayName} nhé!`,
        icon: tomorrowUniform.icon,
        targetDay: tomorrowUniform.dayName,
        outfit: tomorrowUniform.title,
      };
    }
    return {
      text: `Ngày mai là ${tomorrowUniform.dayName} cuối tuần rồi, Miu chọn sẵn ${tomorrowUniform.title} ${tomorrowUniform.icon} yêu thích nhé!`,
      icon: tomorrowUniform.icon,
      targetDay: tomorrowUniform.dayName,
      outfit: tomorrowUniform.title,
    };
  }

  // Buổi trưa / chiều
  return {
    text: `Hôm nay ${todayUniform.dayName}, Miu mặc ${todayUniform.title} ${todayUniform.icon} rất ngoan! Chiều về nhớ cất gọn gàng nhé!`,
    icon: todayUniform.icon,
    targetDay: todayUniform.dayName,
    outfit: todayUniform.title,
  };
}
