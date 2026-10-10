import React from "react";

interface StreetLampProps {
  isOn: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function StreetLamp({ isOn, style, className = "" }: StreetLampProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "90px",
        height: "170px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Radiant Light Cone (Cahaya Sorot ke Bawah saat Lampu Menyala) */}
      {isOn && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "36px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "160px",
            height: "140px",
            background:
              "radial-gradient(ellipse 65% 55% at 50% 10%, rgba(253, 224, 71, 0.45) 0%, rgba(245, 158, 11, 0.25) 45%, transparent 80%)",
            clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)",
            zIndex: 0,
            pointerEvents: "none",
            filter: "blur(4px)",
            animation: "pulseGlow 2.5s ease-in-out infinite",
          }}
        />
      )}

      {/* Golden Aura Glow di sekeliling Lentera */}
      {isOn && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(254, 240, 138, 0.85) 0%, rgba(245, 158, 11, 0.5) 50%, transparent 75%)",
            filter: "blur(12px)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Floating Sparkles saat menyala */}
      {isOn && (
        <>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "10px",
              left: "14px",
              fontSize: "14px",
              zIndex: 3,
              animation: "kiboFloat 3s ease-in-out infinite",
            }}
          >
            ✨
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "22px",
              right: "12px",
              fontSize: "12px",
              zIndex: 3,
              animation: "kiboFloat 2.4s ease-in-out infinite 0.5s",
            }}
          >
            ⭐
          </span>
        </>
      )}

      {/* SVG Gambar Tiang Lampu Bergaya 2.5D Lumina Town */}
      <svg
        viewBox="0 0 100 190"
        width="100%"
        height="100%"
        style={{
          position: "relative",
          zIndex: 2,
          filter: isOn
            ? "drop-shadow(0 0 16px rgba(245, 158, 11, 0.75))"
            : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
          transition: "filter 300ms ease",
        }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="metalDark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="metalRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <radialGradient id="lampBulbLit" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>

          <radialGradient id="lampBulbUnlit" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>
        </defs>

        {/* 1. Finial Tutup Atas Lampu */}
        <circle cx="50" cy="18" r="4" fill="url(#metalRim)" />
        <path
          d="M 50 14 L 52 18 L 48 18 Z"
          fill="#cbd5e1"
        />

        {/* 2. Top Roof / Canopy Lentera */}
        <path
          d="M 32 30 Q 50 18 68 30 L 72 35 L 28 35 Z"
          fill="url(#metalDark)"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        <rect x="26" y="34" width="48" height="4" rx="2" fill="url(#metalRim)" />

        {/* 3. Kaca Lentera & Bohlam */}
        {/* Latar Kaca Lentera */}
        <polygon
          points="32,38 68,38 62,68 38,68"
          fill={isOn ? "rgba(254, 240, 138, 0.45)" : "rgba(30, 41, 59, 0.7)"}
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Bohlam Inti */}
        <circle
          cx="50"
          cy="52"
          r="10"
          fill={isOn ? "url(#lampBulbLit)" : "url(#lampBulbUnlit)"}
        />

        {/* Rangka Besi Lentera (Bars) */}
        <line x1="32" y1="38" x2="38" y2="68" stroke="url(#metalDark)" strokeWidth="2.5" />
        <line x1="68" y1="38" x2="62" y2="68" stroke="url(#metalDark)" strokeWidth="2.5" />
        <line x1="50" y1="38" x2="50" y2="68" stroke="url(#metalDark)" strokeWidth="2" strokeOpacity="0.8" />

        {/* 4. Bottom Cap Lentera */}
        <rect x="36" y="68" width="28" height="5" rx="2" fill="url(#metalRim)" />
        <polygon points="39,73 61,73 54,82 46,82" fill="url(#metalDark)" />

        {/* 5. Tiang Utama (Pole) */}
        <rect x="47" y="82" width="6" height="80" fill="url(#metalDark)" />
        {/* Ring Dekorasi Tengah Tiang */}
        <rect x="45" y="105" width="10" height="4" rx="1.5" fill="url(#metalRim)" />
        <rect x="45" y="135" width="10" height="4" rx="1.5" fill="url(#metalRim)" />

        {/* 6. Base / Pondasi Besi Lampu */}
        <path
          d="M 44 162 L 56 162 L 64 180 L 36 180 Z"
          fill="url(#metalDark)"
          stroke="#475569"
          strokeWidth="1"
        />
        <rect x="32" y="178" width="36" height="6" rx="3" fill="url(#metalRim)" />
      </svg>
    </div>
  );
}
