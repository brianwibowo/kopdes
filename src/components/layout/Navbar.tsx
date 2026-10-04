"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  ShoppingBag, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Beranda", href: "/", icon: LayoutDashboard },
    { label: "Statistik", href: "/pers/dashboard", icon: BarChart3 },
    { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  ];

  const isStatistikActive = pathname.startsWith("/pers/dashboard") || pathname === "/statistik";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-[74px]">
        {/* Logo Primer KOPDES Merah Putih */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/primer.webp"
            alt="KOPDES MERAH PUTIH"
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
            <span className="text-[13px] font-black tracking-tight text-slate-900 leading-none">
              KOPDES <span className="text-red-700">MERAH PUTIH</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
              Platform Monitoring & Komoditas Nasional
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Beranda, Statistik, Marketplace) */}
        <div className="hidden md:flex items-center gap-x-1 lg:gap-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/pers/dashboard"
                ? isStatistikActive
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "bg-red-50 text-red-800 border border-red-200/80 shadow-2xs"
                    : "text-slate-700 hover:text-red-700 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-red-700" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Status Badge */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
            <span>Viewer Resmi Nasional</span>
          </div>

          <Link
            href="/pers/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            <span>Buka Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-700 hover:text-red-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/pers/dashboard"
                ? isStatistikActive
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold ${
                  isActive
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-red-700" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
              <span>Viewer Resmi Nasional</span>
            </span>
            <Link
              href="/pers/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-red-700 font-bold"
            >
              Statistik →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
