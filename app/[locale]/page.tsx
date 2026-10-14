import { setRequestLocale } from "next-intl/server";
import { AboutAdvantages } from "@/components/home/AboutAdvantages";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/layout/Footer";

export const instant = false;

type Props = {
  params: Promise<{ locale: string }>;
};

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
