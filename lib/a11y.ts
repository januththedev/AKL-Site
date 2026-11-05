/*
 * Small, DOM-free keyboard helpers shared by the header menu, the Moments viewer and the chat
 * dialog. Keeping the decisions pure makes them testable without a browser.
 */

/** Wrap an index into 0..length-1 (length 0 yields 0). */
export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

/** Index to move to for a browsing key, or null when the key is not a browsing key. */
export function browseTarget(current: number, length: number, key: string): number | null {
  if (length <= 0) return null;
  if (key === 'ArrowRight' || key === 'ArrowDown') return wrapIndex(current + 1, length);
  if (key === 'ArrowLeft' || key === 'ArrowUp') return wrapIndex(current - 1, length);
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  return null;
}

/**
 * Focus-trap decision for a Tab keypress. `active` is the index of the focused item inside the
 * trap (-1 when focus is outside it). Returns the index to focus, or null to let the browser move
 * focus naturally.
 */
export function trapTabTarget(active: number, length: number, shift: boolean): number | null {
  if (length <= 0) return null;
  if (active < 0) return shift ? length - 1 : 0;
  if (shift && active === 0) return length - 1;
  if (!shift && active === length - 1) return 0;
  return null;
}

export const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Keydown handler body for a modal region: traps Tab inside `container` (plus optional extra items). */
export function handleTrapKey(e: KeyboardEvent, container: HTMLElement | null, extra: Array<HTMLElement | null> = []): void {
  if (e.key !== 'Tab' || !container) return;
  const items = [...extra, ...Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))].filter(
    (el): el is HTMLElement => !!el && el.tabIndex >= 0 && !el.closest('[hidden],[aria-hidden="true"]'),
  );
  const target = trapTabTarget(items.indexOf(document.activeElement as HTMLElement), items.length, e.shiftKey);
  if (target !== null) { e.preventDefault(); items[target]?.focus(); }
}
