import type { Metadata } from "next";
import type { ReactNode } from "react";
/* Self-hosted — avoid next/font/google (SSL to fonts.googleapis.com fails on this host). */
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/libre-baskerville/400.css";
import { getSiteOrigin } from "@/lib/seo";
import "./globals.css";

type Props = {
  children: ReactNode;
};

/**
 * Pass-through root: `<html>` / `<body>` live in `app/[locale]/layout.tsx`
 * (locale `lang`) and `app/studio/layout.tsx` (admin). Avoids nesting and
 * keeps `getLocale()` out of the root so `/_not-found` can prerender.
 */
export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
};

export default function RootLayout({ children }: Props) {
  return children;
}
