import { defineField, defineType } from "sanity";

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
      description: "Optional grouping within a category (e.g. Soft beds).",
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
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      validation: (rule) => rule.required(),
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
      name: "onSale",
      title: "On sale",
      type: "boolean",
      initialValue: false,
      description: "Global sale flag — not a subcategory.",
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare-at price (UAH)",
      type: "number",
      description: "Original price shown when on sale.",
      hidden: ({ document }) => !document?.onSale,
      validation: (rule) =>
        rule.custom((value, context) => {
          const onSale = (context.document as { onSale?: boolean } | undefined)
            ?.onSale;
          if (onSale && (typeof value !== "number" || value < 0)) {
            return "Compare-at price is required when product is on sale";
          }
          return true;
        }),
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
      onSale: "onSale",
      categoryTitle: "category.title.uk",
    },
    prepare({ title, media, onSale, categoryTitle }) {
      return {
        title: title || "Product",
        subtitle: [categoryTitle, onSale ? "Sale" : null]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
