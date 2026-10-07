"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  CircleHelp,
  Database,
  Network,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SimkopdesMap } from "@/components/map/SimkopdesMap";
import { MOCK_KOPERASI, PROVINSI_LIST } from "@/lib/mockData";
import { formatAngka, formatRupiah } from "@/lib/data";
import { downloadFile } from "@/lib/export";
import {
  buildModel,
  DEFAULT_OPTIONS,
  MODEL_ASSUMPTIONS,
  MODEL_TABS,
  MODEL_VERSION,
  modelDataset,
  optionsQuery,
  parseOptions,
  periodLabel,
  scopeLabel,
  type ModelOptions,
  type ModelView,
} from "./model";
import { modelCsv, supplySvg } from "./exports";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-red-800 focus:ring-2 focus:ring-red-100";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-red-300 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed";
const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function ModellingWorkspace({
  view = "overview",
}: {
  view?: ModelView;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const options = useMemo(
    () => parseOptions(Object.fromEntries(params.entries())),
    [params],
  );
  const result = useMemo(() => buildModel(options), [options]);
  const baseline = useMemo(
    () => buildModel({ ...options, price: 0, cost: 0, lag: 0 }),
    [options],
  );
  const [notice, setNotice] = useState("");
  const query = optionsQuery(options);
  const selectedTab = MODEL_TABS.find((t) => t.id === view);
  const title = selectedTab?.title || "Statistik Kopdes";
  const hasData = result.records.length > 0;
  const isScenario = Boolean(options.price || options.cost || options.lag);
  const cash = view === "arus-kas";
  const totals = result.totals;
  const visibleCooperatives = MOCK_KOPERASI.filter(
    (k) => options.province === "ALL" || k.provinsiId === options.province,
  );
  const change = (update: Partial<ModelOptions>) => {
    const next = { ...options, ...update };
    window.history.replaceState(null, "", `${pathname}?${optionsQuery(next)}`);
    setNotice("");
  };
  const exportResult = (format: "csv" | "json" | "svg") => {
    const filename = `kopdes-${view}-${options.province}-${options.from}-${options.to}`;
    if (format === "csv")
      downloadFile(
        modelCsv(result),
        `${filename}.csv`,
        "text/csv;charset=utf-8;",
      );
    if (format === "json")
      downloadFile(
        JSON.stringify(modelDataset(result), null, 2),
        `${filename}.json`,
        "application/json",
      );
    if (format === "svg")
      downloadFile(supplySvg(result), `${filename}.svg`, "image/svg+xml");
    setNotice(
      `Ekspor ${format.toUpperCase()} disiapkan sesuai filter dan skenario aktif.`,
    );
  };
  const metrics =
    view === "overview" || view === "peta"
      ? [
          [
            "Koperasi dalam dataset",
            formatAngka(totals.cooperativeCount),
            `${result.provinces.length} provinsi terwakili`,
          ],
          [
            "Anggota",
            formatAngka(totals.members),
            "Data profil koperasi terpilih",
          ],
          [
            "Pendapatan periode",
            formatRupiah(totals.revenue),
            "Sama dengan model keuntungan",
          ],
          [
            "Laba periode",
            formatRupiah(totals.profit),
            "Pendapatan dikurangi biaya",
          ],
        ]
      : cash
        ? [
            [
              "Saldo awal periode",
              formatRupiah(totals.openingCash),
              "Membawa saldo bulan sebelumnya",
            ],
            [
              "Penerimaan kas",
              formatRupiah(totals.cashIn),
              `Jeda penerimaan ${options.lag} bulan`,
            ],
            [
              "Pembayaran kas",
              formatRupiah(totals.cashOut),
              "Seluruh biaya dibayar bulan berjalan",
            ],
            [
              "Saldo akhir periode",
              formatRupiah(totals.closingCash),
              "Saldo awal + penerimaan − pembayaran",
            ],
          ]
        : [
            [
              "Pendapatan",
              formatRupiah(totals.revenue),
              "Penjualan dalam periode terpilih",
            ],
            [
              "Total biaya",
              formatRupiah(totals.expenses),
              "Pembelian + distribusi + operasional",
            ],
            [
              "Laba model",
              formatRupiah(totals.profit),
              "Pendapatan dikurangi biaya",
            ],
            [
              "Margin laba",
              `${totals.revenue ? ((totals.profit / totals.revenue) * 100).toFixed(1) : "0.0"}%`,
              "Laba dibandingkan pendapatan",
            ],
          ];

  return (
    <div className="model-workspace min-h-screen bg-slate-50 pb-16">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs leading-relaxed text-amber-900">
        <strong>DEMO / MVP</strong> · Dataset sintetis 2026 dan rumus ilustratif
        untuk presentasi. Belum memakai data atau model penelitian 2027.
      </div>
      <div className="mx-auto max-w-7xl space-y-6 px-4 pt-8 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-800">
              <Network size={16} /> Kopdes · Data & modelling
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              {selectedTab?.description ||
                "Satu dataset untuk membaca kondisi koperasi, mengeksplorasi model, dan menghasilkan keluaran yang bisa diolah kembali."}
            </p>
          </div>
          <Link
            href="/koperasi"
            className={`${secondaryButton} no-print shrink-0`}
          >
            Direktori koperasi <ArrowUpRight size={15} />
          </Link>
        </header>

        <nav
          aria-label="Modul analisis"
          className="no-print flex gap-2 overflow-x-auto border-b border-slate-200 pb-3"
        >
          {[{ id: "overview", title: "Ringkasan" }, ...MODEL_TABS].map((t) => (
            <Link
              key={t.id}
              href={`${t.id === "overview" ? "/pers/dashboard" : `/modelling/${t.id}`}?${query}`}
              aria-current={view === t.id ? "page" : undefined}
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${view === t.id ? "bg-red-800 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-red-50 hover:text-red-800"}`}
            >
              {t.title}
            </Link>
          ))}
        </nav>

        <section
          aria-label="Filter dataset"
          className="no-print rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <SlidersHorizontal size={16} className="text-red-800" /> Pilih
              dataset
            </h2>
            <button
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-800"
              onClick={() => change(DEFAULT_OPTIONS)}
            >
              <RotateCcw size={13} /> Reset semua
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.5fr_1fr_1fr]">
            <label className="text-xs font-semibold text-slate-600">
              Provinsi
              <select
                aria-label="Provinsi"
                value={options.province}
                onChange={(e) =>
                  change({ province: e.target.value, cooperative: "ALL" })
                }
                className={inputClass}
              >
                <option value="ALL">Seluruh Indonesia</option>
                {!PROVINSI_LIST.some((p) => p.id === options.province) &&
                  options.province !== "ALL" && (
                    <option value={options.province}>
                      Wilayah tidak ditemukan
                    </option>
                  )}
                {PROVINSI_LIST.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Koperasi
              <select
                aria-label="Koperasi"
                value={options.cooperative}
                onChange={(e) => change({ cooperative: e.target.value })}
                className={inputClass}
              >
                <option value="ALL">Semua koperasi di wilayah</option>
                {!visibleCooperatives.some(
                  (k) => k.id === options.cooperative,
                ) &&
                  options.cooperative !== "ALL" && (
                    <option value={options.cooperative}>
                      Koperasi di luar pilihan / tidak ditemukan
                    </option>
                  )}
                {visibleCooperatives.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Dari bulan
              <input
                aria-label="Dari bulan"
                type="month"
                value={options.from}
                onChange={(e) =>
                  e.target.value && change({ from: e.target.value })
                }
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Sampai bulan
              <input
                aria-label="Sampai bulan"
                type="month"
                value={options.to}
                onChange={(e) =>
                  e.target.value && change({ to: e.target.value })
                }
                className={inputClass}
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Data contoh tersedia Januari–Desember 2026. Filter dan skenario
            tersimpan di alamat halaman.
          </p>
        </section>

        <section
          className="no-print rounded-2xl border border-red-100 bg-red-50/60 p-5"
          aria-label="Skenario simulasi"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-red-900">
              Simulasi usaha{" "}
              <span className="ml-2 rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
                {isScenario ? "Skenario aktif" : "Kondisi dasar"}
              </span>
            </h2>
            <button
              onClick={() => change({ price: 0, cost: 0, lag: 0 })}
              className="text-xs text-red-800 underline underline-offset-4"
            >
              Kembalikan kondisi dasar
            </button>
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <label className="text-xs font-semibold text-slate-700">
              Perubahan harga jual{" "}
              <strong className="float-right text-red-800">
                {options.price > 0 ? "+" : ""}
                {options.price}%
              </strong>
              <input
                aria-label="Perubahan harga jual"
                className="mt-4 w-full accent-red-800"
                type="range"
                min="-50"
                max="50"
                value={options.price}
                onChange={(e) => change({ price: Number(e.target.value) })}
              />
              <span className="mt-1 block font-normal text-slate-500">
                Volume penjualan diasumsikan tetap.
              </span>
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Perubahan seluruh biaya{" "}
              <strong className="float-right text-red-800">
                {options.cost > 0 ? "+" : ""}
                {options.cost}%
              </strong>
              <input
                aria-label="Perubahan seluruh biaya"
                className="mt-4 w-full accent-red-800"
                type="range"
                min="-30"
                max="50"
                value={options.cost}
                onChange={(e) => change({ cost: Number(e.target.value) })}
              />
              <span className="mt-1 block font-normal text-slate-500">
                Pembelian, distribusi, dan operasional.
              </span>
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Jeda penerimaan penjualan
              <select
                aria-label="Jeda penerimaan"
                value={options.lag}
                onChange={(e) => change({ lag: Number(e.target.value) })}
                className={inputClass}
              >
                <option value="0">Langsung pada bulan yang sama</option>
                <option value="1">Diterima 1 bulan kemudian</option>
                <option value="2">Diterima 2 bulan kemudian</option>
              </select>
            </label>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {scopeLabel(options)}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {periodLabel(options)} · Harga {options.price > 0 ? "+" : ""}
              {options.price}% · Biaya {options.cost > 0 ? "+" : ""}
              {options.cost}% · Jeda {options.lag} bulan
            </p>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <button
              disabled={!hasData}
              className={secondaryButton}
              onClick={() => exportResult("csv")}
            >
              <ArrowDownToLine size={14} /> CSV / Excel
            </button>
            <button
              disabled={!hasData}
              className={secondaryButton}
              onClick={() => exportResult("json")}
            >
              JSON
            </button>
            {view === "supply-chain" && (
              <button
                disabled={!hasData}
                className={secondaryButton}
                onClick={() => exportResult("svg")}
              >
                Diagram SVG
              </button>
            )}
            <button
              disabled={!hasData}
              className={secondaryButton}
              onClick={() => window.print()}
            >
              Cetak / PDF
            </button>
          </div>
        </div>
        <p
          role="status"
          className={notice ? "no-print text-xs text-emerald-700" : "sr-only"}
        >
          {notice}
        </p>

        {!hasData ? (
          <div
            role="alert"
            className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"
          >
            <Database className="mx-auto mb-3 text-slate-400" size={32} />
            <h3 className="font-bold">
              {result.validRange
                ? "Tidak ada data untuk pilihan ini"
                : "Periode belum valid"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {result.validRange
                ? "Pilih wilayah yang tersedia dan periode pada tahun 2026."
                : "Bulan awal harus lebih awal atau sama dengan bulan akhir."}
            </p>
            <button
              className={`${secondaryButton} mt-5`}
              onClick={() => change(DEFAULT_OPTIONS)}
            >
              Tampilkan dataset demo
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map(([label, value, detail]) => (
                <div
                  key={label}
                  className="metric-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-medium text-slate-500">{label}</p>
                  <p className="my-3 text-2xl font-extrabold tracking-tight text-slate-900">
                    {value}
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
            {view === "overview" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-bold">Perkembangan kelembagaan</h3>
                  <p className="text-xs text-slate-500">
                    {totals.activeCount} aktif · {totals.attentionCount} perlu
                    atensi · {totals.nibCount} NIB pada dataset
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    ["TAHAP_1_PERSIAPAN", "I · Persiapan"],
                    ["TAHAP_2_KELEMBAGAAN", "II · Kelembagaan"],
                    ["TAHAP_3_PERMODALAN", "III · Permodalan"],
                    ["TAHAP_4_OPERASIONAL", "IV · Operasional"],
                  ].map(([stage, label]) => (
                    <div key={stage} className="border-l-2 border-red-200 pl-3">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-2 text-xl font-bold">
                        {
                          result.cooperatives.filter((k) => k.tahap === stage)
                            .length
                        }{" "}
                        <span className="text-xs font-normal text-slate-500">
                          koperasi
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {isScenario && (
              <div className="flex flex-col gap-2 rounded-xl border border-red-100 bg-white px-5 py-4 text-sm sm:flex-row sm:justify-between">
                <span className="font-semibold text-slate-700">
                  Dampak terhadap kondisi dasar pada pilihan yang sama
                </span>
                <span>
                  Laba:{" "}
                  <strong
                    className={
                      totals.profit - baseline.totals.profit < 0
                        ? "text-red-700"
                        : "text-emerald-700"
                    }
                  >
                    {formatRupiah(totals.profit - baseline.totals.profit)}
                  </strong>{" "}
                  · Saldo akhir kas:{" "}
                  <strong>
                    {formatRupiah(
                      totals.closingCash - baseline.totals.closingCash,
                    )}
                  </strong>
                </span>
              </div>
            )}

            {view === "overview" && (
              <section
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
                aria-label="Jelajahi model"
              >
                {MODEL_TABS.map((t, index) => (
                  <Link
                    href={`/modelling/${t.id}?${query}`}
                    key={t.id}
                    className="group rounded-2xl bg-slate-900 p-5 text-white transition hover:bg-red-900"
                  >
                    <span className="flex justify-between text-xs text-slate-300">
                      MODEL 0{index + 1}
                      <ArrowUpRight size={18} />
                    </span>
                    <h3 className="mt-5 font-bold">{t.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {t.description}
                    </p>
                  </Link>
                ))}
              </section>
            )}

            {view === "supply-chain" && (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold">Aliran usaha koperasi</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Skema agregat dari koperasi terpilih. Hubungan tiap koperasi
                  tersedia pada tabel dan dataset JSON.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <div
                    className="min-w-[660px]"
                    dangerouslySetInnerHTML={{
                      __html: supplySvg(result).replace(/^<\?xml[^>]*>\s*/, ""),
                    }}
                  />
                </div>
              </section>
            )}

            {view === "peta" && (
              <section className="space-y-3">
                <p className="text-xs text-slate-500">
                  Satu titik = satu koperasi contoh. Koordinat bersifat
                  ilustratif; klik titik untuk membuka profil. Lokasi mitra
                  belum dipetakan.
                </p>
                <div className="no-print">
                  <SimkopdesMap
                    koperasiList={result.cooperatives}
                    modelQuery={query}
                  />
                </div>
                <p className="print-only text-sm">
                  Peta interaktif tersedia di website. Tabel di bawah memuat
                  lokasi koperasi terpilih.
                </p>
              </section>
            )}

            {(view === "keuntungan" || cash || view === "overview") && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-2">
                  <BarChart3 size={18} className="text-red-800" />
                  <h3 className="font-bold">
                    {cash
                      ? "Pergerakan kas bulanan"
                      : "Pendapatan dan laba bulanan"}
                  </h3>
                </div>
                <div className="no-print h-80 min-w-0 w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={0}
                    initialDimension={{ width: 800, height: 320 }}
                  >
                    {cash ? (
                      <LineChart
                        data={result.trend}
                        margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis
                          width={80}
                          tickFormatter={formatRupiah}
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip formatter={(value) => rupiah(Number(value))} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <ReferenceLine y={0} stroke="#94a3b8" />
                        <Line
                          dataKey="cashIn"
                          name="Penerimaan"
                          stroke="#0f766e"
                          strokeWidth={2}
                        />
                        <Line
                          dataKey="cashOut"
                          name="Pembayaran"
                          stroke="#e49b50"
                          strokeWidth={2}
                        />
                        <Line
                          dataKey="closingCash"
                          name="Saldo akhir"
                          stroke="#991b1b"
                          strokeWidth={3}
                        />
                      </LineChart>
                    ) : (
                      <BarChart
                        data={result.trend}
                        margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis
                          width={80}
                          tickFormatter={formatRupiah}
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip formatter={(value) => rupiah(Number(value))} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <ReferenceLine y={0} stroke="#94a3b8" />
                        <Bar
                          dataKey="revenue"
                          name="Pendapatan"
                          fill="#cbd5e1"
                          radius={[3, 3, 0, 0]}
                        />
                        <Bar
                          dataKey="profit"
                          name="Laba"
                          fill="#991b1b"
                          radius={[3, 3, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <details
                  className="model-monthly-table mt-4 text-xs"
                  open={cash || view === "keuntungan"}
                >
                  <summary className="no-print cursor-pointer font-semibold text-red-800">
                    Rincian perhitungan bulanan (rupiah)
                  </summary>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          {(cash
                            ? [
                                "Bulan",
                                "Saldo awal",
                                "Penerimaan",
                                "Pembayaran",
                                "Saldo akhir",
                              ]
                            : [
                                "Bulan",
                                "Pendapatan",
                                "Pembelian",
                                "Distribusi",
                                "Operasional",
                                "Laba",
                              ]
                          ).map((c) => (
                            <th key={c} className="px-3 py-3 font-semibold">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.trend.map((row) => (
                          <tr
                            key={row.month}
                            className="border-b border-slate-100"
                          >
                            <td className="px-3 py-3 font-medium">
                              {row.month}
                            </td>
                            {(cash
                              ? [
                                  row.openingCash,
                                  row.cashIn,
                                  row.cashOut,
                                  row.closingCash,
                                ]
                              : [
                                  row.revenue,
                                  row.goods,
                                  row.logistics,
                                  row.operating,
                                  row.profit,
                                ]
                            ).map((n, i) => (
                              <td
                                key={i}
                                className={`px-3 py-3 tabular-nums ${n < 0 ? "text-red-700" : ""}`}
                              >
                                {formatAngka(n)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </section>
            )}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
                <h3 className="font-bold">
                  {view === "supply-chain"
                    ? "Hubungan supply chain"
                    : "Koperasi dalam hasil model"}
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {totals.cooperativeCount} koperasi
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Koperasi & wilayah</th>
                      <th className="px-5 py-3">
                        {view === "supply-chain"
                          ? "Produsen → mitra"
                          : "Komoditas"}
                      </th>
                      <th className="px-5 py-3 text-right">
                        {cash ? "Saldo awal" : "Pendapatan"}
                      </th>
                      <th className="px-5 py-3 text-right">
                        {cash ? "Saldo akhir" : "Laba"}
                      </th>
                      <th className="no-print px-5 py-3">Profil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.cooperativeRows.map((row) => (
                      <tr
                        key={row.cooperative.id}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="min-w-52 px-5 py-4">
                          <div className="font-semibold text-slate-900">
                            {row.cooperative.nama}
                          </div>
                          <div className="mt-1 text-slate-500">
                            {row.cooperative.kabupaten} ·{" "}
                            {row.cooperative.provinsiNama}
                          </div>
                          {view === "peta" && (
                            <div className="mt-1 text-slate-500">
                              {row.cooperative.latitude},{" "}
                              {row.cooperative.longitude}
                            </div>
                          )}
                        </td>
                        <td className="min-w-44 px-5 py-4 text-slate-600">
                          {view === "supply-chain" ? (
                            <>
                              <div>Anggota {row.cooperative.desa}</div>
                              <div className="my-1 font-semibold text-red-800">
                                ↓ {row.cooperative.komoditasUtama}
                              </div>
                              <div>
                                {row.cooperative.mitraOfftaker ||
                                  "Mitra belum terdata"}
                              </div>
                            </>
                          ) : (
                            row.cooperative.komoditasUtama
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums">
                          {formatRupiah(cash ? row.openingCash : row.revenue)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums">
                          {formatRupiah(cash ? row.closingCash : row.profit)}
                        </td>
                        <td className="no-print px-5 py-4">
                          <Link
                            aria-label={`Profil ${row.cooperative.nama}`}
                            className="font-semibold text-red-800 underline underline-offset-4"
                            href={`/pers/dashboard/village/${row.cooperative.id}?${query}`}
                          >
                            Lihat
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        <details className="model-assumptions rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-600">
          <summary className="flex cursor-pointer items-center gap-2 font-bold text-slate-800">
            <CircleHelp size={16} /> Sumber data & asumsi model
          </summary>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed">
            {MODEL_ASSUMPTIONS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
          <p className="mt-4 font-mono text-[10px]">
            Dataset: {MODEL_VERSION} · Ekspor CSV berisi baris koperasi-bulan.
            JSON menyertakan asumsi dan hubungan supply chain.
          </p>
        </details>
        <p className="text-xs leading-relaxed text-slate-500">
          Dataset, filter, dan fungsi perhitungan digunakan bersama oleh
          statistik, keempat model, serta ekspor. CSV dapat dibuka di Excel.
          Untuk PDF, pilih “Simpan sebagai PDF” pada dialog cetak; laporan
          memuat tabel, sementara grafik dan peta interaktif tersedia di
          website.
        </p>
      </div>
    </div>
  );
}
