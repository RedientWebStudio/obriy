import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function PrimaryButton({ href, children, className = "" }: Props) {
  const classes = className
    ? `primary-button ${className}`
    : "primary-button";

  return (
    <Link href={href} className={classes}>
      <span>{children}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/chevron-right.svg"
        alt=""
        width={6}
        height={11}
        className="primary-button-chevron"
      />
    </Link>
  );
}
