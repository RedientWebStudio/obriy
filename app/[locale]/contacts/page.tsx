import { setRequestLocale } from "next-intl/server";
import { ContactsPage } from "@/components/contacts/ContactsPage";
import { Footer } from "@/components/layout/Footer";

export const instant = false;

type Props = {
  params: Promise<{ locale: string }>;
};

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
