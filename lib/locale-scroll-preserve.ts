/**
 * Preserve the user's visual place on Category when switching UK ↔ EN.
 * Absolute scrollY breaks after text reflow; pin to a product/section id
 * + its viewport offset instead.
 *
 * A short visual hold (opacity + overflow) hides the intermediate wrong
 * scroll so restore does not flash as a jump.
 */

const ANCHOR_KEY = "obriy:locale-scroll-anchor";
const HOLD_ATTR = "data-locale-scroll-hold";

export type LocaleScrollAnchor = {
  id: string;
  /** Element's getBoundingClientRect().top at capture time. */
  offset: number;
};

let memoryAnchor: LocaleScrollAnchor | null = null;
/** Ignore capture overwrites briefly (pointerdown + click, or mid-nav). */
let captureLockUntil = 0;

function readSession(): LocaleScrollAnchor | null {
  try {
    const raw = sessionStorage.getItem(ANCHOR_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocaleScrollAnchor;
    if (!parsed?.id || typeof parsed.offset !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** True while a locale switch captured an anchor (skip cold hash jump). */
export function hasPendingLocaleScrollRestore(): boolean {
  return memoryAnchor !== null || readSession() !== null;
}

export function beginLocaleScrollHold(): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(HOLD_ATTR, "");
}

export function endLocaleScrollHold(): void {
  if (typeof document === "undefined") return;
  document.documentElement.removeAttribute(HOLD_ATTR);
}

/**
 * Remember the product/section nearest a mid-viewport probe line so restore
 * can put the same node back at the same screen position.
 */
export function captureLocaleScrollAnchor(): void {
  if (typeof window === "undefined") return;
  if (performance.now() < captureLockUntil && memoryAnchor) return;

  const products = document.querySelectorAll<HTMLElement>(".product-card[id]");
  const sections = document.querySelectorAll<HTMLElement>(
    ".category-section[id]",
  );
  // Prefer products — section headings sit higher and steal the probe.
  const candidates = [...products, ...sections];
  if (candidates.length === 0) return;

  const probe = Math.min(window.innerHeight * 0.35, stickyCoverHint() + 48);
  let best: HTMLElement | null = null;
  let bestDist = Infinity;

  for (const el of candidates) {
    if (!el.id) continue;
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 40 || rect.top > window.innerHeight - 40) continue;
    const dist = Math.abs(rect.top - probe);
    if (dist < bestDist) {
      bestDist = dist;
      best = el;
    }
  }

  if (!best) return;

  const anchor: LocaleScrollAnchor = {
    id: best.id,
    offset: best.getBoundingClientRect().top,
  };
  memoryAnchor = anchor;
  captureLockUntil = performance.now() + 2500;
  beginLocaleScrollHold();
  try {
    sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(anchor));
  } catch {
    /* private mode / quota — memory still holds */
  }
}

export function peekLocaleScrollAnchor(): LocaleScrollAnchor | null {
  return memoryAnchor ?? readSession();
}

export function clearLocaleScrollAnchor(): void {
  memoryAnchor = null;
  captureLockUntil = 0;
  try {
    sessionStorage.removeItem(ANCHOR_KEY);
  } catch {
    /* ignore */
  }
}

/** Place `id` so its top matches the captured viewport offset. */
export function restoreLocaleScrollAnchor(anchor: LocaleScrollAnchor): boolean {
  const el = document.getElementById(anchor.id);
  if (!el) return false;
  const nextTop =
    el.getBoundingClientRect().top + window.scrollY - anchor.offset;
  const top = Math.max(0, nextTop);
  if (Math.abs(top - window.scrollY) > 0.5) {
    window.scrollTo({ top, behavior: "auto" });
  }
  return true;
}

function stickyCoverHint(): number {
  const nav = document.querySelector(".category-sticky-nav");
  if (!nav) return 72;
  return Math.round(nav.getBoundingClientRect().bottom);
}
