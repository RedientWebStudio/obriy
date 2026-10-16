"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { CategoryImage } from "@/lib/category-types";
import { pickLocale } from "@/lib/locale";

type Labels = {
  photoPlaceholder: string;
  photoSingle: string;
  galleryPrev: string;
  galleryNext: string;
  lightboxClose: string;
  lightboxLabel: string;
};

type Props = {
  images: CategoryImage[];
  placeholderCount?: number;
  locale: string;
  labels: Labels;
  productTitle: string;
};

const SWIPE_THRESHOLD_PX = 48;

export function ProductGallery({
  images,
  placeholderCount = 1,
  locale,
  labels,
  productTitle,
}: Props) {
  const count = images.length > 0 ? images.length : Math.max(1, placeholderCount);
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const swipeRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    active: boolean;
  } | null>(null);
  const titleId = useId();
  const hasRealImages = images.length > 0;
  const safeIndex = count > 0 ? ((index % count) + count) % count : 0;
  const current = images[safeIndex];

  useEffect(() => {
    if (lightboxOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
      return;
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      openButtonRef.current?.focus();
    }
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setLightboxOpen(false);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((currentIndex) => (currentIndex - 1 + count) % count);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((currentIndex) => (currentIndex + 1) % count);
      }
    };

    const html = document.documentElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;
    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, count]);

  const go = (delta: number) => {
    if (count <= 1) return;
    setIndex((currentIndex) => (currentIndex + delta + count) % count);
  };

  const onStagePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    if ((event.target as HTMLElement).closest(".product-lightbox-nav")) return;

    swipeRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      active: true,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const endSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start?.active || start.pointerId !== event.pointerId) return;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (Math.abs(dx) <= Math.abs(dy)) return;

    go(dx < 0 ? 1 : -1);
  };

  const cancelSwipe = () => {
    swipeRef.current = null;
  };

  return (
    <div className="product-card-gallery">
      <button
        ref={openButtonRef}
        type="button"
        className={
          hasRealImages
            ? "product-card-media-button has-image"
            : "product-card-media-button"
        }
        onClick={() => setLightboxOpen(true)}
        aria-label={labels.lightboxLabel}
      >
        {hasRealImages && current ? (
          <Image
            src={current.src}
            alt={pickLocale(current.alt, locale) || productTitle}
            fill
            sizes="(min-width: 1024px) 590px, 48vw"
            className="product-card-media-image"
            loading="lazy"
          />
        ) : (
          <div
            className="product-card-media"
            style={{
              backgroundColor:
                safeIndex % 2 === 0
                  ? "var(--product-placeholder-a)"
                  : "var(--product-placeholder-b)",
            }}
          >
            <span className="product-card-media-label">
              {labels.photoPlaceholder}
            </span>
          </div>
        )}
      </button>

      {count > 1 ? (
        <div className="product-card-gallery-controls">
          <button
            type="button"
            className="product-card-gallery-btn"
            aria-label={labels.galleryPrev}
            onClick={() => go(-1)}
          >
            ←
          </button>
          <span className="product-card-gallery-count">
            {safeIndex + 1} / {count}
          </span>
          <button
            type="button"
            className="product-card-gallery-btn"
            aria-label={labels.galleryNext}
            onClick={() => go(1)}
          >
            →
          </button>
        </div>
      ) : (
        <p className="product-card-gallery-single">{labels.photoSingle}</p>
      )}

      {lightboxOpen ? (
        <div
          className="product-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="product-lightbox-backdrop"
            aria-label={labels.lightboxClose}
            onClick={() => setLightboxOpen(false)}
          />
          <div
            className="product-lightbox-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-lightbox-header">
              <p id={titleId} className="product-lightbox-title">
                {productTitle}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                className="product-lightbox-close"
                aria-label={labels.lightboxClose}
                onClick={() => setLightboxOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div
              className={
                count > 1
                  ? "product-lightbox-viewer has-nav"
                  : "product-lightbox-viewer"
              }
            >
              {count > 1 ? (
                <button
                  type="button"
                  className="product-lightbox-nav product-lightbox-nav--prev"
                  aria-label={labels.galleryPrev}
                  onClick={(event) => {
                    event.stopPropagation();
                    go(-1);
                  }}
                >
                  <span aria-hidden="true">←</span>
                </button>
              ) : null}

              <div
                className="product-lightbox-stage"
                onPointerDown={onStagePointerDown}
                onPointerUp={endSwipe}
                onPointerCancel={cancelSwipe}
              >
                {hasRealImages && current ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.src}
                    alt={pickLocale(current.alt, locale) || productTitle}
                    className="product-lightbox-image"
                    draggable={false}
                  />
                ) : (
                  <div className="product-lightbox-placeholder">
                    {labels.photoPlaceholder}
                  </div>
                )}
              </div>

              {count > 1 ? (
                <button
                  type="button"
                  className="product-lightbox-nav product-lightbox-nav--next"
                  aria-label={labels.galleryNext}
                  onClick={(event) => {
                    event.stopPropagation();
                    go(1);
                  }}
                >
                  <span aria-hidden="true">→</span>
                </button>
              ) : null}
            </div>

            {count > 1 ? (
              <div className="product-lightbox-controls">
                <span>
                  {safeIndex + 1} / {count}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
