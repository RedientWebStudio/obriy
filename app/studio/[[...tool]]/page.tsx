import type { Metadata } from "next";
import { redirect } from "next/navigation";

/**
 * Studio is NOT embedded in Next.js. Embedding NextStudio under App Router
 * (especially with cacheComponents) shares the browser History API with
 * Sanity's SPA router and causes Maximum update depth /
 * recursiveTraverseMutationEffects during desk navigation, gallery edits,
 * and publish.
 *
 * Editors run `npm run studio` (Vite on :3333) or a deployed *.sanity.studio.
 * This route only preserves old /studio bookmarks via redirect.
 */
export const instant = false;

export const metadata: Metadata = {
  title: "OBRIY Studio",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ tool?: string[] }>;
};

function resolveStudioOrigin(): string | null {
  const configured = process.env.NEXT_PUBLIC_STUDIO_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3333";
  }
  return null;
}

export default async function StudioRedirectPage({ params }: Props) {
  const origin = resolveStudioOrigin();
  const { tool } = await params;
  const path = tool?.length ? `/${tool.join("/")}` : "";

  if (!origin) {
    return (
      <main
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "2.5rem 1.5rem",
          maxWidth: "36rem",
          lineHeight: 1.5,
          color: "#111",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
          Sanity Studio
        </h1>
        <p style={{ margin: "0 0 1rem" }}>
          Studio runs as a standalone Sanity app, not inside this Next.js
          site. Set <code>NEXT_PUBLIC_STUDIO_URL</code> to your deployed Studio
          URL (after <code>npm run studio:deploy</code>), or open the local
          Studio with <code>npm run studio</code>.
        </p>
      </main>
    );
  }

  redirect(`${origin}${path}`);
}
