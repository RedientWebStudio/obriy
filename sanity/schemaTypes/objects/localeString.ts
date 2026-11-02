import { defineField, defineType } from "sanity";

/**
 * Ukrainian text object. Kept as object type (field `uk`) so existing
 * Sanity documents are not rewritten or deleted; English `en` values may
 * remain in stored JSON but are no longer editable in Studio.
 */
export const localeString = defineType({
  name: "localeString",
  title: "Текст",
  type: "object",
  fields: [
    defineField({
      name: "uk",
      title: "Українська",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});
