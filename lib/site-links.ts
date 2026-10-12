/**
 * External site links. Leave empty until real URLs are provided —
 * empty values render as non-links (no invented placeholders).
 */
export const siteLinks = {
  social: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK?.trim() ?? "",
    telegram: process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM?.trim() ?? "",
    viber: process.env.NEXT_PUBLIC_SOCIAL_VIBER?.trim() ?? "",
  },
  studio: process.env.NEXT_PUBLIC_STUDIO_URL?.trim() ?? "",
} as const;
