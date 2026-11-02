/** One readable chapter per scroll interval; ordinary document scrolling owns the journey. */
export function industryAtScroll(offset: number, step: number, count: number) {
  if (count <= 1 || !Number.isFinite(offset) || !Number.isFinite(step) || step <= 0) return 0;
  return Math.max(0, Math.min(count - 1, Math.floor(offset / step)));
}

export function industryChapterOffset(index: number, step: number, count: number) {
  if (!Number.isFinite(step) || step <= 0 || count <= 1) return 0;
  // Land safely inside a chapter, rather than on a fractional-pixel boundary.
  return (Math.max(0, Math.min(count - 1, index)) + .15) * step;
}
