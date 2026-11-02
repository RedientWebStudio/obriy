import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Own `<html>` / `<body>` because the root layout is a pass-through
 * (locale routes own theirs in `app/[locale]/layout.tsx`).
 *
 * This route only redirects (or shows a config hint) to the standalone
 * Sanity Studio — it does not mount NextStudio.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
