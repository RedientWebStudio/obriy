import type { LocaleField } from "@/lib/locale";
import type { CatalogCategorySlug } from "@/lib/catalog-categories";

export type AssortmentSubcategory = {
  /** Unique within category — used for anchors and Sanity slug */
  slug: string;
  title: LocaleField;
  /** Optional group key for dual categories (chairs, dressers) */
  group?: string;
};

export type AssortmentGroup = {
  key: string;
  title: LocaleField;
};

export type AssortmentCategory = {
  slug: CatalogCategorySlug;
  title: LocaleField;
  /** When false, category tile stays in Catalog but page shows unavailable state */
  assortmentReady: boolean;
  groups?: AssortmentGroup[];
  subcategories: AssortmentSubcategory[];
};

/**
 * Approved assortment structure (UK source + EN localization).
 * Sale («Розпродаж») is not listed here — it is a placement section rendered
 * last when sale-section products exist.
 */
export const assortment: AssortmentCategory[] = [
  {
    slug: "own-production",
    title: {
      uk: "Власне виробництво дерев'яних меблів",
      en: "Own production of wooden furniture",
    },
    assortmentReady: false,
    subcategories: [],
  },
  {
    slug: "beds",
    title: { uk: "Ліжка", en: "Beds" },
    assortmentReady: true,
    subcategories: [
      { slug: "double", title: { uk: "Двоспальні", en: "Double" } },
      { slug: "single", title: { uk: "Односпальні", en: "Single" } },
      { slug: "soft", title: { uk: "М'які", en: "Upholstered" } },
      { slug: "wooden", title: { uk: "Дерев'яні", en: "Wooden" } },
      { slug: "kids", title: { uk: "Дитячі", en: "Kids" } },
      {
        slug: "lift",
        title: { uk: "З підйомним механізмом", en: "With lift mechanism" },
      },
    ],
  },
  {
    slug: "mattresses",
    title: { uk: "Матраци", en: "Mattresses" },
    assortmentReady: true,
    subcategories: [
      { slug: "spring", title: { uk: "Пружинні", en: "Spring" } },
      { slug: "foam", title: { uk: "Безпружинні", en: "Foam" } },
      {
        slug: "memory-foam",
        title: { uk: "З ефектом пам'яті", en: "Memory foam" },
      },
      { slug: "latex", title: { uk: "З латексу", en: "Latex" } },
      { slug: "toppers", title: { uk: "Топери", en: "Toppers" } },
    ],
  },
  {
    slug: "sofas",
    title: { uk: "Дивани", en: "Sofas" },
    assortmentReady: true,
    subcategories: [
      {
        slug: "modular-corner",
        title: { uk: "Модульні кутові", en: "Modular corner" },
      },
      {
        slug: "classic-corner",
        title: { uk: "Класичні кутові", en: "Classic corner" },
      },
      { slug: "kitchen", title: { uk: "Кухонні", en: "Kitchen" } },
      { slug: "straight", title: { uk: "Прямі", en: "Straight" } },
      { slug: "classic", title: { uk: "Класичні", en: "Classic" } },
      { slug: "kids", title: { uk: "Дитячі", en: "Kids" } },
      {
        slug: "compact",
        title: { uk: "Малогабаритні", en: "Compact" },
      },
      {
        slug: "sofa-beds",
        title: { uk: "Дивани-ліжка", en: "Sofa beds" },
      },
      { slug: "office", title: { uk: "Офісні", en: "Office" } },
    ],
  },
  {
    slug: "tables",
    title: { uk: "Столи", en: "Tables" },
    assortmentReady: true,
    subcategories: [
      { slug: "budget", title: { uk: "Бюджетні", en: "Budget" } },
      { slug: "wooden", title: { uk: "Дерев'яні", en: "Wooden" } },
      {
        slug: "book-tables",
        title: { uk: "Столи-книжки", en: "Book tables" },
      },
      {
        slug: "transformers",
        title: { uk: "Трансформери", en: "Transformers" },
      },
      { slug: "garden", title: { uk: "Садові", en: "Garden" } },
      { slug: "ceramic", title: { uk: "Керамічні", en: "Ceramic" } },
    ],
  },
  {
    slug: "dining-sets",
    title: { uk: "Комплекти — столи та стільці", en: "Table and chair sets" },
    assortmentReady: true,
    subcategories: [
      { slug: "wooden", title: { uk: "Дерев'яні", en: "Wooden" } },
      { slug: "garden", title: { uk: "Садові", en: "Garden" } },
      { slug: "modern", title: { uk: "Сучасні", en: "Modern" } },
      { slug: "budget", title: { uk: "Бюджетні", en: "Budget" } },
      { slug: "premium", title: { uk: "Преміум", en: "Premium" } },
    ],
  },
  {
    slug: "chairs",
    title: { uk: "Стільці та крісла", en: "Chairs and armchairs" },
    assortmentReady: true,
    groups: [
      { key: "armchairs", title: { uk: "Крісла", en: "Armchairs" } },
      { key: "chairs", title: { uk: "Стільці", en: "Chairs" } },
    ],
    subcategories: [
      {
        slug: "armchairs-living",
        group: "armchairs",
        title: { uk: "Для вітальні", en: "Living room" },
      },
      {
        slug: "armchairs-office",
        group: "armchairs",
        title: { uk: "Офісні", en: "Office" },
      },
      {
        slug: "armchairs-kids",
        group: "armchairs",
        title: { uk: "Дитячі", en: "Kids" },
      },
      {
        slug: "armchairs-poufs",
        group: "armchairs",
        title: { uk: "Пуфи", en: "Poufs" },
      },
      {
        slug: "armchairs-beanbags",
        group: "armchairs",
        title: { uk: "Крісла-мішки", en: "Bean bags" },
      },
      {
        slug: "armchairs-hanging",
        group: "armchairs",
        title: { uk: "Підвісні", en: "Hanging" },
      },
      {
        slug: "chairs-kitchen",
        group: "chairs",
        title: { uk: "Кухонні", en: "Kitchen" },
      },
      {
        slug: "chairs-bar",
        group: "chairs",
        title: { uk: "Барні", en: "Bar" },
      },
      {
        slug: "chairs-wooden",
        group: "chairs",
        title: { uk: "Дерев'яні", en: "Wooden" },
      },
      {
        slug: "chairs-upholstered",
        group: "chairs",
        title: { uk: "М'які", en: "Upholstered" },
      },
      {
        slug: "chairs-office",
        group: "chairs",
        title: { uk: "Офісні", en: "Office" },
      },
    ],
  },
  {
    slug: "dressers",
    title: { uk: "Комоди та тумби", en: "Dressers and cabinets" },
    assortmentReady: true,
    groups: [
      { key: "dressers", title: { uk: "Комоди", en: "Dressers" } },
      { key: "cabinets", title: { uk: "Тумби", en: "Cabinets" } },
    ],
    subcategories: [
      {
        slug: "dressers-drawers",
        group: "dressers",
        title: { uk: "З шухлядами", en: "With drawers" },
      },
      {
        slug: "dressers-narrow",
        group: "dressers",
        title: { uk: "Вузькі", en: "Narrow" },
      },
      {
        slug: "dressers-large",
        group: "dressers",
        title: { uk: "Великі", en: "Large" },
      },
      {
        slug: "cabinets-bedside",
        group: "cabinets",
        title: { uk: "Приліжкові", en: "Bedside" },
      },
      {
        slug: "cabinets-tv",
        group: "cabinets",
        title: { uk: "Під TV", en: "TV stands" },
      },
      {
        slug: "cabinets-office",
        group: "cabinets",
        title: { uk: "Офісні", en: "Office" },
      },
    ],
  },
  {
    slug: "wardrobes",
    title: { uk: "Шафи", en: "Wardrobes" },
    assortmentReady: true,
    subcategories: [
      { slug: "hinged", title: { uk: "Розпашні", en: "Hinged" } },
      {
        slug: "sliding",
        title: { uk: "Шафи-купе", en: "Sliding-door" },
      },
      { slug: "kids", title: { uk: "Дитячі", en: "Kids" } },
      { slug: "office", title: { uk: "Офісні", en: "Office" } },
      { slug: "built-in", title: { uk: "Вбудовані", en: "Built-in" } },
      {
        slug: "walk-in",
        title: { uk: "Гардеробні", en: "Walk-in closets" },
      },
    ],
  },
  {
    slug: "hallways",
    title: { uk: "Передпокої", en: "Hallways" },
    assortmentReady: true,
    subcategories: [
      { slug: "sets", title: { uk: "Комплекти", en: "Sets" } },
      { slug: "wardrobes", title: { uk: "Шафи", en: "Wardrobes" } },
      {
        slug: "shoe-cabinets",
        title: { uk: "Тумби для взуття", en: "Shoe cabinets" },
      },
      { slug: "hangers", title: { uk: "Вішалки", en: "Hangers" } },
      { slug: "mirrors", title: { uk: "Дзеркала", en: "Mirrors" } },
      {
        slug: "benches-poufs",
        title: { uk: "Банкетки та пуфи", en: "Benches and poufs" },
      },
    ],
  },
  {
    slug: "kitchens",
    title: { uk: "Кухні", en: "Kitchens" },
    assortmentReady: true,
    subcategories: [
      { slug: "corner", title: { uk: "Кутові", en: "Corner" } },
      { slug: "straight", title: { uk: "Прямі", en: "Straight" } },
      { slug: "u-shaped", title: { uk: "П-подібні", en: "U-shaped" } },
      { slug: "small", title: { uk: "Малі", en: "Small" } },
      {
        slug: "with-island",
        title: { uk: "З островом", en: "With island" },
      },
    ],
  },
  {
    slug: "textiles",
    title: { uk: "Текстиль та аксесуари", en: "Textiles and accessories" },
    assortmentReady: true,
    subcategories: [
      { slug: "pillows", title: { uk: "Подушки", en: "Pillows" } },
      {
        slug: "mattress-protectors",
        title: { uk: "Наматрацники", en: "Mattress protectors" },
      },
    ],
  },
];

export const SALE_SECTION_ID = "sale";

export const saleSectionTitle: LocaleField = {
  uk: "Розпродаж",
  en: "Sale",
};

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
