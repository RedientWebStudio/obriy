"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type AppLocale = (typeof routing.locales)[number];

const localeLabelKey = {
  uk: "localeUk",
  en: "localeEn",
} as const;

function otherLocale(locale: string): AppLocale {
  return locale === "uk" ? "en" : "uk";
}

export function LocaleSwitcher() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const nextLocale = otherLocale(locale);

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      scroll={false}
      className="locale-switcher"
      aria-label={t("switchToLocale", {
        locale: t(localeLabelKey[nextLocale]),
      })}
    >
      <span
        className={
          locale === "uk"
            ? "locale-label is-active"
            : "locale-label"
        }
        aria-hidden="true"
      >
        {t("localeUk")}
      </span>
      <span className="locale-sep" aria-hidden="true">
        |
      </span>
      <span
        className={
          locale === "en"
            ? "locale-label is-active"
            : "locale-label"
        }
        aria-hidden="true"
      >
        {t("localeEn")}
      </span>
    </Link>
  );
}
