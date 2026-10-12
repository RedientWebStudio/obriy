import { defineField, defineType } from "sanity";

export const productVariant = defineType({
  name: "productVariant",
  title: "Product variant",
  type: "object",
  fields: [
    defineField({
      name: "sizeLabel",
      title: "Size label",
      type: "localeString",
      description: 'e.g. "160 × 200 см"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (UAH)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      size: "sizeLabel.uk",
      price: "price",
    },
    prepare({ size, price }) {
      return {
        title: size || "Variant",
        subtitle: typeof price === "number" ? `${price} ₴` : undefined,
      };
    },
  },
});
