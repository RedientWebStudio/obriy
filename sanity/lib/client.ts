import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Server-only Sanity client for the Next.js app.
 *
 * Public dataset: anonymous CDN reads of published documents only.
 * No API tokens here — never pass SANITY_API_WRITE_TOKEN (or any secret).
 * Do not import this module from Client Components.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
