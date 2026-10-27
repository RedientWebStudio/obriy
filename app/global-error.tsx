"use client";

import { useEffect, useState } from "react";
/* Self-hosted — match root layout; global-error replaces the root tree. */
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/libre-baskerville/400.css";
import "./globals.css";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const COPY = {
  uk: {
    title: "Щось пішло не так",
    description:
      "Сталася помилка під час завантаження сторінки. Спробуйте ще раз.",
    retry: "Спробувати знову",
  },
  en: {
    title: "Something went wrong",
    description: "An error occurred while loading this page. Please try again.",
    retry: "Try again",
  },
} as const;

export default function GlobalError({ reset }: Props) {
  const [locale, setLocale] = useState<"uk" | "en">("uk");

  useEffect(() => {
    const lang = document.documentElement.lang?.toLowerCase();
    if (lang?.startsWith("en")) {
      setLocale("en");
      return;
    }
    if (typeof navigator !== "undefined" && navigator.language.startsWith("en")) {
      setLocale("en");
    }
  }, []);

  const t = COPY[locale];

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <main className="status-page">
          <div className="container">
            <div className="category-empty status-page-inner">
              <p className="status-page-brand">OBRIY</p>
              <h1 className="category-empty-title">{t.title}</h1>
              <p className="category-empty-lead">{t.description}</p>
              <div className="status-page-action">
                <button type="button" className="primary-button" onClick={reset}>
                  <span>{t.retry}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/chevron-right.svg"
                    alt=""
                    width={6}
                    height={11}
                    className="primary-button-chevron"
                  />
                </button>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
