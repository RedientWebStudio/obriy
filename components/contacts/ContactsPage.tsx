import { getTranslations } from "next-intl/server";
import { ContactInfo } from "@/components/contacts/ContactInfo";
import { FaqAccordion, type FaqItemCopy } from "@/components/contacts/FaqAccordion";
import { StoresSection } from "@/components/contacts/StoresSection";
import { Container } from "@/components/layout/Container";
import { faqItemIds } from "@/lib/faq";

type Props = {
  locale: string;
};

export async function ContactsPage({ locale }: Props) {
  const t = await getTranslations("ContactsPage");
  const tFooter = await getTranslations("Footer");

  const faqItems: FaqItemCopy[] = faqItemIds.map((id) => ({
    id,
    question: t(`faq.items.${id}.question`),
    answer: t(`faq.items.${id}.answer`),
  }));

  return (
    <main className="contacts-page">
      <Container>
        <header className="contacts-intro">
          <h1 className="contacts-heading">{t("heading")}</h1>
          <p className="contacts-lead">{t("lead")}</p>
        </header>

        <div className="contacts-top-divider" aria-hidden="true" />

        <ContactInfo
          labels={{
            phone: t("info.phone"),
            email: t("info.email"),
            schedule: t("info.schedule"),
            social: t("info.social"),
          }}
          values={{
            phone: tFooter("phone"),
            phoneTel: tFooter("phoneTel"),
            email: t("info.emailValue"),
            schedule: t("info.scheduleValue"),
          }}
          socialLabels={{
            telegram: tFooter("social.telegram"),
            viber: tFooter("social.viber"),
          }}
        />

        <StoresSection
          locale={locale}
          heading={t("stores.heading")}
          routeLabel={t("stores.route")}
          mapLabel={t("stores.mapLabel")}
        />

        <section className="contacts-faq" aria-labelledby="faq-heading">
          <header className="contacts-faq-intro">
            <h2 id="faq-heading" className="contacts-section-heading">
              {t("faq.heading")}
            </h2>
            <p className="contacts-faq-lead">{t("faq.lead")}</p>
          </header>
          <FaqAccordion items={faqItems} />
        </section>
      </Container>
    </main>
  );
}
