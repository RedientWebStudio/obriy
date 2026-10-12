"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabelKey = {
  uk: "localeUk",
  en: "localeEn",
} as const;

export function LocaleSwitcher() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className="locale-switcher"
      role="navigation"
      aria-label={t("languageLabel")}
    >
      {routing.locales.map((loc, index) => {
        const label = t(localeLabelKey[loc]);
        const isActive = loc === locale;

        return (
          <Fragment key={loc}>
            {index > 0 ? (
              <span className="locale-sep" aria-hidden="true">
                |
              </span>
            ) : null}
            {isActive ? (
              <span className="locale-active" aria-current="true">
                {label}
              </span>
            ) : (
              <Link
                href={pathname}
                locale={loc}
                scroll={false}
                className="locale-link"
              >
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
