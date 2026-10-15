/**
 * Idempotent seed: creates missing category + subcategory docs from
 * lib/assortment.ts structure. Never deletes or overwrites existing fields
 * beyond ensuring slug/title/order/group for docs we create by deterministic id.
 *
 * Usage: node scripts/seed-assortment.mjs
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
);

if (!env.SANITY_API_WRITE_TOKEN) {
  console.error("Missing SANITY_API_WRITE_TOKEN — aborting.");
  process.exit(1);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-08-19",
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

/** Keep in sync with lib/assortment.ts */
const assortment = [
  {
    slug: "own-production",
    title: {
      uk: "Власне виробництво дерев'яних меблів",
      en: "Own production of wooden furniture",
    },
    order: 0,
    subcategories: [],
  },
  {
    slug: "beds",
    title: { uk: "Ліжка", en: "Beds" },
    order: 1,
    subcategories: [
      { slug: "double", title: { uk: "Двоспальні", en: "Double" }, order: 1 },
      { slug: "single", title: { uk: "Односпальні", en: "Single" }, order: 2 },
      { slug: "soft", title: { uk: "М'які", en: "Upholstered" }, order: 3 },
      { slug: "wooden", title: { uk: "Дерев'яні", en: "Wooden" }, order: 4 },
      { slug: "kids", title: { uk: "Дитячі", en: "Kids" }, order: 5 },
      {
        slug: "lift",
        title: { uk: "З підйомним механізмом", en: "With lift mechanism" },
        order: 6,
      },
    ],
  },
  {
    slug: "mattresses",
    title: { uk: "Матраци", en: "Mattresses" },
    order: 2,
    subcategories: [
      { slug: "spring", title: { uk: "Пружинні", en: "Spring" }, order: 1 },
      { slug: "foam", title: { uk: "Безпружинні", en: "Foam" }, order: 2 },
      {
        slug: "memory-foam",
        title: { uk: "З ефектом пам'яті", en: "Memory foam" },
        order: 3,
      },
      { slug: "latex", title: { uk: "З латексу", en: "Latex" }, order: 4 },
      { slug: "toppers", title: { uk: "Топери", en: "Toppers" }, order: 5 },
    ],
  },
  {
    slug: "sofas",
    title: { uk: "Дивани", en: "Sofas" },
    order: 3,
    subcategories: [
      {
        slug: "modular-corner",
        title: { uk: "Модульні кутові", en: "Modular corner" },
        order: 1,
      },
      {
        slug: "classic-corner",
        title: { uk: "Класичні кутові", en: "Classic corner" },
        order: 2,
      },
      { slug: "kitchen", title: { uk: "Кухонні", en: "Kitchen" }, order: 3 },
      { slug: "straight", title: { uk: "Прямі", en: "Straight" }, order: 4 },
      { slug: "classic", title: { uk: "Класичні", en: "Classic" }, order: 5 },
      { slug: "kids", title: { uk: "Дитячі", en: "Kids" }, order: 6 },
      {
        slug: "compact",
        title: { uk: "Малогабаритні", en: "Compact" },
        order: 7,
      },
      {
        slug: "sofa-beds",
        title: { uk: "Дивани-ліжка", en: "Sofa beds" },
        order: 8,
      },
      { slug: "office", title: { uk: "Офісні", en: "Office" }, order: 9 },
    ],
  },
  {
    slug: "tables",
    title: { uk: "Столи", en: "Tables" },
    order: 4,
    subcategories: [
      { slug: "budget", title: { uk: "Бюджетні", en: "Budget" }, order: 1 },
      { slug: "wooden", title: { uk: "Дерев'яні", en: "Wooden" }, order: 2 },
      {
        slug: "book-tables",
        title: { uk: "Столи-книжки", en: "Book tables" },
        order: 3,
      },
      {
        slug: "transformers",
        title: { uk: "Трансформери", en: "Transformers" },
        order: 4,
      },
      { slug: "garden", title: { uk: "Садові", en: "Garden" }, order: 5 },
      { slug: "ceramic", title: { uk: "Керамічні", en: "Ceramic" }, order: 6 },
    ],
  },
  {
    slug: "dining-sets",
    title: { uk: "Комплекти — столи та стільці", en: "Table and chair sets" },
    order: 5,
    subcategories: [
      { slug: "wooden", title: { uk: "Дерев'яні", en: "Wooden" }, order: 1 },
      { slug: "garden", title: { uk: "Садові", en: "Garden" }, order: 2 },
      { slug: "modern", title: { uk: "Сучасні", en: "Modern" }, order: 3 },
      { slug: "budget", title: { uk: "Бюджетні", en: "Budget" }, order: 4 },
      { slug: "premium", title: { uk: "Преміум", en: "Premium" }, order: 5 },
    ],
  },
  {
    slug: "chairs",
    title: { uk: "Стільці та крісла", en: "Chairs and armchairs" },
    order: 6,
    groups: {
      armchairs: { uk: "Крісла", en: "Armchairs" },
      chairs: { uk: "Стільці", en: "Chairs" },
    },
    subcategories: [
      {
        slug: "armchairs-living",
        groupKey: "armchairs",
        title: { uk: "Для вітальні", en: "Living room" },
        order: 1,
      },
      {
        slug: "armchairs-office",
        groupKey: "armchairs",
        title: { uk: "Офісні", en: "Office" },
        order: 2,
      },
      {
        slug: "armchairs-kids",
        groupKey: "armchairs",
        title: { uk: "Дитячі", en: "Kids" },
        order: 3,
      },
      {
        slug: "armchairs-poufs",
        groupKey: "armchairs",
        title: { uk: "Пуфи", en: "Poufs" },
        order: 4,
      },
      {
        slug: "armchairs-beanbags",
        groupKey: "armchairs",
        title: { uk: "Крісла-мішки", en: "Bean bags" },
        order: 5,
      },
      {
        slug: "armchairs-hanging",
        groupKey: "armchairs",
        title: { uk: "Підвісні", en: "Hanging" },
        order: 6,
      },
      {
        slug: "chairs-kitchen",
        groupKey: "chairs",
        title: { uk: "Кухонні", en: "Kitchen" },
        order: 7,
      },
      {
        slug: "chairs-bar",
        groupKey: "chairs",
        title: { uk: "Барні", en: "Bar" },
        order: 8,
      },
      {
        slug: "chairs-wooden",
        groupKey: "chairs",
        title: { uk: "Дерев'яні", en: "Wooden" },
        order: 9,
      },
      {
        slug: "chairs-upholstered",
        groupKey: "chairs",
        title: { uk: "М'які", en: "Upholstered" },
        order: 10,
      },
      {
        slug: "chairs-office",
        groupKey: "chairs",
        title: { uk: "Офісні", en: "Office" },
        order: 11,
      },
    ],
  },
  {
    slug: "dressers",
    title: { uk: "Комоди та тумби", en: "Dressers and cabinets" },
    order: 7,
    groups: {
      dressers: { uk: "Комоди", en: "Dressers" },
      cabinets: { uk: "Тумби", en: "Cabinets" },
    },
    subcategories: [
      {
        slug: "dressers-drawers",
        groupKey: "dressers",
        title: { uk: "З шухлядами", en: "With drawers" },
        order: 1,
      },
      {
        slug: "dressers-narrow",
        groupKey: "dressers",
        title: { uk: "Вузькі", en: "Narrow" },
        order: 2,
      },
      {
        slug: "dressers-large",
        groupKey: "dressers",
        title: { uk: "Великі", en: "Large" },
        order: 3,
      },
      {
        slug: "cabinets-bedside",
        groupKey: "cabinets",
        title: { uk: "Приліжкові", en: "Bedside" },
        order: 4,
      },
      {
        slug: "cabinets-tv",
        groupKey: "cabinets",
        title: { uk: "Під TV", en: "TV stands" },
        order: 5,
      },
      {
        slug: "cabinets-office",
        groupKey: "cabinets",
        title: { uk: "Офісні", en: "Office" },
        order: 6,
      },
    ],
  },
  {
    slug: "wardrobes",
    title: { uk: "Шафи", en: "Wardrobes" },
    order: 8,
    subcategories: [
      { slug: "hinged", title: { uk: "Розпашні", en: "Hinged" }, order: 1 },
      {
        slug: "sliding",
        title: { uk: "Шафи-купе", en: "Sliding-door" },
        order: 2,
      },
      { slug: "kids", title: { uk: "Дитячі", en: "Kids" }, order: 3 },
      { slug: "office", title: { uk: "Офісні", en: "Office" }, order: 4 },
      { slug: "built-in", title: { uk: "Вбудовані", en: "Built-in" }, order: 5 },
      {
        slug: "walk-in",
        title: { uk: "Гардеробні", en: "Walk-in closets" },
        order: 6,
      },
    ],
  },
  {
    slug: "hallways",
    title: { uk: "Передпокої", en: "Hallways" },
    order: 9,
    subcategories: [
      { slug: "sets", title: { uk: "Комплекти", en: "Sets" }, order: 1 },
      { slug: "wardrobes", title: { uk: "Шафи", en: "Wardrobes" }, order: 2 },
      {
        slug: "shoe-cabinets",
        title: { uk: "Тумби для взуття", en: "Shoe cabinets" },
        order: 3,
      },
      { slug: "hangers", title: { uk: "Вішалки", en: "Hangers" }, order: 4 },
      { slug: "mirrors", title: { uk: "Дзеркала", en: "Mirrors" }, order: 5 },
      {
        slug: "benches-poufs",
        title: { uk: "Банкетки та пуфи", en: "Benches and poufs" },
        order: 6,
      },
    ],
  },
  {
    slug: "kitchens",
    title: { uk: "Кухні", en: "Kitchens" },
    order: 10,
    subcategories: [
      { slug: "corner", title: { uk: "Кутові", en: "Corner" }, order: 1 },
      { slug: "straight", title: { uk: "Прямі", en: "Straight" }, order: 2 },
      { slug: "u-shaped", title: { uk: "П-подібні", en: "U-shaped" }, order: 3 },
      { slug: "small", title: { uk: "Малі", en: "Small" }, order: 4 },
      {
        slug: "with-island",
        title: { uk: "З островом", en: "With island" },
        order: 5,
      },
    ],
  },
  {
    slug: "textiles",
    title: { uk: "Текстиль та аксесуари", en: "Textiles and accessories" },
    order: 11,
    subcategories: [
      { slug: "pillows", title: { uk: "Подушки", en: "Pillows" }, order: 1 },
      {
        slug: "mattress-protectors",
        title: { uk: "Наматрацники", en: "Mattress protectors" },
        order: 2,
      },
    ],
  },
];

const tx = client.transaction();
let creates = 0;

for (const category of assortment) {
  const categoryId = `category-${category.slug}`;
  const existing = await client.fetch(`*[_id == $id][0]._id`, {
    id: categoryId,
  });

  if (!existing) {
    tx.create({
      _id: categoryId,
      _type: "category",
      title: category.title,
      slug: { _type: "slug", current: category.slug },
      order: category.order,
      published: true,
    });
    creates += 1;
  }

  for (const sub of category.subcategories) {
    const subId = `subcategory-${category.slug}-${sub.slug}`;
    const subExisting = await client.fetch(`*[_id == $id][0]._id`, {
      id: subId,
    });
    if (subExisting) continue;

    const doc = {
      _id: subId,
      _type: "subcategory",
      title: sub.title,
      slug: { _type: "slug", current: sub.slug },
      category: { _type: "reference", _ref: categoryId },
      order: sub.order,
      published: true,
    };

    if (sub.groupKey) {
      doc.groupKey = sub.groupKey;
      doc.groupTitle = category.groups?.[sub.groupKey];
    }

    tx.create(doc);
    creates += 1;
  }
}

if (creates === 0) {
  console.log("Assortment already present — nothing to create.");
  process.exit(0);
}

await tx.commit();
console.log(`Created ${creates} document(s).`);
