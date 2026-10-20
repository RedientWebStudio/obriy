"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CategoryNavEntry } from "@/lib/category-types";
import {
  announceChromeMenu,
  onForeignChromeMenuOpen,
} from "@/lib/chrome-menu-bus";
import { setChromeScrollLock } from "@/lib/chrome-scroll-lock";
import type { LocaleField } from "@/lib/locale";
import { pickLocale } from "@/lib/locale";
import {
  isProductHash,
  isProductHashHoldActive,
  PRODUCT_HASH_PENDING_ATTR,
  releaseProductHashHold,
  setProductDeepLinkActive,
} from "@/lib/product-hash-boot";
import { readProductDeepLinkId } from "@/lib/product-share-url";

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

type Selectable = Extract<
  CategoryNavEntry,
  { kind: "subcategory" | "sale" }
>;

function firstSelectableId(nav: CategoryNavEntry[]): string {
  const item = nav.find(
    (entry) => entry.kind === "subcategory" || entry.kind === "sale",
  );
  return item?.id ?? "";
}

/**
 * Visual bottom of Sticky Nav (accounts for Header hide transforms).
 * This is the line content should sit under.
 */
function stickyCoverHeight(): number {
  const nav = document.querySelector(".category-sticky-nav");
  if (nav) {
    return Math.max(0, Math.round(nav.getBoundingClientRect().bottom));
  }

  const header = document.querySelector(".site-header");
  if (!header || header.classList.contains("is-header-hidden")) return 0;
  return Math.max(0, Math.round(header.getBoundingClientRect().height));
}

function stickyNavHeight(): number {
  const nav = document.querySelector(".category-sticky-nav");
  return Math.max(0, Math.round(nav?.getBoundingClientRect().height ?? 0));
}

function sectionHeading(section: HTMLElement): HTMLElement {
  return (
    section.querySelector<HTMLElement>(".category-section-heading") ??
    section.querySelector<HTMLElement>(".category-section-header") ??
    section
  );
}

/** Align product card top under Sticky Nav; sections keep heading target. */
function scrollAlignTarget(element: HTMLElement): HTMLElement {
  if (
    element.classList.contains("product-card") ||
    element.id.startsWith("product-")
  ) {
    return element;
  }
  return sectionHeading(element);
}

function frames(count: number): Promise<void> {
  return new Promise((resolve) => {
    const step = (left: number) => {
      if (left <= 0) {
        resolve();
        return;
      }
      window.requestAnimationFrame(() => step(left - 1));
    };
    step(count);
  });
}

/**
 * Wait until the product card exists, has layout, and Sticky Nav is measurable.
 * Also waits for a short layout-stable window so images/fonts don't shift the
 * target after the scroll starts.
 */
async function waitForProductCard(
  id: string,
  isCancelled: () => boolean,
): Promise<HTMLElement | null> {
  let found: HTMLElement | null = null;

  for (let i = 0; i < 80 && !isCancelled(); i += 1) {
    found = document.getElementById(id);
    const nav = document.querySelector(".category-sticky-nav");
    if (
      found &&
      nav &&
      found.getBoundingClientRect().height > 0 &&
      nav.getBoundingClientRect().height > 0
    ) {
      break;
    }
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 40);
    });
    found = null;
  }

  if (!found || isCancelled()) return found;

  // Layout stability: same document Y across two frames.
  for (let i = 0; i < 12 && !isCancelled(); i += 1) {
    const y1 = Math.round(
      found.getBoundingClientRect().top + window.scrollY,
    );
    await frames(2);
    if (isCancelled()) return found;
    const y2 = Math.round(
      found.getBoundingClientRect().top + window.scrollY,
    );
    if (Math.abs(y1 - y2) <= 1) return found;
  }

  return found;
}

function navIdNearElement(
  element: HTMLElement,
  selectable: Selectable[],
): string {
  const section = element.closest(".category-section");
  if (section?.id) return navIdForSection(section.id, selectable);
  if (element.classList.contains("category-section")) {
    return navIdForSection(element.id, selectable);
  }
  return "";
}

/** Nav item id for a section element (ids usually match). */
function navIdForSection(
  sectionId: string,
  selectable: Selectable[],
): string {
  const match = selectable.find(
    (item) => item.sectionId === sectionId || item.id === sectionId,
  );
  return match?.id ?? sectionId;
}

/**
 * Last section whose top has crossed under Sticky Nav.
 * Bidirectional; uses section top (stable) rather than intersection ratios.
 */
function resolveActiveNavId(
  sections: HTMLElement[],
  selectable: Selectable[],
): string {
  if (sections.length === 0) return "";

  const line = stickyCoverHeight() + 1;
  let current: HTMLElement | null = null;

  for (const section of sections) {
    if (section.getBoundingClientRect().top <= line) {
      current = section;
    }
  }

  if (!current || window.scrollY < 4) {
    current = sections[0] ?? null;
  }

  return current ? navIdForSection(current.id, selectable) : "";
}

/** Cancels an in-flight program scroll when a newer one starts. */
let programScrollGeneration = 0;

type ScrollToSectionOptions = {
  /**
   * After the main scroll, keep chrome locked and re-snap until the target
   * stops shifting (lazy images above a deep product card).
   */
  settleLayout?: boolean;
};

/**
 * Scroll so the align target sits flush under Sticky Nav.
 * Snaps Header to the destination chrome state (locked) before motion so
 * smooth scrolling stays accurate without a late auto jump.
 */
function scrollToSection(
  section: HTMLElement,
  onSettled?: () => void,
  options?: ScrollToSectionOptions,
): void {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const alignEl = () => scrollAlignTarget(section);
  const heading = alignEl();
  const generation = ++programScrollGeneration;
  const settleLayout = Boolean(options?.settleLayout);

  const targetYFor = (cover: number) =>
    Math.max(
      0,
      Math.round(
        alignEl().getBoundingClientRect().top + window.scrollY - cover,
      ),
    );

  const headingDocY =
    heading.getBoundingClientRect().top + window.scrollY;
  const scrollingUp =
    headingDocY < window.scrollY + stickyCoverHeight() - 8;

  // Destination past the top band → Header hidden (Sticky-only cover).
  // Scrolling up / near top → full chrome.
  const stickyOnlyY = targetYFor(stickyNavHeight());
  const headerVisible = scrollingUp || stickyOnlyY <= 10;

  setChromeScrollLock({ locked: true, headerVisible });

  let settled = false;
  const snapToCover = () => {
    const y = targetYFor(stickyCoverHeight());
    if (Math.abs(y - window.scrollY) > 1) {
      window.scrollTo({ top: y, behavior: "auto" });
    }
  };

  const unlockAndSettle = () => {
    if (generation !== programScrollGeneration) return;
    snapToCover();
    setChromeScrollLock({ locked: false });
    onSettled?.();
  };

  const finish = () => {
    if (settled || generation !== programScrollGeneration) return;
    settled = true;
    window.removeEventListener("scrollend", onScrollEnd);
    window.clearTimeout(fallbackTimer);

    snapToCover();

    if (!settleLayout) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(unlockAndSettle);
      });
      return;
    }

    // Product deep-links: absorb post-scroll layout shifts while still locked.
    void (async () => {
      for (let i = 0; i < 12; i += 1) {
        if (generation !== programScrollGeneration) return;
        const before = window.scrollY;
        snapToCover();
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 90);
        });
        if (generation !== programScrollGeneration) return;
        const target = targetYFor(stickyCoverHeight());
        const drifted =
          Math.abs(target - window.scrollY) > 1 ||
          Math.abs(before - window.scrollY) > 1;
        if (!drifted) {
          await frames(2);
          if (generation !== programScrollGeneration) return;
          if (Math.abs(targetYFor(stickyCoverHeight()) - window.scrollY) <= 1) {
            break;
          }
        }
      }
      unlockAndSettle();
    })();
  };

  const onScrollEnd = () => finish();
  let fallbackTimer = 0;

  const run = () => {
    if (generation !== programScrollGeneration) return;

    // Measure live cover after Header snap — more accurate than predicted heights.
    const targetY = targetYFor(stickyCoverHeight());
    const distance = Math.abs(targetY - window.scrollY);
    const useSmooth = !reduceMotion && distance > 4;

    window.scrollTo({
      top: targetY,
      behavior: useSmooth ? "smooth" : "auto",
    });

    if (!useSmooth) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(finish);
      });
      return;
    }

    window.addEventListener("scrollend", onScrollEnd);
    // Long product jumps need more than ~1.4s; still capped for safety.
    fallbackTimer = window.setTimeout(
      finish,
      Math.min(3200, Math.max(900, 360 + distance * 0.4)),
    );
  };

  // Wait two frames so Header snap (data-chrome-snap) is measured.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(run);
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
        (entry): entry is Selectable =>
          entry.kind === "subcategory" || entry.kind === "sale",
      ),
    [nav],
  );

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(() => firstSelectableId(nav));
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  /** Ignore spy updates while a dropdown/hash scroll is in flight. */
  const programScrollUntilRef = useRef(0);

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

  // Unified active-section spy (scroll + Header hide/show). Bidirectional.
  useEffect(() => {
    const sections = selectable
      .map((item) => item.sectionId)
      .filter((id): id is string => Boolean(id))
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    let frame = 0;

    const syncActive = () => {
      if (performance.now() < programScrollUntilRef.current) return;
      const next = resolveActiveNavId(sections, selectable);
      if (!next) return;
      setActiveId((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        syncActive();
      });
    };

    const onScrollEnd = () => {
      programScrollUntilRef.current = 0;
      syncActive();
    };

    syncActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", onScroll, { passive: true });

    const header = document.querySelector(".site-header");
    const mo =
      header && typeof MutationObserver !== "undefined"
        ? new MutationObserver(onScroll)
        : null;
    mo?.observe(header, { attributes: true, attributeFilter: ["class"] });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onScroll);
      mo?.disconnect();
    };
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

    const scrollToHashTarget = (target: HTMLElement) => {
      // Product deep-links: spy the parent subcategory, not the product id.
      const navId = navIdNearElement(target, selectable);
      if (navId) setActiveId(navId);

      const productTarget =
        target.classList.contains("product-card") ||
        target.id.startsWith("product-");

      programScrollUntilRef.current = performance.now() + 4000;
      scrollToSection(
        target,
        () => {
          programScrollUntilRef.current = 0;
          if (navId) setActiveId(navId);
        },
        { settleLayout: productTarget },
      );
    };

    let cancelled = false;
    const previousRestoration = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {
      /* ignore */
    }

    /**
     * Cold open / reload / bfcache: wait for the card, release the native-hash
     * hold, then perform a single offset-aware scroll (no approximate jump).
     * Product Share links may arrive as `#product-…` and/or `?product=`.
     */
    const runColdHash = async () => {
      const productId = readProductDeepLinkId();
      const rawHash = window.location.hash;
      const sectionId =
        !productId && rawHash
          ? decodeURIComponent(rawHash.replace(/^#/, ""))
          : "";
      const id = productId ?? sectionId;
      if (!id || cancelled) return;

      const productLink = Boolean(productId);
      setProductDeepLinkActive(productLink);

      if (productLink) {
        // Re-assert hold (Strict Mode remount / late boot must not expose a jump).
        document.documentElement.setAttribute(PRODUCT_HASH_PENDING_ATTR, "");
        window.scrollTo({ top: 0, behavior: "auto" });
        // Keep hash in sync when Telegram (etc.) kept only `?product=`.
        if (!isProductHash(rawHash)) {
          try {
            history.replaceState(
              null,
              "",
              `${window.location.pathname}${window.location.search}#${productId}`,
            );
          } catch {
            /* ignore */
          }
        }
      }

      let found: HTMLElement | null = null;
      if (productLink) {
        found = await waitForProductCard(id, () => cancelled);
      } else {
        for (let i = 0; i < 50 && !cancelled; i += 1) {
          found = document.getElementById(id);
          if (found) break;
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 40);
          });
        }
        if (found && !cancelled) await frames(2);
      }

      if (!found || cancelled) {
        releaseProductHashHold();
        if (productLink) setProductDeepLinkActive(false);
        return;
      }

      // Prefer resolve via nav map for section hashes; products use the card.
      const target =
        (productLink ? found : resolveHashTarget(rawHash)) ?? found;
      if (!target || cancelled) {
        releaseProductHashHold();
        if (productLink) setProductDeepLinkActive(false);
        return;
      }

      if (productLink || isProductHashHoldActive()) {
        // Unlock scrolling only once the card is ready — then one program scroll.
        window.scrollTo({ top: 0, behavior: "auto" });
        releaseProductHashHold();
        await frames(2);
        if (cancelled) return;
      }

      scrollToHashTarget(target);
    };

    setProductDeepLinkActive(Boolean(readProductDeepLinkId()));
    void runColdHash();

    const onHashChange = () => {
      const raw = window.location.hash;
      if (!raw) {
        setProductDeepLinkActive(false);
        return;
      }

      if (isProductHash(raw)) {
        setProductDeepLinkActive(true);
        // Same-document navigation: undo native jump, then one controlled scroll.
        void (async () => {
          const id = decodeURIComponent(raw.replace(/^#/, ""));
          document.documentElement.setAttribute(
            PRODUCT_HASH_PENDING_ATTR,
            "",
          );
          window.scrollTo({ top: 0, behavior: "auto" });
          const found = await waitForProductCard(id, () => cancelled);
          if (!found || cancelled) {
            releaseProductHashHold();
            setProductDeepLinkActive(false);
            return;
          }
          window.scrollTo({ top: 0, behavior: "auto" });
          releaseProductHashHold();
          await frames(2);
          if (!cancelled) scrollToHashTarget(found);
        })();
        return;
      }

      setProductDeepLinkActive(false);
      const target = resolveHashTarget(raw);
      if (target) scrollToHashTarget(target);
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void runColdHash();
    };
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      cancelled = true;
      // Keep hold across Strict Mode remount; sync deep-link padding to current hash.
      setProductDeepLinkActive(isProductHash(window.location.hash));
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("pageshow", onPageShow);
      try {
        history.scrollRestoration = previousRestoration;
      } catch {
        /* ignore */
      }
    };
  }, [selectable]);

  const onSelect = (item: Selectable) => {
    setActiveId(item.id);
    setOpen(false);

    if (!item.sectionId) return;
    const target = document.getElementById(item.sectionId);
    if (!target) return;

    programScrollUntilRef.current = performance.now() + 1500;
    scrollToSection(target, () => {
      programScrollUntilRef.current = 0;
      setActiveId(item.id);
    });
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
              {/* Mobile Figma 175:2 — combined «Category / Sub» in the trigger */}
              <span className="category-sticky-mobile-prefix">
                {pickLocale(categoryTitle, locale)}
                <span className="category-sticky-mobile-slash">{" / "}</span>
              </span>
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
