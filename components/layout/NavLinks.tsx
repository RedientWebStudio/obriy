"use client";

import { Link, usePathname } from "@/i18n/navigation";

export type NavItem = {
  href: "/" | "/catalog" | "/contacts";
  key: "home" | "catalog" | "contacts";
};

type Props = {
  items: NavItem[];
  labels: Record<NavItem["key"], string>;
  navLabel: string;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, labels, navLabel }: Props) {
  const pathname = usePathname();

  return (
    <nav className="header-nav" aria-label={navLabel}>
      <ul className="header-nav-list">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                className="header-nav-link"
                aria-current={active ? "page" : undefined}
              >
                {labels[item.key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
