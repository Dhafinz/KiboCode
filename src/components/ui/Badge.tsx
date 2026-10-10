import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "cyan" | "yellow" | "green" | "coral" | "neutral";
  size?: "sm" | "md";
  id?: string;
}

export function Badge({ children, variant = "purple", size = "md", id }: BadgeProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    purple: {
      backgroundColor: "rgba(121, 72, 247, 0.18)",
      color: "#c4b5fd",
      borderColor: "rgba(121, 72, 247, 0.4)",
    },
    cyan: {
      backgroundColor: "rgba(0, 242, 254, 0.12)",
      color: "#38bdf8",
      borderColor: "rgba(0, 242, 254, 0.35)",
    },
    yellow: {
      backgroundColor: "rgba(245, 158, 11, 0.15)",
      color: "#fbbf24",
      borderColor: "rgba(245, 158, 11, 0.35)",
    },
    green: {
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      color: "#34d399",
      borderColor: "rgba(16, 185, 129, 0.35)",
    },
    coral: {
      backgroundColor: "rgba(244, 63, 94, 0.15)",
      color: "#fb7185",
      borderColor: "rgba(244, 63, 94, 0.35)",
    },
    neutral: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      color: "#cbd5e1",
      borderColor: "rgba(255, 255, 255, 0.15)",
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "2px 8px", fontSize: "0.75rem" },
    md: { padding: "4px 12px", fontSize: "0.85rem" },
  };

  return (
    <span
      id={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontWeight: 600,
        borderRadius: "9999px",
        border: "1px solid",
        letterSpacing: "0.02em",
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </span>
  );
}
