/** Bé/bố mẹ bật "Giảm chuyển động" trong máy thì bỏ các hoạt hình dài. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
