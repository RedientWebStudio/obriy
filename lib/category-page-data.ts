import "server-only";

import {
  getAssortmentCategory,
  SALE_SECTION_ID,
  saleSectionTitle,
  subcategoryAnchor,
} from "@/lib/assortment";
import type {
  CategoryNavEntry,
  CategoryPageModel,
  CategoryProduct,
  CategorySection,
} from "@/lib/category-types";
import { isDemoCatalogEnabled } from "@/lib/demo/demo-config";
import { getDemoProductsForCategory } from "@/lib/demo/generate-catalog";
import type { LocaleField } from "@/lib/locale";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PRODUCTS_BY_CATEGORY_QUERY } from "@/sanity/lib/queries";

type SanityLocale = { uk?: string; en?: string } | null | undefined;

type SanityProduct = {
  _id: string;
  title?: SanityLocale;
  slug?: string | null;
  description?: SanityLocale;
  gallery?: Array<{
    asset?: { _ref?: string };
    alt?: SanityLocale;
  }> | null;
  variants?: Array<{
    sizeLabel?: SanityLocale;
    price?: number;
    compareAtPrice?: number;
  }> | null;
  specs?: Array<{
    label?: SanityLocale;
    value?: SanityLocale;
  }> | null;
  inSaleSection?: boolean | null;
  compareAtPrice?: number | null;
  subcategorySlug?: string | null;
  order?: number | null;
};

function toLocaleField(value: SanityLocale, fallback = ""): LocaleField {
  return {
    uk: value?.uk?.trim() || fallback,
    en: value?.en?.trim() || value?.uk?.trim() || fallback,
  };
}

function mapSanityProduct(product: SanityProduct): CategoryProduct | null {
  if (!product.slug || !product.title?.uk) return null;

  const variants = (product.variants ?? [])
    .filter(
      (
        variant,
      ): variant is {
        sizeLabel: SanityLocale;
        price: number;
        compareAtPrice?: number;
      } =>
        Boolean(variant?.sizeLabel?.uk) && typeof variant?.price === "number",
    )
    .map((variant) => ({
      sizeLabel: toLocaleField(variant.sizeLabel),
      price: variant.price,
      compareAtPrice:
        typeof variant.compareAtPrice === "number"
          ? variant.compareAtPrice
          : typeof product.compareAtPrice === "number" && product.inSaleSection
            ? product.compareAtPrice
            : undefined,
    }));

  if (variants.length === 0) return null;

  const images = (product.gallery ?? [])
    .map((image, index) => {
      if (!image?.asset) return null;
      try {
        return {
          src: urlFor(image).width(1180).height(664).fit("crop").url(),
          alt: toLocaleField(
            image.alt,
            `${product.title?.uk ?? "Product"} ${index + 1}`,
          ),
        };
      } catch {
        return null;
      }
    })
    .filter((image): image is NonNullable<typeof image> => Boolean(image));

  const description = product.description?.uk
    ? toLocaleField(product.description)
    : null;

  return {
    id: product._id,
    slug: product.slug,
    title: toLocaleField(product.title),
    description,
    images,
    variants,
    specs: (product.specs ?? [])
      .filter((spec) => spec?.label?.uk && spec?.value?.uk)
      .map((spec) => ({
        label: toLocaleField(spec.label),
        value: toLocaleField(spec.value),
      })),
    subcategorySlug: product.subcategorySlug ?? null,
    inSaleSection: Boolean(product.inSaleSection),
    order: typeof product.order === "number" ? product.order : 0,
    source: "sanity",
  };
}

function buildNav(
  categorySlug: string,
  renderedSectionIds: Set<string>,
): CategoryNavEntry[] {
  const category = getAssortmentCategory(categorySlug);
  if (!category) return [];

  const nav: CategoryNavEntry[] = [];
  const groups = category.groups ?? [];

  const pushSub = (sub: (typeof category.subcategories)[number]) => {
    const id = subcategoryAnchor(categorySlug, sub.slug);
    nav.push({
      kind: "subcategory",
      id,
      sectionId: renderedSectionIds.has(id) ? id : null,
      title: sub.title,
      groupKey: sub.group,
    });
  };

  if (groups.length > 0) {
    for (const group of groups) {
      nav.push({
        kind: "group",
        id: `group-${group.key}`,
        title: group.title,
      });

      for (const sub of category.subcategories.filter(
        (item) => item.group === group.key,
      )) {
        pushSub(sub);
      }
    }
  } else {
    for (const sub of category.subcategories) {
      pushSub(sub);
    }
  }

  if (renderedSectionIds.has(SALE_SECTION_ID)) {
    nav.push({
      kind: "sale",
      id: SALE_SECTION_ID,
      sectionId: SALE_SECTION_ID,
      title: saleSectionTitle,
    });
  }

  return nav;
}

function buildSections(
  categorySlug: string,
  products: CategoryProduct[],
): CategorySection[] {
  const category = getAssortmentCategory(categorySlug);
  if (!category) return [];

  const regular = products
    .filter((product) => !product.inSaleSection)
    .sort((a, b) => a.order - b.order);
  const sale = products
    .filter((product) => product.inSaleSection)
    .sort((a, b) => a.order - b.order);

  const sections: CategorySection[] = [];

  for (const sub of category.subcategories) {
    const sectionProducts = regular.filter(
      (product) => product.subcategorySlug === sub.slug,
    );
    // Dynamic count — render whatever data provides (no .slice cap).
    if (sectionProducts.length === 0) continue;

    sections.push({
      id: subcategoryAnchor(categorySlug, sub.slug),
      title: sub.title,
      isSale: false,
      products: sectionProducts,
    });
  }

  if (sale.length > 0) {
    sections.push({
      id: SALE_SECTION_ID,
      title: saleSectionTitle,
      isSale: true,
      products: sale,
    });
  }

  return sections;
}

export async function getCategoryPageModel(
  slug: string,
): Promise<CategoryPageModel | null> {
  const category = getAssortmentCategory(slug);
  if (!category) return null;

  if (!category.assortmentReady) {
    return {
      slug: category.slug,
      title: category.title,
      assortmentReady: false,
      nav: [],
      sections: [],
      usingDemoProducts: false,
    };
  }

  let products: CategoryProduct[] = [];
  let usingDemoProducts = false;

  try {
    const sanityProducts = (await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, {
      categorySlug: slug,
    })) as SanityProduct[];

    products = sanityProducts
      .map((product) => mapSanityProduct(product))
      .filter((product): product is CategoryProduct => Boolean(product));
  } catch {
    products = [];
  }

  /*
    Sanity-first: use CMS products when present.
    Demo fallback only when the category has zero published products and
    DEMO_CATALOG is enabled. Never mix sources inside one category.
  */
  if (products.length === 0 && isDemoCatalogEnabled()) {
    products = getDemoProductsForCategory(slug);
    usingDemoProducts = products.length > 0;
  }

  const sections = buildSections(slug, products);
  const renderedSectionIds = new Set(sections.map((section) => section.id));

  return {
    slug: category.slug,
    title: category.title,
    assortmentReady: true,
    nav: buildNav(slug, renderedSectionIds),
    sections,
    usingDemoProducts,
  };
}
