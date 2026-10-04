# 03 — Arsitektur, Model Data & API (Fase 1: Viewer / Read-only)

## 1. Stack yang Direkomendasikan
| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Full-stack satu repo, cocok untuk Vercel |
| UI | Tailwind CSS + shadcn/ui | Cepat, konsisten, mudah dikustom |
| Peta | **MapLibre GL JS** (+ tile OSM/MapTiler) | Tanpa lock-in, bagus untuk banyak titik |
| Grafik | Recharts (atau ECharts) | Cukup untuk kebutuhan |
| Diagram alur | React Flow (@xyflow/react) | Visualisasi supply chain |
| Tabel | TanStack Table | Sortir, filter, paginasi server-side |
| ORM | **Prisma** atau Drizzle | Tipe aman, migrasi |
| Database | **PostgreSQL** (Neon/Supabase), PostGIS opsional | Agregasi & geospasial |
| Auth | Auth.js (NextAuth) atau Better Auth | Sesi login viewer |
| Validasi | Zod | Satu skema untuk query API & skrip import |
| Data fetching | TanStack Query | Cache & revalidasi |
| Import/Ekspor | PapaParse, ExcelJS/SheetJS | CLI import & unduhan ekspor |
| Hosting | Vercel (app) + Postgres terkelola | Sesuai rencana |

> Vercel tidak menyediakan Postgres persisten sendiri untuk kasus ini; gunakan database terkelola terpisah.

## 2. Arsitektur
```
[Browser: Viewer]
     │ HTTPS
[Next.js on Vercel]
  ├─ UI (Server/Client Components)
  ├─ Route Handlers (GET only) → requireAuth() → queries → Prisma
  └─ Auth.js (sesi viewer)
                │
        [PostgreSQL]
                ▲
   [CLI developer: seed & import] (jalan lokal/CI, bukan bagian UI)
```
Prinsip: data **ditulis hanya oleh skrip developer**; aplikasi web hanya membaca.

## 3. Model Data

### 3.1 Referensi Wilayah
- `Region` — `id`, `code`, `name`, `level` (PROVINCE | REGENCY | DISTRICT | VILLAGE), `parentId`

### 3.2 Pengguna
- `User` — `id`, `name`, `email`, `passwordHash`, `role`, `regionScopeId` (nullable, **belum dipakai Fase 1**), `isActive`, timestamps
- Enum `Role`: Fase 1 hanya **`VIEWER`**. Nilai berikut disiapkan untuk fase lanjut: `ADMIN_PUSAT`, `ADMIN_WILAYAH`, `PENGURUS`, `MITRA`.

### 3.3 Koperasi
- `Cooperative` — `id`, `externalCode` (kunci import, unik), `name`, `type` (DESA | KELURAHAN), `villageRegionId`, `address`, `lat`, `lng`, `legalNumber`, `legalDate`, `memberCount`, `currentStage`, `physicalProgressPct`, `isOperating`, `createdAt`, `updatedAt`
- `CooperativeStageHistory` — `id`, `cooperativeId`, `stage`, `startedAt`, `completedAt`, `note`
- `BoardMember` — `id`, `cooperativeId`, `name`, `position`
- `Asset` — `id`, `cooperativeId`, `kind` (GUDANG | GERAI | KENDARAAN | PERALATAN), `condition`, `note`

### 3.4 Unit Usaha & Kinerja
- `BusinessUnit` — `id`, `cooperativeId`, `kind` (SEMBAKO | SIMPAN_PINJAM | APOTEK | KLINIK | LPG | PUPUK | HASIL_TANI | LOGISTIK | LAINNYA), `status` (RENCANA | AKTIF | NONAKTIF), `startedAt`
- `UnitMetricMonthly` — `id`, `businessUnitId`, `period` (YYYY-MM), `revenue`, `transactionCount`, unik(`businessUnitId`,`period`)

### 3.5 Produk & Alur
- `Product` — `id`, `name`, `category`, `unit`, `referencePrice`
- `Partner` — `id`, `name`, `type` (BUMN | PEMASOK | OFFTAKER | LAINNYA), `lat`, `lng`, `regionId`
- `ProductMovement` — `id`, `productId`, `fromType`, `fromId`, `toType`, `toId`, `quantity`, `unitPrice`, `date`, `status` (DIPESAN | DIKIRIM | DITERIMA | BATAL)
- `StockSnapshot` — `id`, `cooperativeId`, `productId`, `quantity`, `asOf`

### 3.6 Metadata Data
- `DataSourceInfo` — `id`, `entity`, `sourceName`, `lastImportedAt`, `isDummy`

> `AuditLog` tidak dibuat di Fase 1 (tidak ada perubahan lewat UI). Ditambahkan saat fitur tulis hadir.

### 3.7 Indeks Penting
`Cooperative(currentStage)`, `Cooperative(villageRegionId)`, geospasial pada `lat,lng` (atau PostGIS), `Region(parentId)`, `Region(level, code)`, `UnitMetricMonthly(period)`, `ProductMovement(date, productId)`.

### 3.8 Enum Tahap (`Stage`)
`MUSDESUS` → `BADAN_HUKUM` → `PENGURUS_MANAJER` → `PEMBANGUNAN` → `PERLENGKAPAN` → `OPERASIONAL_MULAI` → `BEROPERASI_STABIL` *(final menyesuaikan hasil konfirmasi)*

## 4. Kontrak API (semua GET, terautentikasi)
Format error `{ error: { code, message } }`; paginasi `?page=&pageSize=`.

| Endpoint | Deskripsi |
|---|---|
| `/api/stats/overview` | KPI agregat; param `regionId`, `from`, `to` |
| `/api/stats/stage-funnel` | Jumlah koperasi per tahap |
| `/api/stats/revenue-trend` | Tren omzet bulanan |
| `/api/stats/region-ranking` | Ranking; param `metric`, `level` |
| `/api/stats/attention` | Koperasi macet / omzet turun |
| `/api/map/cooperatives` | GeoJSON ringan; param `bbox`, `zoom`, `stage`, `unitKind`, `regionId` |
| `/api/cooperatives` | Daftar (filter, sortir, search, paginasi) |
| `/api/cooperatives/:id` | Detail profil |
| `/api/cooperatives/:id/units` | Unit usaha + metrik |
| `/api/cooperatives/:id/flow` | Alur produk dari sisi koperasi |
| `/api/products` | Katalog produk |
| `/api/products/:id/flow` | Graf alur (nodes + edges) |
| `/api/movements` | Tabel pergerakan (filter) |
| `/api/regions` | Referensi wilayah (`parentId`) |
| `/api/data-info` | Metadata sumber & waktu pembaruan |
| `/api/export/:entity` | Unduh CSV/Excel mengikuti filter |
| `/api/auth/*` | Login/logout/sesi |

**Strategi peta skala besar:** kirim berdasarkan bbox+zoom; zoom jauh mengembalikan agregat (grid/wilayah), zoom dekat mengembalikan titik. Payload titik minimal: `id`, `lat`, `lng`, `stage`, `name`; detail dimuat saat klik.

## 5. Aturan Bisnis (dihitung saat baca)
- **Macet:** `hari sejak mulai tahap > ambang per tahap` (ambang default di file konfigurasi `lib/config.ts`).
- **Skor kesehatan usaha (P1):** aturan sederhana & transparan, mis. tren omzet 3 bulan terakhir + jumlah unit aktif; alasan skor ditampilkan.
- **Status "beroperasi":** koperasi di tahap `OPERASIONAL_MULAI` atau `BEROPERASI_STABIL`.

## 6. Skrip Data (CLI)
```
pnpm db:seed                         # wilayah + data dummy
pnpm import cooperatives file.csv
pnpm import stages file.csv
pnpm import units file.csv
pnpm import metrics file.csv
pnpm import products file.csv
pnpm import movements file.csv
pnpm import --dry-run <entity> file  # validasi tanpa menulis
```
Aturan: validasi Zod per baris, upsert berdasarkan `externalCode`/kunci alami (idempoten), laporan error per baris, memperbarui `DataSourceInfo.lastImportedAt`.

## 7. Keamanan
- Password di-hash (argon2/bcrypt); cookie sesi `httpOnly`, `secure`, `sameSite`.
- Middleware menolak semua request tanpa sesi; semua route data hanya mengekspor handler `GET`.
- Rate limiting pada login; validasi query param dengan Zod.
- Rahasia hanya di environment variables Vercel.
- Pertimbangkan kebutuhan lokasi data (residensi data) bila dipakai instansi pemerintah.
- Pada fase tulis nanti: tambahkan CSRF, validasi payload, audit log.

## 8. Kesiapan Ekspansi (agar mudah ditambah nanti)
| Kebutuhan masa depan | Yang sudah disiapkan sekarang |
|---|---|
| Peran baru | Enum `Role` + `lib/rbac.ts` (`can(user, action, resource)`), semua halaman/route memanggilnya meski Fase 1 hanya `VIEWER` |
| Akses per wilayah | Kolom `regionScopeId` + helper `scopeByRegion(user)` yang saat ini tidak memfilter |
| Fitur tulis | Struktur `lib/queries/` (baca) dipisah dari `lib/mutations/` (kosong di Fase 1); skema Zod dipakai ulang untuk form |
| Import via UI | Logika import di `lib/importers/` dipakai bersama oleh CLI; UI tinggal memanggilnya |
| Audit log | Tambah tabel `AuditLog` + pembungkus mutasi |
| Integrasi API | Importer menerima sumber generik; tambahkan adapter baru |

## 9. Struktur Folder (Saran)
```
/src
  /app
    /(auth)/login
    /(dashboard)
      /overview  /peta  /koperasi  /koperasi/[id]
      /progres  /unit-usaha  /alur-produk  /laporan  /tentang-data
    /api/...            (GET only)
  /components  /ui  /charts  /map  /tables  /flow
  /lib
    db.ts  auth.ts  rbac.ts  config.ts
    /queries   /mutations(kosong)   /importers   /validators
/prisma  schema.prisma  seed.ts
/scripts  import.ts
/data-templates  *.csv
```

## 10. Lingkungan & Deploy
- Env: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_MAP_STYLE_URL` (+ key tile bila perlu).
- Pipeline: GitHub → Vercel (preview per PR, produksi dari `main`).
- Migrasi: `prisma migrate deploy` saat rilis; seed/import dijalankan manual atau CI terhadap database produksi.
- Backup otomatis di penyedia DB.
