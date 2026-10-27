import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { routing } from "@/i18n/routing";
import { PRODUCT_HASH_BOOT_SCRIPT } from "@/lib/product-hash-boot";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>
      {/* Sync head boot — must run before `#product-…` nodes are parsed.
          suppressHydrationWarning: boot may set data-product-* / overflow on
          <html> before React hydrates (same pattern as theme scripts). */}
      <head>
        <script
          id="obriy-product-hash-boot"
          dangerouslySetInnerHTML={{ __html: PRODUCT_HASH_BOOT_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
