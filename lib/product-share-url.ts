/**
 * Product Share / deep-link URL helpers.
 *
 * Messengers (Telegram) often:
 * - ignore or truncate the `#fragment` when linkifying pasted text
 * - do not turn `localhost` / `127.0.0.1` into a tappable link
 *
 * Phone QA hits the LAN IP; Desktop often uses localhost — Share must rewrite
 * loopback → LAN host so Telegram gets the same kind of URL as the phone.
 */

export const PRODUCT_SHARE_QUERY = "product";

function isLoopbackHostname(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

/** Resolve absolute origin used when copying / sharing a product link. */
export function getProductShareOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      /* fall through */
    }
  }

  if (typeof window === "undefined") return "";

  const { protocol, hostname, port, origin } = window.location;

  // Desktop localhost → same LAN host phones already use (see next.config).
  if (isLoopbackHostname(hostname)) {
    const lanHost = process.env.NEXT_PUBLIC_DEV_LAN_HOST?.trim();
    if (lanHost && !isLoopbackHostname(lanHost)) {
      const portPart = port ? `:${port}` : "";
      return `${protocol}//${lanHost}${portPart}`;
    }
  }

  return origin;
}

/**
 * Absolute product URL for Share / clipboard.
 * Uses `?product=` (Telegram-safe) and `#product-…` (in-page anchor).
 */
export function buildProductShareUrl(
  locale: string,
  categorySlug: string,
  anchorId: string,
): string {
  const origin = getProductShareOrigin() || window.location.origin;
  const url = new URL(
    `/${locale}/catalog/${encodeURIComponent(categorySlug)}`,
    origin.endsWith("/") ? origin : `${origin}/`,
  );
  url.searchParams.set(PRODUCT_SHARE_QUERY, anchorId);
  url.hash = anchorId;
  return url.href;
}

/** Product id from hash or `?product=` (Share / Telegram-safe). */
export function readProductDeepLinkId(
  search = typeof window !== "undefined" ? window.location.search : "",
  hash = typeof window !== "undefined" ? window.location.hash : "",
): string | null {
  if (hash) {
    const fromHash = decodeURIComponent(hash.replace(/^#/, "")).trim();
    if (fromHash.startsWith("product-")) return fromHash;
  }

  const fromQuery = new URLSearchParams(search).get(PRODUCT_SHARE_QUERY)?.trim();
  if (fromQuery?.startsWith("product-")) return fromQuery;

  return null;
}
