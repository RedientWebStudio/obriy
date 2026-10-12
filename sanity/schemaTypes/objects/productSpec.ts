import { defineField, defineType } from "sanity";

export const productSpec = defineType({
  name: "productSpec",
  title: "Specification",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      label: "label.uk",
      value: "value.uk",
    },
    prepare({ label, value }) {
      return {
        title: label || "Spec",
        subtitle: value,
      };
    },
  },
});
