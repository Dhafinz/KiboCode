import React from "react";

interface DigitalPlatformProps {
  index: number;
  label: string;
  isActive: boolean;
  hasChevron?: boolean;
  children?: React.ReactNode;
}

export function DigitalPlatform({
  index,
  label,
  isActive,
  hasChevron = false,
  children,
}: DigitalPlatformProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "160px",
        maxWidth: "100%",
        zIndex: 2,
      }}
    >
      {/* Container Konten Atas (Kibo atau Tiang Lampu) */}
      <div
        style={{
          height: "140px",
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          position: "relative",
          zIndex: 3,
        }}
      >
        {children}
      </div>

      {/* Hexagonal Isometric Platform SVG */}
      <div
        style={{
          position: "relative",
          width: "min(140px, 100%)",
          height: "56px",
          marginTop: "-10px",
          transition: "transform 250ms ease, filter 250ms ease",
          transform: isActive ? "scale(1.05)" : "scale(1)",
          filter: isActive
            ? "drop-shadow(0 0 16px rgba(0, 242, 254, 0.85)) drop-shadow(0 0 30px rgba(121, 72, 247, 0.5))"
            : "drop-shadow(0 0 8px rgba(0, 242, 254, 0.35))",
        }}
      >
        <svg
          viewBox="0 0 160 70"
          width="100%"
          height="100%"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Top Surface Gradient */}
            <linearGradient id={`platTop-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e2952" />
              <stop offset="50%" stopColor="#151d3b" />
              <stop offset="100%" stopColor="#0d1326" />
            </linearGradient>

            {/* Base / 3D Bevel Gradient */}
            <linearGradient id={`platBase-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0e172e" />
              <stop offset="100%" stopColor="#070a14" />
            </linearGradient>
          </defs>

          {/* 1. 3D Bevel Edge / Tebal Bawah Hexagon */}
          <path
            d="M 28 35 L 80 58 L 132 35 L 132 46 L 80 68 L 28 46 Z"
            fill={`url(#platBase-${index})`}
            stroke="rgba(0, 242, 254, 0.3)"
            strokeWidth="1"
          />

          {/* 2. Top Hexagonal Platform Surface */}
          <polygon
            points="28,35 52,14 108,14 132,35 108,56 52,56"
            fill={`url(#platTop-${index})`}
            stroke={isActive ? "var(--cyan-core)" : "rgba(0, 242, 254, 0.6)"}
            strokeWidth={isActive ? "3" : "2"}
          />

          {/* 3. Inner Glowing Contour Line */}
          <polygon
            points="38,35 58,20 102,20 122,35 102,50 58,50"
            fill="none"
            stroke={isActive ? "rgba(0, 242, 254, 0.7)" : "rgba(0, 242, 254, 0.25)"}
            strokeWidth="1.5"
            strokeDasharray={hasChevron ? "none" : "4 2"}
          />

          {/* 4. Glowing Chevron Icon di Tengah jika ada (Platform 2) */}
          {hasChevron && (
            <path
              d="M 74 29 L 83 35 L 74 41 M 80 29 L 89 35 L 80 41"
              fill="none"
              stroke="var(--cyan-core)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 6px var(--cyan-core))"
            />
          )}

          {/* 5. Center Circle Hub untuk Platform 1 & 3 */}
          {!hasChevron && (
            <circle
              cx="80"
              cy="35"
              r="7"
              fill="rgba(0, 242, 254, 0.15)"
              stroke="var(--cyan-core)"
              strokeWidth="1.5"
              filter="drop-shadow(0 0 4px var(--cyan-core))"
            />
          )}
        </svg>
      </div>

      {/* Label Badge Pill di Bawah Platform */}
      <div
        style={{
          marginTop: "6px",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "5px 14px",
          borderRadius: "9999px",
          backgroundColor: isActive ? "rgba(10, 15, 29, 0.95)" : "rgba(7, 10, 20, 0.85)",
          border: isActive ? "1.5px solid var(--cyan-core)" : "1px solid rgba(0, 242, 254, 0.4)",
          boxShadow: isActive
            ? "0 0 16px rgba(0, 242, 254, 0.5)"
            : "0 4px 10px rgba(0, 0, 0, 0.4)",
          transition: "all 200ms ease",
        }}
      >
        <span
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: isActive ? "var(--cyan-core)" : "rgba(0, 242, 254, 0.25)",
            color: isActive ? "#070a14" : "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 800,
          }}
        >
          {index}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: isActive ? "#ffffff" : "var(--cyan-core)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
