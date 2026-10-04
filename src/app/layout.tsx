import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KOPDES MERAH PUTIH — Platform Monitoring & Spasial Nasional",
  description: "Dashboard monitoring sebaran spasial, tahapan progres, dan performa komoditas Koperasi Desa Merah Putih di seluruh 38 provinsi Indonesia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-red-600 selection:text-white">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {children}
        </main>

        {/* Institutional Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-400">Koperasi Desa Merah Putih (KDMP)</span>
              <span className="mx-2">•</span>
              <span>Platform Analitik & Monitoring Spasial Nasional</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-[11px] bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                Data Simulasi Terverifikasi Daratan (38 Provinsi)
              </span>
              <span>Hak Cipta © 2026</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
