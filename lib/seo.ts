import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";

/** App pathnames used for SEO (canonical / sitemap). */
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

/**
 * Path for the single Ukrainian locale (no `/uk` prefix).
 * Dynamic `/catalog/[slug]` is resolved explicitly — next-intl getPathname
 * leaves the `[slug]` token intact without a pathnames map.
 */
export function pagePath(href: SeoHref): string {
  if (typeof href !== "string" && href.pathname === "/catalog/[slug]") {
    const slug = href.params.slug?.trim();
    if (!slug || slug.includes("/") || slug.includes("[")) {
      throw new Error(`Invalid catalog slug for SEO path: ${href.params.slug}`);
    }
    return `/catalog/${slug}`;
  }

  return getPathname({ locale: "uk", href });
}

/** Shared social preview (`public/123.png`). */
const SOCIAL_IMAGE = {
  url: "/123.png",
  width: 1731,
  height: 909,
  alt: "OBRIY",
} as const;

export function buildPageMetadata(options: {
  href: SeoHref;
  title: string;
  description: string;
}): Metadata {
  const { href, title, description } = options;
  const path = pagePath(href);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "OBRIY",
      locale: "uk_UA",
      type: "website",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
