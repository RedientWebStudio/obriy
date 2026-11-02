"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { MQ_DESKTOP_MIN } from "@/lib/breakpoints";

type Props = {
  label: string;
};

/**
 * Shrink the observer root from the bottom by CTA inset + height (+ buffer).
 * Footer is treated as intersecting the CTA band once it enters that zone.
 */
/* Mobile/Tablet band: bottom inset (~20–32) + compact control (~40) + buffer */
const FOOTER_ROOT_MARGIN = "0px 0px -80px 0px";

export function FloatingContactCta({ label }: Props) {
  const [obscuredByFooter, setObscuredByFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") {
      return;
    }

    const desktopMq = window.matchMedia(MQ_DESKTOP_MIN);
    let observer: IntersectionObserver | null = null;

    const disconnect = () => {
      observer?.disconnect();
      observer = null;
    };

    const sync = () => {
      disconnect();
      // Footer-hide on Mobile + Tablet; Desktop keeps the vertical tab always on.
      if (desktopMq.matches) {
        setObscuredByFooter(false);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          setObscuredByFooter(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: FOOTER_ROOT_MARGIN,
          threshold: 0,
        },
      );
      observer.observe(footer);
    };

    sync();
    desktopMq.addEventListener("change", sync);

    return () => {
      desktopMq.removeEventListener("change", sync);
      disconnect();
    };
  }, []);

  return (
    <Link
      href="/contacts"
      className={
        obscuredByFooter
          ? "category-floating-cta is-obscured-by-footer"
          : "category-floating-cta"
      }
      aria-hidden={obscuredByFooter || undefined}
      tabIndex={obscuredByFooter ? -1 : undefined}
    >
      <span className="category-floating-cta-label">{label}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/cta-arrow.svg"
        alt=""
        width={11}
        height={8}
        className="category-floating-cta-arrow"
      />
    </Link>
  );
}
