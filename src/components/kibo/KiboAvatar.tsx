import React from "react";
import Image from "next/image";

interface KiboAvatarProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

/**
 * KiboAvatar displays the official Kibo character visual.
 * Visual source of truth: assets/kibo/kibo-master-reference.png
 * Character identity is locked according to docs/DESIGN.md & docs/DECISIONS.md.
 */
export function KiboAvatar({ size = 200, className = "", showGlow = true }: KiboAvatarProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showGlow && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "10%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 242, 254, 0.35) 0%, rgba(121, 72, 247, 0.25) 50%, transparent 70%)",
            filter: "blur(20px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}
      <Image
        src="/assets/kibo/kibo-master-reference.png"
        alt="Kibo — Maskot Resmi KiboCode"
        width={size}
        height={size}
        priority
        style={{
          objectFit: "contain",
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))",
        }}
      />
    </div>
  );
}
