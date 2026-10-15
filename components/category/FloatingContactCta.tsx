"use client";

import { Link } from "@/i18n/navigation";

type Props = {
  label: string;
};

export function FloatingContactCta({ label }: Props) {
  return (
    <Link href="/contacts" className="category-floating-cta">
      <span className="category-floating-cta-label">{label}</span>
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
