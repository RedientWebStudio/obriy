"use client";

type Props = {
  label: string;
  scrollLabel: string;
};

export function HeaderLogo({ label, scrollLabel }: Props) {
  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className="header-logo"
      aria-label={scrollLabel}
      onClick={scrollToTop}
    >
      {label}
    </button>
  );
}
