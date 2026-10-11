import React from "react";

interface LightCrystalProps {
  isOn: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function LightCrystal({ isOn, style, className = "" }: LightCrystalProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "90px",
        height: "160px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Radiant Prismatic Halo saat Kristal Aktif */}
      {isOn && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.7) 0%, rgba(0, 242, 254, 0.5) 40%, rgba(245, 158, 11, 0.3) 70%, transparent 85%)",
            filter: "blur(12px)",
            zIndex: 1,
            pointerEvents: "none",
            animation: "pulseGlow 2.5s ease-in-out infinite",
          }}
        />
      )}

      {/* Floating Sparkles & Stars */}
      {isOn && (
        <>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "4px",
              left: "10px",
              fontSize: "16px",
              zIndex: 3,
              animation: "kiboFloat 2.8s ease-in-out infinite",
            }}
          >
            🌟
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "16px",
              right: "8px",
              fontSize: "14px",
              zIndex: 3,
              animation: "kiboFloat 2.2s ease-in-out infinite 0.5s",
            }}
          >
            ✨
          </span>
        </>
      )}

      {/* SVG Kristal Cahaya Agung */}
      <svg
        viewBox="0 0 100 180"
        width="100%"
        height="100%"
        style={{
          position: "relative",
          zIndex: 2,
          filter: isOn
            ? "drop-shadow(0 0 18px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 24px rgba(0, 242, 254, 0.7))"
            : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
          transition: "filter 300ms ease",
        }}
      >
        <defs>
          <linearGradient id="crysMetalDark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="crysMetalRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>

          <linearGradient id="crysActive" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#c084fc" />
            <stop offset="70%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          <linearGradient id="crysInactive" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* 1. Kristal Prisma Melayang (Floating Diamond/Octahedron) */}
        <g style={{ transform: isOn ? "translateY(-4px)" : "none", transition: "transform 400ms ease" }}>
          {/* Sisi Kiri Kristal */}
          <polygon
            points="50,12 26,45 50,78"
            fill={isOn ? "url(#crysActive)" : "url(#crysInactive)"}
            opacity="0.9"
            stroke="#ffffff"
            strokeWidth={isOn ? "1" : "0.5"}
          />
          {/* Sisi Kanan Kristal */}
          <polygon
            points="50,12 74,45 50,78"
            fill={isOn ? "url(#crysActive)" : "url(#crysInactive)"}
            opacity="0.75"
            stroke="#ffffff"
            strokeWidth={isOn ? "1" : "0.5"}
          />
          {/* Facet Tengah Kristal */}
          <polygon
            points="50,12 60,45 50,78 40,45"
            fill={isOn ? "#ffffff" : "#64748b"}
            opacity={isOn ? "0.85" : "0.4"}
          />
        </g>

        {/* 2. Cincin Levitation Magnetik (Magnetic Hover Ring) */}
        <ellipse
          cx="50"
          cy="86"
          rx="32"
          ry="9"
          fill="none"
          stroke={isOn ? "var(--cyan-core)" : "#475569"}
          strokeWidth="2.5"
          filter={isOn ? "drop-shadow(0 0 6px var(--cyan-core))" : undefined}
        />
        <ellipse
          cx="50"
          cy="86"
          rx="22"
          ry="6"
          fill="none"
          stroke={isOn ? "#a855f7" : "#334155"}
          strokeWidth="1.5"
        />

        {/* 3. Pilar Penopang Kuil / Pedestal Spire */}
        <polygon
          points="42,90 58,90 64,152 36,152"
          fill="url(#crysMetalDark)"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Cincin Garis Energi Vertikal Pedestal */}
        <line x1="50" y1="92" x2="50" y2="152" stroke={isOn ? "var(--cyan-core)" : "#334155"} strokeWidth="2" />
        <rect x="38" y="112" width="24" height="4" rx="1.5" fill="url(#crysMetalRim)" />
        <rect x="35" y="132" width="30" height="4" rx="1.5" fill="url(#crysMetalRim)" />

        {/* 4. Pondasi Altar Bawah */}
        <path
          d="M 32 152 L 68 152 L 78 170 L 22 170 Z"
          fill="url(#crysMetalDark)"
          stroke="#475569"
          strokeWidth="1"
        />
        <rect x="18" y="168" width="64" height="6" rx="3" fill="url(#crysMetalRim)" />
      </svg>
    </div>
  );
}
