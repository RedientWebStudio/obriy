export type LocaleField = { uk: string; en: string };

export function pickLocale(field: LocaleField, locale: string): string {
  return locale === "en" ? field.en : field.uk;
}
