"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/components/layout/NavLinks";
import { MQ_DESKTOP_MIN } from "@/lib/breakpoints";
import {
  announceChromeMenu,
  onForeignChromeMenuOpen,
} from "@/lib/chrome-menu-bus";

type Props = {
  items: NavItem[];
  labels: Record<NavItem["key"], string>;
  navLabel: string;
  openLabel: string;
  closeLabel: string;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderBurgerMenu({
  items,
  labels,
  navLabel,
  openLabel,
  closeLabel,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const mq = window.matchMedia(MQ_DESKTOP_MIN);
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return onForeignChromeMenuOpen("header-burger", () => setOpen(false));
  }, []);

  useEffect(() => {
    announceChromeMenu("header-burger", open);
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
    if (!open) return;

    const root = rootRef.current;
    if (!root) return;

    const focusables = root.querySelectorAll<HTMLElement>(
      'button[aria-expanded], a[href], [tabindex]:not([tabindex="-1"])',
    );
    const firstLink = root.querySelector<HTMLElement>(".header-burger-link");
    // preventScroll: focusing must not nudge the page and toggle Header.
    firstLink?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusables.length === 0) return;

      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="header-burger" ref={rootRef}>
      <button
        ref={toggleRef}
        type="button"
        className={
          open ? "header-burger-toggle is-open" : "header-burger-toggle"
        }
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          className="header-burger-icon"
          width="24"
          height="14"
          viewBox="0 0 24 14"
          aria-hidden="true"
          focusable="false"
        >
          <rect
            className="header-burger-line"
            x="0"
            y="0"
            width="24"
            height="2"
          />
          <rect
            className="header-burger-line"
            x="0"
            y="6"
            width="24"
            height="2"
          />
          <rect
            className="header-burger-line"
            x="0"
            y="12"
            width="24"
            height="2"
          />
        </svg>
      </button>

      <nav
        id={menuId}
        className={
          open ? "header-burger-panel is-open" : "header-burger-panel"
        }
        aria-label={navLabel}
        aria-hidden={open ? undefined : true}
        inert={open ? undefined : true}
      >
        <ul className="header-burger-list">
          {items.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <li key={item.key} className="header-burger-item">
                <Link
                  href={item.href}
                  className={
                    active
                      ? "header-burger-link is-active"
                      : "header-burger-link"
                  }
                  aria-current={active ? "page" : undefined}
                  tabIndex={open ? undefined : -1}
                  onClick={() => setOpen(false)}
                >
                  {labels[item.key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
