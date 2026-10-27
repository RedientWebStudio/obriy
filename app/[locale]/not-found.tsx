import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { StatusScreen } from "@/components/system/StatusScreen";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default async function LocaleNotFound() {
  const t = await getTranslations("NotFoundPage");

  return (
    <>
      <StatusScreen
        code={t("code")}
        title={t("title")}
        description={t("description")}
        action={<PrimaryButton href="/">{t("cta")}</PrimaryButton>}
      />
      <Footer variant="compact" />
    </>
  );
}
