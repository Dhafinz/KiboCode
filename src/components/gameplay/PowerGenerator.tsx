import React from "react";

interface PowerGeneratorProps {
  isOn: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function PowerGenerator({ isOn, style, className = "" }: PowerGeneratorProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "80px",
        height: "140px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Radiant Electric Energy Aura saat Generator Menyala */}
      {isOn && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0, 242, 254, 0.7) 0%, rgba(56, 189, 248, 0.4) 45%, transparent 75%)",
            filter: "blur(10px)",
            zIndex: 1,
            pointerEvents: "none",
            animation: "pulseGlow 2s ease-in-out infinite",
          }}
        />
      )}

      {/* Floating Sparkles saat daya mengalir */}
      {isOn && (
        <>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "12px",
              left: "8px",
              fontSize: "14px",
              zIndex: 3,
              animation: "kiboFloat 2.6s ease-in-out infinite",
            }}
          >
            ⚡
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "20px",
              right: "6px",
              fontSize: "12px",
              zIndex: 3,
              animation: "kiboFloat 2.2s ease-in-out infinite 0.4s",
            }}
          >
            ✨
          </span>
        </>
      )}

      {/* SVG Generator Daya Reaktor Kuantum */}
      <svg
        viewBox="0 0 100 160"
        width="100%"
        height="100%"
        style={{
          position: "relative",
          zIndex: 2,
          filter: isOn
            ? "drop-shadow(0 0 14px rgba(0, 242, 254, 0.8))"
            : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
          transition: "filter 300ms ease",
        }}
      >
        <defs>
          <linearGradient id="genMetalDark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="genMetalRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="genCoreActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="genCoreInactive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="70%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* 1. Terminal Puncak / Antena Daya */}
        <circle cx="50" cy="18" r="5" fill={isOn ? "#00f2fe" : "#64748b"} />
        <rect x="47" y="23" width="6" height="12" fill="url(#genMetalRim)" />

        {/* 2. Top Dome Cap */}
        <path
          d="M 28 42 Q 50 32 72 42 L 74 48 L 26 48 Z"
          fill="url(#genMetalDark)"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <rect x="24" y="47" width="52" height="4" rx="2" fill="url(#genMetalRim)" />

        {/* 3. Tabung Reaktor Kaca Inti */}
        <rect
          x="30"
          y="51"
          width="40"
          height="54"
          rx="4"
          fill={isOn ? "rgba(0, 242, 254, 0.25)" : "rgba(15, 23, 42, 0.7)"}
          stroke={isOn ? "#00f2fe" : "#475569"}
          strokeWidth="1.5"
        />

        {/* Kumparan Inti Plasma */}
        <rect
          x="40"
          y="57"
          width="20"
          height="42"
          rx="6"
          fill={isOn ? "url(#genCoreActive)" : "url(#genCoreInactive)"}
        />

        {/* Cincin Magnetik Pelindung */}
        <line x1="28" y1="64" x2="72" y2="64" stroke="url(#genMetalRim)" strokeWidth="3" />
        <line x1="28" y1="78" x2="72" y2="78" stroke="url(#genMetalRim)" strokeWidth="3" />
        <line x1="28" y1="92" x2="72" y2="92" stroke="url(#genMetalRim)" strokeWidth="3" />

        {/* Indikator Status LED */}
        <circle cx="50" cy="78" r="4" fill={isOn ? "#ffffff" : "#334155"} />

        {/* 4. Dudukan Bawah / Transformer Base */}
        <rect x="22" y="105" width="56" height="8" rx="2" fill="url(#genMetalRim)" />
        <path
          d="M 26 113 L 74 113 L 80 145 L 20 145 Z"
          fill="url(#genMetalDark)"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Ventilasi Pendingin */}
        <rect x="34" y="120" width="32" height="3" fill="#0f172a" />
        <rect x="34" y="126" width="32" height="3" fill="#0f172a" />
        <rect x="34" y="132" width="32" height="3" fill="#0f172a" />

        {/* Pondasi Bawah */}
        <rect x="16" y="145" width="68" height="6" rx="3" fill="url(#genMetalRim)" />
      </svg>
    </div>
  );
}
