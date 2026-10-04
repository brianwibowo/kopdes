import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Koperasi Desa/Kelurahan Merah Putih — SIMKOPDES",
  description:
    "Koperasi Desa/Kelurahan Merah Putih adalah koperasi yang beranggotakan warga yang berdomisili di desa atau kelurahan yang sama dan dibuktikan dengan kartu tanda penduduk.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-[#065366] selection:text-white pt-[75px]">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
