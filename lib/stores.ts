export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  /** Address string used for maps / directions search */
  addressQuery: string;
  hours: string;
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
    name: "Магазин OBRIY",
    address: "м. Мукачево, вул. І. Маргітича 4",
    addressQuery: "Мукачево, вул. І. Маргітича 4",
    hours: "Пн–Сб · 9:00–18:00 · Нд — вихідний",
    // Place pin from https://maps.app.goo.gl/8jT39P7VtVFwCW6SA
    coordinates: { lat: 48.4382103, lng: 22.720031 },
    directionsUrl: "https://maps.app.goo.gl/8jT39P7VtVFwCW6SA",
  },
  {
    id: "mukachevo-shtefana",
    name: "Магазин OBRIY",
    address: "м. Мукачево, вул. А. Штефана 25",
    addressQuery: "Мукачево, вул. А. Штефана 25",
    hours: "Пн–Сб · 9:00–18:00 · Нд — вихідний",
    coordinates: { lat: 48.43695498545579, lng: 22.723572749073792 },
  },
];

/** Google Maps directions — confirmed URL or destination coordinates. */
export function storeDirectionsUrl(store: StoreLocation): string {
  if (store.directionsUrl) return store.directionsUrl;
  const { lat, lng } = store.coordinates;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
