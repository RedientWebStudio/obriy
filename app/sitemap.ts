import type { MetadataRoute } from "next";
import { catalogCategories } from "@/lib/catalog-categories";
import {
  absoluteUrl,
  localizedPath,
  type SeoHref,
} from "@/lib/seo";
import { routing } from "@/i18n/routing";

function entry(href: SeoHref): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(localizedPath(locale, href));
  }
  languages["x-default"] = languages[routing.defaultLocale];

  return {
    url: languages[routing.defaultLocale],
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: SeoHref[] = ["/", "/catalog", "/contacts"];
  const categoryPages: SeoHref[] = catalogCategories.map((category) => ({
    pathname: "/catalog/[slug]" as const,
    params: { slug: category.slug },
  }));

  return [...staticPages, ...categoryPages].map(entry);
}
