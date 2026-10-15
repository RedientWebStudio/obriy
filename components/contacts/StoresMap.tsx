"use client";

import { useEffect, useRef, useState } from "react";
import type { StoreLocation } from "@/lib/stores";
import { pickLocale } from "@/lib/locale";

type Props = {
  stores: StoreLocation[];
  locale: string;
  label: string;
};

export function StoresMap({ stores, locale, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current || stores.length === 0) return;

    let cancelled = false;
    let map: import("leaflet").Map | null = null;

    const init = async () => {
      try {
        const L = (await import("leaflet")).default;
        await import("leaflet/dist/leaflet.css");

        if (cancelled || !containerRef.current) return;

        const bounds = L.latLngBounds(
          stores.map((store) => [store.coordinates.lat, store.coordinates.lng]),
        );

        map = L.map(containerRef.current, {
          scrollWheelZoom: true,
          attributionControl: true,
        }).fitBounds(bounds.pad(0.35));

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        stores.forEach((store, index) => {
          const indexLabel = String(index + 1).padStart(2, "0");
          const markerIcon = L.divIcon({
            className: "stores-map-marker",
            html: `<span class="stores-map-marker-index">${indexLabel}</span>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -16],
          });

          L.marker([store.coordinates.lat, store.coordinates.lng], {
            icon: markerIcon,
            title: pickLocale(store.name, locale),
          })
            .addTo(map!)
            .bindPopup(
              `<strong>${pickLocale(store.name, locale)}</strong><br/>${pickLocale(store.address, locale)}`,
              { className: "stores-map-popup" },
            );
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    void init();

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, [stores, locale]);

  if (stores.length === 0 || failed) {
    return (
      <div
        className="stores-map stores-map--fallback"
        role="region"
        aria-label={label}
      >
        <p className="stores-map-fallback-label">{label}</p>
      </div>
    );
  }

  return (
    <div className="stores-map" role="region" aria-label={label}>
      <div ref={containerRef} className="stores-map-canvas" />
    </div>
  );
}
