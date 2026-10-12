import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export const instant = false;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");

  return (
    <main className="container stack gap-4 py-16">
      <h1 className="text-logo">{t("title")}</h1>
      <p className="text-body">{t("description")}</p>
      <p className="text-body">{t("currentLocale")}</p>
      <nav className="cluster text-body">
        {locale === "uk" ? (
          <Link href="/" locale="en" className="underline text-ink">
            {t("switchToEn")}
          </Link>
        ) : (
          <Link href="/" locale="uk" className="underline text-ink">
            {t("switchToUk")}
          </Link>
        )}
      </nav>
      <p className="text-body pt-8">
        locales: {routing.locales.join(", ")} · default: {routing.defaultLocale}
      </p>
    </main>
  );
}
