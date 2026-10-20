import type { ReactNode } from "react";
/* Self-hosted — avoid next/font/google (SSL to fonts.googleapis.com fails on this host). */
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/libre-baskerville/400.css";
import { PRODUCT_HASH_BOOT_SCRIPT } from "@/lib/product-hash-boot";
import "./globals.css";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="uk" className="h-full antialiased" suppressHydrationWarning>
      {/* Sync head boot — must run before `#product-…` nodes are parsed.
          suppressHydrationWarning: boot may set data-product-* / overflow on
          <html> before React hydrates (same pattern as theme scripts). */}
      <head>
        <script
          id="obriy-product-hash-boot"
          dangerouslySetInnerHTML={{ __html: PRODUCT_HASH_BOOT_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
