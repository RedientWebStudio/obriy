import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

/**
 * Prefer Studio-prefixed env (Vite / `sanity deploy`), then Next public env.
 * Fallbacks match `sanity.cli.ts` — projectId/dataset are public identifiers.
 */
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "qu60lpod";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  "2025-08-19";

/**
 * Standalone Studio config (Vite via `sanity dev` / `sanity deploy`).
 * Not loaded by the Next.js App Router — that avoids dual History API
 * ownership with Next 16 cacheComponents.
 */
export default defineConfig({
  name: "obriy",
  title: "OBRIY",
  projectId,
  dataset,
  basePath: "/",
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});
