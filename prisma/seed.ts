import { PrismaClient, StatusKoperasi } from "@prisma/client";
const prisma = new PrismaClient();

const provinsiData = [
  { id: "11", nama: "Aceh", latitude: 4.695, longitude: 96.749 },
  { id: "12", nama: "Sumatera Utara", latitude: 2.116, longitude: 99.545 },
  { id: "13", nama: "Sumatera Barat", latitude: -0.739, longitude: 100.800 },
  { id: "14", nama: "Riau", latitude: 0.293, longitude: 101.706 },
  { id: "15", nama: "Jambi", latitude: -1.610, longitude: 103.613 },
  { id: "16", nama: "Sumatera Selatan", latitude: -3.319, longitude: 103.914 },
  { id: "17", nama: "Bengkulu", latitude: -3.580, longitude: 102.344 },
  { id: "18", nama: "Lampung", latitude: -4.558, longitude: 105.406 },
  { id: "19", nama: "Kep. Bangka Belitung", latitude: -2.741, longitude: 106.440 },
  { id: "21", nama: "Kep. Riau", latitude: 3.946, longitude: 108.143 },
  { id: "31", nama: "DKI Jakarta", latitude: -6.175, longitude: 106.845 },
  { id: "32", nama: "Jawa Barat", latitude: -6.921, longitude: 107.607 },
  { id: "33", nama: "Jawa Tengah", latitude: -7.150, longitude: 110.140 },
  { id: "34", nama: "DI Yogyakarta", latitude: -7.797, longitude: 110.370 },
  { id: "35", nama: "Jawa Timur", latitude: -7.536, longitude: 112.238 },
  { id: "36", nama: "Banten", latitude: -6.405, longitude: 106.064 },
  { id: "51", nama: "Bali", latitude: -8.409, longitude: 115.189 },
  { id: "52", nama: "Nusa Tenggara Barat", latitude: -8.652, longitude: 117.362 },
  { id: "53", nama: "Nusa Tenggara Timur", latitude: -8.658, longitude: 121.079 },
  { id: "61", nama: "Kalimantan Barat", latitude: -0.279, longitude: 111.475 },
  { id: "62", nama: "Kalimantan Tengah", latitude: -1.682, longitude: 113.384 },
  { id: "63", nama: "Kalimantan Selatan", latitude: -3.092, longitude: 115.283 },
  { id: "64", nama: "Kalimantan Timur", latitude: 1.693, longitude: 116.419 },
  { id: "65", nama: "Kalimantan Utara", latitude: 3.073, longitude: 116.041 },
  { id: "71", nama: "Sulawesi Utara", latitude: 0.625, longitude: 123.975 },
  { id: "72", nama: "Sulawesi Tengah", latitude: -1.431, longitude: 121.445 },
  { id: "73", nama: "Sulawesi Selatan", latitude: -3.669, longitude: 119.974 },
  { id: "74", nama: "Sulawesi Tenggara", latitude: -4.145, longitude: 122.175 },
  { id: "75", nama: "Gorontalo", latitude: 0.698, longitude: 122.447 },
  { id: "76", nama: "Sulawesi Barat", latitude: -2.844, longitude: 119.232 },
  { id: "81", nama: "Maluku", latitude: -3.239, longitude: 130.145 },
  { id: "82", nama: "Maluku Utara", latitude: 1.570, longitude: 127.809 },
  { id: "91", nama: "Papua", latitude: -4.270, longitude: 138.080 },
  { id: "92", nama: "Papua Barat", latitude: -1.338, longitude: 133.174 },
  { id: "93", nama: "Papua Selatan", latitude: -6.731, longitude: 140.670 },
  { id: "94", nama: "Papua Tengah", latitude: -3.590, longitude: 136.200 },
  { id: "95", nama: "Papua Pegunungan", latitude: -4.000, longitude: 138.500 },
  { id: "96", nama: "Papua Barat Daya", latitude: -1.500, longitude: 132.000 },
];

const jenisUsahaOptions = [
  "Simpan Pinjam", "Pertanian", "Perikanan", "Peternakan",
  "Perdagangan", "Kerajinan", "Pariwisata", "Jasa",
  "Produksi", "Konsumsi"
];

function pick<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const namaDepan = [
  "Maju", "Sejahtera", "Makmur", "Bersama", "Mandiri",
  "Harapan", "Berkah", "Karya", "Tani", "Bahari",
  "Gotong Royong", "Sumber", "Tunas", "Mekar", "Lestari",
  "Gemilang", "Sentosa", "Abadi", "Cahaya", "Mutiara"
];

const namaBelakang = [
  "Jaya", "Utama", "Sejati", "Baru", "Desa",
  "Bersatu", "Nusantara", "Bangkit", "Mulia", "Sentral"
];

const desaNames = [
  "Sukamaju", "Cibadak", "Karangsari", "Tanjungsari", "Margahayu",
  "Sukarame", "Padasuka", "Ciampea", "Tegallega", "Mulyasari",
  "Mekarjaya", "Sindangsari", "Cipaku", "Neglasari", "Jayaraga",
  "Sukamanah", "Cimahi", "Mekarsari", "Pakemitan", "Sukabumi",
  "Wanasaba", "Kedungwuni", "Wonorejo", "Sumberagung", "Rejosari",
  "Giripurno", "Sendangmulyo", "Kebondalem", "Ngadirejo", "Purwodadi",
  "Karangtengah", "Tamansari", "Banyumanik", "Sumbergondo", "Gondangdia",
  "Patemon", "Ketapang", "Sukawati", "Seminyak", "Ubud",
  "Sanur", "Mataram", "Labuan", "Sorong", "Merauke",
  "Jayapura", "Manokwari", "Ternate", "Ambon", "Kendari"
];

const kabupatenNames = [
  "Kab. Bogor", "Kab. Bandung", "Kab. Sleman", "Kab. Malang", "Kab. Gianyar",
  "Kab. Lombok Barat", "Kab. Kuningan", "Kab. Klaten", "Kab. Jember", "Kab. Tabanan",
  "Kab. Bantul", "Kab. Karanganyar", "Kab. Banyuwangi", "Kab. Badung", "Kab. Garut",
  "Kab. Pontianak", "Kab. Banjar", "Kab. Kutai Kartanegara", "Kab. Manado", "Kab. Makassar",
  "Kab. Sorong", "Kab. Jayapura", "Kab. Merauke", "Kab. Aceh Besar", "Kab. Deli Serdang",
  "Kab. Padang Pariaman", "Kab. Kampar", "Kab. Batanghari", "Kab. Ogan Ilir", "Kab. Rejang Lebong",
  "Kab. Lampung Tengah", "Kab. Bangka", "Kab. Bintan", "Kab. Tangerang", "Kab. Manokwari",
  "Kab. Gorontalo", "Kab. Mamuju", "Kab. Konawe", "Kab. Poso", "Kab. Halmahera Utara",
  "Kab. Maluku Tengah", "Kab. Kupang", "Kab. Sumbawa", "Kab. Barito Kuala", "Kab. Kotawaringin",
  "Kab. Bulungan", "Kab. Minahasa", "Kab. Sigi", "Kab. Bone", "Kab. Tolitoli"
];

const kecamatanNames = [
  "Kec. Cibinong", "Kec. Lembang", "Kec. Depok", "Kec. Lawang", "Kec. Ubud",
  "Kec. Gerung", "Kec. Kadugede", "Kec. Prambanan", "Kec. Tanggul", "Kec. Kediri",
  "Kec. Sedayu", "Kec. Tawangmangu", "Kec. Genteng", "Kec. Mengwi", "Kec. Samarang",
  "Kec. Sungai Raya", "Kec. Martapura", "Kec. Tenggarong", "Kec. Wanea", "Kec. Biringkanaya",
  "Kec. Aimas", "Kec. Sentani", "Kec. Naukenjerai", "Kec. Darussalam", "Kec. Pancur Batu",
  "Kec. Batang Anai", "Kec. Bangkinang", "Kec. Muara Bulian", "Kec. Indralaya", "Kec. Curup",
  "Kec. Gunung Sugih", "Kec. Sungailiat", "Kec. Tanjung Pinang", "Kec. Tigaraksa", "Kec. Rendani",
  "Kec. Limboto", "Kec. Kalukku", "Kec. Unaaha", "Kec. Poso Kota", "Kec. Tobelo",
  "Kec. Masohi", "Kec. Kupang Tengah", "Kec. Sumbawa Besar", "Kec. Alalak", "Kec. Pangkalan Bun",
  "Kec. Tanjung Selor", "Kec. Tondano", "Kec. Kulawi", "Kec. Tanete Riattang", "Kec. Baolan"
];

async function main() {
  console.log("Seeding provinsi...");
  for (const p of provinsiData) {
    await prisma.provinsi.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }

  console.log("Seeding koperasi...");
  const koperasiData = provinsiData.map((prov, idx) => {
    const jmlKoperasi = idx < 10 ? 2 : 1;
    return Array.from({ length: jmlKoperasi }, (_, j) => {
      const depan = namaDepan[(idx * 3 + j) % namaDepan.length];
      const belakang = namaBelakang[(idx * 2 + j) % namaBelakang.length];
      const statusVal: StatusKoperasi =
        rand(1, 10) <= 7 ? "AKTIF" : rand(1, 10) <= 5 ? "TIDAK_AKTIF" : "BEKU";
      return {
        nama: `KSP ${depan} ${belakang}`,
        noRegistrasi: `KDMP-${prov.id}-${String(j + 1).padStart(3, "0")}`,
        provinsiId: prov.id,
        kabupaten: kabupatenNames[(idx + j) % kabupatenNames.length],
        kecamatan: kecamatanNames[(idx + j) % kecamatanNames.length],
        desa: desaNames[(idx + j) % desaNames.length],
        alamat: `Jl. Koperasi No. ${rand(1, 100)}, RT ${rand(1, 10)}/RW ${rand(1, 5)}`,
        latitude: prov.latitude! + (Math.random() - 0.5) * 0.5,
        longitude: prov.longitude! + (Math.random() - 0.5) * 0.5,
        status: statusVal,
        jenisUsaha: pick(jenisUsahaOptions, rand(1, 3)),
        jumlahAnggota: rand(25, 500),
        totalAset: BigInt(rand(50, 2000)) * 1_000_000n,
        totalShu: BigInt(rand(5, 200)) * 1_000_000n,
        volumeUsaha: BigInt(rand(20, 1500)) * 1_000_000n,
        tahunBerdiri: rand(2018, 2024),
        ketua: `H. ${["Ahmad", "Budi", "Siti", "Dewi", "Agus", "Rina", "Hasan", "Fatimah", "Joko", "Sri"][idx % 10]} ${["Suparjo", "Wahyudi", "Hartono", "Rahayu", "Pranoto", "Mulyani", "Santoso", "Wibowo", "Kusuma", "Lestari"][(idx + j) % 10]}`,
        telepon: `08${rand(10, 99)}${rand(1000000, 9999999)}`,
        email: `ksp.${depan.toLowerCase().replace(/ /g, "")}.${prov.id}@gmail.com`,
      };
    });
  }).flat();

  for (const k of koperasiData) {
    await prisma.koperasi.upsert({
      where: { noRegistrasi: k.noRegistrasi },
      update: {},
      create: k,
    });
  }

  console.log(`Seeded ${provinsiData.length} provinsi, ${koperasiData.length} koperasi.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
