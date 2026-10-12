import type { ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Use content-max (1296px) instead of full page-max (1440px). */
  narrow?: boolean;
};

export function Container({
  children,
  className = "",
  as: Tag = "div",
  narrow = false,
}: Props) {
  const base = narrow ? "container-narrow" : "container";
  const classes = className ? `${base} ${className}` : base;

  return <Tag className={classes}>{children}</Tag>;
}
