import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "qu60lpod";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-08-19";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const result = await client.fetch(`{
  "projectId": $projectId,
  "dataset": $dataset,
  "categories": count(*[_type == "category"]),
  "products": count(*[_type == "product"]),
  "publishedCategories": count(*[_type == "category" && published == true]),
  "publishedProducts": count(*[_type == "product" && published == true])
}`, { projectId, dataset });

console.log(JSON.stringify(result, null, 2));
