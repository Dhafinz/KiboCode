"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { KiboAvatar } from "@/components/kibo/KiboAvatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CHAPTERS, Chapter } from "@/data/chapters";

export default function HomePage() {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeHintLevel, setActiveHintLevel] = useState<number>(1);

  // Keyboard Accessibility: Tutup modal dengan tombol Escape & kunci scroll latar
  useEffect(() => {
    if (!selectedChapter) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedChapter(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedChapter]);

  const hintExamples = [
    {
      level: 1,
      title: "Level 1: Berpikir (Thinking)",
      badgeVariant: "cyan" as const,
      avatarVariant: "thinking" as const,
      kiboSays:
        "Hmm... Kibo sudah berjalan dua langkah, tapi lampunya belum menyala. Menurutmu, instruksi apa yang masih kurang ya?",
      explanation:
        "Kibo memancing rasa ingin tahu anak tanpa langsung memberi tahu letak kesalahan.",
    },
    {
      level: 2,
      title: "Level 2: Arah (Direction)",
      badgeVariant: "yellow" as const,
      avatarVariant: "thinking" as const,
      kiboSays:
        "Coba lihat tombol di dekat tiang lampu! Kibo harus menyentuh tombol itu agar lampunya hidup.",
      explanation:
        "Kibo mengarahkan perhatian anak ke objek penting di dunia simulasi.",
    },
    {
      level: 3,
      title: "Level 3: Konsep (Concept)",
      badgeVariant: "purple" as const,
      avatarVariant: "happy" as const,
      kiboSays:
        "Aha! Kamu bisa menambahkan blok ACTIVATE tepat setelah blok MOVE agar Kibo menyalakan lampu!",
      explanation:
        "Kibo memperkenalkan konsep dan blok koding yang relevan untuk tantangan ini.",
    },
    {
      level: 4,
      title: "Level 4: Solusi Terpandu (Guided Solution)",
      badgeVariant: "green" as const,
      avatarVariant: "celebrate" as const,
      kiboSays:
        "Yuk susun bersama: MOVE → MOVE → ACTIVATE. Ayo jalankan lagi kodenya, Kibo siap meluncur!",
      explanation:
        "Diberikan setelah beberapa kali mencoba agar anak tetap termotivasi dan tidak frustrasi.",
    },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* =====================================================================
          1. HERO SECTION
          ===================================================================== */}
      <section
        id="hero"
        style={{
          position: "relative",
          padding: "56px 0 72px 0",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
              alignItems: "center",
              gap: "40px",
            }}
          >
            {/* Kolom Kiri: Teks & CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <Badge variant="cyan" size="md">
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--cyan-core)",
                      display: "inline-block",
                      boxShadow: "0 0 8px var(--cyan-core)",
                    }}
                  />
                  Petualangan Logika Coding SD
                </Badge>
                <Badge variant="purple" size="md">
                  Usia Kelas 1 – 6
                </Badge>
              </div>

              <h1
                id="hero-main-title"
                style={{
                  fontSize: "clamp(1.85rem, 4.5vw, 3.5rem)",
                  fontWeight: 800,
                  lineHeight: 1.18,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                Belajar Coding Bersama{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #00f2fe 0%, #9d7df9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Kibo!
                </span>
              </h1>

              <p
                style={{
                  fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  maxWidth: "560px",
                }}
              >
                Sebuah <strong style={{ color: "#ffffff" }}>System Glitch</strong> membuat Kibo World kehilangan instruksi. Bantu Kibo menyusun blok kode visual, hidupkan kembali kota lampu, dan jadilah pemecah masalah cilik yang hebat!
              </p>

              {/* Tagline Box */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(121, 72, 247, 0.12)",
                  border: "1px solid rgba(121, 72, 247, 0.3)",
                  width: "fit-content",
                  maxWidth: "100%",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>✨</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--kibo-purple-light)" }}>
                  &ldquo;Learn to Code. Help Kibo. Solve Problems.&rdquo;
                </span>
              </div>

              {/* Tombol CTA Utama */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  paddingTop: "8px",
                }}
              >
                <Link href="/adventure">
                  <Button
                    variant="cyan"
                    size="lg"
                    style={{
                      borderRadius: "16px",
                      padding: "14px 30px",
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      boxShadow: "0 8px 24px rgba(0, 242, 254, 0.35)",
                    }}
                  >
                    Mulai Petualangan 🚀
                  </Button>
                </Link>
                <a href="#cara-belajar">
                  <Button
                    variant="secondary"
                    size="lg"
                    style={{
                      borderRadius: "16px",
                      padding: "14px 26px",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                    }}
                  >
                    Cara Belajar 💡
                  </Button>
                </a>
              </div>

              {/* Fitur Sorotan Kecil */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                  paddingTop: "12px",
                  fontSize: "0.875rem",
                  color: "var(--text-dim)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "var(--success-green)" }}>✓</span> Tanpa Sintaks Rumit
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "var(--success-green)" }}>✓</span> AI Mentor Bersahabat
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "var(--success-green)" }}>✓</span> 15 Misi Interaktif
                </span>
              </div>
            </div>

            {/* Kolom Kanan: Visual Karakter Kibo */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                width: "100%",
              }}
            >
              {/* Background Circular Aura */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: "320px",
                  height: "320px",
                  maxWidth: "85vw",
                  maxHeight: "85vw",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(121, 72, 247, 0.35) 0%, rgba(0, 242, 254, 0.2) 50%, transparent 70%)",
                  filter: "blur(32px)",
                  zIndex: 0,
                }}
              />

              {/* Maskot Kibo Waving (Hero Variant) + Speech Badge */}
              <div
                className="kibo-floating"
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  width: "100%",
                  maxWidth: "320px",
                }}
              >
                <KiboAvatar
                  size={280}
                  variant="hero"
                  showGlow={true}
                  priority={true}
                  style={{
                    borderRadius: "28px",
                    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.45)",
                    border: "2px solid rgba(0, 242, 254, 0.4)",
                  }}
                />

                {/* Dialogue Badge di Bawah Kibo (Tanpa tumpang tindih) */}
                <div
                  style={{
                    backgroundColor: "rgba(13, 18, 36, 0.95)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(0, 242, 254, 0.4)",
                    borderRadius: "18px",
                    padding: "10px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                    maxWidth: "100%",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "var(--cyan-core)",
                      boxShadow: "0 0 10px var(--cyan-core)",
                      flexShrink: 0,
                    }}
                    className="core-pulse"
                  />
                  <span style={{ fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.4 }}>
                    &ldquo;Hai! Aku Kibo. Yuk bantu aku koding!&rdquo;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CARA BELAJAR (4 LANGKAH SEDERHANA UNTUK ANAK SD)
          ===================================================================== */}
      <section
        id="cara-belajar"
        style={{
          padding: "72px 0",
          backgroundColor: "rgba(13, 18, 36, 0.5)",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
            <Badge variant="cyan" size="md">
              Alur Belajar Ramah Anak
            </Badge>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginTop: "12px",
                marginBottom: "12px",
              }}
            >
              Belajar Logika Itu Seperti Menyusun Balok!
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6 }}>
              Tidak ada kode rumit atau hafalan syntax teks. Di KiboCode, kamu belajar cara berpikir komputer melalui 4 langkah seru:
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: "24px",
            }}
          >
            {/* Langkah 1 */}
            <div className="glass-card interactive-card" style={{ padding: "32px 24px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(121, 72, 247, 0.2)",
                  border: "1px solid rgba(121, 72, 247, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                🔍
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--kibo-purple-light)", fontWeight: 700, marginBottom: "6px" }}>
                LANGKAH 1
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "10px" }}>
                Kenali Masalah
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Amati apa yang rusak di Kibo World. Apakah lampunya padam, gerbangnya terkunci, atau tanaman yang kehausan?
              </p>
            </div>

            {/* Langkah 2 */}
            <div className="glass-card interactive-card" style={{ padding: "32px 24px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(0, 242, 254, 0.15)",
                  border: "1px solid rgba(0, 242, 254, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                🧩
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--cyan-core)", fontWeight: 700, marginBottom: "6px" }}>
                LANGKAH 2
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "10px" }}>
                Susun Blok Kode
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Tarik blok instruksi visual seperti <code style={{ color: "var(--cyan-core)" }}>MOVE</code>, <code style={{ color: "var(--cyan-core)" }}>IF</code>, dan <code style={{ color: "var(--cyan-core)" }}>REPEAT</code> sesuai urutan logikamu.
              </p>
            </div>

            {/* Langkah 3 */}
            <div className="glass-card interactive-card" style={{ padding: "32px 24px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                ▶️
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--warm-yellow)", fontWeight: 700, marginBottom: "6px" }}>
                LANGKAH 3
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "10px" }}>
                Jalankan Program
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Tekan tombol Run dan lihat Kibo mengeksekusi instruksimu secara langsung di dunia simulasi dengan mata kepalamu sendiri!
              </p>
            </div>

            {/* Langkah 4 */}
            <div className="glass-card interactive-card" style={{ padding: "32px 24px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                🌟
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--success-green)", fontWeight: 700, marginBottom: "6px" }}>
                LANGKAH 4
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "10px" }}>
                Bantu Kibo & Pulihkan
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Jika ada yang keliru, Kibo siap membantumu dengan petunjuk ramah. Bila berhasil, Kibo Core bersinar dan dunia kembali pulih!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. PETA BAB KIBO WORLD (5 CHAPTER DARI DATA chapters.ts)
          ===================================================================== */}
      <section id="kurikulum" style={{ padding: "80px 0" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto" }}>
            <Badge variant="purple" size="md">
              Peta Petualangan 5 Bab
            </Badge>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginTop: "12px",
                marginBottom: "12px",
              }}
            >
              5 Wilayah Kibo World yang Menantimu
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6 }}>
              Setiap wilayah mengajarkan satu konsep dasar pemrograman. Tantangan disusun bertahap dari yang paling mudah hingga pemecahan masalah utuh.
            </p>
          </div>

          {/* Grid 5 Chapter */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "24px",
            }}
          >
            {CHAPTERS.map((ch, idx) => {
              const chapterIcons = ["💡", "⛩️", "🌱", "💾", "🔮"];
              const chapterColors = [
                "var(--kibo-purple-light)",
                "var(--cyan-core)",
                "var(--success-green)",
                "var(--warm-yellow)",
                "#f43f5e",
              ];

              return (
                <div
                  key={ch.id}
                  className="glass-card interactive-card"
                  style={{
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "20px",
                    borderRadius: "20px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Nomor & Badge Konsep */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "2rem",
                          display: "inline-block",
                        }}
                      >
                        {chapterIcons[idx] ?? "✨"}
                      </span>
                      <Badge variant={idx === 0 ? "purple" : idx === 1 ? "cyan" : idx === 2 ? "green" : idx === 3 ? "yellow" : "coral"} size="sm">
                        BAB {ch.order}
                      </Badge>
                    </div>

                    <h3
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: 800,
                        color: "#ffffff",
                        marginBottom: "6px",
                      }}
                    >
                      {ch.title}
                    </h3>

                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: chapterColors[idx],
                        marginBottom: "12px",
                      }}
                    >
                      Konsep: {ch.conceptLabel}
                    </div>

                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {ch.description}
                    </p>
                  </div>

                  {/* Footer Card */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      paddingTop: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", color: "var(--text-dim)", fontWeight: 600 }}>
                      🎯 3 Level Misi
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedChapter(ch)}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "#ffffff",
                        padding: "10px 18px",
                        minHeight: "44px",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        cursor: "pointer",
                        transition: "all 150ms ease",
                      }}
                    >
                      Lihat Misi →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal / Dialog Preview Bab Terpilih */}
          {selectedChapter && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-chapter-title"
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                padding: "16px",
              }}
              onClick={() => setSelectedChapter(null)}
            >
              <div
                className="glass-card"
                style={{
                  maxWidth: "520px",
                  width: "100%",
                  padding: "clamp(20px, 4vw, 36px)",
                  borderRadius: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  position: "relative",
                  border: "1px solid rgba(0, 242, 254, 0.4)",
                  backgroundColor: "rgba(10, 15, 29, 0.98)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge variant="cyan" size="md">
                    Bab {selectedChapter.order} • {selectedChapter.concept.toUpperCase()}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => setSelectedChapter(null)}
                    aria-label="Tutup dialog"
                    style={{
                      width: "44px",
                      height: "44px",
                      minWidth: "44px",
                      minHeight: "44px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 150ms ease",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <h3 id="modal-chapter-title" style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "8px" }}>
                    {selectedChapter.title}
                  </h3>
                  <div style={{ color: "var(--cyan-core)", fontWeight: 600, fontSize: "0.95rem", marginBottom: "12px" }}>
                    Fokus Pembelajaran: {selectedChapter.conceptLabel}
                  </div>
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                    {selectedChapter.description}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(121, 72, 247, 0.1)",
                    border: "1px solid rgba(121, 72, 247, 0.25)",
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <KiboAvatar size={54} variant="happy" showGlow={false} isCircle={true} />
                  <div style={{ fontSize: "0.875rem", color: "#ffffff", lineHeight: 1.5 }}>
                    {selectedChapter.id === "lumina-town" ? (
                      <>
                        <strong>Wilayah Aktif!</strong> Misi 01 (Lampu Pertama) sudah siap dimainkan. Bantu Kibo menyusun instruksi untuk menyalakan kembali lampu kota!
                      </>
                    ) : (
                      <>
                        <strong>Status Pengembangan:</strong> Wilayah ini akan terbuka setelah misi di Lumina Town diselesaikan. Ayo selesaikan tantangan pertama!
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setSelectedChapter(null)}
                    style={{ minHeight: "44px", padding: "10px 20px" }}
                  >
                    Tutup
                  </Button>
                  {selectedChapter.id === "lumina-town" ? (
                    <Link href="/challenge/ch-01">
                      <Button
                        variant="cyan"
                        size="md"
                        style={{ minHeight: "44px", padding: "10px 24px", fontWeight: 800 }}
                      >
                        Mainkan Misi 01 Sekarang 🚀
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setSelectedChapter(null)}
                      style={{ minHeight: "44px", padding: "10px 24px" }}
                    >
                      Mengerti, Siap Belajar! 👍
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          4. AI KIBO MENTOR: BUKAN PEMBERI JAWABAN, TAPI SAHABAT BERPIKIR
          ===================================================================== */}
      <section
        id="kibo-mentor"
        style={{
          padding: "80px 0",
          backgroundColor: "rgba(10, 15, 29, 0.6)",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto" }}>
            <Badge variant="cyan" size="md">
              AI Kibo Mentor
            </Badge>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginTop: "12px",
                marginBottom: "12px",
              }}
            >
              Sahabat Belajar yang Selalu Mendukungmu
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6 }}>
              Kibo bukan chatbot biasa yang langsung memberi contekan jawaban. Kibo adalah mentor suportif yang membimbing anak berpikir mandiri melalui 4 tingkat petunjuk bertahap (*Progressive Hints*).
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "36px",
              alignItems: "center",
            }}
          >
            {/* Kolom Kiri: 4 Tombol Pilihan Level Petunjuk */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                Coba Pilih Tingkat Petunjuk Kibo:
              </h3>
              {hintExamples.map((item) => {
                const isActive = activeHintLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setActiveHintLevel(item.level)}
                    style={{
                      textAlign: "left",
                      padding: "18px 20px",
                      borderRadius: "16px",
                      backgroundColor: isActive ? "rgba(121, 72, 247, 0.2)" : "rgba(21, 29, 56, 0.5)",
                      border: isActive
                        ? "2px solid var(--cyan-core)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: isActive ? "0 0 20px rgba(0, 242, 254, 0.2)" : "none",
                      transition: "all 200ms ease",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.825rem",
                          fontWeight: 700,
                          color: isActive ? "var(--cyan-core)" : "var(--text-dim)",
                          marginBottom: "4px",
                        }}
                      >
                        TINGKAT {item.level}
                      </div>
                      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff" }}>
                        {item.title.split(": ")[1]}
                      </div>
                    </div>
                    <span style={{ fontSize: "1.25rem" }}>
                      {isActive ? "👉" : "🔘"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Kolom Kanan: Tampilan Interaktif Dialog Kibo */}
            <div
              className="glass-card"
              style={{
                padding: "36px 32px",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                border: "1px solid rgba(0, 242, 254, 0.3)",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
              }}
            >
              {(() => {
                const currentHint = hintExamples.find((h) => h.level === activeHintLevel)!;
                return (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <KiboAvatar
                        size={84}
                        variant={currentHint.avatarVariant}
                        showGlow={true}
                        isCircle={true}
                      />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <h4 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Kibo</h4>
                          <Badge variant={currentHint.badgeVariant} size="sm">
                            Mentor AI
                          </Badge>
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "var(--cyan-core)" }}>
                          {currentHint.title}
                        </span>
                      </div>
                    </div>

                    {/* Gelembung Percakapan */}
                    <div
                      style={{
                        backgroundColor: "rgba(13, 18, 36, 0.9)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "18px",
                        padding: "20px",
                        position: "relative",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1.1rem",
                          lineHeight: 1.6,
                          color: "#ffffff",
                          fontWeight: 500,
                        }}
                      >
                        &ldquo;{currentHint.kiboSays}&rdquo;
                      </p>
                    </div>

                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        paddingTop: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>💡</span>
                      <span>{currentHint.explanation}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. KENAPA KIBOCODE COCOK UNTUK ANAK SD
          ===================================================================== */}
      <section style={{ padding: "80px 0" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
            <Badge variant="yellow" size="md">
              Nilai Edukasi
            </Badge>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginTop: "12px",
                marginBottom: "12px",
              }}
            >
              Belajar Tanpa Rasa Takut Salah
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6 }}>
              KiboCode dirancang khusus dengan pendekatan ramah anak yang membangun kepercayaan diri dalam memecahkan masalah.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "24px",
            }}
          >
            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "14px" }}>🔄</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
                Bebas Coba Berulang Kali
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Tidak ada pengurangan nilai atau sistem kalah yang membuat takut. Anak didorong untuk bereksperimen, mencoba lagi, dan belajar dari kesalahan.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "14px" }}>👀</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
                Hasil Visual Nyata
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Setiap blok yang disusun langsung terlihat dampaknya pada karakter Kibo dan lingkungan dunia simulasi, memudahkan pemahaman sebab-akibat.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "14px" }}>⭐</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
                Bintang Penguasaan Materi
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Tingkat bintang mengukur kemandirian berpikir anak. Misi dapat dimainkan ulang kapan saja untuk meningkatkan bintang tanpa risiko kehilangan capaian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. FINAL CALL TO ACTION (CTA)
          ===================================================================== */}
      <section style={{ padding: "40px 0 88px 0" }}>
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: "clamp(36px, 6vw, 64px) clamp(24px, 5vw, 48px)",
              textAlign: "center",
              borderRadius: "32px",
              background:
                "radial-gradient(ellipse at 50% 20%, rgba(121, 72, 247, 0.25) 0%, rgba(13, 18, 36, 0.8) 70%, transparent 100%)",
              border: "1px solid rgba(0, 242, 254, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
            }}
          >
            <KiboAvatar size={140} variant="celebrate" showGlow={true} isCircle={true} />

            <div style={{ maxWidth: "620px" }}>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
                  fontWeight: 800,
                  marginBottom: "12px",
                }}
              >
                Siap Memulai Petualangan Kodingmu?
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1.6 }}>
                Bantu Kibo menyalakan lampu pertama di Lumina Town. Jelajahi kurikulum 5 bab dan mulailah belajar berpikir seperti programmer cilik!
              </p>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/adventure">
                <Button
                  variant="cyan"
                  size="lg"
                  style={{
                    borderRadius: "16px",
                    padding: "16px 36px",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    boxShadow: "0 8px 24px rgba(0, 242, 254, 0.4)",
                  }}
                >
                  Jelajahi Peta 5 Bab Sekarang 🚀
                </Button>
              </Link>
              <a href="#hero">
                <Button
                  variant="outline"
                  size="lg"
                  style={{
                    borderRadius: "16px",
                    padding: "16px 28px",
                    fontSize: "1.05rem",
                  }}
                >
                  Kembali ke Atas ⬆️
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
