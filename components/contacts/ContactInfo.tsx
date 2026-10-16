import { formatScheduleText } from "@/lib/format-schedule";
import { externalLinkProps, siteLinks } from "@/lib/site-links";

type Props = {
  labels: {
    phone: string;
    email: string;
    schedule: string;
    social: string;
  };
  values: {
    phone: string;
    phoneTel: string;
    email: string;
    schedule: string;
  };
  socialLabels: {
    telegram: string;
    viber: string;
  };
};

const messengerItems = [
  { key: "telegram" as const, src: "/icons/telegram-ink.svg" },
  { key: "viber" as const, src: "/icons/viber-ink.svg" },
];

export function ContactInfo({ labels, values, socialLabels }: Props) {
  return (
    <div className="contacts-info">
      <div className="contacts-info-item">
        <p className="contacts-info-label">{labels.phone}</p>
        <a href={`tel:${values.phoneTel}`} className="contacts-info-value">
          {values.phone}
        </a>
      </div>

      <div className="contacts-info-divider" aria-hidden="true" />

      <div className="contacts-info-item">
        <p className="contacts-info-label">{labels.email}</p>
        <a href={`mailto:${values.email}`} className="contacts-info-value">
          {values.email}
        </a>
      </div>

      <div className="contacts-info-divider" aria-hidden="true" />

      <div className="contacts-info-item">
        <p className="contacts-info-label">{labels.schedule}</p>
        <p className="contacts-info-value">
          {formatScheduleText(values.schedule)}
        </p>
      </div>

      <div className="contacts-info-divider" aria-hidden="true" />

      <div className="contacts-info-item">
        <p className="contacts-info-label">{labels.social}</p>
        <ul className="contacts-socials">
          {messengerItems.map((item) => {
            const href = siteLinks.social[item.key];
            const label = socialLabels[item.key];

            return (
              <li key={item.key}>
                {href ? (
                  <a
                    href={href}
                    className="contacts-social contacts-social-link"
                    aria-label={label}
                    {...externalLinkProps(href)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.src} alt="" width={30} height={30} />
                  </a>
                ) : (
                  <span
                    className="contacts-social"
                    role="img"
                    aria-label={label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.src} alt="" width={30} height={30} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
