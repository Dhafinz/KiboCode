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
      backgroundColor: "#F3EEFF",
      color: "#5B21B6",
      borderColor: "#D9CCFF",
    },
    cyan: {
      backgroundColor: "#EDF8FF",
      color: "#0369A1",
      borderColor: "#BFE8FF",
    },
    yellow: {
      backgroundColor: "#FFF9E6",
      color: "#92400E",
      borderColor: "#FFE49A",
    },
    green: {
      backgroundColor: "#EEFAF2",
      color: "#166534",
      borderColor: "#B9F2D0",
    },
    coral: {
      backgroundColor: "#FFF1F2",
      color: "#9F1239",
      borderColor: "#FECDD3",
    },
    neutral: {
      backgroundColor: "#F1F5F9",
      color: "#334155",
      borderColor: "#DDE7F3",
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "3px 10px", fontSize: "0.78rem" },
    md: { padding: "5px 14px", fontSize: "0.85rem" },
  };

  return (
    <span
      id={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontWeight: 700,
        borderRadius: "9999px",
        border: "1px solid",
        letterSpacing: "0.01em",
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </span>
  );
}
