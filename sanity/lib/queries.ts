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
