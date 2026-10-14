import React from "react";

export interface KiboCoreChamberProps {
  isActive: boolean;
  requiredValue?: number;
  currentMemoryValue?: number | null;
  label?: string;
  isKiboHere?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function KiboCoreChamber({
  isActive,
  requiredValue = 5,
  currentMemoryValue,
  label,
  isKiboHere = false,
  style,
  className = "",
}: KiboCoreChamberProps) {
  // Evaluasi jika Kibo berada di altar dengan memori yang keliru
  const isValueMismatch =
    !isActive &&
    isKiboHere &&
    currentMemoryValue !== null &&
    currentMemoryValue !== undefined &&
    currentMemoryValue !== requiredValue;

  // Evaluasi jika Kibo berada di altar tanpa nilai memori
  const isEmptyMemoryWarning =
    !isActive &&
    isKiboHere &&
    currentMemoryValue === null;

  // Status Badge Text & Style - Friendly Future Accessible Palette
  let badgeText = `🔮 ALTAR INTI (KODE ${requiredValue})`;
  let badgeBg = "#FFFFFF";
  let badgeColor = "var(--color-soft-purple-deep, #5B21B6)";
  let badgeBorder = "1.5px solid var(--color-soft-purple, #D9CCFF)";
  let badgeShadow = "0 2px 8px rgba(36, 52, 77, 0.1)";

  if (isActive) {
    badgeBg = "var(--color-mint-green, #B9F2D0)";
    badgeColor = "var(--color-mint-green-deep, #15803D)";
    badgeBorder = "1.5px solid #86EFAC";
    badgeShadow = "0 2px 10px rgba(5, 150, 105, 0.2)";
    badgeText = `🌟 INTI KIBO PULIH (${requiredValue})`;
  } else if (isValueMismatch) {
    badgeBg = "#FFE4E6";
    badgeColor = "#9F1239";
    badgeBorder = "1.5px solid #FECDD3";
    badgeShadow = "0 2px 8px rgba(225, 29, 72, 0.15)";
    badgeText = `⚠️ SALAH: ${currentMemoryValue} ≠ ${requiredValue}`;
  } else if (isEmptyMemoryWarning) {
    badgeBg = "#FFF9E6";
    badgeColor = "#92400E";
    badgeBorder = "1.5px solid #FFE49A";
    badgeShadow = "0 2px 8px rgba(217, 119, 6, 0.15)";
    badgeText = `📭 BUTUH DATA: ${requiredValue}`;
  }

  return (
    <div
      className={className}
      aria-label={label || "Altar Inti Kibo"}
      style={{
        position: "relative",
        width: "120px",
        height: "155px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* 1. Radiant Atmospheric Halo (Klimaks Visual Kibo Core yang Hangat & Menyenangkan) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: isActive ? "145px" : "110px",
          height: isActive ? "145px" : "110px",
          borderRadius: "50%",
          background: isActive
            ? "radial-gradient(circle, rgba(191, 232, 255, 0.6) 0%, rgba(217, 204, 255, 0.45) 45%, rgba(185, 242, 208, 0.3) 70%, transparent 85%)"
            : isValueMismatch
            ? "radial-gradient(circle, rgba(254, 205, 211, 0.5) 0%, rgba(254, 243, 199, 0.3) 55%, transparent 75%)"
            : isEmptyMemoryWarning
            ? "radial-gradient(circle, rgba(254, 243, 199, 0.5) 0%, rgba(254, 215, 170, 0.3) 55%, transparent 75%)"
            : "radial-gradient(circle, rgba(217, 204, 255, 0.4) 0%, rgba(191, 232, 255, 0.25) 50%, transparent 75%)",
          filter: "blur(12px)",
          zIndex: 1,
          animation: isActive ? "pulseGlow 2.5s ease-in-out infinite" : "pulseGlow 4s ease-in-out infinite",
          transition: "all 400ms ease",
        }}
      />

      {/* Floating Sparkles & Cosmic Particles saat Inti Kibo Aktif */}
      {isActive && (
        <>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-6px",
              left: "14px",
              fontSize: "16px",
              zIndex: 4,
              animation: "kiboFloat 2.6s ease-in-out infinite",
            }}
          >
            🌟
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "6px",
              right: "12px",
              fontSize: "14px",
              zIndex: 4,
              animation: "kiboFloat 2s ease-in-out infinite 0.4s",
            }}
          >
            ✨
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-12px",
              right: "34px",
              fontSize: "12px",
              zIndex: 4,
              animation: "kiboFloat 3s ease-in-out infinite 0.8s",
            }}
          >
            🔮
          </span>
        </>
      )}

      {/* 2. Floating Status Badge di atas Altar */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10px",
          zIndex: 5,
          padding: "3px 10px",
          borderRadius: "9999px",
          backgroundColor: badgeBg,
          boxShadow: badgeShadow,
          color: badgeColor,
          fontSize: "0.65rem",
          fontWeight: 800,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          border: badgeBorder,
          transition: "all 250ms ease",
          transform: isActive ? "scale(1.04)" : "scale(1)",
        }}
      >
        {badgeText}
      </div>

      {/* 3. SVG Altar Inti Kibo (Sci-Fi Sanctuary Dais & Levitating Core Orb) */}
      <svg
        viewBox="0 0 120 160"
        width="100%"
        height="100%"
        style={{
          position: "relative",
          zIndex: 2,
          filter: isActive
            ? "drop-shadow(0 0 16px rgba(0, 242, 254, 0.9)) drop-shadow(0 0 24px rgba(168, 85, 247, 0.75))"
            : "drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))",
          transition: "filter 350ms ease",
        }}
      >
        <defs>
          {/* Altar Pedestal Metals */}
          <linearGradient id="coreAltarMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0a0f1d" />
          </linearGradient>

          <linearGradient id="corePylonMetal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Core Orb Gradients */}
          <radialGradient id="coreOrbActiveGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#00f2fe" />
            <stop offset="65%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#581c87" />
          </radialGradient>

          <radialGradient id="coreOrbInactiveGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#6366f1" />
            <stop offset="85%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Ascending Energy Beam */}
          <linearGradient id="coreEnergyBeam" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(0, 242, 254, 0.85)" />
            <stop offset="40%" stopColor="rgba(168, 85, 247, 0.6)" />
            <stop offset="100%" stopColor="rgba(0, 242, 254, 0)" />
          </linearGradient>
        </defs>

        {/* --- A. Ascending Beam of Light (Hanya tampil saat Aktif) --- */}
        {isActive && (
          <polygon
            points="52,140 68,140 76,0 44,0"
            fill="url(#coreEnergyBeam)"
            opacity="0.8"
          />
        )}

        {/* --- B. Tiered Altar Dais / Hexagonal Base --- */}
        {/* Tier 1: Dasar Terbawah */}
        <path
          d="M 18 144 L 60 156 L 102 144 L 94 136 L 60 142 L 26 136 Z"
          fill="url(#coreAltarMetal)"
          stroke={isActive ? "#00f2fe" : "rgba(168, 85, 247, 0.5)"}
          strokeWidth="1.5"
        />

        {/* Tier 2: Panggung Inti Utama */}
        <polygon
          points="24,136 60,144 96,136 88,126 60,131 32,126"
          fill="#1e1b4b"
          stroke={isActive ? "#38bdf8" : "rgba(0, 242, 254, 0.4)"}
          strokeWidth="1.5"
        />

        {/* Tier 3: Dudukan Emitter Kristal */}
        <polygon
          points="36,126 60,130 84,126 78,118 60,121 42,118"
          fill="#090d16"
          stroke={isActive ? "#a855f7" : "rgba(168, 85, 247, 0.4)"}
          strokeWidth="1.2"
        />

        {/* Glowing Circuit Lines pada Altar */}
        <path
          d="M 34 139 L 60 147 L 86 139"
          fill="none"
          stroke={isActive ? "#00f2fe" : "rgba(0, 242, 254, 0.3)"}
          strokeWidth="1.5"
          strokeDasharray={isActive ? "none" : "3,2"}
        />

        {/* --- C. Twin Focus Pylons (Tiang Resonansi Samping) --- */}
        {/* Pylon Kiri */}
        <path
          d="M 24 130 L 32 118 L 38 72 L 44 56 L 40 54 L 34 74 L 26 120 Z"
          fill="url(#corePylonMetal)"
          stroke={isActive ? "#00f2fe" : "rgba(124, 58, 237, 0.6)"}
          strokeWidth="1.2"
        />
        {/* Energy Conduit Line Pylon Kiri */}
        <path
          d="M 28 122 L 35 74 L 40 58"
          fill="none"
          stroke={isActive ? "#00f2fe" : "#a855f7"}
          strokeWidth="1.2"
        />
        {/* Emitter Tip Kiri */}
        <polygon
          points="40,54 45,50 44,56 40,58"
          fill={isActive ? "#00f2fe" : "#7c3aed"}
        />

        {/* Pylon Kanan */}
        <path
          d="M 96 130 L 88 118 L 82 72 L 76 56 L 80 54 L 86 74 L 94 120 Z"
          fill="url(#corePylonMetal)"
          stroke={isActive ? "#00f2fe" : "rgba(124, 58, 237, 0.6)"}
          strokeWidth="1.2"
        />
        {/* Energy Conduit Line Pylon Kanan */}
        <path
          d="M 92 122 L 85 74 L 80 58"
          fill="none"
          stroke={isActive ? "#00f2fe" : "#a855f7"}
          strokeWidth="1.2"
        />
        {/* Emitter Tip Kanan */}
        <polygon
          points="80,54 75,50 76,56 80,58"
          fill={isActive ? "#00f2fe" : "#7c3aed"}
        />

        {/* --- D. Gyroscopic Resonance Rings (Cincin Penstabil Energi 4 Wilayah) --- */}
        <ellipse
          cx="60"
          cy="78"
          rx="32"
          ry="12"
          fill="none"
          stroke={isActive ? "#00f2fe" : "rgba(0, 242, 254, 0.3)"}
          strokeWidth={isActive ? "2" : "1"}
          strokeDasharray={isActive ? "8,4" : "4,4"}
        />
        <ellipse
          cx="60"
          cy="78"
          rx="24"
          ry="32"
          fill="none"
          stroke={isActive ? "#a855f7" : "rgba(168, 85, 247, 0.3)"}
          strokeWidth={isActive ? "1.8" : "1"}
          strokeDasharray={isActive ? "6,3" : "3,3"}
        />

        {/* 4 Node Kristal Resonansi 4 Wilayah pada Cincin Energi */}
        {/* 1. Lumina Town: Cahaya Emas di Atas */}
        <circle
          cx="60"
          cy="46"
          r={isActive ? "3.5" : "2.5"}
          fill={isActive ? "#fde047" : "rgba(253, 224, 71, 0.5)"}
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        {/* 2. Memory Station: Data Sian di Bawah */}
        <circle
          cx="60"
          cy="110"
          r={isActive ? "3.5" : "2.5"}
          fill={isActive ? "#38bdf8" : "rgba(56, 189, 248, 0.5)"}
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        {/* 3. Sprout Garden: Flora Zamrud di Kiri */}
        <circle
          cx="28"
          cy="78"
          r={isActive ? "3.5" : "2.5"}
          fill={isActive ? "#10b981" : "rgba(16, 185, 129, 0.5)"}
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        {/* 4. Gate Valley: Kristal Amber di Kanan */}
        <circle
          cx="92"
          cy="78"
          r={isActive ? "3.5" : "2.5"}
          fill={isActive ? "#f59e0b" : "rgba(245, 158, 11, 0.5)"}
          stroke="#ffffff"
          strokeWidth="0.8"
        />

        {/* --- E. Floating Central Core Orb (Inti Dunia Kibo) --- */}
        {/* Core Outer Glow Ring */}
        <circle
          cx="60"
          cy="78"
          r="22"
          fill="none"
          stroke={isActive ? "#00f2fe" : "rgba(168, 85, 247, 0.5)"}
          strokeWidth={isActive ? "2.5" : "1.2"}
          opacity="0.9"
        />

        {/* Bola Inti Utama */}
        <circle
          cx="60"
          cy="78"
          r="17"
          fill={isActive ? "url(#coreOrbActiveGrad)" : "url(#coreOrbInactiveGrad)"}
          stroke={isActive ? "#ffffff" : "#00f2fe"}
          strokeWidth={isActive ? "2" : "1.2"}
        />

        {/* Inner Cosmic Spark / Rune Kibo di dalam Orb */}
        <circle
          cx="56"
          cy="74"
          r="5"
          fill="#ffffff"
          opacity={isActive ? "0.9" : "0.5"}
        />
        <polygon
          points="60,68 63,75 70,78 63,81 60,88 57,81 50,78 57,75"
          fill={isActive ? "#ffffff" : "#38bdf8"}
          opacity={isActive ? "0.95" : "0.6"}
        />

        {/* Arc Penyalur Energi Antara Emitter dan Core */}
        {isActive && (
          <>
            <line
              x1="44"
              y1="56"
              x2="52"
              y2="70"
              stroke="#00f2fe"
              strokeWidth="2"
              strokeDasharray="2,2"
            />
            <line
              x1="76"
              y1="56"
              x2="68"
              y2="70"
              stroke="#00f2fe"
              strokeWidth="2"
              strokeDasharray="2,2"
            />
          </>
        )}
      </svg>
    </div>
  );
}
