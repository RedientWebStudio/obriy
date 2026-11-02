import { defineField, defineType } from "sanity";

/**
 * Ukrainian text object. Kept as object type (field `uk`) so existing
 * Sanity documents are not rewritten or deleted; English `en` values may
 * remain in stored JSON but are no longer editable in Studio.
 */
export const localeText = defineType({
  name: "localeText",
  title: "Текст",
  type: "object",
  fields: [
    defineField({
      name: "uk",
      title: "Українська",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
});
