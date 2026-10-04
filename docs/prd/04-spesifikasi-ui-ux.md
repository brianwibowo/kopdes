# 04 — Spesifikasi UI/UX (Fase 1: Viewer / Read-only)

## 1. Prinsip Visual
- Tema bersih, profesional, nuansa **merah–putih** sebagai identitas (merah sebagai aksen, bukan dominan; latar putih/abu muda).
- **Light mode** utama; dark mode P2.
- Tipografi sans-serif modern (mis. Inter / Plus Jakarta Sans). Angka KPI besar dan tebal.
- Kartu bersudut membulat, bayangan halus, jarak lega.
- Warna status konsisten di seluruh aplikasi (peta, chip, grafik).
- **Tidak ada tombol Tambah/Ubah/Hapus** di antarmuka; fokus pada eksplorasi dan pembacaan data.

### Palet Status (saran)
| Tahap/Status | Warna |
|---|---|
| Musyawarah desa | Abu `#94A3B8` |
| Badan hukum | Biru `#3B82F6` |
| Pengurus & manajer | Ungu `#8B5CF6` |
| Pembangunan | Kuning `#F59E0B` |
| Perlengkapan | Oranye `#F97316` |
| Operasional mulai | Hijau muda `#22C55E` |
| Beroperasi stabil | Hijau tua `#15803D` |
| Perhatian/macet | Merah `#DC2626` |

## 2. Layout Global
- **Sidebar kiri** (collapsible): Overview, Peta, Koperasi, Progres, Unit Usaha, Alur Produk, Laporan, Tentang Data.
- **Topbar:** filter wilayah global (bertingkat), filter periode, pencarian cepat, menu profil (nama, logout).
- **Konten:** grid kartu; breadcrumb untuk halaman detail.
- Mobile: sidebar jadi drawer; tabel menjadi kartu atau scroll horizontal.
- Footer kecil: "Data diperbarui: …" + banner **"Data Contoh"** bila dummy.

## 3. Daftar Halaman

### 3.1 Login
Form email+password, logo, pesan error jelas. Tanpa registrasi dan tanpa "lupa password" di Fase 1 (reset oleh developer).

### 3.2 Overview (`/overview`)
- Baris 1: 4–5 kartu KPI (Total Kopdes, Berbadan Hukum, Bangunan Selesai, Beroperasi, Omzet Periode) + indikator perubahan.
- Baris 2: mini-peta sebaran (klik → Peta) + donut status tahap.
- Baris 3: tren omzet + tabel ranking wilayah.
- Baris 4: panel "Perlu Perhatian".
- Semua widget mengikuti filter global.

### 3.3 Peta (`/peta`)
- Peta layar penuh; **panel filter** kiri, **panel detail** kanan saat pin diklik (bottom sheet di mobile).
- Cluster berwarna dengan angka; pin individual berwarna sesuai tahap.
- Legenda di pojok; tombol "Reset tampilan"; search autocomplete di atas peta.
- Panel detail: nama, alamat, chip status, anggota, ikon unit usaha, mini-progres, tombol **Lihat Profil**.

### 3.4 Daftar Koperasi (`/koperasi`)
- Tabel: nama, wilayah, tahap (chip), anggota, unit aktif, omzet bulan terakhir.
- Toolbar: pencarian, filter bertingkat, tombol **Ekspor**.
- Klik baris → profil.

### 3.5 Profil Koperasi (`/koperasi/[id]`)
Header: nama, chip tahap, wilayah, tombol Ekspor ringkas. Tab:
1. **Ringkasan** — KPI koperasi, mini-peta, timeline singkat
2. **Legalitas & Pengurus** — nomor badan hukum, daftar pengurus
3. **Fisik & Aset** — progres pembangunan (bar %), daftar aset
4. **Unit Usaha** — kartu per unit + grafik omzet
5. **Alur Produk** — diagram masuk/keluar
6. **Riwayat Tahap** — stepper dengan tanggal

### 3.6 Progres (`/progres`)
- Funnel horizontal per tahap (jumlah & persen); klik segmen untuk memfilter tabel.
- Panel "Macet > N hari".

### 3.7 Unit Usaha (`/unit-usaha`)
- Kartu ringkasan per jenis unit (jumlah koperasi aktif, omzet total).
- Grafik perbandingan antar jenis unit dan antar wilayah.
- Tabel kinerja dengan label kesehatan (baik/perhatian/kritis) + alasan.

### 3.8 Alur Produk (`/alur-produk`)
- Pilih produk → diagram **React Flow**: Pemasok → Koperasi (gudang) → Gerai → Anggota.
- Ketebalan garis ∝ volume; klik node melihat rincian; filter periode & wilayah.
- Tab "Katalog Produk" dan "Pergerakan" (tabel baca-saja).

### 3.9 Laporan (`/laporan`)
Pilih jenis data + filter → pratinjau → unduh CSV/Excel (PDF P2).

### 3.10 Tentang Data (`/tentang-data`)
Sumber data, waktu pembaruan terakhir per entitas, penanda data contoh, glosarium indikator (tahap, "macet", skor kesehatan), dan catatan keterbatasan data.

## 4. Komponen Reusable
`KpiCard`, `StatusChip`, `RegionFilter` (bertingkat), `PeriodFilter`, `DataTable` (server-side), `MapView`, `MapFilterPanel`, `CoopDetailPanel`, `StageStepper`, `FunnelChart`, `TrendChart`, `FlowDiagram`, `ExportButton`, `DataFreshnessBadge`, `EmptyState`, `Skeleton`.

## 5. State & Interaksi
- **Loading:** skeleton, bukan spinner penuh.
- **Kosong:** pesan jelas ("Belum ada data untuk filter ini") + tombol reset filter.
- **Error:** pesan ramah + coba lagi.
- Filter tersimpan di URL (query string) agar tautan bisa dibagikan.
- Format: tanggal `4 Okt 2026`; uang ringkas `Rp 1,25 jt` dan detail `Rp 1.250.000`.

## 6. Responsif
| Breakpoint | Perilaku |
|---|---|
| ≥1280 | Layout penuh, panel samping |
| 768–1279 | Sidebar ringkas (ikon), grid 2 kolom |
| <768 | Drawer, 1 kolom, panel detail peta jadi bottom sheet |

## 7. Aksesibilitas
Kontras WCAG AA, fokus terlihat, label ARIA pada kontrol peta/grafik utama, chip status memakai ikon/teks selain warna.

## 8. Aset yang Dibutuhkan
Logo (jika ada), ikon jenis unit usaha, palet final, gaya tile peta, ilustrasi empty state.

## 9. Catatan Kesiapan Ekspansi UI
Tata letak sengaja menyisakan tempat untuk aksi masa depan (mis. toolbar tabel, header profil) tanpa menampilkannya sekarang. Item menu baru (mis. "Pengaturan") dapat ditambahkan tanpa mengubah layout.
