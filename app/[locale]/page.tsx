import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutAdvantages } from "@/components/home/AboutAdvantages";
import { Hero } from "@/components/home/Hero";
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
    href: "/",
    title: t("home.title"),
    description: t("home.description"),
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <main>
        <Hero />
        <AboutAdvantages />
      </main>
      <Footer />
    </>
  );
}
