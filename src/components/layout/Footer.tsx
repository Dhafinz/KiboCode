import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        borderTop: "1px solid var(--border-subtle, #DDE7F3)",
        backgroundColor: "#EDF4FC",
        padding: "48px 0 32px 0",
        color: "var(--color-slate-muted, #526581)",
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
                color: "var(--color-deep-slate, #24344D)",
              }}
            >
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-sky-blue-deep, #0284C7)",
                  boxShadow: "0 2px 6px rgba(2, 132, 199, 0.3)",
                  display: "inline-block",
                }}
              />
              <span>
                Kibo<span style={{ color: "var(--color-soft-purple-deep, #6366F1)" }}>Code</span>
              </span>
            </div>
            <p style={{ color: "var(--color-slate-muted, #526581)", lineHeight: 1.6, fontSize: "0.875rem" }}>
              Petualangan edukatif logika pemrograman untuk anak sekolah dasar. Bantu Kibo memperbaiki sistem digital yang rusak langkah demi langkah.
            </p>
            <div style={{ fontSize: "0.825rem", color: "var(--color-sky-blue-deep, #0284C7)", fontWeight: 700 }}>
              &ldquo;Learn to Code. Help Kibo. Solve Problems.&rdquo;
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ color: "var(--color-deep-slate, #24344D)", fontSize: "0.95rem", fontWeight: 800 }}>Navigasi Cepat</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.875rem" }}>
              <Link href="/" style={{ color: "var(--color-slate-muted, #526581)", transition: "color 150ms ease" }}>
                Beranda
              </Link>
              <Link href="/#cara-belajar" style={{ color: "var(--color-slate-muted, #526581)", transition: "color 150ms ease" }}>
                Cara Belajar Logika
              </Link>
              <Link href="/adventure" style={{ color: "var(--color-slate-muted, #526581)", transition: "color 150ms ease" }}>
                Peta 5 Bab Kibo World
              </Link>
              <Link href="/#kibo-mentor" style={{ color: "var(--color-slate-muted, #526581)", transition: "color 150ms ease" }}>
                Kibo AI Mentor
              </Link>
            </div>
          </div>

          {/* Kolom 3: Kurikulum 5 Bab */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ color: "var(--color-deep-slate, #24344D)", fontSize: "0.95rem", fontWeight: 800 }}>5 Wilayah Kibo World</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.825rem", color: "var(--color-slate-muted, #526581)" }}>
              <div>1. Lumina Town — Sequence</div>
              <div>2. Gate Valley — Condition</div>
              <div>3. Sprout Garden — Loop</div>
              <div>4. Memory Station — Variable</div>
              <div>5. Kibo Core — Problem Solving</div>
            </div>
          </div>

          {/* Kolom 4: Keterangan Proyek */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ color: "var(--color-deep-slate, #24344D)", fontSize: "0.95rem", fontWeight: 800 }}>Tentang Proyek</h4>
            <p style={{ fontSize: "0.825rem", color: "var(--color-slate-muted, #526581)", lineHeight: 1.6 }}>
              Dibuat untuk lomba inovasi edukasi teknologi anak SD. Fokus pada pemahaman logika komputasional, visualisasi aksi langsung, dan pendampingan mentor suportif.
            </p>
          </div>
        </div>

        {/* Baris Bawah: Hak Cipta & Status Sistem */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            borderTop: "1px solid var(--border-subtle, #DDE7F3)",
            paddingTop: "24px",
            fontSize: "0.8rem",
            color: "var(--color-slate-dim, #7C8BA1)",
          }}
        >
          <div>&copy; 2026 KiboCode. Dikembangkan untuk Edukasi Anak Indonesia.</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--color-mint-green-deep, #059669)",
                display: "inline-block",
              }}
            />
            <span>Sistem Kibo World: Stabil & Ramah Anak</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
