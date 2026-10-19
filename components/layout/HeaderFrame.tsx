"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { MQ_TABLET_MIN } from "@/lib/breakpoints";

type Props = {
  children: ReactNode;
};

const SCROLL_THRESHOLD = 10;

/**
 * Category hide-on-scroll. Header and Sticky Nav share one transform so the
 * joint never opens (Sticky `top` stays fixed at --header-height).
 */
export function HeaderFrame({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    hiddenRef.current = hidden;
  }, [hidden]);

  useEffect(() => {
    const mq = window.matchMedia(MQ_TABLET_MIN);

    const canHideCategoryChrome = () =>
      mq.matches && Boolean(document.querySelector(".category-sticky-nav"));

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 0);

      if (!canHideCategoryChrome()) {
        if (hiddenRef.current) setHidden(false);
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
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      mq.removeEventListener("change", update);
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
