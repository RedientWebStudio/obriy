"use client";

import type { MouseEvent } from "react";
import { Link, usePathname } from "@/i18n/navigation";

type Props = {
  label: string;
};

export function HeaderLogo({ label }: Props) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;

    // Preserve new-tab / modified clicks and non-primary buttons.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });

    if (window.location.hash) {
      const { pathname: path, search } = window.location;
      window.history.replaceState(null, "", `${path}${search}`);
    }
  };

  return (
    <Link href="/" className="header-logo" onClick={handleClick}>
      {label}
    </Link>
  );
}
