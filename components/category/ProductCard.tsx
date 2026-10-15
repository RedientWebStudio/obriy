"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ProductGallery } from "@/components/category/ProductGallery";
import type { CategoryProduct } from "@/lib/category-types";
import { productAnchor } from "@/lib/assortment";
import { discountPercent, formatPriceUah } from "@/lib/format-price";
import { pickLocale } from "@/lib/locale";

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
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    try {
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      return copied;
    } catch {
      return false;
    }
  }
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
  const sizeRootRef = useRef<HTMLDivElement>(null);
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
    if (!sizeOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!sizeRootRef.current?.contains(event.target as Node)) {
        setSizeOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSizeOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sizeOpen]);

  const shareProduct = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${anchorId}`;
    const payload = { title, url };
    let canShare = false;
    try {
      canShare =
        typeof navigator.share === "function" &&
        (typeof navigator.canShare !== "function" ||
          navigator.canShare(payload));
    } catch {
      canShare = false;
    }

    if (canShare) {
      try {
        await navigator.share(payload);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    const copied = await copyShareUrl(url);
    if (!copied) return;

    setShareNote(labels.shareCopied);
    window.setTimeout(() => setShareNote(null), 2000);
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
        </div>
        {shareNote ? (
          <p className="product-card-share-note" role="status">
            {shareNote}
          </p>
        ) : null}

        {variant ? (
          <div className="product-card-meta">
            <div className="product-card-size-block" ref={sizeRootRef}>
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
                    <span className="product-card-caret" aria-hidden="true">
                      {sizeOpen ? "⌃" : "⌄"}
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
              <span className="product-card-caret" aria-hidden="true">
                {specsOpen ? "⌃" : "⌄"}
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
