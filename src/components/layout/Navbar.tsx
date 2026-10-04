"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ExternalLink } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [corpUniOpen, setCorpUniOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-[75px]">
        {/* Logo Primer SIMKOPDES */}
        <Link href="/" className="flex items-center">
          <img
            src="/images/primer.webp"
            alt="SIMKOPDES - Koperasi Desa/Kelurahan Merah Putih"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-x-7">
          <Link
            href="/"
            className={`text-base font-medium transition-colors ${
              pathname === "/" ? "text-[#a0b73e] font-bold" : "text-gray-900 hover:text-[#a0b73e]"
            }`}
          >
            Beranda
          </Link>

          {/* Corporate University Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCorpUniOpen(!corpUniOpen)}
              onMouseEnter={() => setCorpUniOpen(true)}
              className="flex items-center gap-1 text-base font-medium text-gray-900 hover:text-[#a0b73e] transition-colors"
            >
              <span>Corporate University</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {corpUniOpen && (
              <div
                onMouseLeave={() => setCorpUniOpen(false)}
                className="absolute left-0 mt-2 w-52 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50 animate-fade-in"
              >
                <a
                  href="https://lms.kop.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-[#065366] transition-colors"
                >
                  Akses Pembelajaran
                </a>
                <a
                  href="https://lms.kop.go.id/game"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-[#065366] transition-colors"
                >
                  Gim
                </a>
              </div>
            )}
          </div>

          <Link
            href="/pers/dashboard"
            className={`text-base font-medium transition-colors ${
              pathname.startsWith("/pers/dashboard") || pathname === "/statistik"
                ? "text-[#a0b73e] font-bold"
                : "text-gray-900 hover:text-[#a0b73e]"
            }`}
          >
            Statistik
          </Link>

          <a
            href="https://trade.simkopdes.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-gray-900 hover:text-[#a0b73e] transition-colors"
          >
            Coop Trade
          </a>

          {/* Action Button: Masuk */}
          <Link
            href="/pers/dashboard"
            className="px-5 py-2 rounded-md font-semibold text-sm text-white bg-[#a0b73e] hover:bg-[#859d18] transition-colors shadow-xs"
          >
            Masuk
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 hover:text-[#a0b73e]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-5 space-y-3 shadow-md">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-900 hover:text-[#a0b73e]"
          >
            Beranda
          </Link>
          <Link
            href="/pers/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-900 hover:text-[#a0b73e]"
          >
            Statistik
          </Link>
          <a
            href="https://lms.kop.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base font-medium text-gray-700 hover:text-[#a0b73e]"
          >
            Corporate University
          </a>
          <a
            href="https://trade.simkopdes.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base font-medium text-gray-700 hover:text-[#a0b73e]"
          >
            Coop Trade
          </a>
          <div className="pt-2">
            <Link
              href="/pers/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-md font-semibold text-sm text-white bg-[#a0b73e] hover:bg-[#859d18]"
            >
              Masuk
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
