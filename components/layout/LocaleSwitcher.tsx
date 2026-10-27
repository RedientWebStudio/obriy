"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { captureLocaleScrollAnchor } from "@/lib/locale-scroll-preserve";

type AppLocale = (typeof routing.locales)[number];

const localeLabelKey = {
  uk: "localeUk",
  en: "localeEn",
} as const;

function otherLocale(locale: string): AppLocale {
  return locale === "uk" ? "en" : "uk";
}

/** Guard against a transient pathname that still includes `/uk` or `/en`. */
function pathWithoutLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/(uk|en)(?=\/|$)/, "");
  return stripped.length > 0 ? stripped : "/";
}

export function LocaleSwitcher() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = otherLocale(locale);
  const href = pathWithoutLocale(pathname);
  // localePrefix: as-needed — default `uk` has no prefix.
  const fallbackHref =
    nextLocale === routing.defaultLocale
      ? href
      : `/${nextLocale}${href === "/" ? "" : href}`;

  return (
    <a
      href={fallbackHref}
      className="locale-switcher"
      aria-label={t("switchToLocale", {
        locale: t(localeLabelKey[nextLocale]),
      })}
      hrefLang={nextLocale}
      onClick={(event) => {
        event.preventDefault();
        const onCategory = Boolean(
          document.querySelector(".category-page .product-card[id]"),
        );
        if (onCategory) captureLocaleScrollAnchor();
        // scroll: false — we restore relative to the captured product ourselves.
        router.replace(href, { locale: nextLocale, scroll: false });
      }}
    >
      <span
        className={
          locale === "uk" ? "locale-label is-active" : "locale-label"
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
          locale === "en" ? "locale-label is-active" : "locale-label"
        }
        aria-hidden="true"
      >
        {t("localeEn")}
      </span>
    </a>
  );
}
