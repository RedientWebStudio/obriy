"use client";

/* Self-hosted — match root layout; global-error replaces the root tree. */
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/libre-baskerville/400.css";
import "./globals.css";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: Props) {
  return (
    <html lang="uk" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <main className="status-page">
          <div className="container">
            <div className="category-empty status-page-inner">
              <p className="status-page-brand">OBRIY</p>
              <h1 className="category-empty-title">Щось пішло не так</h1>
              <p className="category-empty-lead">
                Сталася помилка під час завантаження сторінки. Спробуйте ще раз.
              </p>
              <div className="status-page-action">
                <button type="button" className="primary-button" onClick={reset}>
                  <span>Спробувати знову</span>
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
