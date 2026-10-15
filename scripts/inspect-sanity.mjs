import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-08-19",
  useCdn: false,
  token: env.SANITY_API_WRITE_TOKEN,
});

const [categories, subcategories, products, categoryDocs] = await Promise.all([
  client.fetch("count(*[_type == 'category'])"),
  client.fetch("count(*[_type == 'subcategory'])"),
  client.fetch("count(*[_type == 'product'])"),
  client.fetch(
    `*[_type == "category"]{ title, "slug": slug.current, order } | order(order asc)`,
  ),
]);

console.log(
  JSON.stringify({ categories, subcategories, products, categoryDocs }, null, 2),
);
