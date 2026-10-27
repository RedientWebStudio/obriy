import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactsPage } from "@/components/contacts/ContactsPage";
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
    href: "/contacts",
    title: t("contacts.title"),
    description: t("contacts.description"),
  });
}

export default async function ContactsRoutePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ContactsPage locale={locale} />
      <Footer variant="compact" />
    </>
  );
}
