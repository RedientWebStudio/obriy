import type { CatalogCategorySlug } from "@/lib/catalog-categories";

export type AssortmentSubcategory = {
  /** Unique within category — used for anchors and Sanity slug */
  slug: string;
  title: string;
  /** Optional group key for dual categories (chairs, dressers) */
  group?: string;
};

export type AssortmentGroup = {
  key: string;
  title: string;
};

export type AssortmentCategory = {
  slug: CatalogCategorySlug;
  title: string;
  /** When false, category tile stays in Catalog but page shows unavailable state */
  assortmentReady: boolean;
  /**
   * When false, «Розпродаж» is omitted from nav, sections, and demo products.
   * Defaults to true for all other categories.
   */
  hasSaleSection?: boolean;
  groups?: AssortmentGroup[];
  subcategories: AssortmentSubcategory[];
};

/**
 * Approved assortment structure (Ukrainian).
 * Sale («Розпродаж») is not listed here — it is a placement section rendered
 * last when sale-section products exist (unless hasSaleSection is false).
 */
export const assortment: AssortmentCategory[] = [
  {
    slug: "own-production",
    title: "Власне виробництво",
    assortmentReady: true,
    hasSaleSection: false,
    subcategories: [
      {
        slug: "natural-wood-beds",
        title: "Ліжка з натурального дерева",
      },
    ],
  },
  {
    slug: "beds",
    title: "Ліжка",
    assortmentReady: true,
    subcategories: [
      { slug: "double", title: "Двоспальні" },
      { slug: "single", title: "Односпальні" },
      { slug: "soft", title: "М'які" },
      { slug: "wooden", title: "Дерев'яні" },
      { slug: "kids", title: "Дитячі" },
      {
        slug: "lift",
        title: "З підйомним механізмом",
      },
    ],
  },
  {
    slug: "mattresses",
    title: "Матраци",
    assortmentReady: true,
    subcategories: [
      { slug: "spring", title: "Пружинні" },
      { slug: "foam", title: "Безпружинні" },
      {
        slug: "memory-foam",
        title: "З ефектом пам'яті",
      },
      { slug: "latex", title: "З латексу" },
      { slug: "toppers", title: "Топери" },
    ],
  },
  {
    slug: "sofas",
    title: "Дивани",
    assortmentReady: true,
    subcategories: [
      {
        slug: "modular-corner",
        title: "Модульні кутові",
      },
      {
        slug: "classic-corner",
        title: "Класичні кутові",
      },
      { slug: "kitchen", title: "Кухонні" },
      { slug: "straight", title: "Прямі" },
      { slug: "classic", title: "Класичні" },
      { slug: "kids", title: "Дитячі" },
      {
        slug: "compact",
        title: "Малогабаритні",
      },
      {
        slug: "sofa-beds",
        title: "Дивани-ліжка",
      },
      { slug: "office", title: "Офісні" },
    ],
  },
  {
    slug: "tables",
    title: "Столи",
    assortmentReady: true,
    subcategories: [
      { slug: "budget", title: "Бюджетні" },
      { slug: "wooden", title: "Дерев'яні" },
      {
        slug: "book-tables",
        title: "Столи-книжки",
      },
      {
        slug: "transformers",
        title: "Трансформери",
      },
      { slug: "garden", title: "Садові" },
      { slug: "ceramic", title: "Керамічні" },
    ],
  },
  {
    slug: "dining-sets",
    title: "Комплекти — столи та стільці",
    assortmentReady: true,
    subcategories: [
      { slug: "wooden", title: "Дерев'яні" },
      { slug: "garden", title: "Садові" },
      { slug: "modern", title: "Сучасні" },
      { slug: "budget", title: "Бюджетні" },
      { slug: "premium", title: "Преміум" },
    ],
  },
  {
    slug: "chairs",
    title: "Стільці та крісла",
    assortmentReady: true,
    groups: [
      { key: "armchairs", title: "Крісла" },
      { key: "chairs", title: "Стільці" },
    ],
    subcategories: [
      {
        slug: "armchairs-living",
        group: "armchairs",
        title: "Для вітальні",
      },
      {
        slug: "armchairs-office",
        group: "armchairs",
        title: "Офісні",
      },
      {
        slug: "armchairs-kids",
        group: "armchairs",
        title: "Дитячі",
      },
      {
        slug: "armchairs-poufs",
        group: "armchairs",
        title: "Пуфи",
      },
      {
        slug: "armchairs-beanbags",
        group: "armchairs",
        title: "Крісла-мішки",
      },
      {
        slug: "armchairs-hanging",
        group: "armchairs",
        title: "Підвісні",
      },
      {
        slug: "chairs-kitchen",
        group: "chairs",
        title: "Кухонні",
      },
      {
        slug: "chairs-bar",
        group: "chairs",
        title: "Барні",
      },
      {
        slug: "chairs-wooden",
        group: "chairs",
        title: "Дерев'яні",
      },
      {
        slug: "chairs-upholstered",
        group: "chairs",
        title: "М'які",
      },
      {
        slug: "chairs-office",
        group: "chairs",
        title: "Офісні",
      },
    ],
  },
  {
    slug: "dressers",
    title: "Комоди та тумби",
    assortmentReady: true,
    groups: [
      { key: "dressers", title: "Комоди" },
      { key: "cabinets", title: "Тумби" },
    ],
    subcategories: [
      {
        slug: "dressers-drawers",
        group: "dressers",
        title: "З шухлядами",
      },
      {
        slug: "dressers-narrow",
        group: "dressers",
        title: "Вузькі",
      },
      {
        slug: "dressers-large",
        group: "dressers",
        title: "Великі",
      },
      {
        slug: "cabinets-bedside",
        group: "cabinets",
        title: "Приліжкові",
      },
      {
        slug: "cabinets-tv",
        group: "cabinets",
        title: "Під TV",
      },
      {
        slug: "cabinets-office",
        group: "cabinets",
        title: "Офісні",
      },
    ],
  },
  {
    slug: "wardrobes",
    title: "Шафи",
    assortmentReady: true,
    subcategories: [
      { slug: "hinged", title: "Розпашні" },
      {
        slug: "sliding",
        title: "Шафи-купе",
      },
      { slug: "kids", title: "Дитячі" },
      { slug: "office", title: "Офісні" },
      { slug: "built-in", title: "Вбудовані" },
      {
        slug: "walk-in",
        title: "Гардеробні",
      },
    ],
  },
  {
    slug: "hallways",
    title: "Передпокої",
    assortmentReady: true,
    subcategories: [
      { slug: "sets", title: "Комплекти" },
      { slug: "wardrobes", title: "Шафи" },
      {
        slug: "shoe-cabinets",
        title: "Тумби для взуття",
      },
      { slug: "hangers", title: "Вішалки" },
      { slug: "mirrors", title: "Дзеркала" },
      {
        slug: "benches-poufs",
        title: "Банкетки та пуфи",
      },
    ],
  },
  {
    slug: "kitchens",
    title: "Кухні",
    assortmentReady: true,
    subcategories: [
      { slug: "corner", title: "Кутові" },
      { slug: "straight", title: "Прямі" },
      { slug: "u-shaped", title: "П-подібні" },
      { slug: "small", title: "Малі" },
      {
        slug: "with-island",
        title: "З островом",
      },
    ],
  },
  {
    slug: "textiles",
    title: "Текстиль та аксесуари",
    assortmentReady: true,
    subcategories: [
      { slug: "pillows", title: "Подушки" },
      {
        slug: "mattress-protectors",
        title: "Наматрацники",
      },
    ],
  },
];

export const SALE_SECTION_ID = "sale";

export const saleSectionTitle = "Розпродаж";

export function categorySupportsSaleSection(
  category: AssortmentCategory | undefined,
): boolean {
  return category?.hasSaleSection !== false;
}

export function getAssortmentCategory(
  slug: string,
): AssortmentCategory | undefined {
  return assortment.find((category) => category.slug === slug);
}

export function subcategoryAnchor(
  categorySlug: string,
  subcategorySlug: string,
): string {
  return `${categorySlug}--${subcategorySlug}`;
}

export function productAnchor(
  categorySlug: string,
  productSlug: string,
): string {
  return `product-${categorySlug}-${productSlug}`;
}
