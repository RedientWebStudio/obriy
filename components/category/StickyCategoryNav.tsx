"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CategoryNavEntry } from "@/lib/category-types";
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

/** Header + sticky subcategory bar, measured after layout. */
function stickyCoverHeight(): number {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".category-sticky-nav");
  return (
    (header?.getBoundingClientRect().height ?? 0) +
    (nav?.getBoundingClientRect().height ?? 0)
  );
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
  const listId = useId();

  const activeItem =
    selectable.find((item) => item.id === activeId) ?? selectable[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
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
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!hash) return;

    const match = selectable.find(
      (item) => item.id === hash || item.sectionId === hash,
    );
    const target = document.getElementById(match?.sectionId ?? hash);
    if (!target) return;

    window.requestAnimationFrame(() => {
      scrollToTarget(target);
    });
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
                  <li key={entry.id} role="option" aria-selected={selected}>
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
