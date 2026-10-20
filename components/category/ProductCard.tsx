"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ProductGallery } from "@/components/category/ProductGallery";
import type { CategoryProduct } from "@/lib/category-types";
import { productAnchor } from "@/lib/assortment";
import { discountPercent, formatPriceUah } from "@/lib/format-price";
import { pickLocale } from "@/lib/locale";
import { buildProductShareUrl } from "@/lib/product-share-url";

export type ProductCardLabels = {
  size: string;
  price: string;
  specifications: string;
  photoPlaceholder: string;
  photoSingle: string;
  galleryPrev: string;
  galleryNext: string;
  share: string;
  shareCopied: string;
  more: string;
  less: string;
  fromPrefix: string;
  lightboxClose: string;
  lightboxLabel: string;
};

type Props = {
  product: CategoryProduct;
  categorySlug: string;
  locale: string;
  labels: ProductCardLabels;
};

async function copyShareUrl(url: string): Promise<boolean> {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      /* fall through to execCommand */
    }
  }

  try {
    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.setAttribute("aria-hidden", "true");
    field.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;";
    document.body.appendChild(field);
    field.focus();
    field.select();
    field.setSelectionRange(0, url.length);
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  } catch {
    return false;
  }
}

/**
 * Web Share sheet — for coarse / touch-first agents (phones, tablets).
 * Fine-pointer desktops often expose `navigator.share` too (Chrome/Edge), but
 * the OS sheet is a poor fit for “copy product link” and may share title text
 * instead of the URL. Prefer clipboard there (input modality, not User-Agent).
 */
function shouldOfferWebShare(): boolean {
  if (!window.isSecureContext || typeof navigator.share !== "function") {
    return false;
  }
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return false;
  }
  return true;
}

/**
 * Try the OS share sheet with URL-first payloads (never title-only text).
 * AbortError = user cancelled (not a failure).
 */
async function tryWebShare(url: string, title: string): Promise<"shared" | "abort" | "fail"> {
  if (!shouldOfferWebShare()) return "fail";

  // URL-first: desktop/OS targets that mishandle `text` won't copy the title alone.
  const attempts: ShareData[] = [{ url, title }, { url }];

  for (const data of attempts) {
    try {
      if (typeof navigator.canShare === "function" && !navigator.canShare(data)) {
        continue;
      }
      await navigator.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "abort";
      }
    }
  }
  return "fail";
}

export function ProductCard({
  product,
  categorySlug,
  locale,
  labels,
}: Props) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [shareNoteVisible, setShareNoteVisible] = useState(false);
  const shareHideTimerRef = useRef<number | null>(null);
  const shareClearTimerRef = useRef<number | null>(null);
  const sizeListId = useId();
  const specsId = useId();

  const anchorId = productAnchor(categorySlug, product.slug);
  const variant = product.variants[variantIndex] ?? product.variants[0];
  const title = pickLocale(product.title, locale);
  const description = product.description
    ? pickLocale(product.description, locale).trim()
    : "";
  const hasDescription = description.length > 0;
  const showDescToggle = description.length > 90;
  const hasSpecs = product.specs.length > 0;
  const multiSize = product.variants.length > 1;
  const compareAt = variant?.compareAtPrice;
  const hasDiscount =
    typeof compareAt === "number" &&
    typeof variant?.price === "number" &&
    compareAt > variant.price;
  const salePct = hasDiscount
    ? discountPercent(variant.price, compareAt)
    : 0;

  useEffect(() => {
    return () => {
      if (shareHideTimerRef.current !== null) {
        window.clearTimeout(shareHideTimerRef.current);
      }
      if (shareClearTimerRef.current !== null) {
        window.clearTimeout(shareClearTimerRef.current);
      }
    };
  }, []);

  const showCopiedNote = () => {
    if (shareHideTimerRef.current !== null) {
      window.clearTimeout(shareHideTimerRef.current);
    }
    if (shareClearTimerRef.current !== null) {
      window.clearTimeout(shareClearTimerRef.current);
    }

    setShareNote(labels.shareCopied);
    setShareNoteVisible(true);

    shareHideTimerRef.current = window.setTimeout(() => {
      setShareNoteVisible(false);
      shareClearTimerRef.current = window.setTimeout(() => {
        setShareNote(null);
        shareClearTimerRef.current = null;
      }, 200);
      shareHideTimerRef.current = null;
    }, 2000);
  };

  const shareProduct = async () => {
    const url = buildProductShareUrl(locale, categorySlug, anchorId);
    const outcome = await tryWebShare(url, title);
    // Shared OK, or user dismissed the sheet — never auto-copy after AbortError.
    if (outcome === "shared" || outcome === "abort") return;

    const copied = await copyShareUrl(url);
    if (!copied) return;
    showCopiedNote();
  };

  return (
    <article id={anchorId} className="product-card">
      <ProductGallery
        key={product.id}
        images={product.images}
        placeholderCount={product.placeholderCount}
        locale={locale}
        productTitle={title}
        labels={{
          photoPlaceholder: labels.photoPlaceholder,
          photoSingle: labels.photoSingle,
          galleryPrev: labels.galleryPrev,
          galleryNext: labels.galleryNext,
          lightboxClose: labels.lightboxClose,
          lightboxLabel: labels.lightboxLabel,
        }}
      />

      <div className="product-card-info">
        <div className="product-card-title-row">
          <h3 className="product-card-title">{title}</h3>
          <div className="product-card-share-wrap">
            <button
              type="button"
              className="product-card-share"
              aria-label={labels.share}
              onClick={() => {
                void shareProduct();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/share.svg" alt="" width={28} height={28} />
            </button>
            <p
              className={
                shareNoteVisible
                  ? "product-card-share-note is-visible"
                  : "product-card-share-note"
              }
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {shareNote ? (
                <>
                  <span className="product-card-share-check" aria-hidden="true">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 6.2L4.8 9L10 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{shareNote}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        {variant ? (
          <div className="product-card-meta">
            <div className="product-card-size-block">
              <span className="product-card-field-label">{labels.size}</span>
              {multiSize ? (
                <>
                  <button
                    type="button"
                    className="product-card-size-trigger"
                    aria-expanded={sizeOpen}
                    aria-controls={sizeListId}
                    aria-haspopup="listbox"
                    onClick={() => setSizeOpen((value) => !value)}
                  >
                    <span>{pickLocale(variant.sizeLabel, locale)}</span>
                    <span
                      className={
                        sizeOpen
                          ? "product-card-caret is-open"
                          : "product-card-caret"
                      }
                      aria-hidden="true"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/icons/chevron-down.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="product-card-caret-icon"
                      />
                    </span>
                  </button>
                  {sizeOpen ? (
                    <ul
                      id={sizeListId}
                      className="product-card-size-menu"
                      role="listbox"
                    >
                      {product.variants.map((option, index) => {
                        const selected = index === variantIndex;
                        return (
                          <li
                            key={`${pickLocale(option.sizeLabel, "uk")}-${index}`}
                            role="option"
                            aria-selected={selected}
                          >
                            <button
                              type="button"
                              className={
                                selected
                                  ? "product-card-size-option is-active"
                                  : "product-card-size-option"
                              }
                              onClick={() => {
                                setVariantIndex(index);
                                setSizeOpen(false);
                              }}
                            >
                              {pickLocale(option.sizeLabel, locale)}
                              {selected ? " ✓" : ""}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </>
              ) : (
                <p className="product-card-size-value">
                  {pickLocale(variant.sizeLabel, locale)}
                </p>
              )}
            </div>

            <div className="product-card-price-block">
              <span className="product-card-field-label">{labels.price}</span>
              {hasDiscount ? (
                <>
                  <p className="product-card-price">
                    {formatPriceUah(variant.price)}
                  </p>
                  <p className="product-card-sale-row">
                    <span className="product-card-compare">
                      {formatPriceUah(compareAt)}
                    </span>
                    {salePct > 0 ? (
                      <span className="product-card-discount">−{salePct}%</span>
                    ) : null}
                  </p>
                </>
              ) : multiSize ? (
                <p className="product-card-price">
                  {formatPriceUah(variant.price)}
                </p>
              ) : (
                <p className="product-card-price">
                  {`${labels.fromPrefix} ${formatPriceUah(variant.price)}`}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {hasDescription ? (
          <div className="product-card-desc-block">
            <p
              className={
                showDescToggle && !descExpanded
                  ? "product-card-desc is-clamped"
                  : "product-card-desc"
              }
            >
              {description}
            </p>
            {showDescToggle ? (
              <button
                type="button"
                className="product-card-desc-toggle"
                onClick={() => setDescExpanded((value) => !value)}
              >
                {descExpanded ? labels.less : labels.more}
              </button>
            ) : null}
          </div>
        ) : null}

        {hasSpecs ? (
          <div className="product-card-specs">
            <button
              type="button"
              className="product-card-specs-trigger"
              aria-expanded={specsOpen}
              aria-controls={specsId}
              onClick={() => setSpecsOpen((value) => !value)}
            >
              <span>{labels.specifications}</span>
              <span
                className={
                  specsOpen
                    ? "product-card-caret is-open"
                    : "product-card-caret"
                }
                aria-hidden="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/chevron-down.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="product-card-caret-icon"
                />
              </span>
            </button>
            {specsOpen ? (
              <div id={specsId} className="product-card-specs-panel">
                <dl className="product-card-specs-list">
                  {product.specs.map((spec) => (
                    <div
                      key={pickLocale(spec.label, "uk")}
                      className="product-card-spec-row"
                    >
                      <dt>{pickLocale(spec.label, locale)}</dt>
                      <dd>{pickLocale(spec.value, locale)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
