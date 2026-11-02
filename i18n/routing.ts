import { defineRouting } from "next-intl/routing";

/** Single-locale site: Ukrainian only, no URL prefix. */
export const routing = defineRouting({
  locales: ["uk"],
  defaultLocale: "uk",
  localePrefix: "never",
});
