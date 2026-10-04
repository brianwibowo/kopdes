"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { KoperasiItem, ProvinsiData } from "@/lib/types";
import { formatRupiah } from "@/lib/data";
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  ChevronRight, 
  X, 
  Layers, 
  Navigation,
  Compass,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

interface IndonesiaMapProps {
  koperasiList: KoperasiItem[];
  provinsiList: ProvinsiData[];
  selectedId?: string;
  onSelectKoperasi?: (koperasi: KoperasiItem | null) => void;
  height?: string;
}

export function IndonesiaMap({
  koperasiList,
  provinsiList,
  selectedId,
  onSelectKoperasi,
  height = "h-[620px]",
}: IndonesiaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [selectedKoperasi, setSelectedKoperasi] = useState<KoperasiItem | null>(null);
  const [filterProvinsi, setFilterProvinsi] = useState<string>("ALL");
  const [filterTahap, setFilterTahap] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sync external selectedId
  useEffect(() => {
    if (selectedId) {
      const found = koperasiList.find((k) => k.id === selectedId);
      if (found) {
        setSelectedKoperasi(found);
      }
    }
  }, [selectedId, koperasiList]);

  // Filter items
  const filteredList = koperasiList.filter((k) => {
    if (filterProvinsi !== "ALL" && k.provinsiId !== filterProvinsi) return false;
    if (filterTahap !== "ALL" && k.tahap !== filterTahap) return false;
    if (filterStatus !== "ALL" && k.status !== filterStatus) return false;
    return true;
  });

  // Initialize MapLibre GL
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        const maplibregl = (await import("maplibre-gl")) as any;
        await import("maplibre-gl/dist/maplibre-gl.css");

        if (!isMounted) return;

        // Clean up previous map if exists
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
                tiles: [
                  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                ],
                tileSize: 256,
                attribution: "© OpenStreetMap kontributor",
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
                  "raster-saturation": -0.85, // muted, institutional dark/desaturated
                  "raster-brightness-max": 0.85,
                  "raster-contrast": 0.2,
                },
              },
            ],
          },
          center: [118.0, -2.5], // Center of Indonesia
          zoom: 4.6,
          minZoom: 3.5,
          maxZoom: 16,
          maxBounds: [
            [92.0, -13.0], // Barat Daya
            [144.0, 8.5],  // Timur Laut
          ],
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

        map.on("load", () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;
          setMapLoaded(true);
        });
      } catch (err) {
        console.error("Gagal inisialisasi MapLibre:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers on map
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    import("maplibre-gl").then((maplibregl: any) => {
      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      filteredList.forEach((k) => {
        // Create custom marker DOM element
        const el = document.createElement("div");
        el.className = "group cursor-pointer relative";
        
        const isSelected = selectedKoperasi?.id === k.id;
        const isAtensi = k.status === "PERLU_ATENSI";

        el.innerHTML = `
          <div class="flex items-center justify-center w-7 h-7 rounded-full shadow-md transition-transform duration-200 hover:scale-125 ${
            isSelected 
              ? "bg-red-600 ring-4 ring-red-400/50 z-30" 
              : isAtensi 
              ? "bg-amber-600 ring-2 ring-amber-300/40 z-20" 
              : "bg-slate-900 border-2 border-red-500 hover:bg-red-600 z-10"
          }">
            <span class="w-2.5 h-2.5 rounded-full ${isSelected || isAtensi ? "bg-white" : "bg-red-400"}"></span>
          </div>
        `;

        el.addEventListener("click", () => {
          setSelectedKoperasi(k);
          if (onSelectKoperasi) onSelectKoperasi(k);

          // Smooth fly to coordinate
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
  }, [filteredList, mapLoaded, selectedKoperasi, onSelectKoperasi]);

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
    <div className={`relative w-full ${height} rounded-xl overflow-hidden border border-slate-800 bg-slate-950`}>
      {/* Map Filter Controls Bar */}
      <div className="absolute top-3 left-3 right-14 z-20 flex flex-wrap gap-2 pointer-events-none">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-xs shadow-lg">
          <div className="flex items-center gap-1.5 px-2 text-slate-400 font-medium">
            <Layers className="w-3.5 h-3.5 text-red-400" />
            <span>Filter Peta:</span>
          </div>

          {/* Provinsi Select */}
          <select
            value={filterProvinsi}
            onChange={(e) => setFilterProvinsi(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
          >
            <option value="ALL">Semua Provinsi (38)</option>
            {provinsiList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>

          {/* Tahap Select */}
          <select
            value={filterTahap}
            onChange={(e) => setFilterTahap(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
          >
            <option value="ALL">Semua Tahap Progres</option>
            <option value="TAHAP_1_PERSIAPAN">Tahap I: Persiapan</option>
            <option value="TAHAP_2_KELEMBAGAAN">Tahap II: Kelembagaan</option>
            <option value="TAHAP_3_PERMODALAN">Tahap III: Permodalan</option>
            <option value="TAHAP_4_OPERASIONAL">Tahap IV: Operasional</option>
          </select>

          {/* Status Select */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="AKTIF">Aktif</option>
            <option value="BERKEMBANG">Berkembang</option>
            <option value="PERLU_ATENSI">Perlu Atensi</option>
          </select>

          <button
            onClick={resetView}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 border border-slate-700/60"
            title="Reset Posisi Peta Indonesia"
          >
            <Compass className="w-3 h-3 text-slate-400" />
            <span>Reset Posisi</span>
          </button>

          <div className="text-slate-400 px-1 border-l border-slate-700">
            Ditampilkan: <span className="text-white font-bold">{filteredList.length}</span> titik
          </div>
        </div>
      </div>

      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Bottom Right Map Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 shadow-md">
        <div className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
          <Navigation className="w-3 h-3 text-red-400" />
          <span>Legenda Titik KDMP</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-red-500" />
            <span>Koperasi Aktif & Mandiri</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Perlu Pendampingan / Atensi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-red-400/50" />
            <span>Koperasi Terpilih</span>
          </div>
        </div>
      </div>

      {/* Drawer Detail Panel (Desktop: Slide-over Kanan, Mobile: Bottom Sheet) */}
      {selectedKoperasi && (
        <div className="absolute inset-y-0 right-0 w-full sm:w-96 z-30 bg-slate-950/95 backdrop-blur-lg border-l border-slate-800 shadow-2xl p-5 overflow-y-auto flex flex-col justify-between animate-fade-in">
          <div>
            {/* Header & Close Button */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono tracking-wider text-red-400 font-semibold">
                  {selectedKoperasi.noRegistrasi}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                  {selectedKoperasi.nama}
                </h3>
              </div>
              <button
                onClick={() => setSelectedKoperasi(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Tutup panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges Status */}
            <div className="flex items-center gap-2 mt-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedKoperasi.status === "AKTIF"
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                  : selectedKoperasi.status === "PERLU_ATENSI"
                  ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                  : "bg-blue-950/80 text-blue-300 border border-blue-800/60"
              }`}>
                {selectedKoperasi.status === "AKTIF" ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                )}
                {selectedKoperasi.status}
              </span>

              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                {selectedKoperasi.tahap.replace(/_/g, " ")}
              </span>
            </div>

            {/* Atensi Alert if any */}
            {selectedKoperasi.catatanMonitoring && (
              <div className="mt-3.5 p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Catatan Pengawasan:</div>
                  <div className="mt-0.5 text-amber-300/90">{selectedKoperasi.catatanMonitoring}</div>
                </div>
              </div>
            )}

            {/* Info Lokasi Spasial */}
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white">{selectedKoperasi.desa}, {selectedKoperasi.kecamatan}</div>
                  <div className="text-slate-400">{selectedKoperasi.kabupaten}, {selectedKoperasi.provinsiNama}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Koordinat: {selectedKoperasi.latitude.toFixed(4)}, {selectedKoperasi.longitude.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Komoditas & Mitra */}
              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 space-y-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Komoditas Unggulan:</span>
                  <span className="font-semibold text-slate-200">{selectedKoperasi.komoditasUtama}</span>
                </div>
                {selectedKoperasi.mitraOfftaker && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Mitra / Offtaker:</span>
                    <span className="text-slate-300">{selectedKoperasi.mitraOfftaker}</span>
                  </div>
                )}
              </div>

              {/* Ringkasan Finansial */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Total Aset</span>
                  <span className="text-sm font-bold text-white">
                    {formatRupiah(selectedKoperasi.totalAset)}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Volume Usaha</span>
                  <span className="text-sm font-bold text-white">
                    {formatRupiah(selectedKoperasi.volumeUsaha)}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Anggota</span>
                  <span className="text-sm font-bold text-white">
                    {selectedKoperasi.jumlahAnggota} orang
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">SHU Berjalan</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {formatRupiah(selectedKoperasi.totalShu)}
                  </span>
                </div>
              </div>

              {/* Kontak & Ketua */}
              <div className="pt-2 text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ketua: <strong className="text-slate-200">{selectedKoperasi.ketua}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Telepon: <span className="text-slate-300 font-mono">{selectedKoperasi.telepon}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button: Buka Profil Lengkap */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              href={`/koperasi/${selectedKoperasi.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-md"
            >
              <span>Lihat Profil Lengkap Koperasi</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
