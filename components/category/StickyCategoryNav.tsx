"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CategoryNavEntry } from "@/lib/category-types";
import {
  announceChromeMenu,
  onForeignChromeMenuOpen,
} from "@/lib/chrome-menu-bus";
import type { LocaleField } from "@/lib/locale";
import { pickLocale } from "@/lib/locale";

type Props = {
  locale: string;
  categoryTitle: LocaleField;
  nav: CategoryNavEntry[];
  labels: {
    navAria: string;
    openMenu: string;
    closeMenu: string;
  };
};

function firstSelectableId(nav: CategoryNavEntry[]): string {
  const item = nav.find(
    (entry) => entry.kind === "subcategory" || entry.kind === "sale",
  );
  return item?.id ?? "";
}

/** Visible chrome above content (header may be slid away on Category). */
function stickyCoverHeight(): number {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".category-sticky-nav");
  const headerHidden = header?.classList.contains("is-header-hidden");
  const headerH = headerHidden
    ? 0
    : (header?.getBoundingClientRect().height ?? 0);
  const navH = nav?.getBoundingClientRect().height ?? 0;
  return headerH + navH;
}

function scrollToTarget(target: HTMLElement) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const top =
    target.getBoundingClientRect().top + window.scrollY - stickyCoverHeight();

  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

export function StickyCategoryNav({
  locale,
  categoryTitle,
  nav,
  labels,
}: Props) {
  const selectable = useMemo(
    () =>
      nav.filter(
        (entry): entry is Extract<CategoryNavEntry, { kind: "subcategory" | "sale" }> =>
          entry.kind === "subcategory" || entry.kind === "sale",
      ),
    [nav],
  );

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(() => firstSelectableId(nav));
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const activeItem =
    selectable.find((item) => item.id === activeId) ?? selectable[0];

  useEffect(() => {
    return onForeignChromeMenuOpen("category-nav", () => setOpen(false));
  }, []);

  useEffect(() => {
    announceChromeMenu("category-nav", open);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const openScrollY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - openScrollY) < 10) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  useEffect(() => {
    const sectionIds = selectable
      .map((item) => item.sectionId)
      .filter((id): id is string => Boolean(id));

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const cover = Math.ceil(stickyCoverHeight());
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${cover}px 0px -55% 0px`,
        threshold: [0.1, 0.25, 0.5],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [selectable]);

  useEffect(() => {
    const resolveHashTarget = (rawHash: string): HTMLElement | null => {
      const hash = decodeURIComponent(rawHash.replace(/^#/, ""));
      if (!hash) return null;

      const match = selectable.find(
        (item) => item.id === hash || item.sectionId === hash,
      );
      return document.getElementById(match?.sectionId ?? hash);
    };

    const scrollHash = (rawHash = window.location.hash) => {
      const target = resolveHashTarget(rawHash);
      if (!target) return;
      scrollToTarget(target);
    };

    // Cold open with #product-… — wait two frames so sticky cover is laid out.
    let cancelled = false;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!cancelled) scrollHash();
      });
    });

    const onHashChange = () => {
      scrollHash();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [selectable]);

  const onSelect = (item: Extract<CategoryNavEntry, { kind: "subcategory" | "sale" }>) => {
    setActiveId(item.id);
    setOpen(false);

    if (!item.sectionId) return;
    const target = document.getElementById(item.sectionId);
    if (!target) return;
    scrollToTarget(target);
  };

  if (selectable.length === 0) return null;

  return (
    <div ref={rootRef} className="category-sticky-nav">
      <div className="category-sticky-nav-inner">
        <p className="category-sticky-category-label">
          {pickLocale(categoryTitle, locale)}
        </p>

        <div className="category-sticky-right">
          <button
            ref={toggleRef}
            type="button"
            className="category-sticky-trigger"
            aria-expanded={open}
            aria-controls={listId}
            aria-haspopup="listbox"
            aria-label={open ? labels.closeMenu : labels.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="category-sticky-subcategory">
              {activeItem ? pickLocale(activeItem.title, locale) : ""}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/chevron-down.svg"
              alt=""
              width={20}
              height={20}
              className={
                open
                  ? "category-sticky-chevron is-open"
                  : "category-sticky-chevron"
              }
            />
            <span className="category-sticky-accent" aria-hidden="true" />
          </button>

          {open ? (
            <ul
              id={listId}
              className="category-sticky-menu"
              role="listbox"
              aria-label={labels.navAria}
            >
              {nav.map((entry) => {
                if (entry.kind === "group") {
                  return (
                    <li
                      key={entry.id}
                      className="category-sticky-group"
                      role="presentation"
                    >
                      {pickLocale(entry.title, locale)}
                    </li>
                  );
                }

                const selected = entry.id === activeId;
                return (
                  <li
                    key={entry.id}
                    className="category-sticky-item"
                    role="option"
                    aria-selected={selected}
                  >
                    <button
                      type="button"
                      className={
                        selected
                          ? "category-sticky-option is-active"
                          : "category-sticky-option"
                      }
                      onClick={() => onSelect(entry)}
                    >
                      {pickLocale(entry.title, locale)}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
