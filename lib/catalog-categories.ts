/**
 * Catalog category cards — order matches Figma Catalog Desktop (102:11).
 * Each slug routes to the universal `/catalog/[slug]` category page.
 */
export const catalogCategories = [
  {
    slug: "own-production",
    image: "/images/catalog/own-production.png",
  },
  {
    slug: "beds",
    image: "/images/catalog/beds.png",
  },
  {
    slug: "mattresses",
    image: "/images/catalog/mattresses.png",
  },
  {
    slug: "sofas",
    image: "/images/catalog/sofas.png",
  },
  {
    slug: "tables",
    image: "/images/catalog/tables.png",
  },
  {
    slug: "chairs",
    image: "/images/catalog/chairs.png",
  },
  {
    slug: "dining-sets",
    image: "/images/catalog/dining-sets.png",
  },
  {
    slug: "dressers",
    image: "/images/catalog/dressers.png",
  },
  {
    slug: "wardrobes",
    image: "/images/catalog/wardrobes.png",
  },
  {
    slug: "hallways",
    image: "/images/catalog/hallways.png",
  },
  {
    slug: "kitchens",
    image: "/images/catalog/kitchens.png",
  },
  {
    slug: "textiles",
    image: "/images/catalog/textiles.png",
  },
] as const;

export type CatalogCategorySlug = (typeof catalogCategories)[number]["slug"];
