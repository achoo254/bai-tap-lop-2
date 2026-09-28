/**
 * Sổ đăng ký bộ sinh câu. Mỗi vùng/sự kiện đăng ký các kỹ năng của mình khi module của nó được nạp,
 * nên trang chỉ tải mã của nơi bé đang chơi.
 */
import type { Challenge, SkillDefinition, SkillId } from './skill-types';

const registry = new Map<SkillId, SkillDefinition>();

export function registerSkill<C extends Challenge>(definition: SkillDefinition<C>): void {
  if (registry.has(definition.id)) throw new Error(`Kỹ năng ${definition.id} đã được đăng ký`);
  // Kiểu tổng quát hoá: registry chỉ trả SkillDefinition<Challenge>, mini-game tự biết kiểu cụ thể.
  registry.set(definition.id, definition as unknown as SkillDefinition);
}

export function getSkill(id: SkillId): SkillDefinition {
  const definition = registry.get(id);
  if (!definition) throw new Error(`Chưa nạp bộ sinh câu cho kỹ năng ${id}`);
  return definition;
}

export function isSkillRegistered(id: SkillId): boolean {
  return registry.has(id);
}

/** Chỉ dùng trong test: xoá sổ đăng ký giữa các ca. */
export function clearSkillRegistryForTest(): void {
  registry.clear();
}
