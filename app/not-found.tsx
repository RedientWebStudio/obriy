import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";
/* Self-hosted — root not-found owns html/body (pass-through root layout). */
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/libre-baskerville/400.css";
import "./globals.css";

/** Cookie locale lookup — allow blocking prerender for `/_not-found`. */
export const instant = false;

type Locale = (typeof routing.locales)[number];

async function resolveLocale(): Promise<Locale> {
  const jar = await cookies();
  const fromCookie = jar.get("NEXT_LOCALE")?.value;
  if (fromCookie && routing.locales.includes(fromCookie as Locale)) {
    return fromCookie as Locale;
  }
  return routing.defaultLocale;
}

/**
 * Global not-found shell — used when no locale layout wraps the response
 * (e.g. invalid `[locale]`). Locale-matched 404s use `app/[locale]/not-found.tsx`.
 */
export default async function GlobalNotFound() {
  const locale = await resolveLocale();
  const messages = (await import(`../messages/${locale}.json`)).default
    .NotFoundPage as {
    code: string;
    title: string;
    description: string;
    cta: string;
  };
  const homeHref = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <main className="status-page">
          <div className="container">
            <div className="category-empty status-page-inner">
              <p className="status-page-brand">OBRIY</p>
              <p className="status-page-code">{messages.code}</p>
              <h1 className="category-empty-title">{messages.title}</h1>
              <p className="category-empty-lead">{messages.description}</p>
              <div className="status-page-action">
                <a href={homeHref} className="primary-button">
                  <span>{messages.cta}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/chevron-right.svg"
                    alt=""
                    width={6}
                    height={11}
                    className="primary-button-chevron"
                  />
                </a>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
