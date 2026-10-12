type Props = {
  className?: string;
};

/** Brand accent — Figma 60 × 2 */
export function AccentBar({ className = "" }: Props) {
  const classes = className
    ? `accent-bar ${className}`
    : "accent-bar";

  return <div className={classes} aria-hidden="true" />;
}
