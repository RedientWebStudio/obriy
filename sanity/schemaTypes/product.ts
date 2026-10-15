import { defineField, defineType } from "sanity";

const PRODUCT_DESCRIPTION_MAX = 250;

type ProductDescriptionValue = {
  uk?: string;
  en?: string;
} | null;

/** Character limit for product.description only — not shared localeText. */
export function validateProductDescription(
  value: ProductDescriptionValue | undefined,
): true | string {
  const uk = typeof value?.uk === "string" ? value.uk : "";
  const en = typeof value?.en === "string" ? value.en : "";
  const tooLong: string[] = [];

  if (uk.length > PRODUCT_DESCRIPTION_MAX) {
    tooLong.push(`Ukrainian is ${uk.length} characters`);
  }
  if (en.length > PRODUCT_DESCRIPTION_MAX) {
    tooLong.push(`English is ${en.length} characters`);
  }

  if (tooLong.length === 0) return true;

  return `Description must be ${PRODUCT_DESCRIPTION_MAX} characters or fewer, including spaces. ${tooLong.join(". ")}.`;
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
        "Regular subcategory placement. Leave empty when the product belongs only to Sale.",
      hidden: ({ document }) => Boolean(document?.inSaleSection),
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
