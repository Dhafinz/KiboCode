import React from "react";
import { KiboAvatar } from "@/components/kibo/KiboAvatar";
import { Badge } from "@/components/ui/Badge";
import { CHAPTERS } from "@/data/chapters";

export default function HomePage() {
  return (
    <div style={{ padding: "48px 0 64px 0", flex: 1, display: "flex", flexDirection: "column" }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {/* Hero Section */}
        <section
          id="hero-foundation-section"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "24px",
            padding: "40px 20px",
            borderRadius: "24px",
            background: "radial-gradient(ellipse at 50% 30%, rgba(121, 72, 247, 0.15) 0%, rgba(13, 18, 36, 0.4) 70%, transparent 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Status Badges */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <Badge variant="purple" size="md">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
              KiboCode Foundation
            </Badge>
            <Badge variant="cyan" size="md">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00f2fe", display: "inline-block" }} />
              Next.js 16 + React 19 + TypeScript
            </Badge>
            <Badge variant="green" size="md">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              SQLite + Prisma Ready
            </Badge>
          </div>

          {/* Kibo Master Visual Preview */}
          <div style={{ margin: "12px 0" }}>
            <KiboAvatar size={220} showGlow={true} />
          </div>

          <div style={{ maxWidth: "700px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h1
              id="hero-title"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #ffffff 40%, #c4b5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Selamat Datang di KiboCode
            </h1>
            <p
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              Petualangan belajar logika coding untuk anak sekolah dasar.
              Bantu Kibo memulihkan sistem yang rusak di Kibo World langkah demi langkah.
            </p>
          </div>
        </section>

        {/* Foundation Architecture Cards */}
        <section id="foundation-specs-section">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Card 1: Mascot & Visual Identity */}
            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(121, 72, 247, 0.2)",
                    border: "1px solid rgba(121, 72, 247, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--kibo-purple-light)",
                    fontWeight: "bold",
                  }}
                >
                  KB
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem" }}>Identitas Kibo Terkunci</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--cyan-core)" }}>Source of Truth Asset</span>
                </div>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Asset visual resmi dimuat dari <code>assets/kibo/kibo-master-reference.png</code>.
                Karakter digital blob dengan Kibo Core tetap konsisten dan tidak diubah.
              </p>
            </div>

            {/* Card 2: Database Foundation */}
            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(0, 242, 254, 0.15)",
                    border: "1px solid rgba(0, 242, 254, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--cyan-core)",
                    fontWeight: "bold",
                  }}
                >
                  DB
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem" }}>Database Foundation</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--success-green)" }}>SQLite + Prisma ORM</span>
                </div>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Development storage menggunakan SQLite lokal dengan model PlayerProgress terverifikasi.
                Siap dikembangkan untuk Phase 5 (Progress & Mastery).
              </p>
            </div>

            {/* Card 3: 5 Chapters Content Ready */}
            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--warm-yellow)",
                    fontWeight: "bold",
                  }}
                >
                  15
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem" }}>5 Chapter Disiapkan</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--warm-yellow)" }}>15 Tantangan MVP</span>
                </div>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Struktur kurikulum terdefinisi di <code>src/data/chapters.ts</code>: Lumina Town,
                Gate Valley, Sprout Garden, Memory Station, dan Kibo Core.
              </p>
            </div>
          </div>
        </section>

        {/* Chapters Preview Strip */}
        <section
          id="chapters-overview"
          style={{
            padding: "24px",
            borderRadius: "16px",
            backgroundColor: "rgba(21, 29, 56, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: "4px" }}>Peta Kurikulum Pembelajaran</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>
              5 bab pembelajaran terstruktur untuk mengenalkan logika pemrograman dasar
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {CHAPTERS.map((ch) => (
              <div
                key={ch.id}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "rgba(10, 15, 29, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--cyan-core)", fontWeight: 700, marginBottom: "4px" }}>
                  BAB {ch.order}
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ffffff", marginBottom: "4px" }}>
                  {ch.title}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {ch.conceptLabel}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
