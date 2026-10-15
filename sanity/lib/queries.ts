import { defineQuery } from "next-sanity";

export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category" && published == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    order
  }`,
);

export const PRODUCTS_COUNT_QUERY = defineQuery(
  `count(*[_type == "product" && published == true])`,
);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(
  `*[_type == "category" && slug.current == $slug && published == true][0] {
    _id,
    title,
    "slug": slug.current,
    order
  }`,
);

export const SUBCATEGORIES_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "subcategory" && category->slug.current == $categorySlug && published == true] | order(order asc) {
    _id,
    title,
    intro,
    "slug": slug.current,
    groupKey,
    groupTitle,
    order
  }`,
);

export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "product" && category->slug.current == $categorySlug && published == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    gallery[]{
      ...,
      asset,
      alt
    },
    variants[]{ sizeLabel, price, compareAtPrice },
    specs[]{ label, value },
    inSaleSection,
    compareAtPrice,
    "subcategorySlug": subcategory->slug.current,
    order
  }`,
);
