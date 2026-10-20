import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export async function Hero() {
  const t = await getTranslations("HomePage.hero");
  const locale = await getLocale();

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <Image
        src="/images/home/hero.png"
        alt={t("imageAlt")}
        fill
        priority
        sizes="100vw"
        className="hero-image"
      />
      <div className="hero-tonal" aria-hidden="true" />

      {/*
        Absolute tops: Mobile Figma 80:7 (100 / 142 / 250 / 354);
        Tablet/Desktop restore approved anchors in CSS.
      */}
      <div className="hero-content">
        <p className="hero-eyebrow">{t("eyebrow")}</p>
        <h1 id="hero-heading" className="hero-title">
          <span className="hero-title-line">{t("titleLine1")}</span>
          <span className="hero-title-line">{t("titleLine2")}</span>
        </h1>
        <p className="hero-body" lang={locale}>
          <span className="hero-body-line">{t("bodyLine1")}</span>
          <span className="hero-body-line">{t("bodyLine2")}</span>
        </p>
        <PrimaryButton href="/catalog" className="hero-cta">
          {t("cta")}
        </PrimaryButton>
      </div>
    </section>
  );
}
