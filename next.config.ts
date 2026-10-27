import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * LAN phone / tablet testing: Next.js blocks cross-origin `/_next/*` (HMR /
 * webpack) unless the host is listed. Without this, SSR HTML paints but React
 * never hydrates — Burger, dropdowns, and other client handlers stay dead.
 * Update the IP when DHCP reassigns it (see terminal warning).
 */
const lanDevOrigins = [
  "10.127.45.173",
  ...(process.env.ALLOWED_DEV_ORIGINS?.split(/[\s,]+/).filter(Boolean) ?? []),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: lanDevOrigins,
  /*
    When the desktop browser is on localhost but phones use the LAN IP,
    product Share must copy the LAN origin — Telegram ignores localhost URLs
    (plain text, not a tappable link). Overridable via NEXT_PUBLIC_SITE_URL.
  */
  env: {
    NEXT_PUBLIC_DEV_LAN_HOST: lanDevOrigins[0] ?? "",
  },
  cacheComponents: true,
  partialPrefetching: true,
  /*
    Dev-only: Next 16.4 default React debug channel can throw
    "Cannot write to a CLOSED writable stream" on soft navigations
    (e.g. Home → Catalog on a LAN phone) and flash the error overlay.
    Debug info still arrives via the main RSC stream when this is off.
  */
  experimental: {
    reactDebugChannel: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
