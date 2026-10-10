import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(5, 8, 16, 0.95)",
        padding: "48px 0 32px 0",
        color: "var(--text-muted)",
        fontSize: "0.9rem",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "36px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "32px",
          }}
        >
          {/* Kolom 1: Profil KiboCode */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#ffffff",
              }}
            >
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: "var(--cyan-core)",
                  boxShadow: "0 0 10px var(--cyan-core)",
                  display: "inline-block",
                }}
              />
              <span>
                Kibo<span style={{ color: "var(--cyan-core)" }}>Code</span>
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6, fontSize: "0.875rem" }}>
              Petualangan edukatif logika pemrograman untuk anak sekolah dasar. Bantu Kibo memperbaiki sistem digital yang rusak langkah demi langkah.
            </p>
            <div style={{ fontSize: "0.8rem", color: "var(--cyan-core)", fontWeight: 600 }}>
              &ldquo;Learn to Code. Help Kibo. Solve Problems.&rdquo;
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: 700 }}>Navigasi Cepat</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.875rem" }}>
              <Link href="/" style={{ color: "var(--text-muted)", transition: "color 150ms ease" }}>
                Beranda
              </Link>
              <Link href="/#cara-belajar" style={{ color: "var(--text-muted)", transition: "color 150ms ease" }}>
                Cara Belajar Logika
              </Link>
              <Link href="/#kurikulum" style={{ color: "var(--text-muted)", transition: "color 150ms ease" }}>
                Peta 5 Bab Kibo World
              </Link>
              <Link href="/#kibo-mentor" style={{ color: "var(--text-muted)", transition: "color 150ms ease" }}>
                Kibo AI Mentor
              </Link>
            </div>
          </div>

          {/* Kolom 3: Kurikulum 5 Bab */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: 700 }}>5 Wilayah Kibo World</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.825rem", color: "var(--text-dim)" }}>
              <div>1. Lumina Town — Sequence</div>
              <div>2. Gate Valley — Condition</div>
              <div>3. Sprout Garden — Loop</div>
              <div>4. Memory Station — Variable</div>
              <div>5. Kibo Core — Problem Solving</div>
            </div>
          </div>

          {/* Kolom 4: Keterangan Proyek */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: 700 }}>Tentang Proyek</h4>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Dibuat untuk lomba inovasi edukasi teknologi anak SD. Fokus pada pemahaman logika komputasional, visualisasi aksi langsung, dan pendampingan mentor suportif.
            </p>
          </div>
        </div>

        {/* Baris Bawah */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            fontSize: "0.825rem",
            color: "var(--text-dim)",
          }}
        >
          <div>
            &copy; 2026 KiboCode. Petualangan Belajar Coding untuk Anak SD.
          </div>
          <div>
            Next.js &bull; React &bull; TypeScript &bull; Prisma SQLite
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
