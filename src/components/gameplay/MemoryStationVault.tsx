import React from "react";

export interface MemoryStationVaultProps {
  type: "terminal" | "reactor" | "vault";
  isActive: boolean;
  requiredValue?: number;
  currentMemoryValue?: number | null;
  label?: string;
  isKiboHere?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function MemoryStationVault({
  type,
  isActive,
  requiredValue,
  currentMemoryValue,
  label,
  isKiboHere = false,
  style,
  className = "",
}: MemoryStationVaultProps) {
  // Evaluasi apakah Kibo berada di petak ini dengan nilai yang salah
  const isValueMismatch =
    !isActive &&
    isKiboHere &&
    currentMemoryValue !== null &&
    currentMemoryValue !== undefined &&
    requiredValue !== undefined &&
    currentMemoryValue !== requiredValue;

  // Evaluasi apakah Kibo berada di petak ini dengan memori kosong padahal butuh nilai
  const isEmptyMemoryWarning =
    !isActive &&
    isKiboHere &&
    currentMemoryValue === null &&
    requiredValue !== undefined;

  // Dynamic glow color
  const glowColor = isActive
    ? type === "reactor"
      ? "radial-gradient(circle, rgba(0, 242, 254, 0.55) 0%, rgba(236, 72, 153, 0.3) 50%, transparent 75%)"
      : type === "vault"
      ? "radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, rgba(0, 242, 254, 0.35) 50%, transparent 75%)"
      : "radial-gradient(circle, rgba(139, 92, 246, 0.55) 0%, rgba(0, 242, 254, 0.35) 50%, transparent 75%)"
    : isValueMismatch
    ? "radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 75%)"
    : "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(0, 242, 254, 0.15) 50%, transparent 75%)";

  // Dynamic Badge Text & Color - Friendly Future Palette
  let badgeText = "";
  let badgeBg = "#FFFFFF";
  let badgeColor = "var(--color-deep-slate, #24344D)";
  let badgeBorder = "1.5px solid var(--border-subtle, #DDE7F3)";
  let badgeShadow = "0 2px 8px rgba(36, 52, 77, 0.08)";

  if (isActive) {
    badgeBg = "var(--color-mint-green, #B9F2D0)";
    badgeColor = "var(--color-mint-green-deep, #15803D)";
    badgeBorder = "1.5px solid #86EFAC";
    badgeShadow = "0 2px 10px rgba(5, 150, 105, 0.2)";
    badgeText =
      type === "reactor"
        ? `⚡ REAKTOR AKTIF (${requiredValue ?? 5})`
        : type === "vault"
        ? `🌟 KUBAH TERBUKA (${requiredValue ?? 4})`
        : `✓ TERMINAL AKTIF (${requiredValue ?? 3})`;
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
  } else {
    badgeText =
      type === "reactor"
        ? `🔋 REAKTOR (KODE ${requiredValue ?? 5})`
        : type === "vault"
        ? `🔒 KUBAH (KODE ${requiredValue ?? 4})`
        : `💾 TERMINAL (KODE ${requiredValue ?? 3})`;
  }

  return (
    <div
      className={className}
      aria-label={label || `${type} target`}
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
      {/* Radiant Glow Ambient di Belakang Perangkat */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "125px",
          height: "95px",
          borderRadius: "50%",
          background: glowColor,
          filter: "blur(14px)",
          zIndex: 1,
          pointerEvents: "none",
          transition: "background 400ms ease",
          animation: isActive ? "pulseGlow 2.5s ease-in-out infinite" : "none",
        }}
      />

      {/* Floating Status Badge di Atas Target */}
      <div
        style={{
          position: "absolute",
          top: "6px",
          zIndex: 4,
          padding: "3px 9px",
          borderRadius: "9999px",
          backgroundColor: badgeBg,
          color: badgeColor,
          border: badgeBorder,
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.02em",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          boxShadow: badgeShadow,
          transition: "all 300ms ease",
          whiteSpace: "nowrap",
        }}
      >
        <span>{badgeText}</span>
      </div>

      {/* SVG Isometric Render Sesuai Tipe Target */}
      <svg
        viewBox="0 0 120 150"
        width="100%"
        height="100%"
        style={{
          zIndex: 2,
          overflow: "visible",
          filter: isActive
            ? "drop-shadow(0 6px 14px rgba(0, 242, 254, 0.5))"
            : isValueMismatch
            ? "drop-shadow(0 6px 14px rgba(239, 68, 68, 0.5))"
            : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.45))",
          transition: "filter 350ms ease",
        }}
      >
        <defs>
          {/* Gradient untuk Terminal Data Alpha / Konsol */}
          <linearGradient id="termBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="termScreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isActive ? "#00f2fe" : isValueMismatch ? "#ef4444" : "#4338ca"} />
            <stop offset="100%" stopColor={isActive ? "#0284c7" : isValueMismatch ? "#b91c1c" : "#1e1b4b"} />
          </linearGradient>

          {/* Gradient untuk Reaktor Memori */}
          <linearGradient id="reactorBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="reactorCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isActive ? "#00f2fe" : isValueMismatch ? "#f87171" : "#818cf8"} />
            <stop offset="60%" stopColor={isActive ? "#ec4899" : isValueMismatch ? "#ef4444" : "#4f46e5"} />
            <stop offset="100%" stopColor="#1e1b4b" />
          </radialGradient>

          {/* Gradient untuk Kubah Memori Utama */}
          <linearGradient id="vaultArch" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338ca" />
            <stop offset="50%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="crystalPillar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isActive ? "#fde047" : "#a78bfa"} />
            <stop offset="50%" stopColor={isActive ? "#00f2fe" : "#818cf8"} />
            <stop offset="100%" stopColor={isActive ? "#f59e0b" : "#4338ca"} />
          </linearGradient>
        </defs>

        {/* ===================================================================
            A. TIPE: TERMINAL DATA ALPHA / KONSOL
            =================================================================== */}
        {type === "terminal" && (
          <g transform="translate(0, 10)">
            {/* Hexagonal Platform Base */}
            <polygon
              points="60,135 95,123 95,115 60,127 25,115 25,123"
              fill="#1e1b4b"
              stroke="#6366f1"
              strokeWidth="1.5"
            />
            <polygon
              points="60,127 95,115 60,103 25,115"
              fill="url(#termBase)"
              stroke={isActive ? "#00f2fe" : isValueMismatch ? "#ef4444" : "#818cf8"}
              strokeWidth="1.5"
            />

            {/* Central Pedestal Column */}
            <polygon points="50,110 70,110 74,68 46,68" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1" />
            <line x1="60" y1="110" x2="60" y2="68" stroke={isActive ? "#00f2fe" : "#818cf8"} strokeWidth="2" strokeDasharray="3,2" />

            {/* Holographic angled display monitor */}
            <polygon
              points="24,42 96,42 88,74 32,74"
              fill="url(#termScreen)"
              opacity={isActive ? 0.95 : 0.75}
              stroke={isActive ? "#00f2fe" : isValueMismatch ? "#fca5a5" : "#a5b4fc"}
              strokeWidth="2"
            />

            {/* Circuit Lines on Screen */}
            <line x1="34" y1="50" x2="86" y2="50" stroke={isActive ? "#ffffff" : "#c7d2fe"} strokeWidth="1" opacity="0.6" />
            <line x1="38" y1="66" x2="82" y2="66" stroke={isActive ? "#ffffff" : "#c7d2fe"} strokeWidth="1" opacity="0.6" />

            {/* Center Value Badge Readout */}
            <circle
              cx="60"
              cy="58"
              r="12"
              fill={isActive ? "#0369a1" : isValueMismatch ? "#991b1b" : "#312e81"}
              stroke={isActive ? "#38bdf8" : isValueMismatch ? "#f87171" : "#a5b4fc"}
              strokeWidth="1.5"
            />
            <text
              x="60"
              y="62"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontWeight="900"
              fontFamily="monospace"
            >
              {isActive ? `✓${requiredValue ?? 3}` : isValueMismatch ? `!${currentMemoryValue}` : requiredValue ?? 3}
            </text>

            {/* Floating Top Antenna / Sensor */}
            <line x1="60" y1="42" x2="60" y2="30" stroke={isActive ? "#00f2fe" : "#818cf8"} strokeWidth="2" />
            <circle
              cx="60"
              cy="28"
              r="4"
              fill={isActive ? "#00f2fe" : isValueMismatch ? "#ef4444" : "#a855f7"}
              stroke="#ffffff"
              strokeWidth="1"
            />
          </g>
        )}

        {/* ===================================================================
            B. TIPE: REAKTOR MEMORI (PLASMA CYLINDRICAL CORE)
            =================================================================== */}
        {type === "reactor" && (
          <g transform="translate(0, 10)">
            {/* Hexagonal High-Voltage Reactor Base */}
            <polygon
              points="60,135 98,122 98,114 60,127 22,114 22,122"
              fill="#0f172a"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <polygon
              points="60,127 98,114 60,101 22,114"
              fill="url(#reactorBody)"
              stroke={isActive ? "#00f2fe" : "#38bdf8"}
              strokeWidth="1.5"
            />

            {/* Lower Power Coils */}
            <rect x="42" y="94" width="36" height="12" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
            <line x1="48" y1="100" x2="72" y2="100" stroke={isActive ? "#00f2fe" : "#a5b4fc"} strokeWidth="2" />

            {/* Transparent Plasma Cylinder Chamber */}
            <rect
              x="36"
              y="45"
              width="48"
              height="50"
              rx="8"
              fill="rgba(15, 23, 42, 0.75)"
              stroke={isActive ? "#00f2fe" : isValueMismatch ? "#ef4444" : "#6366f1"}
              strokeWidth="2"
            />

            {/* Central Energy Reactor Sphere */}
            <circle
              cx="60"
              cy="70"
              r={isActive ? "18" : "15"}
              fill="url(#reactorCore)"
              stroke={isActive ? "#ffffff" : isValueMismatch ? "#fca5a5" : "#c7d2fe"}
              strokeWidth="1.5"
              style={{
                transition: "r 300ms ease",
              }}
            />

            {/* Glowing Pulse Orbit Ring */}
            <ellipse
              cx="60"
              cy="70"
              rx="22"
              ry="8"
              fill="none"
              stroke={isActive ? "#00f2fe" : isValueMismatch ? "#ef4444" : "#818cf8"}
              strokeWidth="1.5"
              strokeDasharray={isActive ? "none" : "4,3"}
              transform={isActive ? "rotate(-15, 60, 70)" : "none"}
            />

            {/* Reactor Code Digits / Status on Core */}
            <text
              x="60"
              y="74"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="900"
              fontFamily="monospace"
              style={{ textShadow: "0 0 6px #00f2fe" }}
            >
              {isActive ? "⚡5" : isValueMismatch ? `!${currentMemoryValue}` : "5"}
            </text>

            {/* Top Cap & Containment Emitters */}
            <rect x="40" y="38" width="40" height="9" rx="3" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.5" />
            <polygon points="54,38 66,38 60,26" fill={isActive ? "#00f2fe" : "#818cf8"} />
          </g>
        )}

        {/* ===================================================================
            C. TIPE: KUBAH MEMORI UTAMA (VAULT CYBER DOME)
            =================================================================== */}
        {type === "vault" && (
          <g transform="translate(0, 10)">
            {/* Massive Vault Foundation */}
            <polygon
              points="60,136 100,123 100,115 60,128 20,115 20,123"
              fill="#0f172a"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <polygon
              points="60,128 100,115 60,102 20,115"
              fill="#1e1b4b"
              stroke={isActive ? "#f59e0b" : "#818cf8"}
              strokeWidth="1.5"
            />

            {/* Outer Vault Arch */}
            <path
              d="M 28,110 L 28,62 Q 60,24 92,62 L 92,110 Z"
              fill="url(#vaultArch)"
              stroke={isActive ? "#f59e0b" : isValueMismatch ? "#ef4444" : "#6366f1"}
              strokeWidth="2.5"
            />

            {/* Inner Cryptographic Chamber */}
            <path
              d="M 38,105 L 38,68 Q 60,40 82,68 L 82,105 Z"
              fill={isActive ? "rgba(245, 158, 11, 0.2)" : "rgba(15, 23, 42, 0.9)"}
              stroke={isActive ? "#fbbf24" : "#4338ca"}
              strokeWidth="1.5"
            />

            {/* Center Memory Crystal / Iris Lock */}
            {isActive ? (
              // Open Vault: Glowing Divine Crystal Inside
              <g>
                <polygon
                  points="60,46 70,68 60,100 50,68"
                  fill="url(#crystalPillar)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <circle cx="60" cy="72" r="6" fill="#ffffff" />
                <text
                  x="60"
                  y="76"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="9"
                  fontWeight="900"
                >
                  4
                </text>
                {/* Light Beams Radiating */}
                <line x1="60" y1="46" x2="60" y2="24" stroke="#fde047" strokeWidth="2.5" />
                <polygon points="56,24 64,24 60,18" fill="#fde047" />
              </g>
            ) : (
              // Closed Vault: Cryptographic Iris Dial Lock
              <g>
                <circle
                  cx="60"
                  cy="74"
                  r="16"
                  fill="#1e1b4b"
                  stroke={isValueMismatch ? "#ef4444" : "#a855f7"}
                  strokeWidth="2"
                />
                <circle
                  cx="60"
                  cy="74"
                  r="9"
                  fill="#0f172a"
                  stroke={isValueMismatch ? "#f87171" : "#38bdf8"}
                  strokeWidth="1.5"
                />
                <text
                  x="60"
                  y="78"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="900"
                  fontFamily="monospace"
                >
                  {isValueMismatch ? `!${currentMemoryValue}` : "4"}
                </text>
              </g>
            )}

            {/* Spire Finial on Top of Dome */}
            <circle
              cx="60"
              cy="26"
              r="4.5"
              fill={isActive ? "#f59e0b" : "#818cf8"}
              stroke="#ffffff"
              strokeWidth="1"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
