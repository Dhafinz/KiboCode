import React from "react";

interface GardenPlantProps {
  type: "sprout" | "flower" | "fountain";
  isBloomed: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function GardenPlant({
  type,
  isBloomed,
  style,
  className = "",
}: GardenPlantProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "110px",
        height: "145px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Radiant Glow saat Tanaman Mekar atau Air Mengalir */}
      {isBloomed && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120px",
            height: "100px",
            borderRadius: "50%",
            background:
              type === "fountain"
                ? "radial-gradient(circle, rgba(0, 242, 254, 0.5) 0%, rgba(56, 189, 248, 0.25) 50%, transparent 75%)"
                : "radial-gradient(circle, rgba(236, 72, 153, 0.45) 0%, rgba(16, 185, 129, 0.3) 50%, transparent 75%)",
            filter: "blur(12px)",
            zIndex: 1,
            pointerEvents: "none",
            animation: "pulseGlow 2.5s ease-in-out infinite",
          }}
        />
      )}

      {/* Floating Status Badge */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          zIndex: 4,
          padding: "3px 10px",
          borderRadius: "9999px",
          backgroundColor: isBloomed
            ? type === "fountain"
              ? "rgba(6, 182, 212, 0.9)"
              : "rgba(16, 185, 129, 0.9)"
            : "rgba(100, 116, 139, 0.85)",
          color: "#ffffff",
          fontSize: "0.725rem",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          boxShadow: isBloomed
            ? type === "fountain"
              ? "0 0 12px rgba(6, 182, 212, 0.8)"
              : "0 0 12px rgba(16, 185, 129, 0.8)"
            : "0 0 8px rgba(0, 0, 0, 0.4)",
          transition: "all 300ms ease",
        }}
      >
        <span>
          {isBloomed
            ? type === "fountain"
              ? "🌊 AIR MENGALIR"
              : type === "sprout"
              ? "🌸 MEKAR"
              : "🌺 MEKAR INDAH"
            : type === "fountain"
            ? "⛲ POMPA MATI"
            : type === "sprout"
            ? "🌱 TUNAS"
            : "🌷 KUNCUP"}
        </span>
      </div>

      {/* SVG Isometric Garden Plant 2.5D */}
      <svg
        viewBox="0 0 120 150"
        width="100%"
        height="100%"
        style={{
          position: "relative",
          zIndex: 2,
          filter: isBloomed
            ? type === "fountain"
              ? "drop-shadow(0 0 12px rgba(6, 182, 212, 0.7))"
              : "drop-shadow(0 0 12px rgba(236, 72, 153, 0.6))"
            : "drop-shadow(0 0 6px rgba(0, 0, 0, 0.5))",
          transition: "filter 300ms ease",
        }}
      >
        <defs>
          <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="petalPink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>

          <linearGradient id="petalRose" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          <linearGradient id="fountainWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* ========================================================
            TIPE 1 & 2: TUNAS (SPROUT) DAN BUNGA (FLOWER)
            ======================================================== */}
        {type !== "fountain" && (
          <g>
            {/* Pot Tanaman Isometrik */}
            <path
              d="M 30 130 L 90 130 L 98 108 L 22 108 Z"
              fill="url(#potGrad)"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            {/* Permukaan Tanah di Pot */}
            <ellipse cx="60" cy="108" rx="38" ry="10" fill="url(#soilGrad)" />

            {/* Batang Tanaman */}
            <path
              d={isBloomed ? "M 60 108 Q 58 85 60 65" : "M 60 108 Q 59 95 60 88"}
              fill="none"
              stroke="url(#stemGrad)"
              strokeWidth={isBloomed ? "4" : "3"}
              strokeLinecap="round"
            />

            {/* Daun Hijau di Batang */}
            <path
              d={isBloomed ? "M 60 92 Q 44 86 42 76 Q 52 82 60 88" : "M 60 98 Q 48 95 46 88 Q 54 92 60 96"}
              fill="#10b981"
              stroke="#059669"
              strokeWidth="1"
            />
            <path
              d={isBloomed ? "M 60 84 Q 76 78 78 68 Q 68 74 60 80" : "M 60 96 Q 72 93 74 86 Q 66 90 60 94"}
              fill="#10b981"
              stroke="#059669"
              strokeWidth="1"
            />

            {/* KONDISI A: BELUM DISIRAM (Tunas Kecil atau Kuncup Tidur) */}
            {!isBloomed && (
              <g>
                {type === "sprout" ? (
                  // Dua daun tunas mungil
                  <path
                    d="M 60 88 Q 54 78 50 82 Q 56 86 60 88 M 60 88 Q 66 78 70 82 Q 64 86 60 88"
                    fill="#34d399"
                    stroke="#059669"
                    strokeWidth="1"
                  />
                ) : (
                  // Kuncup mawar tertutup
                  <ellipse cx="60" cy="80" rx="8" ry="12" fill="#9f1239" stroke="#fda4af" strokeWidth="1" />
                )}
                {/* Tetesan air kering / simbol perlu disiram */}
                <circle cx="60" cy="62" r="3" fill="#64748b" opacity="0.6" />
              </g>
            )}

            {/* KONDISI B: SUDAH DISIRAM (Bunga Mekar Penuh) */}
            {isBloomed && (
              <g>
                {/* Mahkota Bunga Mekar */}
                <circle cx="60" cy="55" r="16" fill={type === "flower" ? "url(#petalRose)" : "url(#petalPink)"} />
                {/* Kelopak Bunga (Petals) */}
                <ellipse cx="46" cy="55" rx="10" ry="7" fill={type === "flower" ? "#f43f5e" : "#f472b6"} />
                <ellipse cx="74" cy="55" rx="10" ry="7" fill={type === "flower" ? "#f43f5e" : "#f472b6"} />
                <ellipse cx="60" cy="41" rx="7" ry="10" fill={type === "flower" ? "#f43f5e" : "#f472b6"} />
                <ellipse cx="60" cy="69" rx="7" ry="10" fill={type === "flower" ? "#f43f5e" : "#f472b6"} />

                {/* Inti Sari Bunga Emas */}
                <circle cx="60" cy="55" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                <circle cx="60" cy="55" r="3" fill="#ffffff" />

                {/* Sparkles / Bintang Berkilau di Sekitar Bunga */}
                <text x="34" y="42" fill="#fde047" fontSize="11" fontWeight="bold">✦</text>
                <text x="80" y="46" fill="#67e8f9" fontSize="9" fontWeight="bold">✦</text>
                <text x="56" y="28" fill="#f472b6" fontSize="10" fontWeight="bold">✦</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================
            TIPE 3: AIR MANCUR KEBUN (FOUNTAIN)
            ======================================================== */}
        {type === "fountain" && (
          <g>
            {/* Kolam Penampung Bawah */}
            <ellipse cx="60" cy="125" rx="46" ry="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <ellipse cx="60" cy="123" rx="42" ry="11" fill={isBloomed ? "#0369a1" : "#0f172a"} />

            {/* Pilar Penyangga Tengah */}
            <path d="M 52 123 L 52 90 L 68 90 L 68 123 Z" fill="url(#potGrad)" stroke="#475569" strokeWidth="1.5" />

            {/* Mangkuk Air Mancur Atas */}
            <ellipse cx="60" cy="88" rx="28" ry="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <ellipse cx="60" cy="87" rx="25" ry="6" fill={isBloomed ? "#0284c7" : "#0f172a"} />

            {/* Nosel / Pusat Semburan Air */}
            <path d="M 56 87 L 56 72 L 64 72 L 64 87 Z" fill="#64748b" />

            {/* Semburan Air Mancur saat Aktif */}
            {isBloomed && (
              <g>
                {/* Kolom air semprotan utama */}
                <path
                  d="M 60 72 Q 60 38 60 32"
                  fill="none"
                  stroke="url(#fountainWater)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <line x1="60" y1="70" x2="60" y2="34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

                {/* Lengkungan air jatuh kiri & kanan */}
                <path
                  d="M 60 36 Q 42 38 38 82"
                  fill="none"
                  stroke="url(#fountainWater)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 60 36 Q 78 38 82 82"
                  fill="none"
                  stroke="url(#fountainWater)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Percikan Air (Water Splashes) */}
                <circle cx="60" cy="30" r="4" fill="#e0f2fe" />
                <circle cx="36" cy="84" r="2.5" fill="#38bdf8" />
                <circle cx="84" cy="84" r="2.5" fill="#38bdf8" />
                <text x="54" y="24" fill="#38bdf8" fontSize="12" fontWeight="bold">💧</text>
              </g>
            )}

            {!isBloomed && (
              <text x="60" y="58" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">
                💤
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
