import type { MetadataRoute } from "next";
import { catalogCategories } from "@/lib/catalog-categories";
import { absoluteUrl, pagePath, type SeoHref } from "@/lib/seo";

function entry(href: SeoHref): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(pagePath(href)),
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
