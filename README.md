# SIMKOPDES — website dan modelling MVP

Satu aplikasi Next.js untuk website Kopdes, direktori, marketplace contoh, statistik, dan empat modul modelling. Seluruh angka merupakan **data sintetis untuk presentasi**, bukan hasil survei atau model ilmiah tervalidasi.

## Menjalankan dan memeriksa

```bash
npm ci
npm run dev
npm test
npm run lint
npm run build
npm start
```

Gunakan Node.js yang didukung versi Next.js pada `package.json` (build lokal diverifikasi dengan Node 20). Test memakai TypeScript yang sudah terpasang dan runner bawaan Node, tanpa dependency tambahan.

## Halaman

- `/` — beranda, perkembangan kelembagaan, dan peta contoh.
- `/koperasi` — direktori, pencarian, filter, pagination, dan ekspor CSV.
- `/marketplace` — komoditas contoh dan tautan model tiap koperasi.
- `/pers/dashboard` — ringkasan statistik dari mesin model yang sama.
- `/pers/dashboard/village/[id]` — profil dan model koperasi; ID tidak ditemukan menghasilkan 404.
- `/modelling/supply-chain` — diagram hubungan agregat dan tabel produsen–koperasi–mitra.
- `/modelling/peta` — peta koperasi terpilih dan tabel lokasi.
- `/modelling/keuntungan` — pendapatan, rincian biaya, laba, dan skenario.
- `/modelling/arus-kas` — saldo awal, penerimaan, pembayaran, saldo akhir.
- `/modelling` dan `/peta` mengarah ke modul terkait; `/statistik`, `/progres`, dan `/koperasi/[id]` tetap tersedia sebagai alias.

## Sinkronisasi MVP

`src/lib/mockData.ts` adalah satu sumber profil dan angka tahunan. `src/features/modelling/model.ts` membuat data bulanan secara deterministik dan menyediakan satu fungsi perhitungan untuk statistik, profil, keempat modul, dan ekspor. Tidak ada salinan database atau hasil perhitungan terpisah antarmodul.

Navigasi Statistik/Modelling di header juga meneruskan filter aktif. Filter `province`, `cooperative`, `from`, `to`, `price`, `cost`, dan `lag` disimpan dalam query URL. Tautan antartab dan profil meneruskan pilihan tersebut. Refresh atau membagikan URL akan mereproduksi hasil yang sama. Perubahan skenario tidak mengubah dataset dasar. Ini belum merupakan sinkronisasi data lapangan atau penyimpanan lintas pengguna.

Dataset berisi 53 koperasi contoh pada 38 provinsi. Data bulanan tersedia Januari–Desember 2026, termasuk bulan yang belum berlangsung. Periode di luar dataset menampilkan keadaan kosong; rentang terbalik menampilkan pesan kesalahan.

## Perhitungan ilustratif

- `volumeUsaha` menjadi pendapatan contoh setahun; `totalShu` menjadi laba contoh setahun. Distribusi musiman bulanan menjaga total tahunan tetap sama melalui pembulatan kumulatif.
- Total biaya = pendapatan − laba. Alokasi contoh: pembelian 80%, distribusi 7%, dan sisanya operasional.
- Harga jual dapat diubah −50% sampai +50% dengan volume tetap. Biaya dapat diubah −30% sampai +50%.
- Saldo awal Januari = 10% aset. Biaya dibayar bulan berjalan. Penjualan diterima langsung atau setelah 1–2 bulan, tanpa piutang awal.
- Skenario berlaku mulai Januari; filter periode mengambil hasil dan membawa saldo sebelumnya. Saldo awal/akhir tidak dijumlahkan lintas bulan. Penerimaan setelah Desember tidak masuk kas tahun ini.
- Supply chain adalah skema hubungan ilustratif dalam rupiah. Belum mencakup optimasi distribusi, jarak rute, tonase, persediaan, atau lokasi mitra.

Asumsi juga tampil di aplikasi dan disertakan di JSON. Rumus dan format input nantinya perlu diganti/disepakati dengan periset saat dataset 2027 tersedia.

## Keluaran

- CSV UTF-8: satu baris koperasi-bulan dengan angka rupiah, identitas, filter, dan skenario. Bisa dibuka/diimpor ke Excel; **bukan berkas XLSX**.
- JSON: metadata, asumsi, profil koperasi, catatan bulanan, total, dan hubungan supply chain.
- SVG: diagram supply chain agregat sesuai pilihan.
- Cetak/PDF: dialog cetak browser; pilih “Simpan sebagai PDF”. Laporan memakai tabel; grafik dan peta interaktif dibaca di website. Tabel lokasi menggantikan peta pada laporan cetak.

Endpoint baca publik `/api/modelling` memakai mesin yang sama. Contoh:

```text
/api/modelling?province=32&from=2026-01&to=2026-04&price=10&cost=5&lag=1&format=json
```

Format tersedia: `json`, `csv`, `svg`. Tidak ada endpoint tulis atau penyimpanan file pada server. Endpoint ini hanya berisi fixture demo; jangan menggantinya dengan data sensitif tanpa kontrol akses.

## Hosting dan stack

Build produksi memakai opsi resmi `next build --webpack` agar dapat diverifikasi di lingkungan lokal yang membatasi port proses CSS Turbopack. Deployment tetap Next.js biasa.

Tetap menggunakan Next.js App Router, React, TypeScript, Tailwind CSS, Recharts, MapLibre GL, dan Lucide yang sudah ada. Ekspor memakai API browser; tidak ada library runtime baru. Basemap OpenStreetMap membutuhkan koneksi internet; tabel tetap tersedia jika peta gagal dimuat.

Deploy kembali **project Vercel yang sama** dengan framework Next.js, install `npm ci`, dan build `npm run build`. Route modelling akan tersedia pada domain website yang sama. Tidak perlu domain, aplikasi Vercel, VPS, database, atau environment variable baru untuk versi demo ini. Jangan gunakan `output: export` karena aplikasi menggunakan Route Handler dan route dinamis.

Scaffold Prisma pada repository belum dipakai oleh MVP. Ketika masuk implementasi data penelitian, tambahkan database/API, autentikasi, import dan validasi dataset, versi rumus, serta pengujian terhadap hasil periset. VPS dapat digunakan pada fase tersebut jika diperlukan.

## Alur presentasi

1. Buka Statistik dan periksa total nasional.
2. Pilih Jawa Barat, Januari–April 2026.
3. Buka Supply chain lalu Peta Kopdes; pilihan tetap sama.
4. Buka Keuntungan, ubah harga +10% dan biaya +5%.
5. Buka Arus kas, pilih jeda penerimaan 1 bulan dan lihat dampaknya.
6. Unduh CSV/JSON, ekspor diagram SVG, atau cetak laporan.
7. Buka profil salah satu koperasi dan kembali ke modelnya.

Pengujian mencakup rekonsiliasi tahunan, partisi provinsi, filter wilayah/periode, kesinambungan kas, skenario rugi, jeda penerimaan, input URL, serta konsistensi dan escaping ekspor.
