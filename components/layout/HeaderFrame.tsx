"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { onChromeMenuChange } from "@/lib/chrome-menu-bus";
import { onChromeScrollLock } from "@/lib/chrome-scroll-lock";

type Props = {
  children: ReactNode;
};

const SCROLL_THRESHOLD = 10;

/**
 * Global hide-on-scroll for every page and width:
 * down → hide, up → show, top → always visible.
 * Pauses while Burger / Category dropdown is open, or during program scroll.
 * On Category, Header + Sticky share one transform (CSS).
 */
export function HeaderFrame({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const hiddenRef = useRef(false);
  const menuOpenRef = useRef(false);
  const openMenusRef = useRef(new Set<string>());
  const scrollLockedRef = useRef(false);

  useEffect(() => {
    hiddenRef.current = hidden;
  }, [hidden]);

  useEffect(() => {
    const snapChrome = (nextHidden: boolean) => {
      const root = document.documentElement;
      const header = document.querySelector(".site-header");
      root.dataset.chromeSnap = "1";
      // Apply class immediately so Sticky cover math can measure before React paint.
      if (header) {
        header.classList.toggle("is-header-hidden", nextHidden);
      }
      hiddenRef.current = nextHidden;
      setHidden(nextHidden);
      void document.body.offsetHeight;
      window.requestAnimationFrame(() => {
        delete root.dataset.chromeSnap;
      });
    };

    const unlockScroll = () => {
      scrollLockedRef.current = false;
      lastYRef.current = window.scrollY;
    };

    const stopMenu = onChromeMenuChange((detail) => {
      if (detail.open) {
        openMenusRef.current.add(detail.source);
      } else {
        openMenusRef.current.delete(detail.source);
      }
      const anyOpen = openMenusRef.current.size > 0;
      menuOpenRef.current = anyOpen;
      if (!anyOpen) {
        lastYRef.current = window.scrollY;
      }
    });

    const stopLock = onChromeScrollLock((detail) => {
      if (detail.locked) {
        scrollLockedRef.current = true;
        if (typeof detail.headerVisible === "boolean") {
          const nextHidden = !detail.headerVisible;
          if (hiddenRef.current !== nextHidden) {
            snapChrome(nextHidden);
          }
        }
        lastYRef.current = window.scrollY;
        return;
      }
      unlockScroll();
    });

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 0);

      if (menuOpenRef.current || scrollLockedRef.current) {
        // Keep baseline current so unlock does not see a huge delta.
        lastYRef.current = y;
        return;
      }

      const delta = y - lastYRef.current;

      if (y <= SCROLL_THRESHOLD) {
        setHidden(false);
      } else if (delta > SCROLL_THRESHOLD) {
        setHidden(true);
      } else if (delta < -SCROLL_THRESHOLD) {
        setHidden(false);
      }

      lastYRef.current = y;
    };

    lastYRef.current = window.scrollY;
    update();

    window.addEventListener("scroll", update, { passive: true });
    return () => {
      stopMenu();
      stopLock();
      window.removeEventListener("scroll", update);
    };
  }, []);

  const className = [
    "site-header",
    scrolled ? "is-scrolled" : "",
    hidden ? "is-header-hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={className}>
      <Container>
        <div className="header-bar">{children}</div>
      </Container>
    </header>
  );
}
