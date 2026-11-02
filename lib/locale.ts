/**
 * Content string type used across catalog / contacts.
 * Sanity still stores `{ uk, en? }` objects; callers normalize via `ukText`.
 */
export type LocaleField = string;

/** Read Ukrainian text from a plain string or legacy Sanity locale object. */
export function ukText(
  value: string | { uk?: string; en?: string } | null | undefined,
  fallback = "",
): string {
  if (typeof value === "string") return value;
  return value?.uk?.trim() || fallback;
}

/** @deprecated Use the string directly — site is Ukrainian-only. */
export function pickLocale(
  field: LocaleField | { uk?: string; en?: string },
  _locale?: string,
): string {
  return ukText(field);
}
