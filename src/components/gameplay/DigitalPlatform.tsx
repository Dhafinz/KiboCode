import React from "react";

interface DigitalPlatformProps {
  index: number;
  label: string;
  isActive: boolean;
  hasChevron?: boolean;
  isCompact?: boolean;
  children?: React.ReactNode;
}

export function DigitalPlatform({
  index,
  label,
  isActive,
  hasChevron = false,
  isCompact = false,
  children,
}: DigitalPlatformProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: isCompact ? "100%" : "160px",
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
          width: isCompact ? "min(115px, 98%)" : "min(140px, 100%)",
          height: isCompact ? "48px" : "56px",
          marginTop: isCompact ? "-6px" : "-10px",
          transition: "transform 250ms ease, filter 250ms ease",
          transform: isActive ? "scale(1.04)" : "scale(1)",
          filter: isActive
            ? "drop-shadow(0 4px 14px rgba(2, 132, 199, 0.35))"
            : "drop-shadow(0 2px 6px rgba(36, 52, 77, 0.15))",
        }}
      >
        <svg
          viewBox="0 0 160 70"
          width="100%"
          height="100%"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Top Surface Gradient - Friendly Clean Tech */}
            <linearGradient id={`platTop-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F0F7FF" />
              <stop offset="100%" stopColor="#E2EEFC" />
            </linearGradient>

            {/* Base / 3D Bevel Gradient */}
            <linearGradient id={`platBase-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>

          {/* 1. 3D Bevel Edge / Tebal Bawah Hexagon */}
          <path
            d="M 28 35 L 80 58 L 132 35 L 132 46 L 80 68 L 28 46 Z"
            fill={`url(#platBase-${index})`}
            stroke="#94A3B8"
            strokeWidth="1"
          />

          {/* 2. Top Hexagonal Platform Surface */}
          <polygon
            points="28,35 52,14 108,14 132,35 108,56 52,56"
            fill={`url(#platTop-${index})`}
            stroke={isActive ? "var(--color-sky-blue-deep, #0284C7)" : "#93C5FD"}
            strokeWidth={isActive ? "2.5" : "1.5"}
          />

          {/* 3. Inner Contour Line */}
          <polygon
            points="38,35 58,20 102,20 122,35 102,50 58,50"
            fill="none"
            stroke={isActive ? "rgba(2, 132, 199, 0.6)" : "rgba(147, 197, 253, 0.45)"}
            strokeWidth="1.5"
            strokeDasharray={hasChevron ? "none" : "4 2"}
          />

          {/* 4. Glowing Chevron Icon di Tengah jika ada */}
          {hasChevron && (
            <path
              d="M 74 29 L 83 35 L 74 41 M 80 29 L 89 35 L 80 41"
              fill="none"
              stroke="var(--color-sky-blue-deep, #0284C7)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* 5. Center Circle Hub untuk Platform Target/Awal */}
          {!hasChevron && (
            <circle
              cx="80"
              cy="35"
              r="7"
              fill="rgba(191, 232, 255, 0.5)"
              stroke="var(--color-sky-blue-deep, #0284C7)"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>

      {/* Label Badge Pill di Bawah Platform */}
      <div
        title={`${index}. ${label}`}
        style={{
          marginTop: isCompact ? "4px" : "6px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isCompact ? "4px" : "8px",
          padding: isCompact ? "3px 8px" : "5px 14px",
          maxWidth: "96%",
          boxSizing: "border-box",
          borderRadius: "9999px",
          backgroundColor: "#FFFFFF",
          border: isActive
            ? "1.5px solid var(--color-sky-blue-deep, #0284C7)"
            : "1px solid var(--border-subtle, #DDE7F3)",
          boxShadow: isActive
            ? "0 2px 10px rgba(2, 132, 199, 0.25)"
            : "0 2px 6px rgba(36, 52, 77, 0.08)",
          transition: "all 180ms ease",
        }}
      >
        <span
          style={{
            width: isCompact ? "16px" : "20px",
            height: isCompact ? "16px" : "20px",
            borderRadius: "50%",
            backgroundColor: isActive
              ? "var(--color-sky-blue-deep, #0284C7)"
              : "var(--color-sky-blue, #BFE8FF)",
            color: isActive ? "#FFFFFF" : "var(--color-deep-slate, #24344D)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isCompact ? "0.62rem" : "0.75rem",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {index}
        </span>
        <span
          style={{
            fontSize: isCompact ? "0.65rem" : "0.75rem",
            fontWeight: 800,
            letterSpacing: isCompact ? "0.02em" : "0.04em",
            color: "var(--color-deep-slate, #24344D)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
