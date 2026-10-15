import type { LocaleField } from "@/lib/locale";

export type CategoryImage = {
  src: string;
  alt: LocaleField;
};

export type CategoryProductVariant = {
  sizeLabel: LocaleField;
  price: number;
  /** Per-variant compare-at price for discount display */
  compareAtPrice?: number;
};

export type CategoryProductSpec = {
  label: LocaleField;
  value: LocaleField;
};

export type CategoryProduct = {
  id: string;
  slug: string;
  title: LocaleField;
  description?: LocaleField | null;
  images: CategoryImage[];
  /** Demo-only placeholder count when images are empty (Figma beds) */
  placeholderCount?: number;
  variants: CategoryProductVariant[];
  specs: CategoryProductSpec[];
  /** Regular subcategory slug; ignored when inSaleSection */
  subcategorySlug: string | null;
  /** Catalog placement in the Sale section (not the same as having a discount) */
  inSaleSection: boolean;
  order: number;
  source: "sanity" | "demo";
};

export type CategoryNavEntry =
  | {
      kind: "group";
      id: string;
      title: LocaleField;
    }
  | {
      kind: "subcategory" | "sale";
      id: string;
      sectionId: string | null;
      title: LocaleField;
      groupKey?: string;
    };

export type CategorySection = {
  id: string;
  title: LocaleField;
  isSale: boolean;
  products: CategoryProduct[];
};

export type CategoryPageModel = {
  slug: string;
  title: LocaleField;
  assortmentReady: boolean;
  nav: CategoryNavEntry[];
  sections: CategorySection[];
  /** True when page uses temporary demo catalog data (not Sanity) */
  usingDemoProducts: boolean;
};
