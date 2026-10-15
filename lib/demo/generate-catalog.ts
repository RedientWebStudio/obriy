import { assortment } from "@/lib/assortment";
import type {
  CategoryProduct,
  CategoryProductSpec,
  CategoryProductVariant,
} from "@/lib/category-types";
import type { CatalogCategorySlug } from "@/lib/catalog-categories";
import type { LocaleField } from "@/lib/locale";

type VariantKind = "bed-size" | "mattress-size" | "table-size" | "sofa-size" | "module-size" | "single";

type CategoryProfile = {
  image: string;
  basePrice: number;
  variantKind: VariantKind;
};

const demoDescription: LocaleField = {
  uk: "Демонстраційний опис для перевірки картки товару. Не є комерційною пропозицією.",
  en: "Demo description for the product card. Not a commercial offer.",
};

/** Long enough to clamp to two lines and reveal the «Ще» / More control. */
const demoLongDescription: LocaleField = {
  uk: "Демонстраційний опис для перевірки картки товару. Цей фрагмент навмисно довший за два рядки, щоб можна було перевірити кнопку «Ще» і згортання тексту. Це не опис реального виробу OBRIY і не комерційна пропозиція.",
  en: "Demo description for the product card. This passage is intentionally longer than two lines so the More control and text collapse can be checked. It does not describe a real OBRIY product and is not a commercial offer.",
};

function demoDescriptionFor(index: number): LocaleField {
  return index === 0 ? demoLongDescription : demoDescription;
}

const demoSpecs: CategoryProductSpec[] = [
  {
    label: { uk: "Дані", en: "Data" },
    value: { uk: "Демонстраційні", en: "Demo" },
  },
  {
    label: { uk: "Призначення", en: "Purpose" },
    value: { uk: "Перевірка інтерфейсу", en: "Interface check" },
  },
];

function demoTitle(index: number): LocaleField {
  const number = String(index + 1).padStart(2, "0");
  return { uk: `Товар ${number}`, en: `Product ${number}` };
}

function L(uk: string, en: string): LocaleField {
  return { uk, en };
}

function catalogImage(slug: CatalogCategorySlug): string {
  return `/images/catalog/${slug}.png`;
}

const profiles: Partial<Record<CatalogCategorySlug, CategoryProfile>> = {
  beds: { image: catalogImage("beds"), basePrice: 16800, variantKind: "bed-size" },
  mattresses: { image: catalogImage("mattresses"), basePrice: 9200, variantKind: "mattress-size" },
  sofas: { image: catalogImage("sofas"), basePrice: 24500, variantKind: "sofa-size" },
  tables: { image: catalogImage("tables"), basePrice: 7800, variantKind: "table-size" },
  "dining-sets": { image: catalogImage("dining-sets"), basePrice: 18900, variantKind: "module-size" },
  chairs: { image: catalogImage("chairs"), basePrice: 4200, variantKind: "module-size" },
  dressers: { image: catalogImage("dressers"), basePrice: 9600, variantKind: "module-size" },
  wardrobes: { image: catalogImage("wardrobes"), basePrice: 15600, variantKind: "module-size" },
  hallways: { image: catalogImage("hallways"), basePrice: 7200, variantKind: "module-size" },
  kitchens: { image: catalogImage("kitchens"), basePrice: 42000, variantKind: "module-size" },
  textiles: { image: catalogImage("textiles"), basePrice: 890, variantKind: "single" },
};

function bedSizes(base: number): CategoryProductVariant[] {
  return [
    { sizeLabel: L("140 × 200 см", "140 × 200 cm"), price: base - 1200 },
    { sizeLabel: L("160 × 200 см", "160 × 200 cm"), price: base },
    { sizeLabel: L("180 × 200 см", "180 × 200 cm"), price: base + 1800 },
  ];
}

function mattressSizes(base: number): CategoryProductVariant[] {
  return [
    { sizeLabel: L("160 × 200 см", "160 × 200 cm"), price: base },
    { sizeLabel: L("180 × 200 см", "180 × 200 cm"), price: base + 900 },
  ];
}

function tableSizes(base: number): CategoryProductVariant[] {
  return [
    { sizeLabel: L("120 × 80 см", "120 × 80 cm"), price: base },
    { sizeLabel: L("140 × 80 см", "140 × 80 cm"), price: base + 1100 },
  ];
}

function sofaSizes(base: number): CategoryProductVariant[] {
  return [
    { sizeLabel: L("220 × 95 см", "220 × 95 cm"), price: base },
    { sizeLabel: L("280 × 160 см", "280 × 160 cm"), price: base + 3200 },
  ];
}

const moduleSizeLabels: Partial<
  Record<CatalogCategorySlug, [LocaleField, LocaleField]>
> = {
  "dining-sets": [
    L("120 × 80 см", "120 × 80 cm"),
    L("160 × 90 см", "160 × 90 cm"),
  ],
  chairs: [
    L("45 × 52 × 86 см", "45 × 52 × 86 cm"),
    L("50 × 56 × 98 см", "50 × 56 × 98 cm"),
  ],
  dressers: [
    L("80 × 45 × 85 см", "80 × 45 × 85 cm"),
    L("120 × 48 × 95 см", "120 × 48 × 95 cm"),
  ],
  wardrobes: [
    L("120 × 60 × 220 см", "120 × 60 × 220 cm"),
    L("180 × 60 × 240 см", "180 × 60 × 240 cm"),
  ],
  hallways: [
    L("80 × 35 × 190 см", "80 × 35 × 190 cm"),
    L("120 × 35 × 200 см", "120 × 35 × 200 cm"),
  ],
  kitchens: [L("240 × 60 см", "240 × 60 cm"), L("300 × 60 см", "300 × 60 cm")],
};

function moduleSizes(
  categorySlug: CatalogCategorySlug,
  base: number,
): CategoryProductVariant[] {
  const labels = moduleSizeLabels[categorySlug] ?? [
    L("80 × 40 × 80 см", "80 × 40 × 80 cm"),
    L("120 × 40 × 90 см", "120 × 40 × 90 cm"),
  ];
  return [
    { sizeLabel: labels[0], price: base },
    { sizeLabel: labels[1], price: base + 600 },
  ];
}

function singleVariant(base: number): CategoryProductVariant[] {
  return [{ sizeLabel: L("Стандарт", "Standard"), price: base }];
}

function variantsFor(
  kind: VariantKind,
  base: number,
  index: number,
  categorySlug: CatalogCategorySlug,
): CategoryProductVariant[] {
  // Mix single vs multi so UI of both states can be tested.
  if (index % 2 === 0 && kind !== "single") {
    return singleVariant(base);
  }

  switch (kind) {
    case "bed-size":
      return bedSizes(base);
    case "mattress-size":
      return mattressSizes(base);
    case "table-size":
      return tableSizes(base);
    case "sofa-size":
      return sofaSizes(base);
    case "module-size":
      return moduleSizes(categorySlug, base);
    case "single":
      return singleVariant(base);
  }
}

function productImages(
  imageSrc: string,
  title: LocaleField,
  index: number,
): CategoryProduct["images"] {
  const primary = {
    src: imageSrc,
    alt: L(
      `${title.uk} — демонстраційне фото`,
      `${title.en} — demo photo`,
    ),
  };

  // Every second card gets a multi-image gallery (same asset, different alt)
  // so gallery controls and lightbox can be verified without extra files.
  if (index % 2 === 1) {
    return [
      primary,
      {
        src: imageSrc,
        alt: L(
          `${title.uk} — ракурс 2 (демо)`,
          `${title.en} — angle 2 (demo)`,
        ),
      },
      {
        src: imageSrc,
        alt: L(
          `${title.uk} — ракурс 3 (демо)`,
          `${title.en} — angle 3 (demo)`,
        ),
      },
    ];
  }

  return [primary];
}

function buildProduct(options: {
  categorySlug: CatalogCategorySlug;
  subcategorySlug: string;
  index: number;
  order: number;
  profile: CategoryProfile;
  inSaleSection?: boolean;
}): CategoryProduct {
  const price =
    options.profile.basePrice +
    options.index * 700 +
    (options.subcategorySlug.length % 5) * 250;

  const title = demoTitle(options.index);
  const number = String(options.index + 1).padStart(2, "0");
  const slug = options.inSaleSection
    ? `sale-${number}`
    : `${options.subcategorySlug}-${number}`;

  let productVariants = variantsFor(
    options.profile.variantKind,
    price,
    options.index,
    options.categorySlug,
  );

  if (options.inSaleSection) {
    productVariants = productVariants.map((variant) => ({
      ...variant,
      price: Math.round(variant.price * 0.84),
      compareAtPrice: variant.price,
    }));
  } else if (options.index === 3 && productVariants.length === 1) {
    // Occasional discount outside the Sale section (P2 rule).
    const [only] = productVariants;
    productVariants = [
      {
        ...only,
        price: Math.round(only.price * 0.9),
        compareAtPrice: only.price,
      },
    ];
  }

  return {
    id: `demo-${options.categorySlug}-${slug}`,
    slug,
    title,
    description: demoDescriptionFor(options.index),
    images: productImages(options.profile.image, title, options.index),
    variants: productVariants,
    specs: demoSpecs,
    subcategorySlug: options.inSaleSection ? null : options.subcategorySlug,
    inSaleSection: Boolean(options.inSaleSection),
    order: options.order,
    source: "demo",
  };
}

/** 4 demo products per approved subcategory, plus 4 sale items. */
export function getDemoProductsForCategory(
  categorySlug: string,
): CategoryProduct[] {
  const category = assortment.find((item) => item.slug === categorySlug);
  const profile = profiles[categorySlug as CatalogCategorySlug];
  if (!category || !category.assortmentReady || !profile) return [];

  const products: CategoryProduct[] = [];
  let order = 1;

  for (const sub of category.subcategories) {
    for (let index = 0; index < 4; index += 1) {
      products.push(
        buildProduct({
          categorySlug: category.slug,
          subcategorySlug: sub.slug,
          index,
          order,
          profile,
        }),
      );
      order += 1;
    }
  }

  for (let index = 0; index < 4; index += 1) {
    products.push(
      buildProduct({
        categorySlug: category.slug,
        subcategorySlug: "sale",
        index,
        order,
        profile,
        inSaleSection: true,
      }),
    );
    order += 1;
  }

  return products;
}

export function countDemoCatalogStats() {
  const ready = assortment.filter((item) => item.assortmentReady);
  let subcategories = 0;
  let products = 0;
  let saleProducts = 0;

  for (const category of ready) {
    subcategories += category.subcategories.length;
    const list = getDemoProductsForCategory(category.slug);
    products += list.length;
    saleProducts += list.filter((item) => item.inSaleSection).length;
  }

  return {
    categories: ready.length,
    subcategories,
    products,
    saleProducts,
    regularProducts: products - saleProducts,
  };
}
