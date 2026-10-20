/**
 * Locks Header hide/show while a chrome overlay is open or a programmatic
 * anchor scroll is in flight — prevents mid-flight chrome jumps.
 */

export const CHROME_SCROLL_LOCK_EVENT = "obriy:chrome-scroll-lock";

export type ChromeScrollLockDetail = {
  locked: boolean;
  /** When locking for program scroll, force Header visibility before motion. */
  headerVisible?: boolean;
};

export function setChromeScrollLock(detail: ChromeScrollLockDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ChromeScrollLockDetail>(CHROME_SCROLL_LOCK_EVENT, {
      detail,
    }),
  );
}

export function onChromeScrollLock(
  handler: (detail: ChromeScrollLockDetail) => void,
): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<ChromeScrollLockDetail>).detail;
    if (detail) handler(detail);
  };

  window.addEventListener(CHROME_SCROLL_LOCK_EVENT, listener);
  return () => window.removeEventListener(CHROME_SCROLL_LOCK_EVENT, listener);
}
