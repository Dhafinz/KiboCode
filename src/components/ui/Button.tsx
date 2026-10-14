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
    transition: "all 180ms ease",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    boxSizing: "border-box",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
      color: "#FFFFFF",
      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    cyan: {
      backgroundColor: "var(--color-sky-blue, #BFE8FF)",
      color: "var(--color-deep-slate, #24344D)",
      boxShadow: "0 3px 10px rgba(2, 132, 199, 0.15)",
      border: "1px solid #7DD3FC",
    },
    secondary: {
      backgroundColor: "#FFFFFF",
      color: "var(--color-deep-slate, #24344D)",
      border: "1px solid #DDE7F3",
      boxShadow: "0 1px 3px rgba(36, 52, 77, 0.05)",
    },
    outline: {
      backgroundColor: "#FFFFFF",
      color: "#4F46E5",
      border: "2px solid #D9CCFF",
      boxShadow: "0 1px 3px rgba(36, 52, 77, 0.04)",
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 14px", fontSize: "0.875rem" },
    md: { padding: "10px 20px", fontSize: "0.975rem" },
    lg: { padding: "14px 28px", fontSize: "1.1rem" },
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
