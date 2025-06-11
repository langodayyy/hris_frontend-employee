"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

type MapboxMapProps = {
  officeLat?: number;
  officeLng?: number;
  onPinReady?: (lat: number, lng: number) => void;
};

export default function MapboxMap({ onPinReady, officeLat, officeLng }: MapboxMapProps) {
  const mapContainer = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Always call hooks in the same order
  useEffect(() => {
    if (!mapContainer.current || officeLat == undefined || officeLng == undefined) {
      return; // Exit early if required props are missing
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [officeLng, officeLat],
      zoom: 17,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl());

    setTimeout(() => map.resize(), 300);

    map.on("load", () => {
      map.loadImage("../images/current-location.png", (error, image) => {
        if (error || !image) {
          console.error("Failed to load pin icon:", error);
          return;
        }

        if (!map.hasImage("pin")) {
          map.addImage("pin", image);
        }

        // Add office marker
        map.loadImage("../images/office.png", (err, officeImage) => {
          if (!err && officeImage && !map.hasImage("office-pin")) {
            map.addImage("office-pin", officeImage);
          }
          map.addSource("office-point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: [officeLng, officeLat],
                  },
                },
              ],
            },
          });
          map.addLayer({
            id: "office-pin-layer",
            type: "symbol",
            source: "office-point",
            layout: {
              "icon-image": "office-pin",
              "icon-size": 0.06,
              "icon-anchor": "bottom",
            },
          });
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;

            map.addSource("pin-point", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "Point",
                      coordinates: [longitude, latitude],
                    },
                  },
                ],
              },
            });

            map.addLayer({
              id: "pin-layer",
              type: "symbol",
              source: "pin-point",
              layout: {
                "icon-image": "pin",
                "icon-size": 0.2,
                "icon-anchor": "bottom",
              },
            });

            map.flyTo({ center: [longitude, latitude], zoom: 17 });

            if (typeof onPinReady === "function") {
              onPinReady(latitude, longitude);
            }
          });
        }
      });
    });

    return () => map.remove();
  }, [officeLat, officeLng, onPinReady]);

  // Conditional rendering for missing data
  if (officeLat == undefined || officeLng == undefined) {
    return (
      <div className="p-4 text-sm text-gray-600 italic">
        Data location not found.
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-md">
      <div ref={mapContainer} className="w-full h-[400px] rounded-md" />

      {/* Watermark */}
      <div className="absolute bottom-2 left-2 text-xs text-black bg-white/80 px-2 py-1 rounded shadow">
        © Mapbox © OpenStreetMap
      </div>
      <div className="absolute bottom-2 right-2 text-xs flex flex-col gap-2">
        <div
          className="bg-white p-2 rounded shadow cursor-pointer hover:bg-neutral-100"
          onClick={() => {
            if (mapRef.current && navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom: 17,
                  });
                }
              });
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#145be1"
            className="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
          </svg>
        </div>
        <div
          className="text-black bg-primary-900 p-2 rounded shadow cursor-pointer hover:bg-primary-950"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo({
                center: [officeLng, officeLat],
                zoom: 17,
              });
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-buildings"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 21v-15c0 -1 1 -2 2 -2h5c1 0 2 1 2 2v15" />
            <path d="M16 8h2c1 0 2 1 2 2v11" />
            <path d="M3 21h18" />
            <path d="M10 12v0" />
            <path d="M10 16v0" />
            <path d="M10 8v0" />
            <path d="M7 12v0" />
            <path d="M7 16v0" />
            <path d="M7 8v0" />
            <path d="M17 12v0" />
            <path d="M17 16v0" />
          </svg>
        </div>
      </div>
    </div>
  );
}