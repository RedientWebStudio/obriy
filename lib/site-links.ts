/**
 * External site links. Messenger URLs are the single source for
 * Contacts and the full footer. Optional env values override them.
 */
const TELEGRAM_URL = "https://t.me/Vitaliia_11";
const VIBER_URL = "viber://chat?number=%2B380967422184";

export const siteLinks = {
  social: {
    telegram:
      process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM?.trim() || TELEGRAM_URL,
    viber: process.env.NEXT_PUBLIC_SOCIAL_VIBER?.trim() || VIBER_URL,
  },
  studio: process.env.NEXT_PUBLIC_STUDIO_URL?.trim() ?? "",
} as const;

/** HTTPS links open in a new tab. App URIs such as viber:// stay in-place. */
export function externalLinkProps(
  href: string,
): { target: "_blank"; rel: "noopener noreferrer" } | Record<string, never> {
  if (/^https?:\/\//i.test(href)) {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  return {};
}
