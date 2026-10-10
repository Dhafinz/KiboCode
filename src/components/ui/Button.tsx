import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "cyan";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 700,
    borderRadius: "14px",
    transition: "all 200ms ease",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #7948f7 0%, #5824d6 100%)",
      color: "#ffffff",
      boxShadow: "0 4px 14px rgba(121, 72, 247, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
    },
    cyan: {
      background: "linear-gradient(135deg, #00f2fe 0%, #0ea5e9 100%)",
      color: "#070a14",
      boxShadow: "0 4px 14px rgba(0, 242, 254, 0.35)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    secondary: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.12)",
    },
    outline: {
      backgroundColor: "transparent",
      color: "#c4b5fd",
      border: "2px solid rgba(121, 72, 247, 0.5)",
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 14px", fontSize: "0.875rem" },
    md: { padding: "10px 20px", fontSize: "1rem" },
    lg: { padding: "14px 28px", fontSize: "1.125rem" },
  };

  return (
    <button
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
