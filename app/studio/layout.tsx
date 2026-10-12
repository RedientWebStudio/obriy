import type { ReactNode } from "react";

/**
 * Do not render <html>/<body> here — only the root layout may own those tags.
 * Nested html/body breaks Studio hydration (black screen).
 * Do not set id="sanity" — NextStudio already owns that id.
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
