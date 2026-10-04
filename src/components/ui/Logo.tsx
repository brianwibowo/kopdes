import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? 28 : size === "md" ? 36 : 48;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Emblem Merah Putih KDMP */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <circle cx="24" cy="24" r="22" fill="#0f172a" stroke="#dc2626" strokeWidth="2.5" />
        {/* Lingkaran Roda Gerigi Koperasi */}
        <circle cx="24" cy="24" r="16" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        
        {/* Perisai Merah Putih */}
        <path
          d="M24 9L34 14V24C34 30.5 29.5 36.5 24 38C18.5 36.5 14 30.5 14 24V14L24 9Z"
          fill="#1e293b"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />
        {/* Belahan Merah Atas */}
        <path
          d="M24 10.5L32.5 14.8V23.5H15.5V14.8L24 10.5Z"
          fill="#dc2626"
        />
        {/* Belahan Putih Bawah */}
        <path
          d="M15.5 23.5H32.5C32.5 29.2 28.5 34.5 24 36.2C19.5 34.5 15.5 29.2 15.5 23.5Z"
          fill="#f8fafc"
        />
        {/* Bintang Emas Pusat Kemakmuran */}
        <polygon
          points="24,19 25.5,22.5 29,22.5 26,24.5 27.2,28 24,25.8 20.8,28 22,24.5 19,22.5 22.5,22.5"
          fill="#f59e0b"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-white leading-none text-base">
              KOPDES
            </span>
            <span className="font-extrabold text-red-500 tracking-tight leading-none text-base">
              MERAH PUTIH
            </span>
          </div>
          <span className="text-[10px] tracking-wider uppercase text-slate-400 font-medium mt-0.5">
            Monitoring Spasial Nasional
          </span>
        </div>
      )}
    </div>
  );
}
