import { StoresMap } from "@/components/contacts/StoresMap";
import { storeDirectionsUrl, stores } from "@/lib/stores";

type Props = {
  heading: string;
  routeLabel: string;
  mapLabel: string;
};

export function StoresSection({ heading, routeLabel, mapLabel }: Props) {
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
            <h3 className="contacts-store-name">{store.name}</h3>
            <p className="contacts-store-address">{store.address}</p>
            <p className="contacts-store-hours">{store.hours}</p>
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
        key={stores
          .map((s) => `${s.id}:${s.coordinates.lat},${s.coordinates.lng}`)
          .join("|")}
        stores={stores}
        label={mapLabel}
      />
    </section>
  );
}
