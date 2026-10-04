"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../ui/Logo";
import { 
  LayoutDashboard, 
  MapPin, 
  Building2, 
  TrendingUp, 
  Info, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Ringkasan", href: "/", icon: LayoutDashboard },
    { label: "Peta Sebaran", href: "/peta", icon: MapPin },
    { label: "Direktori Koperasi", href: "/koperasi", icon: Building2 },
    { label: "Tahapan Progres", href: "/progres", icon: TrendingUp },
  ];

  return (
    <>
      {/* Banner Transparansi Data Simulasi (Standar Anti-Slop R-17) */}
      <div className="bg-amber-950/70 border-b border-amber-800/40 px-4 py-1.5 text-center text-xs text-amber-200 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-semibold">Mode Pratinjau:</span>
        <span>Menampilkan 50 Koperasi Contoh di 38 Provinsi Seluruh Indonesia</span>
        <span className="hidden md:inline text-amber-400/60">•</span>
        <span className="hidden md:inline text-amber-300/80">Basis Data: Pelaporan Oktober 2026</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-white border border-slate-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-red-500" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Role Badge */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Viewer (Read-Only)</span>
            </div>

            <a
              href="https://simkopdes.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors px-2 py-1"
              title="Portal Resmi SIMKOPDES"
            >
              <span>SIMKOPDES Resmi</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-red-500" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 px-3">
              <span>Mode: Viewer (Read-Only)</span>
              <a
                href="https://simkopdes.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 flex items-center gap-1"
              >
                SIMKOPDES Resmi <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
