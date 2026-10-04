"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  ShoppingBag, 
  Menu, 
  X 
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Beranda", href: "/", icon: LayoutDashboard },
    { label: "Statistik", href: "/pers/dashboard", icon: BarChart3 },
    { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  ];

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;
  const isStatistikActive = pathname.startsWith("/pers/dashboard") || pathname === "/statistik";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-transparent shadow-none"
          : "bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-[74px]">
        {/* Custom Logo Brandmark */}
        <Link href="/" className="flex items-center group">
          <Logo size="md" inverted={isTransparent} />
        </Link>

        {/* Desktop Navigation Links: Beranda, Statistik, Marketplace */}
        <div className="hidden md:flex items-center gap-x-2">
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
                  isTransparent
                    ? isActive
                      ? "bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-xs"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                    : isActive
                    ? "bg-red-50 text-red-800 border border-red-200 shadow-2xs"
                    : "text-slate-700 hover:text-red-700 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isTransparent
                      ? isActive
                        ? "text-white"
                        : "text-white/80"
                      : isActive
                      ? "text-red-700"
                      : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-md transition-colors ${
              isTransparent
                ? "text-white hover:bg-white/10"
                : "text-slate-700 hover:text-red-700 hover:bg-slate-100"
            }`}
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
        </div>
      )}
    </nav>
  );
}
