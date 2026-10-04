# 05 — Panduan Development (untuk IDE / AI Coding Assistant)

Baca bersama `02`, `03`, dan `04`.

## 1. Konteks Singkat untuk Assistant
> Bangun web dashboard **read-only** untuk monitoring Koperasi Desa/Kelurahan Merah Putih dengan Next.js (App Router, TypeScript), Tailwind + shadcn/ui, Prisma + PostgreSQL, MapLibre GL, Recharts, React Flow, TanStack Table/Query, Zod, Auth.js. Hanya ada peran **VIEWER**. Tidak ada form tambah/ubah/hapus dan tidak ada endpoint tulis. Data dimuat lewat seed dan skrip import CLI. Bahasa UI: Indonesia. Rancang agar peran dan fitur tulis mudah ditambah kemudian (lihat `03` bagian 8).

## 2. Roadmap Implementasi

### Sprint 0 — Fondasi
- [ ] Inisialisasi Next.js + TS + Tailwind + shadcn/ui
- [ ] Prisma + Postgres; skema sesuai `03`
- [ ] Auth.js (login viewer), middleware proteksi, `lib/rbac.ts` (`can()` — Fase 1 hanya izin baca)
- [ ] Layout global (sidebar, topbar, filter wilayah/periode, footer data freshness)
- [ ] `db:seed`: wilayah + data dummy + akun viewer demo

### Sprint 1 — Data inti & Peta
- [ ] Endpoint daftar & detail koperasi (GET)
- [ ] Halaman Koperasi: tabel server-side, filter, ekspor CSV
- [ ] Peta: `/api/map/cooperatives` (bbox+zoom), clustering, filter, panel detail
- [ ] Profil koperasi (tab Ringkasan, Legalitas, Fisik, Riwayat Tahap)

### Sprint 2 — Dashboard & Progres
- [ ] Endpoint statistik (overview, funnel, tren, ranking, attention)
- [ ] Halaman Overview
- [ ] Halaman Progres (funnel + macet)

### Sprint 3 — Bisnis & Alur Produk
- [ ] Unit usaha + metrik bulanan (tab profil + halaman Unit Usaha)
- [ ] Label kesehatan usaha (aturan transparan)
- [ ] Katalog produk + tabel pergerakan
- [ ] Halaman Alur Produk (React Flow) + tab di profil

### Sprint 4 — Data tooling & Finalisasi
- [ ] CLI import (cooperatives, stages, units, metrics, products, movements) + `--dry-run` + laporan error
- [ ] Template CSV + README cara import
- [ ] Halaman Tentang Data + Laporan/ekspor
- [ ] Polesan: skeleton, empty state, responsif
- [ ] Uji, deploy produksi, dokumentasi serah terima

## 3. Data Dummy (Seed)
- **Wilayah:** minimal 5–8 provinsi dengan beberapa kab/kota, kecamatan, desa (subset; tandai sebagai contoh bila bukan data resmi).
- **Koperasi:** 800–2.000 titik dengan koordinat **di daratan** wilayah terpilih (bukan acak di laut). Distribusi tahap tidak seragam, mis.: 5% musdesus, 20% badan hukum, 15% pengurus, 20% pembangunan, 15% perlengkapan, 15% operasional mulai, 10% stabil.
- **Unit usaha:** 1–4 unit per koperasi; aktif hanya untuk koperasi di tahap operasional ke atas.
- **Metrik bulanan:** 6–12 bulan terakhir dengan tren naik/turun dan variasi ringan.
- **Produk:** 15–25 (beras, minyak goreng, gula, LPG 3 kg, pupuk, obat umum, dll).
- **Mitra:** 5–10 pemasok/BUMN fiktif atau generik.
- **Pergerakan:** beberapa ratus dengan status bervariasi.
- Tampilkan banner **Data Contoh**. Jangan memakai nama pejabat atau data pribadi nyata.

## 4. Konvensi Kode
- TypeScript strict; Zod untuk validasi query & skrip import.
- Query di `lib/queries/*`; komponen UI tidak mengakses DB langsung.
- Seluruh route handler hanya mengekspor `GET` dan memanggil `requireAuth()` + `can(user,'read',resource)`.
- `lib/mutations/` dibiarkan kosong (placeholder) agar jelas tempat fitur tulis nanti.
- Teks UI dikumpulkan di satu tempat; ambang & konfigurasi di `lib/config.ts`.
- Commit kecil; branch per fitur; preview PR di Vercel.

## 5. Pengujian
| Level | Cakupan minimal |
|---|---|
| Unit | Format tanggal/rupiah, aturan "macet", skor kesehatan, validator import |
| Integrasi | Endpoint statistik & peta; **semua endpoint menolak tanpa login**; metode selain GET ditolak |
| Import | Baris valid/invalid, idempotensi (jalankan dua kali hasil sama) |
| Manual | Responsif, performa peta dengan 10.000 titik dummy |

## 6. Definition of Done (per fitur)
1. Memenuhi AC di `02`
2. Terautentikasi dan hanya-baca
3. Loading/empty/error state tersedia
4. Responsif minimal tablet
5. Tanpa error console / lint
6. Terdokumentasi singkat di README

## 7. Checklist Rilis Demo
- [ ] Env var produksi terpasang di Vercel
- [ ] Migrasi & seed berjalan di database produksi
- [ ] Akun viewer demo siap
- [ ] Banner "Data Contoh" aktif (bila dummy)
- [ ] Uji di Chrome desktop + HP
- [ ] Backup database aktif
- [ ] Naskah demo 5–7 menit: Overview → Peta → Profil → Progres → Alur Produk

## 8. Checklist Menambah Peran & Fitur Tulis Nanti
1. Tambahkan nilai peran di enum `Role` dan aturan di `lib/rbac.ts`
2. Aktifkan `scopeByRegion(user)` untuk peran bercakupan wilayah
3. Buat fungsi di `lib/mutations/` memakai skema Zod yang sudah ada
4. Tambahkan route `POST/PATCH` + CSRF + audit log
5. Tambahkan UI form/tombol pada tempat yang sudah disiapkan (header profil, toolbar tabel)
6. Pindahkan importer ke UI (wizard) memakai `lib/importers/`

## 9. Prompt Awal untuk IDE
```
Konteks: baca PRD di /docs/prd (01–05). Mulai dari Sprint 0.
Tugas: inisialisasi Next.js (App Router, TS), Tailwind, shadcn/ui, Prisma+Postgres.
Aplikasi READ-ONLY dengan satu peran VIEWER; jangan buat endpoint/form tulis.
Buat skema Prisma sesuai 03, seed dummy sesuai 05 bagian 3, layout global sesuai 04.
Siapkan lib/rbac.ts dan folder lib/mutations (kosong) sesuai 03 bagian 8.
Jangan membuat fitur di luar Fase 1. Tanyakan dulu bila ada ambiguitas.
```
