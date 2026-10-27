import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { Footer } from "@/components/layout/Footer";
import { buildPageMetadata } from "@/lib/seo";

export const instant = false;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Meta" });

  return buildPageMetadata({
    locale,
    href: "/catalog",
    title: t("catalog.title"),
    description: t("catalog.description"),
  });
}

export default async function CatalogRoutePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CatalogPage />
      <Footer variant="compact" />
    </>
  );
}
