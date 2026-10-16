"use client";

import { Link } from "@/i18n/navigation";
import en from "@/messages/en.json";
import uk from "@/messages/uk.json";

type Props = {
  label: string;
};

/** Both locales — outer size follows the longest label, not the active one. */
const CTA_SIZING_LABELS = [
  en.CategoryPage.floatingCta,
  uk.CategoryPage.floatingCta,
] as const;

export function FloatingContactCta({ label }: Props) {
  return (
    <Link href="/contacts" className="category-floating-cta">
      <span className="category-floating-cta-label-slot">
        <span className="category-floating-cta-sizer" aria-hidden="true">
          {CTA_SIZING_LABELS.map((entry) => (
            <span key={entry} className="category-floating-cta-label">
              {entry}
            </span>
          ))}
        </span>
        <span className="category-floating-cta-label">{label}</span>
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/cta-arrow.svg"
        alt=""
        width={11}
        height={8}
        className="category-floating-cta-arrow"
      />
    </Link>
  );
}
