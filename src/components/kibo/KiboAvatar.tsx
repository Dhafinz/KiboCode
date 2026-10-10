import React from "react";

export type KiboVariant =
  | "hero"
  | "idle"
  | "happy"
  | "thinking"
  | "confused"
  | "sad"
  | "celebrate";

interface CropConfig {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Koordinat pemotongan visual (cropping) dari lembar master 1254x1254
 * Visual source of truth: assets/kibo/kibo-master-reference.png
 * docs/DESIGN.md & docs/DECISIONS.md: Karakter Kibo tidak diubah/didesain ulang.
 */
const CROP_MAP: Record<KiboVariant, CropConfig> = {
  hero: { left: 345, top: 20, width: 420, height: 435 },
  idle: { left: 40, top: 500, width: 145, height: 165 },
  happy: { left: 220, top: 500, width: 155, height: 165 },
  thinking: { left: 405, top: 490, width: 155, height: 175 },
  confused: { left: 605, top: 495, width: 155, height: 170 },
  sad: { left: 810, top: 505, width: 155, height: 165 },
  celebrate: { left: 1010, top: 485, width: 165, height: 180 },
};

export interface KiboAvatarProps {
  size?: number;
  variant?: KiboVariant;
  showGlow?: boolean;
  isCircle?: boolean;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export function KiboAvatar({
  size = 200,
  variant = "hero",
  showGlow = true,
  isCircle = false,
  className = "",
  style = {},
  priority = false,
}: KiboAvatarProps) {
  const crop = CROP_MAP[variant] ?? CROP_MAP.hero;
  const containerWidth = size;

  // Faktor skala & offset posisi berdasarkan kanvas master 1254x1254
  const scaleX = 1254 / crop.width;
  const scaleY = 1254 / crop.height;
  const offsetX = -(crop.left / crop.width) * 100;
  const offsetY = -(crop.top / crop.height) * 100;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: containerWidth,
        maxWidth: "100%",
        height: "auto",
        aspectRatio: `${crop.width} / ${crop.height}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {showGlow && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "5%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0, 242, 254, 0.45) 0%, rgba(121, 72, 247, 0.3) 50%, transparent 75%)",
            filter: "blur(22px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: isCircle ? "50%" : "24px",
          zIndex: 1,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/kibo/kibo-master-reference.png"
          alt={`Kibo — ${variant}`}
          loading={priority ? "eager" : "lazy"}
          style={{
            position: "absolute",
            width: `${scaleX * 100}%`,
            height: `${scaleY * 100}%`,
            left: `${offsetX}%`,
            top: `${offsetY}%`,
            maxWidth: "none",
            maxHeight: "none",
            objectFit: "fill",
            pointerEvents: "none",
            filter: "drop-shadow(0 6px 20px rgba(0, 0, 0, 0.35))",
          }}
        />
      </div>
    </div>
  );
}

export default KiboAvatar;
