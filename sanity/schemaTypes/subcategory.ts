import { defineField, defineType } from "sanity";

export const subcategory = defineType({
  name: "subcategory",
  title: "Subcategory",
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
      description:
        "Stable id within the parent category. For dual categories use unique slugs (e.g. chairs-office).",
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "localeText",
    }),
    defineField({
      name: "category",
      title: "Parent category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "groupKey",
      title: "Group key",
      type: "string",
      description:
        'Optional dual-category group id (e.g. "armchairs", "chairs"). Leave empty for flat categories.',
    }),
    defineField({
      name: "groupTitle",
      title: "Group title",
      type: "localeString",
      description: "Display title for the group in Studio / navigation.",
      hidden: ({ parent }) => !parent?.groupKey,
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
  orderings: [
    {
      title: "Sort order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title.uk",
      categoryTitle: "category.title.uk",
      groupTitle: "groupTitle.uk",
      groupKey: "groupKey",
    },
    prepare({ title, categoryTitle, groupTitle, groupKey }) {
      const group = groupTitle || groupKey;
      return {
        title: title || "Subcategory",
        subtitle: [categoryTitle, group].filter(Boolean).join(" · "),
      };
    },
  },
});
