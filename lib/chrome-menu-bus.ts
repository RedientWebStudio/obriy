/**
 * Lightweight bus so Header burger and Category sticky dropdown
 * never stay open at the same time.
 */
export type ChromeMenuSource = "header-burger" | "category-nav";

export const CHROME_MENU_EVENT = "obriy:chrome-menu";

export type ChromeMenuDetail = { source: ChromeMenuSource; open: boolean };

export function announceChromeMenu(source: ChromeMenuSource, open: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ChromeMenuDetail>(CHROME_MENU_EVENT, {
      detail: { source, open },
    }),
  );
}

/** Close self when another chrome menu opens. */
export function onForeignChromeMenuOpen(
  self: ChromeMenuSource,
  onForeignOpen: () => void,
): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<ChromeMenuDetail>).detail;
    if (!detail?.open || detail.source === self) return;
    onForeignOpen();
  };

  window.addEventListener(CHROME_MENU_EVENT, listener);
  return () => window.removeEventListener(CHROME_MENU_EVENT, listener);
}

export function onChromeMenuChange(
  handler: (detail: ChromeMenuDetail) => void,
): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<ChromeMenuDetail>).detail;
    if (detail) handler(detail);
  };

  window.addEventListener(CHROME_MENU_EVENT, listener);
  return () => window.removeEventListener(CHROME_MENU_EVENT, listener);
}
