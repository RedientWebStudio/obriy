import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { siteLinks } from "@/lib/site-links";

const socials = [
  { key: "facebook" as const, src: "/icons/facebook.svg" },
  { key: "telegram" as const, src: "/icons/telegram.svg" },
  { key: "viber" as const, src: "/icons/viber.svg" },
];

export async function Footer() {
  const t = await getTranslations("Footer");
  const studioUrl = siteLinks.studio;

  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <a href={`tel:${t("phoneTel")}`} className="footer-phone">
            {t("phone")}
          </a>
          <p className="footer-schedule">{t("schedule")}</p>
          <ul className="footer-socials">
            {socials.map((item) => {
              const href = siteLinks.social[item.key];
              const label = t(`social.${item.key}`);

              return (
                <li key={item.key}>
                  {href ? (
                    <a
                      href={href}
                      className="footer-social footer-social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.src} alt="" width={36} height={36} />
                    </a>
                  ) : (
                    <span
                      className="footer-social"
                      role="img"
                      aria-label={label}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.src} alt="" width={36} height={36} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-bottom">
          <p className="footer-meta">{t("copyright")}</p>
          <p className="footer-meta footer-credit">
            {t("creditPrefix")}
            {studioUrl ? (
              <a
                href={studioUrl}
                className="footer-credit-name"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("creditStudio")}
              </a>
            ) : (
              <span className="footer-credit-name">{t("creditStudio")}</span>
            )}
          </p>
        </div>
      </Container>
    </footer>
  );
}
