/**
 * Kỹ năng là đơn vị tiến trình của nhân vật. Mỗi năm học là một thế giới (Thế giới Lớp 2, Lớp 3…);
 * mỗi kỹ năng thuộc đúng một thế giới và một môn (một vùng của thế giới đó), mã có tiền tố lớp
 * (`lop-2/chan-le`) để tiến trình từng năm tách bạch. Nhân vật (tên, Level, xu, đồ, huy hiệu) thì đi
 * theo bé qua mọi thế giới.
 * Sự kiện (TIMO, Violympic…) không có kỹ năng riêng — chúng dùng lại kỹ năng của thế giới chứa nó
 * ở bậc khó cao hơn.
 */
import type { RandomSource } from './random';
import { MATH_SKILLS as GRADE_2_MATH } from './lop-2/math-skills';

/** Mỗi năm học một thế giới; thêm lớp mới = thêm một mục ở đây + thư mục kỹ năng của lớp đó. */
export const GRADES = {
  'lop-2': { name: 'Thế giới Lớp 2', schoolYear: '2026–2027', opensOn: '2026-09-05' },
} as const;
export type GradeId = keyof typeof GRADES;

/** Mỗi môn là một vùng trên bản đồ của một thế giới. */
export const SUBJECTS = {
  toan: 'Toán',
  'tieng-viet': 'Tiếng Việt',
  'tieng-anh': 'Tiếng Anh',
} as const;
export type SubjectId = keyof typeof SUBJECTS;

export type SkillStrand = 'chuong-trinh' | 'tu-duy';

interface SkillInfo {
  grade: GradeId;
  subject: SubjectId;
  strand: SkillStrand;
  title: string;
}

type Catalog = Record<string, { strand: SkillStrand; title: string }>;

type PrefixedCatalog<G extends GradeId, T extends Catalog> = {
  [K in keyof T & string as `${G}/${K}`]: SkillInfo;
};

/** Gắn lớp + môn vào danh mục kỹ năng của một môn và thêm tiền tố lớp vào mã. */
function catalogOf<G extends GradeId, T extends Catalog>(
  grade: G,
  subject: SubjectId,
  skills: T,
): PrefixedCatalog<G, T> {
  const entries = Object.entries(skills).map(([id, info]) => [
    `${grade}/${id}`,
    { grade, subject, ...info },
  ]);
  // Object.fromEntries mất thông tin khoá; kiểu khoá có tiền tố được dựng lại từ danh mục gốc.
  return Object.fromEntries(entries) as unknown as PrefixedCatalog<G, T>;
}

export const SKILLS = {
  ...catalogOf('lop-2', 'toan', GRADE_2_MATH),
};

export type SkillId = keyof typeof SKILLS;
export const SKILL_IDS = Object.keys(SKILLS) as SkillId[];

export function skillsOf(grade: GradeId, subject?: SubjectId): SkillId[] {
  return SKILL_IDS.filter(
    (id) => SKILLS[id].grade === grade && (subject === undefined || SKILLS[id].subject === subject),
  );
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export const MIN_DIFFICULTY: DifficultyLevel = 1;
export const MAX_DIFFICULTY: DifficultyLevel = 5;

/** Một câu đố: dữ liệu thuần do bộ sinh câu tạo ra; mini-game dùng `data` để vẽ và `answer` để chấm. */
export interface Challenge<TData = unknown, TAnswer = unknown> {
  skill: SkillId;
  level: DifficultyLevel;
  /** Câu đọc to cho bé (tiếng Việt, ngắn). */
  prompt: string;
  /** Dòng tiếng Anh nhỏ khi hoạt động cần song ngữ (vd. sự kiện mô phỏng đề thi quốc tế). */
  promptEn?: string;
  data: TData;
  answer: TAnswer;
}

/** Bậc 1: hình nhắc nhẹ · bậc 2: hoạt hình từng bước · bậc 3: lộ đáp án rồi làm câu song sinh. */
export type HintStepNumber = 1 | 2 | 3;
export interface HintStep {
  step: HintStepNumber;
  /** Câu mèo con đọc to khi gợi ý. */
  speech: string;
}

export interface SkillDefinition<C extends Challenge = Challenge> {
  id: SkillId;
  /**
   * Sinh một câu ở bậc khó cho trước. Câu "song sinh" sau khi lộ đáp án = gọi lại hàm này
   * cùng bậc để được câu cùng dạng nhưng đổi số.
   */
  generate(level: DifficultyLevel, random: RandomSource): C;
  isCorrect(challenge: C, answer: unknown): boolean;
  hints(challenge: C): readonly [HintStep, HintStep, HintStep];
}
