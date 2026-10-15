import { StoresMap } from "@/components/contacts/StoresMap";
import { pickLocale } from "@/lib/locale";
import { storeDirectionsUrl, stores } from "@/lib/stores";

type Props = {
  locale: string;
  heading: string;
  routeLabel: string;
  mapLabel: string;
};

export function StoresSection({
  locale,
  heading,
  routeLabel,
  mapLabel,
}: Props) {
  return (
    <section className="contacts-stores" aria-labelledby="stores-heading">
      <h2 id="stores-heading" className="contacts-section-heading">
        {heading}
      </h2>
      <div className="contacts-stores-divider" aria-hidden="true" />

      <div className="contacts-stores-grid">
        {stores.map((store, index) => (
          <article
            key={store.id}
            className={
              index === 0
                ? "contacts-store"
                : "contacts-store contacts-store--next"
            }
          >
            <h3 className="contacts-store-name">
              {pickLocale(store.name, locale)}
            </h3>
            <p className="contacts-store-address">
              {pickLocale(store.address, locale)}
            </p>
            <p className="contacts-store-hours">
              {pickLocale(store.hours, locale)}
            </p>
            <a
              href={storeDirectionsUrl(store)}
              className="contacts-store-route"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{routeLabel}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/route-arrow.svg"
                alt=""
                width={24}
                height={24}
                className="contacts-store-route-icon"
              />
            </a>
          </article>
        ))}
      </div>

      <StoresMap
        key={stores.map((s) => `${s.id}:${s.coordinates.lat},${s.coordinates.lng}`).join("|")}
        stores={stores}
        locale={locale}
        label={mapLabel}
      />
    </section>
  );
}
