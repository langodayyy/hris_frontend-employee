"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import * as turf from "@turf/turf";

mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

type MapboxMapProps = {
  onPinReady: (lat: number, lng: number) => void;
};

export default function MapboxMap({ onPinReady }: MapboxMapProps) {
  const mapContainer = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const designatedLat = -7.944280192922373;
  const designatedLng = 112.60562448554032;

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [designatedLng, designatedLat],
      zoom: 17,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl());

    setTimeout(() => map.resize(), 300);

    map.on("load", () => {
      // Tambahkan lingkaran radius menggunakan turf
      const circle = turf.circle([designatedLng, designatedLat], 10, {
        steps: 64,
        units: "meters",
      });

      map.addSource("radius-circle", {
        type: "geojson",
        data: circle,
      });

      map.addLayer({
        id: "radius-circle-fill",
        type: "fill",
        source: "radius-circle",
        paint: {
          "fill-color": "#FF0000", // Warna merah
          "fill-opacity": 0.1,
        },
      });

      map.loadImage("../images/map-pin.png", (error, image) => {
        if (error || !image) {
          console.error("Gagal memuat ikon pin:", error);
          return;
        }

        if (!map.hasImage("pin")) {
          map.addImage("pin", image);
        }

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
                  coordinates: [designatedLng, designatedLat],
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

        // 🔥 Kirim ke halaman pemanggil
        onPinReady(designatedLat, designatedLng);
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className="relative w-full h-full rounded-md">
      <div ref={mapContainer} className="w-full h-[400px] rounded-md" />

      {/* Watermark di sudut kiri bawah */}
      <div className="absolute bottom-2 left-2 text-xs text-black bg-white/80 px-2 py-1 rounded shadow">
        © Mapbox © OpenStreetMap
      </div>
    </div>
  );
}
