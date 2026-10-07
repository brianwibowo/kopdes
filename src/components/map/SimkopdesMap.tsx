"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Map as LibreMap, Marker } from "maplibre-gl";
import type { KoperasiItem, ProvinsiData } from "@/lib/types";
import { formatRupiah } from "@/lib/data";
import { Compass, X, ChevronRight } from "lucide-react";

export interface SimkopdesMapProps {
  provinsiList?: ProvinsiData[];
  koperasiList: KoperasiItem[];
  modelQuery?: string;
  selectedId?: string;
  onSelectKoperasi?: (koperasi: KoperasiItem | null) => void;
  height?: string;
}

export function SimkopdesMap({
  koperasiList,
  modelQuery = "",
  selectedId: externalId,
  onSelectKoperasi,
  height = "h-[510px]",
}: SimkopdesMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = koperasiList.find(
    (k) => k.id === (externalId ?? selectedId),
  );

  useEffect(() => {
    let cancelled = false;
    let instance: LibreMap | undefined;
    async function init() {
      try {
        const lib = await import("maplibre-gl");
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (cancelled || !container.current) return;
        lib.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
        instance = new lib.Map({
          container: container.current,
          style: {
            version: 8,
            sources: {
              osm: {
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution:
                  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              },
            },
            layers: [
              {
                id: "osm",
                type: "raster",
                source: "osm",
                paint: { "raster-saturation": -0.4 },
              },
            ],
          },
          center: [118, -2.5],
          zoom: 3,
          minZoom: 1,
          maxZoom: 16,
        });
        mapRef.current = instance;
        instance.addControl(new lib.NavigationControl(), "top-right");
        instance.on("load", () => {
          if (!cancelled) setReady(true);
        });
        instance.on("error", () => {
          if (!cancelled)
            setError(
              "Peta dasar belum dapat dimuat. Periksa koneksi internet; dataset dan tabel tetap tersedia.",
            );
        });
      } catch {
        if (!cancelled)
          setError(
            "Peta tidak dapat ditampilkan pada browser ini. Gunakan tabel koperasi untuk melihat lokasi dan profil.",
          );
      }
    }
    void init();
    return () => {
      cancelled = true;
      instance?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const markers: Marker[] = [];
    void import("maplibre-gl").then((lib) => {
      const map = mapRef.current;
      if (!map || cancelled) return;
      const bounds = new lib.LngLatBounds();
      for (const k of koperasiList) {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "kopdes-map-marker";
        el.textContent = "1";
        el.setAttribute("aria-label", `Lihat ${k.nama}`);
        el.title = k.nama;
        el.addEventListener("click", () => {
          setSelectedId(k.id);
          onSelectKoperasi?.(k);
          map.flyTo({
            center: [k.longitude, k.latitude],
            zoom: Math.max(map.getZoom(), 7),
            duration: 700,
          });
        });
        markers.push(
          new lib.Marker({ element: el })
            .setLngLat([k.longitude, k.latitude])
            .addTo(map),
        );
        bounds.extend([k.longitude, k.latitude]);
      }
      if (koperasiList.length)
        map.fitBounds(bounds, { padding: 65, maxZoom: 9, duration: 400 });
      else
        map.fitBounds(
          [
            [94, -11],
            [142, 6],
          ],
          { padding: 30, duration: 0 },
        );
    });
    return () => {
      cancelled = true;
      markers.forEach((marker) => marker.remove());
    };
  }, [ready, koperasiList, onSelectKoperasi]);

  return (
    <div
      className={`relative ${height} w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100`}
    >
      <div
        ref={container}
        className="h-full w-full"
        aria-label="Peta koperasi contoh"
      />
      {!ready && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-500">
          Memuat peta…
        </div>
      )}
      {error && (
        <div
          role="status"
          className="absolute bottom-8 left-4 right-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"
        >
          {error}
        </div>
      )}
      <button
        onClick={() => {
          mapRef.current?.fitBounds(
            [
              [94, -11],
              [142, 6],
            ],
            { padding: 30, duration: 500 },
          );
          setSelectedId(null);
          onSelectKoperasi?.(null);
        }}
        className="absolute left-3 top-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm"
      >
        <Compass size={14} className="text-red-800" /> Lihat Indonesia
      </button>
      {selected && (
        <aside
          aria-label={`Ringkasan ${selected.nama}`}
          className="absolute inset-y-0 right-0 z-10 flex w-full flex-col overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-xl sm:w-80"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-800">
                Koperasi contoh
              </span>
              <h3 className="mt-2 font-bold text-slate-900">{selected.nama}</h3>
            </div>
            <button
              onClick={() => {
                setSelectedId(null);
                onSelectKoperasi?.(null);
              }}
              aria-label="Tutup detail peta"
              className="rounded-lg p-1 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            {selected.desa}, {selected.kecamatan}
            <br />
            {selected.kabupaten}, {selected.provinsiNama}
          </p>
          <dl className="mt-5 space-y-4 text-xs">
            {[
              ["Anggota", selected.jumlahAnggota.toLocaleString("id-ID")],
              ["Aset profil", formatRupiah(selected.totalAset)],
              ["Komoditas", selected.komoditasUtama],
              ["Mitra penyerapan", selected.mitraOfftaker || "Belum terdata"],
            ].map(([name, value]) => (
              <div key={name}>
                <dt className="text-slate-500">{name}</dt>
                <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={`/pers/dashboard/village/${selected.id}${modelQuery ? `?${modelQuery}` : ""}`}
            className="mt-auto flex items-center justify-between gap-2 rounded-lg bg-red-800 px-4 py-3 text-xs font-bold text-white"
          >
            Buka profil koperasi <ChevronRight size={16} />
          </Link>
        </aside>
      )}
    </div>
  );
}
