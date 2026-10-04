import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  inverted?: boolean;
}

export function Logo({ className = "", size = "md", showTagline = true, inverted = false }: LogoProps) {
  const iconSize = size === "sm" ? 34 : size === "lg" ? 48 : 40;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Custom KDMP Vector Brandmark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
      >
        <defs>
          <linearGradient id="logoRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Shield / Badge Frame */}
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />

        {/* Red Flag Arch (Upper) */}
        <path
          d="M 6 22 C 6 13 13 7 24 7 C 35 7 42 13 42 22 C 35 19.5 29 23.5 24 20 C 19 16.5 13 20 6 22 Z"
          fill="url(#logoRedGrad)"
        />

        {/* White Base Arch (Lower) */}
        <path
          d="M 6 24 C 12 21.5 18 25 24 22 C 30 19 36 21.5 42 24 C 42 33 35 41 24 41 C 13 41 6 33 6 24 Z"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Golden Seed / Growth Sprout (Gotong Royong) */}
        <path
          d="M 24 13 C 24 13 28 18 28 22.5 C 28 25 26.2 27 24 27.8 C 21.8 27 20 25 20 22.5 C 20 18 24 13 24 13 Z"
          fill="url(#logoGoldGrad)"
        />
        <circle cx="24" cy="32.5" r="2.2" fill="url(#logoGoldGrad)" />
      </svg>

      {/* Brandmark Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[17px] sm:text-[19px] font-black tracking-tight ${
              inverted ? "text-white drop-shadow-xs" : "text-slate-900"
            }`}
          >
            KOPDES
          </span>
          <span
            className={`text-[17px] sm:text-[19px] font-black tracking-tight ${
              inverted ? "text-red-400 drop-shadow-xs" : "text-red-700"
            }`}
          >
            MERAH PUTIH
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[9.5px] sm:text-[10px] font-bold tracking-[0.14em] uppercase mt-1 ${
              inverted ? "text-slate-200/90 drop-shadow-xs" : "text-slate-500"
            }`}
          >
            Koperasi Desa Mandiri
          </span>
        )}
      </div>
    </div>
  );
}
