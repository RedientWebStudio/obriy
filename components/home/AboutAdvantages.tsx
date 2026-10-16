import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { AccentBar } from "@/components/ui/AccentBar";
import { AdvantageCard } from "@/components/home/AdvantageCard";

const ADVANTAGE_KEYS = ["01", "02", "03", "04"] as const;

export async function AboutAdvantages() {
  const t = await getTranslations("HomePage");

  return (
    <section className="about-advantages" aria-labelledby="about-heading">
      <Container>
        <div className="about-block">
          <AccentBar className="mx-auto" />
          <h2 id="about-heading" className="about-heading">
            {t("about.heading")}
          </h2>
          <p className="about-text">
            <span className="about-text-line">{t("about.bodyLine1")}</span>
            <span className="about-text-line">{t("about.bodyLine2")}</span>
          </p>
        </div>

        <div className="advantages-block">
          <AccentBar className="mx-auto" />
          <h2 className="advantages-heading">{t("advantages.heading")}</h2>
          <div className="advantages-grid">
            {ADVANTAGE_KEYS.map((key) => (
              <AdvantageCard
                key={key}
                number={key}
                title={t(`advantages.items.${key}.title`)}
                description={t(`advantages.items.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
