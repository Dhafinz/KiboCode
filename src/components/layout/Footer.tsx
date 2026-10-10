import React from "react";

export function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(7, 10, 20, 0.9)",
        padding: "24px 0",
        color: "var(--text-muted)",
        fontSize: "0.875rem",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div>
          <span style={{ fontWeight: 700, color: "#ffffff" }}>KiboCode</span> — Belajar Logika Coding untuk Anak SD
        </div>
        <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>
          Lomba Web Education • Next.js + React + TypeScript + Prisma SQLite
        </div>
      </div>
    </footer>
  );
}
