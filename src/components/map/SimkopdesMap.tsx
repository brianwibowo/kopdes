"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { KoperasiItem, ProvinsiData } from "@/lib/types";
import { formatRupiah } from "@/lib/data";
import { MapPin, Navigation, Compass, Layers, X, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";

interface SimkopdesMapProps {
  provinsiList: ProvinsiData[];
  koperasiList: KoperasiItem[];
}

export function SimkopdesMap({ provinsiList, koperasiList }: SimkopdesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [selectedKoperasi, setSelectedKoperasi] = useState<KoperasiItem | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!mapContainerRef.current) return;

      try {
        const maplibregl = (await import("maplibre-gl")) as any;
        await import("maplibre-gl/dist/maplibre-gl.css");

        if (!isMounted) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: {
            version: 8,
            sources: {
              "osm-tiles": {
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: "© OpenStreetMap contributors",
              },
            },
            layers: [
              {
                id: "osm-layer",
                type: "raster",
                source: "osm-tiles",
                minzoom: 0,
                maxzoom: 19,
                paint: {
                  "raster-saturation": -0.2,
                  "raster-brightness-max": 0.98,
                },
              },
            ],
          },
          center: [118.0, -2.5],
          zoom: 4.6,
          minZoom: 3.5,
          maxZoom: 15,
          maxBounds: [
            [92.0, -13.0],
            [144.0, 8.5],
          ],
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

        map.on("load", () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;
          setMapLoaded(true);
        });
      } catch (err) {
        console.error("MapLibre load error:", err);
      }
    }

    init();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Place Province Bubble Badges & Cooperative Markers
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    import("maplibre-gl").then((maplibregl: any) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      koperasiList.forEach((k) => {
        const el = document.createElement("div");
        el.className = "cursor-pointer group";

        const isSelected = selectedKoperasi?.id === k.id;

        el.innerHTML = `
          <div class="flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all duration-200 hover:scale-125 ${
            isSelected
              ? "bg-[#991b1b] text-white ring-4 ring-red-200"
              : "bg-white border-2 border-[#991b1b] text-[#991b1b] hover:bg-[#991b1b] hover:text-white"
          }">
            <span class="text-xs font-bold font-mono leading-none">1</span>
          </div>
        `;

        el.addEventListener("click", () => {
          setSelectedKoperasi(k);
          mapInstanceRef.current.flyTo({
            center: [k.longitude, k.latitude],
            zoom: Math.max(mapInstanceRef.current.getZoom(), 8),
            speed: 1.2,
          });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([k.longitude, k.latitude])
          .addTo(mapInstanceRef.current);

        markersRef.current.push(marker);
      });
    });
  }, [mapLoaded, koperasiList, selectedKoperasi]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [118.0, -2.5],
        zoom: 4.6,
        speed: 1.2,
      });
    }
    setSelectedKoperasi(null);
  };

  return (
    <div className="relative w-full h-[520px] rounded-[10px] overflow-hidden border border-[#E6E8EB] bg-[#f8fafc]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Reset Map Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={resetView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs"
        >
          <Compass className="w-3.5 h-3.5 text-[#991b1b]" />
          <span>Reset Tampilan Indonesia</span>
        </button>
      </div>

      {/* Drawer Detail Panel saat Titik Dipilih */}
      {selectedKoperasi && (
        <div className="absolute inset-y-0 right-0 w-full sm:w-96 z-30 bg-white border-l border-gray-200 shadow-2xl p-5 overflow-y-auto flex flex-col justify-between animate-fade-in">
          <div>
            <div className="flex items-start justify-between pb-3 border-b border-gray-200">
              <div>
                <span className="text-[11px] font-mono text-[#991b1b] font-bold">
                  {selectedKoperasi.noRegistrasi}
                </span>
                <h4 className="text-base font-bold text-gray-900 mt-0.5 leading-snug">
                  {selectedKoperasi.nama}
                </h4>
              </div>
              <button
                onClick={() => setSelectedKoperasi(null)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="bg-[#F2F3F7] p-3 rounded-lg border border-[#E6E8EB]">
                <div className="font-bold text-[#991b1b]">Lokasi Administratif</div>
                <div className="text-gray-700 mt-1">
                  Desa {selectedKoperasi.desa}, Kec. {selectedKoperasi.kecamatan}
                </div>
                <div className="text-gray-600">
                  {selectedKoperasi.kabupaten}, {selectedKoperasi.provinsiNama}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F2F3F7] p-2.5 rounded-lg border border-[#E6E8EB]">
                  <span className="text-[10px] text-gray-500 block">Simpanan Pokok</span>
                  <span className="font-bold text-[#991b1b] text-xs">
                    {formatRupiah(selectedKoperasi.totalAset * 0.3)}
                  </span>
                </div>
                <div className="bg-[#F2F3F7] p-2.5 rounded-lg border border-[#E6E8EB]">
                  <span className="text-[10px] text-gray-500 block">Simpanan Wajib</span>
                  <span className="font-bold text-[#991b1b] text-xs">
                    {formatRupiah(selectedKoperasi.totalAset * 0.7)}
                  </span>
                </div>
              </div>

              <div className="bg-[#F2F3F7] p-3 rounded-lg border border-[#E6E8EB]">
                <span className="text-[10px] text-gray-500 block font-semibold uppercase">Komoditas Utama:</span>
                <span className="font-bold text-gray-800 text-xs block mt-0.5">{selectedKoperasi.komoditasUtama}</span>
                {selectedKoperasi.mitraOfftaker && (
                  <span className="text-[11px] text-gray-600 block mt-1">Mitra: {selectedKoperasi.mitraOfftaker}</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 mt-4">
            <Link
              href={`/pers/dashboard/village/${selectedKoperasi.id}?village_name=${encodeURIComponent(selectedKoperasi.desa)}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>Buka Detail Statistik Desa</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
