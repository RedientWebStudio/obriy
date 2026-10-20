/**
 * Cold product deep-links (`#product-…`): suppress the browser's native hash
 * jump so StickyCategoryNav can perform a single offset-aware scroll.
 */

export const PRODUCT_HASH_PENDING_ATTR = "data-product-hash-pending";

/** Keeps bottom scroll room while a product hash is the active deep-link. */
export const PRODUCT_DEEP_LINK_ATTR = "data-product-deep-link";

/** True when the URL hash targets a product card (`#product-…`). */
export function isProductHash(rawHash = ""): boolean {
  const hash = rawHash.startsWith("#") ? rawHash : `#${rawHash}`;
  return /^#product-/.test(hash);
}

/**
 * Inline boot — must run from `<head>` before the target node is parsed so
 * native hash scrolling never paints an approximate position.
 * Also arms for `?product=product-…` (Share links for Telegram etc.).
 */
export const PRODUCT_HASH_BOOT_SCRIPT = `(function(){try{var h=location.hash||"";var q=(new URLSearchParams(location.search)).get("product")||"";var product=h.indexOf("#product-")===0||(q.indexOf("product-")===0);if(!product)return;if("scrollRestoration" in history)history.scrollRestoration="manual";var de=document.documentElement;de.setAttribute("${PRODUCT_HASH_PENDING_ATTR}","");de.setAttribute("${PRODUCT_DEEP_LINK_ATTR}","");de.style.overflow="hidden";de.style.height="100%";function pin(){if(!de.hasAttribute("${PRODUCT_HASH_PENDING_ATTR}"))return;if(window.scrollY||window.pageYOffset)window.scrollTo(0,0);}pin();window.addEventListener("scroll",pin,{passive:true,capture:true});document.addEventListener("DOMContentLoaded",pin);window.addEventListener("load",pin);}catch(e){}})();`;

/** Allow programmatic scrolling after the product card is ready. */
export function releaseProductHashHold(): void {
  if (typeof document === "undefined") return;
  const de = document.documentElement;
  de.removeAttribute(PRODUCT_HASH_PENDING_ATTR);
  if (de.style.overflow === "hidden") de.style.overflow = "";
  if (de.style.height === "100%") de.style.height = "";
}

/** Toggle extra bottom padding used to align the last product under Sticky Nav. */
export function setProductDeepLinkActive(active: boolean): void {
  if (typeof document === "undefined") return;
  if (active) {
    document.documentElement.setAttribute(PRODUCT_DEEP_LINK_ATTR, "");
  } else {
    document.documentElement.removeAttribute(PRODUCT_DEEP_LINK_ATTR);
  }
}

export function isProductHashHoldActive(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.hasAttribute(PRODUCT_HASH_PENDING_ATTR);
}
