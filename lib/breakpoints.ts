/**
 * Viewport breakpoints — must match CSS cascade in layout.css / tokens.css.
 *
 * Tablet:  ≥768px and <1024px
 * Desktop: ≥1024px
 *
 * Prefer `min-width` queries only. Do NOT use `max-width: 1023px` in JS:
 * it can disagree with CSS `min-width: 1024px` under classic scrollbars,
 * subpixel zoom, or Tailwind v4 `max-*` (breakpoint − 1px) semantics,
 * which makes 1023px look like a third breakpoint.
 */

export const MQ_TABLET_MIN = "(min-width: 768px)";
export const MQ_DESKTOP_MIN = "(min-width: 1024px)";

/** True for the Tablet band that CSS treats as pre-Desktop (≥768 and not ≥1024). */
export function matchesTabletBand(
  tabletMq: MediaQueryList = window.matchMedia(MQ_TABLET_MIN),
  desktopMq: MediaQueryList = window.matchMedia(MQ_DESKTOP_MIN),
): boolean {
  return tabletMq.matches && !desktopMq.matches;
}
