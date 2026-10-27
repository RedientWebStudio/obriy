import { notFound } from "next/navigation";

/**
 * Catch unknown locale routes (e.g. `/en/unknown`) so Next.js renders
 * `app/[locale]/not-found.tsx` instead of the root not-found shell.
 */
export default function LocaleCatchAll() {
  notFound();
}
