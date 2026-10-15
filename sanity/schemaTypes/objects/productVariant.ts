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
    defineField({
      name: "compareAtPrice",
      title: "Compare-at price (UAH)",
      type: "number",
      description:
        "Original price for this size when discounted. Optional — independent of Sale section placement.",
      validation: (rule) => rule.min(0),
    }),
  ],
  preview: {
    select: {
      size: "sizeLabel.uk",
      price: "price",
      compareAtPrice: "compareAtPrice",
    },
    prepare({ size, price, compareAtPrice }) {
      const priceLabel =
        typeof price === "number" ? `${price} ₴` : undefined;
      const discount =
        typeof compareAtPrice === "number" &&
        typeof price === "number" &&
        compareAtPrice > price
          ? ` (was ${compareAtPrice} ₴)`
          : "";
      return {
        title: size || "Variant",
        subtitle: priceLabel ? `${priceLabel}${discount}` : undefined,
      };
    },
  },
});
