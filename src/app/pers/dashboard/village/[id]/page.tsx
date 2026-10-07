import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  MapPin,
  Network,
} from "lucide-react";
import { formatAngka, formatRupiah, getKoperasiById } from "@/lib/data";
import {
  buildModel,
  MODEL_TABS,
  optionsQuery,
  parseOptions,
  periodLabel,
} from "@/features/modelling/model";

export default async function VillagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const koperasi = getKoperasiById(id);
  if (!koperasi) notFound();
  const options = {
    ...parseOptions(await searchParams),
    province: koperasi.provinsiId,
    cooperative: koperasi.id,
  };
  const result = buildModel(options);
  const query = optionsQuery(options);
  const metrics = [
    ["Anggota", formatAngka(koperasi.jumlahAnggota)],
    ["Aset profil", formatRupiah(koperasi.totalAset)],
    ["Pendapatan periode", formatRupiah(result.totals.revenue)],
    ["Laba periode", formatRupiah(result.totals.profit)],
  ];
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs text-amber-900">
        <strong>DEMO / MVP</strong> · Profil dan keuangan sintetis untuk
        presentasi. Data legalitas belum diverifikasi.
      </div>
      <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/pers/dashboard?${query}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-red-800"
        >
          <ArrowLeft size={14} /> Kembali ke statistik terpilih
        </Link>
        <header className="rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
          <div className="mb-3 flex items-center gap-2 text-xs text-red-200">
            <Building2 size={16} /> {koperasi.noRegistrasi}
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            {koperasi.nama}
          </h1>
          <p className="mt-3 flex items-start gap-2 text-sm text-slate-300">
            <MapPin size={16} className="shrink-0" />
            {koperasi.desa}, {koperasi.kecamatan}, {koperasi.kabupaten},{" "}
            {koperasi.provinsiNama}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-3 py-1.5">
              {koperasi.status.replaceAll("_", " ")}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">
              {koperasi.tahap.replaceAll("_", " ")}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">
              Berdiri {koperasi.tahunBerdiri}
            </span>
          </div>
        </header>
        <div>
          <h2 className="font-bold text-slate-900">Ringkasan data dan model</h2>
          <p className="mt-1 text-xs text-slate-500">
            {periodLabel(options)} · Harga {options.price}% · Biaya{" "}
            {options.cost}% · Jeda penerimaan {options.lag} bulan. Anggota dan
            aset berasal dari profil; pendapatan dan laba mengikuti model.
          </p>
        </div>
        {!result.records.length && (
          <p
            role="alert"
            className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900"
          >
            Tidak ada data model pada periode ini. Data contoh tersedia
            Januari–Desember 2026.
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-3 text-2xl font-extrabold text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </div>
        <section className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="flex items-center gap-2 font-bold text-red-900">
            <Network size={18} /> Jelajahi model koperasi ini
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Wilayah, koperasi, periode, dan skenario langsung diteruskan ke
            modul pilihan.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODEL_TABS.map((tab) => (
              <Link
                key={tab.id}
                href={`/modelling/${tab.id}?${query}`}
                className="flex items-center justify-between rounded-lg border border-red-100 bg-white px-4 py-3 text-sm font-bold text-red-800"
              >
                {tab.title}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 font-bold">Identitas kelembagaan</h2>
            <dl className="space-y-4 text-sm">
              {[
                ["Ketua (contoh)", koperasi.ketua],
                ["Alamat", koperasi.alamat],
                [
                  "Nomor badan hukum (contoh)",
                  koperasi.skBadanHukum || "Belum terdata",
                ],
                ["NIB (contoh)", koperasi.nib || "Belum terdata"],
                ["NPWP, RAT, dan sertifikasi", "Belum tersedia dalam dataset"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-1 break-words font-medium text-slate-800">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 font-bold">Usaha dan pendampingan</h2>
            <dl className="space-y-4 text-sm">
              {[
                ["Jenis usaha", koperasi.jenisUsaha.join(", ")],
                ["Komoditas utama", koperasi.komoditasUtama],
                [
                  "Mitra pada dataset",
                  koperasi.mitraOfftaker || "Belum terdata",
                ],
                [
                  "Koordinat ilustratif",
                  `${koperasi.latitude}, ${koperasi.longitude}`,
                ],
                [
                  "Catatan monitoring",
                  koperasi.catatanMonitoring ||
                    "Tidak ada catatan pada dataset contoh.",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-1 font-medium text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
