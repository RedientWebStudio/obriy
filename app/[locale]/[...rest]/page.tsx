import { notFound, redirect } from "next/navigation";

/** Catch-all only redirects or 404s — no useful instant shell. */
export const instant = false;

type Props = {
  params: Promise<{ locale: string; rest: string[] }>;
};

/**
 * Catch unknown locale routes (e.g. `/en/unknown`) so Next.js renders
 * `app/[locale]/not-found.tsx` instead of the root not-found shell.
 *
 * Legacy `/[locale]/studio` bookmarks: send them to `/studio`, which
 * redirects to the standalone Sanity Studio (Vite / *.sanity.studio).
 */
export default async function LocaleCatchAll({ params }: Props) {
  const { rest } = await params;

  if (rest[0] === "studio") {
    const suffix = rest.slice(1).join("/");
    redirect(suffix ? `/studio/${suffix}` : "/studio");
  }

  notFound();
}
