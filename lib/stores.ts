import type { LocaleField } from "@/lib/locale";

export type StoreLocation = {
  id: string;
  name: LocaleField;
  address: LocaleField;
  /** Address string used for maps / directions search */
  addressQuery: string;
  hours: LocaleField;
  /** Confirmed store coordinates (WGS84). */
  coordinates: {
    lat: number;
    lng: number;
  };
  /**
   * Optional confirmed Google Maps URL for «Прокласти маршрут».
   * When set, used instead of a constructed destination link.
   */
  directionsUrl?: string;
};

/**
 * Store data from Figma Contacts — Desktop (226:2).
 * Coordinates confirmed for the two Mukachevo locations.
 */
export const stores: StoreLocation[] = [
  {
    id: "mukachevo-margitycha",
    name: { uk: "Магазин OBRIY", en: "OBRIY store" },
    address: {
      uk: "м. Мукачево, вул. І. Маргітича 4",
      en: "Mukachevo, I. Margitycha St. 4",
    },
    addressQuery: "Мукачево, вул. І. Маргітича 4",
    hours: {
      uk: "Пн–Сб · 9:00–18:00 · Нд — вихідний",
      en: "Mon–Sat · 9:00–18:00 · Sun — closed",
    },
    // Place pin from https://maps.app.goo.gl/8jT39P7VtVFwCW6SA
    coordinates: { lat: 48.4382103, lng: 22.720031 },
    directionsUrl: "https://maps.app.goo.gl/8jT39P7VtVFwCW6SA",
  },
  {
    id: "mukachevo-shtefana",
    name: { uk: "Магазин OBRIY", en: "OBRIY store" },
    address: {
      uk: "м. Мукачево, вул. А. Штефана 25",
      en: "Mukachevo, A. Shtefana St. 25",
    },
    addressQuery: "Мукачево, вул. А. Штефана 25",
    hours: {
      uk: "Пн–Сб · 9:00–18:00 · Нд — вихідний",
      en: "Mon–Sat · 9:00–18:00 · Sun — closed",
    },
    coordinates: { lat: 48.43695498545579, lng: 22.723572749073792 },
  },
];

/** Google Maps directions — confirmed URL or destination coordinates. */
export function storeDirectionsUrl(store: StoreLocation): string {
  if (store.directionsUrl) return store.directionsUrl;
  const { lat, lng } = store.coordinates;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
