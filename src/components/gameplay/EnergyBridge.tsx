import React from "react";

interface EnergyBridgeProps {
  isActive: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function EnergyBridge({ isActive, style, className = "" }: EnergyBridgeProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "115px",
        height: "145px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Radiant Glow di sekitar Celah / Jembatan */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "125px",
          height: "90px",
          borderRadius: "16px",
          background: isActive
            ? "radial-gradient(circle, rgba(0, 242, 254, 0.45) 0%, rgba(56, 189, 248, 0.25) 50%, transparent 75%)"
            : "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(245, 158, 11, 0.2) 50%, transparent 75%)",
          filter: "blur(12px)",
          zIndex: 1,
          pointerEvents: "none",
          transition: "background 400ms ease",
        }}
      />

      {/* Floating Status Badge: Tersambung / Terputus */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          zIndex: 4,
          padding: "3px 10px",
          borderRadius: "9999px",
          backgroundColor: isActive ? "rgba(14, 165, 233, 0.9)" : "rgba(239, 68, 68, 0.9)",
          color: "#ffffff",
          fontSize: "0.725rem",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          boxShadow: isActive
            ? "0 0 12px rgba(56, 189, 248, 0.8)"
            : "0 0 12px rgba(239, 68, 68, 0.8)",
          transition: "all 300ms ease",
        }}
      >
        <span>{isActive ? "⚡ TERSAMBUNG" : "⚠️ TERPUTUS"}</span>
      </div>

      {/* SVG Isometric Energy Bridge 2.5D */}
      <svg
        viewBox="0 0 120 150"
        width="100%"
        height="100%"
        style={{
          position: "relative",
          zIndex: 2,
          filter: isActive
            ? "drop-shadow(0 0 14px rgba(0, 242, 254, 0.7))"
            : "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))",
          transition: "filter 300ms ease",
        }}
      >
        <defs>
          {/* Gradients untuk Tiang Penyangga Jembatan */}
          <linearGradient id="bridgePillarGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="bridgeActiveLaser" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>

          <linearGradient id="bridgeHazardLaser" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Tiang Penyangga Kiri */}
        <path
          d="M 12 120 L 28 112 L 28 70 L 12 78 Z"
          fill="url(#bridgePillarGrad)"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <ellipse cx="20" cy="74" rx="8" ry="4" fill="#38bdf8" opacity={isActive ? "0.9" : "0.3"} />
        <circle cx="20" cy="65" r="5" fill={isActive ? "#00f2fe" : "#ef4444"} />

        {/* Tiang Penyangga Kanan */}
        <path
          d="M 92 112 L 108 120 L 108 78 L 92 70 Z"
          fill="url(#bridgePillarGrad)"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <ellipse cx="100" cy="74" rx="8" ry="4" fill="#38bdf8" opacity={isActive ? "0.9" : "0.3"} />
        <circle cx="100" cy="65" r="5" fill={isActive ? "#00f2fe" : "#ef4444"} />

        {/* Celah Digital / Abyss di Bawah Jembatan */}
        <ellipse cx="60" cy="115" rx="36" ry="12" fill="#030712" opacity="0.85" />
        <ellipse
          cx="60"
          cy="115"
          rx="32"
          ry="9"
          fill="none"
          stroke={isActive ? "#00f2fe" : "#ef4444"}
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.6"
        />

        {/* KONDISI 1: JEMBATAN TERPUTUS (Hazard Gap) */}
        {!isActive && (
          <g>
            {/* Balok jembatan kiri terputus */}
            <path
              d="M 28 85 L 45 80 L 45 92 L 28 97 Z"
              fill="#1e293b"
              stroke="#ef4444"
              strokeWidth="1.5"
            />
            {/* Balok jembatan kanan terputus */}
            <path
              d="M 75 80 L 92 85 L 92 97 L 75 92 Z"
              fill="#1e293b"
              stroke="#ef4444"
              strokeWidth="1.5"
            />
            {/* Celah kosong berkedip / peringatan */}
            <line
              x1="45"
              y1="86"
              x2="75"
              y2="86"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="3 3"
              opacity="0.8"
            />
            <text
              x="60"
              y="90"
              fill="#ef4444"
              fontSize="11"
              fontWeight="900"
              textAnchor="middle"
            >
              ✕
            </text>
          </g>
        )}

        {/* KONDISI 2: JEMBATAN TERSAMBUNG (Solid Glowing Energy Walkway) */}
        {isActive && (
          <g>
            {/* Landasan energi bercahaya transparan */}
            <polygon
              points="28,88 60,78 92,88 60,98"
              fill="rgba(0, 242, 254, 0.3)"
              stroke="#00f2fe"
              strokeWidth="2"
            />
            {/* Berkas laser utama jembatan */}
            <line
              x1="26"
              y1="88"
              x2="94"
              y2="88"
              stroke="url(#bridgeActiveLaser)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="drop-shadow(0 0 6px #00f2fe)"
            />
            {/* Garis inti putih terang */}
            <line
              x1="30"
              y1="88"
              x2="90"
              y2="88"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Chevron indikator jalur energi */}
            <path
              d="M 46 84 L 52 88 L 46 92"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 66 84 L 72 88 L 66 92"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
