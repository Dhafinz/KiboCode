import React from "react";

interface SmartGateProps {
  isOpen: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function SmartGate({ isOpen, style, className = "" }: SmartGateProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "110px",
        height: "150px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Radiant Glow di sekitar Gerbang saat Terbuka (Hijau/Cyan) atau Tertutup (Oranye) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "110px",
          borderRadius: "16px",
          background: isOpen
            ? "radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(0, 242, 254, 0.25) 50%, transparent 75%)"
            : "radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(239, 68, 68, 0.2) 50%, transparent 75%)",
          filter: "blur(10px)",
          zIndex: 1,
          pointerEvents: "none",
          transition: "background 400ms ease",
        }}
      />

      {/* Status Badge Float: Kunci / Terbuka */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          zIndex: 4,
          padding: "3px 10px",
          borderRadius: "9999px",
          backgroundColor: isOpen ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)",
          color: "#ffffff",
          fontSize: "0.75rem",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          boxShadow: isOpen
            ? "0 0 12px rgba(16, 185, 129, 0.8)"
            : "0 0 12px rgba(239, 68, 68, 0.8)",
          transition: "all 300ms ease",
        }}
      >
        <span>{isOpen ? "🔓 TERBUKA" : "🔒 TERTUTUP"}</span>
      </div>

      {/* SVG Smart Gate 2.5D Lumina Town */}
      <svg
        viewBox="0 0 120 160"
        width="100%"
        height="100%"
        style={{
          position: "relative",
          zIndex: 2,
          filter: isOpen
            ? "drop-shadow(0 0 12px rgba(16, 185, 129, 0.7))"
            : "drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))",
          transition: "filter 300ms ease",
        }}
      >
        <defs>
          <linearGradient id="gatePillarDark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="gatePillarRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="laserClosed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <linearGradient id="laserOpen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
        </defs>

        {/* 1. Tiang Kiri Gerbang */}
        <rect x="12" y="30" width="14" height="115" rx="3" fill="url(#gatePillarDark)" stroke="#475569" strokeWidth="1.5" />
        <rect x="10" y="24" width="18" height="8" rx="2" fill="url(#gatePillarRim)" />
        <circle cx="19" cy="42" r="3.5" fill={isOpen ? "#10b981" : "#ef4444"} />
        <circle cx="19" cy="80" r="2.5" fill="url(#gatePillarRim)" />
        <rect x="8" y="142" width="22" height="6" rx="2" fill="url(#gatePillarRim)" />

        {/* 2. Tiang Kanan Gerbang */}
        <rect x="94" y="30" width="14" height="115" rx="3" fill="url(#gatePillarDark)" stroke="#475569" strokeWidth="1.5" />
        <rect x="92" y="24" width="18" height="8" rx="2" fill="url(#gatePillarRim)" />
        <circle cx="101" cy="42" r="3.5" fill={isOpen ? "#10b981" : "#ef4444"} />
        <circle cx="101" cy="80" r="2.5" fill="url(#gatePillarRim)" />
        <rect x="90" y="142" width="22" height="6" rx="2" fill="url(#gatePillarRim)" />

        {/* 3. Balok Atas Penghubung (Header Arch) */}
        <path d="M 22 36 L 98 36 L 94 44 L 26 44 Z" fill="url(#gatePillarDark)" stroke="#475569" strokeWidth="1" />
        <rect x="44" y="26" width="32" height="10" rx="3" fill="#0f172a" stroke={isOpen ? "#10b981" : "#f59e0b"} strokeWidth="1.5" />
        <circle cx="60" cy="31" r="3" fill={isOpen ? "#10b981" : "#f59e0b"} />

        {/* 4. Kisi Laser / Palang Pintu Digital */}
        {!isOpen ? (
          /* Kondisi Tertutup: Kisi Laser Merah/Oranye Menyilang */
          <g>
            {/* Palang Horisontal Laser */}
            <rect x="26" y="58" width="68" height="5" rx="2" fill="url(#laserClosed)" filter="drop-shadow(0 0 6px #ef4444)" />
            <rect x="26" y="78" width="68" height="5" rx="2" fill="url(#laserClosed)" filter="drop-shadow(0 0 6px #ef4444)" />
            <rect x="26" y="98" width="68" height="5" rx="2" fill="url(#laserClosed)" filter="drop-shadow(0 0 6px #ef4444)" />
            <rect x="26" y="118" width="68" height="5" rx="2" fill="url(#laserClosed)" filter="drop-shadow(0 0 6px #ef4444)" />

            {/* Palang Laser Diagonal */}
            <line x1="28" y1="58" x2="92" y2="122" stroke="url(#laserClosed)" strokeWidth="3" opacity="0.8" />
            <line x1="92" y1="58" x2="28" y2="122" stroke="url(#laserClosed)" strokeWidth="3" opacity="0.8" />

            {/* Inti Kunci Gerbang */}
            <circle cx="60" cy="88" r="10" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
            <text x="60" y="92" textAnchor="middle" fontSize="10" fill="#fecdd3" fontWeight="bold">✕</text>
          </g>
        ) : (
          /* Kondisi Terbuka: Palang Laser Terbuka ke Samping, Jalur Hijau Bebas */
          <g>
            {/* Sisi Kiri Terlipat */}
            <rect x="26" y="58" width="12" height="65" rx="2" fill="url(#laserOpen)" opacity="0.7" />
            {/* Sisi Kanan Terlipat */}
            <rect x="82" y="58" width="12" height="65" rx="2" fill="url(#laserOpen)" opacity="0.7" />

            {/* Partikel Sinar Jalur Terbuka di Tengah */}
            <path d="M 52 110 L 60 96 L 68 110" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 52 86 L 60 72 L 68 86" fill="none" stroke="#00f2fe" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>
    </div>
  );
}
