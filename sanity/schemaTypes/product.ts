import { defineField, defineType, type Reference } from "sanity";
import { ProductSubcategoryInput } from "./productSubcategoryInput";

const PRODUCT_DESCRIPTION_MAX = 250;
const STUDIO_API_VERSION =
  process.env.SANITY_STUDIO_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  "2025-08-19";

type ProductDescriptionValue = {
  uk?: string;
  en?: string;
} | null;

type RefLike = { _ref?: string } | null | undefined;

/** Character limit for product.description only — not shared localeText. */
export function validateProductDescription(
  value: ProductDescriptionValue | undefined,
): true | string {
  const uk = typeof value?.uk === "string" ? value.uk : "";

  if (uk.length <= PRODUCT_DESCRIPTION_MAX) return true;

  return `Опис має містити не більше ${PRODUCT_DESCRIPTION_MAX} символів з пробілами. Зараз: ${uk.length}.`;
}

function referenceIds(ref: string): string[] {
  const published = ref.replace(/^drafts\./, "");
  return [published, `drafts.${published}`];
}

function categoryRefFromDocument(document: unknown): string | null {
  if (!document || typeof document !== "object") return null;
  const category = (document as { category?: RefLike }).category;
  return typeof category?._ref === "string" ? category._ref : null;
}

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.uk",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "reference",
      to: [{ type: "subcategory" }],
      description:
        "Select a Category first. Shows only subcategories of that category. Leave empty when the product belongs only to Sale.",
      hidden: ({ document }) => Boolean(document?.inSaleSection),
      readOnly: ({ document }) => !categoryRefFromDocument(document),
      components: {
        input: ProductSubcategoryInput,
      },
      options: {
        filter: ({ document }) => {
          const categoryId = categoryRefFromDocument(document);
          if (!categoryId) {
            return {
              filter: "_id in $none",
              params: { none: [] as string[] },
            };
          }

          return {
            filter: "category._ref in $categoryIds",
            params: {
              categoryIds: referenceIds(categoryId),
            },
          };
        },
      },
      validation: (rule) =>
        rule.custom(async (value, context) => {
          const reference = value as Reference | undefined;
          const subcategoryId =
            typeof reference?._ref === "string" ? reference._ref : null;

          // Sale products may omit subcategory; empty is always allowed.
          if (!subcategoryId) return true;

          const categoryId = categoryRefFromDocument(context.document);
          if (!categoryId) {
            return "Select a Category before choosing a Subcategory.";
          }

          const getClient = context.getClient;
          if (typeof getClient !== "function") {
            return "Unable to validate Subcategory against Category.";
          }

          const client = getClient({ apiVersion: STUDIO_API_VERSION });
          const matches = await client.fetch<number>(
            `count(*[
              _type == "subcategory" &&
              _id in $subcategoryIds &&
              category._ref in $categoryIds
            ])`,
            {
              subcategoryIds: referenceIds(subcategoryId),
              categoryIds: referenceIds(categoryId),
            },
          );

          if (matches > 0) return true;

          return "Subcategory must belong to the selected Category.";
        }),
    }),
    defineField({
      name: "inSaleSection",
      title: "Place in Sale section",
      type: "boolean",
      initialValue: false,
      description:
        "Catalog placement in «Розпродаж». Not the same as having a discounted price. Sale products are not listed in regular subcategories.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "localeString",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      validation: (rule) => rule.custom(validateProductDescription),
    }),
    defineField({
      name: "variants",
      title: "Size / price variants",
      type: "array",
      of: [{ type: "productVariant" }],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      of: [{ type: "productSpec" }],
    }),
    defineField({
      name: "compareAtPrice",
      title: "Legacy compare-at price (UAH)",
      type: "number",
      description:
        "Deprecated: prefer compare-at price on each variant. Kept for older documents.",
      deprecated: {
        reason: "Use variant.compareAtPrice instead",
      },
      // Hidden from editors; field retained so existing documents keep data
      // and catalog fallback (product.compareAtPrice) still works.
      hidden: true,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title.uk",
      media: "gallery.0",
      inSaleSection: "inSaleSection",
      categoryTitle: "category.title.uk",
    },
    prepare({ title, media, inSaleSection, categoryTitle }) {
      return {
        title: title || "Product",
        subtitle: [categoryTitle, inSaleSection ? "Sale section" : null]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
