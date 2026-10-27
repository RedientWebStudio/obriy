import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** App pathnames used for SEO (canonical / hreflang / sitemap). */
export type SeoHref =
  | "/"
  | "/catalog"
  | "/contacts"
  | {
      pathname: "/catalog/[slug]";
      params: { slug: string };
    };

/**
 * Canonical site origin for metadataBase / sitemap / robots.
 * Uses NEXT_PUBLIC_SITE_URL when set; otherwise a local build-safe fallback
 * (not a production domain claim).
 */
export function getSiteOrigin(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured);
    } catch {
      /* fall through */
    }
  }
  return new URL("http://localhost:3000");
}

export function absoluteUrl(pathname: string): string {
  const origin = getSiteOrigin();
  const base = origin.href.endsWith("/") ? origin.href : `${origin.href}/`;
  const path = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return new URL(path, base).href;
}

export function localizedPath(locale: string, href: SeoHref): string {
  return getPathname({ locale, href });
}

/** Canonical + hreflang map for the current locale page. */
export function buildLocaleAlternates(locale: string, href: SeoHref) {
  const canonical = localizedPath(locale, href);
  const languages: Record<string, string> = {};

  for (const loc of routing.locales) {
    languages[loc] = localizedPath(loc, href);
  }
  languages["x-default"] = languages[routing.defaultLocale];

  return {
    canonical,
    languages,
  };
}

export function buildPageMetadata(options: {
  locale: string;
  href: SeoHref;
  title: string;
  description: string;
}): Metadata {
  const { locale, href, title, description } = options;
  return {
    title,
    description,
    alternates: buildLocaleAlternates(locale, href),
  };
}
