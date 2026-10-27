"use client";

import { useLayoutEffect } from "react";
import { setChromeScrollLock } from "@/lib/chrome-scroll-lock";
import {
  clearLocaleScrollAnchor,
  endLocaleScrollHold,
  peekLocaleScrollAnchor,
  restoreLocaleScrollAnchor,
} from "@/lib/locale-scroll-preserve";

/**
 * Re-pin the captured product before paint (useLayoutEffect) while the page
 * is held invisible — avoids the visible snap that useEffect-after-paint caused.
 */
export function CategoryLocaleScrollPreserve({ locale }: { locale: string }) {
  useLayoutEffect(() => {
    const anchor = peekLocaleScrollAnchor();
    if (!anchor) {
      endLocaleScrollHold();
      return;
    }

    let cancelled = false;
    let raf = 0;
    const startedAt = performance.now();

    setChromeScrollLock({ locked: true, headerVisible: true });

    const finish = () => {
      clearLocaleScrollAnchor();
      endLocaleScrollHold();
      if (!cancelled) setChromeScrollLock({ locked: false });
    };

    const tick = () => {
      if (cancelled) return;

      const el = document.getElementById(anchor.id);
      if (el) {
        restoreLocaleScrollAnchor(anchor);
        const err = Math.abs(el.getBoundingClientRect().top - anchor.offset);
        if (err <= 2) {
          // One more pin after layout, then reveal.
          raf = window.requestAnimationFrame(() => {
            if (cancelled) return;
            restoreLocaleScrollAnchor(anchor);
            finish();
          });
          return;
        }
      }

      if (performance.now() - startedAt > 1500) {
        finish();
        return;
      }

      raf = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelled = true;
      if (raf) window.cancelAnimationFrame(raf);
      setChromeScrollLock({ locked: false });
      // Keep hold if a remount will continue restore; otherwise drop it.
      if (!peekLocaleScrollAnchor()) endLocaleScrollHold();
    };
  }, [locale]);

  return null;
}
