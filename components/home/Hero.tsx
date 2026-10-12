import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export async function Hero() {
  const t = await getTranslations("HomePage.hero");

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
        Positions match Figma Hero (4:6) absolute tops:
        eyebrow 168 · title 212 · body 369 · CTA 502 · left = page pad
      */}
      <div className="hero-content">
        <p className="hero-eyebrow">{t("eyebrow")}</p>
        <h1 id="hero-heading" className="hero-title">
          <span className="hero-title-line">{t("titleLine1")}</span>
          <span className="hero-title-line">{t("titleLine2")}</span>
        </h1>
        <p className="hero-body">
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
