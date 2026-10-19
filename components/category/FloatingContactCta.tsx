"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  matchesTabletBand,
  MQ_DESKTOP_MIN,
  MQ_TABLET_MIN,
} from "@/lib/breakpoints";
import en from "@/messages/en.json";
import uk from "@/messages/uk.json";

type Props = {
  label: string;
};

/** Both locales — outer size follows the longest label, not the active one. */
const CTA_SIZING_LABELS = [
  en.CategoryPage.floatingCta,
  uk.CategoryPage.floatingCta,
] as const;

/**
 * Shrink the observer root from the bottom by CTA inset + height (+ buffer).
 * Footer is treated as intersecting the CTA band once it enters that zone.
 */
/* bottom inset (~32) + control height (~40) + small buffer */
const FOOTER_ROOT_MARGIN = "0px 0px -88px 0px";

export function FloatingContactCta({ label }: Props) {
  const [obscuredByFooter, setObscuredByFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") {
      return;
    }

    const tabletMq = window.matchMedia(MQ_TABLET_MIN);
    const desktopMq = window.matchMedia(MQ_DESKTOP_MIN);
    let observer: IntersectionObserver | null = null;

    const disconnect = () => {
      observer?.disconnect();
      observer = null;
    };

    const sync = () => {
      disconnect();
      // Footer-hide is Tablet-only — never attach on Mobile/Desktop.
      if (!matchesTabletBand(tabletMq, desktopMq)) {
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
    tabletMq.addEventListener("change", sync);
    desktopMq.addEventListener("change", sync);

    return () => {
      tabletMq.removeEventListener("change", sync);
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
      <span className="category-floating-cta-label-slot">
        <span className="category-floating-cta-sizer" aria-hidden="true">
          {CTA_SIZING_LABELS.map((entry) => (
            <span key={entry} className="category-floating-cta-label">
              {entry}
            </span>
          ))}
        </span>
        <span className="category-floating-cta-label">{label}</span>
      </span>
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
