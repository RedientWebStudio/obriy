import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Own `<html>` / `<body>` because the root layout is a pass-through
 * (locale routes own theirs in `app/[locale]/layout.tsx`).
 * Do not set id="sanity" — NextStudio already owns that id.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
