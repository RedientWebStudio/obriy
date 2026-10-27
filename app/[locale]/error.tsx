"use client";

import { useTranslations } from "next-intl";
import { StatusScreen } from "@/components/system/StatusScreen";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ reset }: Props) {
  const t = useTranslations("Error");

  return (
    <StatusScreen
      title={t("title")}
      description={t("description")}
      action={
        <button type="button" className="primary-button" onClick={reset}>
          <span>{t("retry")}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/chevron-right.svg"
            alt=""
            width={6}
            height={11}
            className="primary-button-chevron"
          />
        </button>
      }
    />
  );
}
