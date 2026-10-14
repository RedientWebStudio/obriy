import { setRequestLocale } from "next-intl/server";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { Footer } from "@/components/layout/Footer";

export const instant = false;

type Props = {
  params: Promise<{ locale: string }>;
};

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
