"use client";

import { useEffect, useRef, useState } from "react";
import type { StoreLocation } from "@/lib/stores";
import { MQ_DESKTOP_MIN } from "@/lib/breakpoints";
import { pickLocale } from "@/lib/locale";

type Props = {
  stores: StoreLocation[];
  locale: string;
  label: string;
};

type TouchPair = {
  x: number;
  y: number;
};

function touchPairCenter(touches: TouchList): TouchPair | null {
  const a = touches.item(0);
  const b = touches.item(1);
  if (!a || !b) return null;
  return {
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
  };
}

/**
 * Cooperative touch for phone/Tablet touch surfaces (not Desktop ≥1024):
 * one finger scrolls the page; two fingers pan/zoom the map; mouse can drag.
 */
function shouldUseCooperativeTouch(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia(MQ_DESKTOP_MIN).matches) return false;
  return (
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function StoresMap({ stores, locale, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current || stores.length === 0) return;

    let cancelled = false;
    let map: import("leaflet").Map | null = null;
    let mapContainer: HTMLElement | null = null;
    let pairCenter: TouchPair | null = null;
    const cleanups: Array<() => void> = [];

    const init = async () => {
      try {
        const L = (await import("leaflet")).default;
        await import("leaflet/dist/leaflet.css");

        if (cancelled || !containerRef.current) return;

        const bounds = L.latLngBounds(
          stores.map((store) => [store.coordinates.lat, store.coordinates.lng]),
        );

        const cooperativeTouch = shouldUseCooperativeTouch();

        map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          /*
            Cooperative starts with dragging off so one-finger page scroll works.
            Mouse drag is enabled on pointerdown (capture) before Leaflet handles it.
            Two-finger pan is applied manually — enabling Leaflet drag mid-gesture
            is unreliable.
          */
          dragging: !cooperativeTouch,
          touchZoom: true,
          doubleClickZoom: true,
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

        if (cooperativeTouch && map) {
          mapContainer = map.getContainer();

          const onPointerDownCapture = (event: PointerEvent) => {
            if (!map || event.pointerType !== "mouse") return;
            map.dragging.enable();
          };

          const onPointerUp = (event: PointerEvent) => {
            if (!map || event.pointerType !== "mouse") return;
            map.dragging.disable();
          };

          const onTouchStart = (event: TouchEvent) => {
            if (event.touches.length >= 2) {
              pairCenter = touchPairCenter(event.touches);
              mapContainer?.classList.add("stores-map--two-finger");
            } else {
              pairCenter = null;
              mapContainer?.classList.remove("stores-map--two-finger");
            }
          };

          const onTouchMove = (event: TouchEvent) => {
            if (!map || event.touches.length < 2) return;
            const next = touchPairCenter(event.touches);
            if (!next) return;
            if (!pairCenter) {
              pairCenter = next;
              return;
            }
            // Block page scroll while two-finger map pan is active.
            event.preventDefault();
            map.panBy([pairCenter.x - next.x, pairCenter.y - next.y], {
              animate: false,
            });
            pairCenter = next;
          };

          const onTouchEnd = (event: TouchEvent) => {
            if (event.touches.length < 2) {
              pairCenter = null;
              mapContainer?.classList.remove("stores-map--two-finger");
            } else {
              pairCenter = touchPairCenter(event.touches);
            }
          };

          mapContainer.addEventListener("pointerdown", onPointerDownCapture, true);
          mapContainer.addEventListener("pointerup", onPointerUp, true);
          mapContainer.addEventListener("pointercancel", onPointerUp, true);
          mapContainer.addEventListener("touchstart", onTouchStart, {
            passive: true,
          });
          mapContainer.addEventListener("touchmove", onTouchMove, {
            passive: false,
          });
          mapContainer.addEventListener("touchend", onTouchEnd, {
            passive: true,
          });
          mapContainer.addEventListener("touchcancel", onTouchEnd, {
            passive: true,
          });

          cleanups.push(() => {
            mapContainer?.removeEventListener(
              "pointerdown",
              onPointerDownCapture,
              true,
            );
            mapContainer?.removeEventListener("pointerup", onPointerUp, true);
            mapContainer?.removeEventListener(
              "pointercancel",
              onPointerUp,
              true,
            );
            mapContainer?.removeEventListener("touchstart", onTouchStart);
            mapContainer?.removeEventListener("touchmove", onTouchMove);
            mapContainer?.removeEventListener("touchend", onTouchEnd);
            mapContainer?.removeEventListener("touchcancel", onTouchEnd);
            mapContainer?.classList.remove("stores-map--two-finger");
          });
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    void init();

    return () => {
      cancelled = true;
      for (const cleanup of cleanups) cleanup();
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
