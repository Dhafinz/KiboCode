"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { KiboAvatar } from "@/components/kibo/KiboAvatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CHAPTERS, Chapter } from "@/data/chapters";
import { usePlayerProgress, getChapterProgress } from "@/features/progress/storage";

export default function HomePage() {
  const progress = usePlayerProgress();
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
          1. HERO SECTION (Friendly Future Bright & Playful)
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
                      backgroundColor: "var(--color-sky-blue-deep, #0284C7)",
                      display: "inline-block",
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
                  fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                  fontWeight: 800,
                  lineHeight: 1.18,
                  letterSpacing: "-0.02em",
                  color: "var(--color-deep-slate, #24344D)",
                }}
              >
                Belajar Coding Bersama{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)",
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
                  color: "var(--color-slate-muted, #526581)",
                  lineHeight: 1.6,
                  maxWidth: "560px",
                }}
              >
                Sebuah <strong style={{ color: "var(--color-deep-slate, #24344D)" }}>System Glitch</strong> membuat Kibo World kehilangan instruksi. Bantu Kibo menyusun blok kode visual, hidupkan kembali kota lampu, dan jadilah pemecah masalah cilik yang hebat!
              </p>

              {/* Tagline Box */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid var(--color-soft-purple, #D9CCFF)",
                  boxShadow: "var(--shadow-sm)",
                  width: "fit-content",
                  maxWidth: "100%",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>✨</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-soft-purple-deep, #6366F1)" }}>
                  &ldquo;Learn to Code. Help Kibo. Solve Problems.&rdquo;
                </span>
              </div>

              {/* Progress Indicator jika pemain sudah memiliki progres */}
              {progress.totalStars > 0 && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 16px",
                    borderRadius: "9999px",
                    backgroundColor: "#EEFAF2",
                    border: "1.5px solid var(--color-mint-green, #B9F2D0)",
                    color: "var(--color-mint-green-deep, #059669)",
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    width: "fit-content",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <span>⭐ {progress.totalStars} Bintang Dikumpulkan</span>
                  <span>•</span>
                  <span>🔋 Dunia Pulih: {progress.worldRestoredPct}%</span>
                </div>
              )}

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
                    }}
                  >
                    {progress.totalStars > 0 ? "Lanjutkan Petualangan 🚀" : "Mulai Petualangan 🚀"}
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
                      fontWeight: 700,
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
                  gap: "18px",
                  paddingTop: "12px",
                  fontSize: "0.9rem",
                  color: "var(--color-slate-muted, #526581)",
                  fontWeight: 600,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "var(--color-mint-green-deep, #059669)", fontWeight: 800 }}>✓</span> Tanpa Sintaks Rumit
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "var(--color-mint-green-deep, #059669)", fontWeight: 800 }}>✓</span> AI Mentor Bersahabat
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "var(--color-mint-green-deep, #059669)", fontWeight: 800 }}>✓</span> 15 Tantangan Coding
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
                    "radial-gradient(circle, rgba(191, 232, 255, 0.45) 0%, rgba(217, 204, 255, 0.3) 50%, transparent 70%)",
                  filter: "blur(24px)",
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
                  showGlow={false}
                  priority={true}
                  style={{
                    borderRadius: "28px",
                    boxShadow: "0 12px 28px rgba(36, 52, 77, 0.12)",
                    border: "2.5px solid var(--color-sky-blue, #BFE8FF)",
                    backgroundColor: "#FFFFFF",
                  }}
                />

                {/* Dialogue Badge di Bawah Kibo */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid var(--color-sky-blue, #BFE8FF)",
                    borderRadius: "18px",
                    padding: "10px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: "var(--shadow-md)",
                    maxWidth: "100%",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-sky-blue-deep, #0284C7)",
                      flexShrink: 0,
                    }}
                    className="core-pulse"
                  />
                  <span style={{ fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)", fontWeight: 700, color: "var(--color-deep-slate, #24344D)", lineHeight: 1.4 }}>
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
          backgroundColor: "#EDF5FD",
          borderTop: "1px solid var(--border-subtle, #DDE7F3)",
          borderBottom: "1px solid var(--border-subtle, #DDE7F3)",
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
            <Badge variant="cyan" size="md">
              Bagaimana Cara Belajar di KiboCode?
            </Badge>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginTop: "12px",
                marginBottom: "12px",
                color: "var(--color-deep-slate, #24344D)",
              }}
            >
              Belajar Logika Itu Seperti Menyusun Balok!
            </h2>
            <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "1.05rem", lineHeight: 1.6 }}>
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
                  backgroundColor: "#F3EEFF",
                  border: "1.5px solid var(--color-soft-purple, #D9CCFF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                🔍
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-soft-purple-deep, #6366F1)", fontWeight: 800, marginBottom: "6px" }}>
                LANGKAH 1
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px", color: "var(--color-deep-slate, #24344D)" }}>
                Kenali Masalah
              </h3>
              <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "0.925rem", lineHeight: 1.6 }}>
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
                  backgroundColor: "#EDF8FF",
                  border: "1.5px solid var(--color-sky-blue, #BFE8FF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                🧩
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-sky-blue-deep, #0284C7)", fontWeight: 800, marginBottom: "6px" }}>
                LANGKAH 2
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px", color: "var(--color-deep-slate, #24344D)" }}>
                Susun Blok Kode
              </h3>
              <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Pilih dan susun blok kode visual seperti <code style={{ color: "var(--color-sky-blue-deep, #0284C7)", fontWeight: 700 }}>MOVE</code>, <code style={{ color: "var(--color-sky-blue-deep, #0284C7)", fontWeight: 700 }}>IF</code>, dan <code style={{ color: "var(--color-sky-blue-deep, #0284C7)", fontWeight: 700 }}>REPEAT</code> sesuai urutan logikamu.
              </p>
            </div>

            {/* Langkah 3 */}
            <div className="glass-card interactive-card" style={{ padding: "32px 24px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  backgroundColor: "#FFF9E6",
                  border: "1.5px solid var(--color-warm-yellow, #FFE49A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                ▶️
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-warm-yellow-deep, #D97706)", fontWeight: 800, marginBottom: "6px" }}>
                LANGKAH 3
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px", color: "var(--color-deep-slate, #24344D)" }}>
                Jalankan Program
              </h3>
              <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "0.925rem", lineHeight: 1.6 }}>
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
                  backgroundColor: "#EEFAF2",
                  border: "1.5px solid var(--color-mint-green, #B9F2D0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                🌟
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-mint-green-deep, #059669)", fontWeight: 800, marginBottom: "6px" }}>
                LANGKAH 4
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px", color: "var(--color-deep-slate, #24344D)" }}>
                Bantu Kibo & Pulihkan
              </h3>
              <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "0.925rem", lineHeight: 1.6 }}>
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
                color: "var(--color-deep-slate, #24344D)",
              }}
            >
              5 Wilayah Kibo World yang Menantimu
            </h2>
            <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "1.05rem", lineHeight: 1.6 }}>
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
              const chapterBadgeVariants = ["yellow", "yellow", "green", "cyan", "purple"] as const;
              const chapterAccents = [
                "var(--color-warm-yellow-deep, #D97706)",
                "#B45309",
                "var(--color-mint-green-deep, #059669)",
                "var(--color-sky-blue-deep, #0284C7)",
                "var(--color-soft-purple-deep, #6366F1)",
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
                      <Badge variant={chapterBadgeVariants[idx] ?? "neutral"} size="sm">
                        BAB {ch.order}
                      </Badge>
                    </div>

                    <h3
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: 800,
                        color: "var(--color-deep-slate, #24344D)",
                        marginBottom: "6px",
                      }}
                    >
                      {ch.title}
                    </h3>

                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: chapterAccents[idx],
                        marginBottom: "12px",
                      }}
                    >
                      Konsep: {ch.conceptLabel}
                    </div>

                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-slate-muted, #526581)",
                        lineHeight: 1.6,
                      }}
                    >
                      {ch.description}
                    </p>
                  </div>

                  {/* Footer Card */}
                  <div
                    style={{
                      borderTop: "1px solid var(--border-subtle, #DDE7F3)",
                      paddingTop: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {(() => {
                      const chProg = getChapterProgress(ch.id, progress);
                      return (
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: chProg.isRestored
                              ? "var(--color-mint-green-deep, #059669)"
                              : chProg.completed > 0
                              ? "var(--color-sky-blue-deep, #0284C7)"
                              : "var(--color-slate-dim, #7C8BA1)",
                            fontWeight: 700,
                          }}
                        >
                          {chProg.isRestored
                            ? "✅ Pulih Sepenuhnya ✨"
                            : chProg.completed > 0
                            ? `🎯 ${chProg.completed}/${ch.totalChallenges} Selesai`
                            : `🎯 ${ch.totalChallenges} Tantangan Coding`}
                        </span>
                      );
                    })()}
                    <button
                      type="button"
                      onClick={() => setSelectedChapter(ch)}
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: "var(--color-deep-slate, #24344D)",
                        padding: "8px 16px",
                        minHeight: "40px",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        border: "1px solid var(--border-subtle, #DDE7F3)",
                        boxShadow: "var(--shadow-sm)",
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
                backgroundColor: "rgba(36, 52, 77, 0.45)",
                backdropFilter: "blur(6px)",
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
                  border: "1px solid var(--border-subtle, #DDE7F3)",
                  boxShadow: "var(--shadow-lg)",
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
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#F1F5F9",
                      border: "1px solid var(--border-subtle, #DDE7F3)",
                      color: "var(--color-deep-slate, #24344D)",
                      fontSize: "1.1rem",
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
                  <h3 id="modal-chapter-title" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px", color: "var(--color-deep-slate, #24344D)" }}>
                    {selectedChapter.title}
                  </h3>
                  <div style={{ color: "var(--color-sky-blue-deep, #0284C7)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "12px" }}>
                    Fokus Pembelajaran: {selectedChapter.conceptLabel}
                  </div>
                  <p style={{ color: "var(--color-slate-muted, #526581)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                    {selectedChapter.description}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#F4F9FF",
                    border: "1.5px solid var(--color-sky-blue, #BFE8FF)",
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <KiboAvatar size={54} variant="happy" showGlow={false} isCircle={true} />
                  <div style={{ fontSize: "0.875rem", color: "var(--color-deep-slate, #24344D)", lineHeight: 1.5 }}>
                    <strong>Wilayah Kibo World:</strong> Memiliki {selectedChapter.totalChallenges} tantangan coding yang membantumu menguasai konsep {selectedChapter.conceptLabel.toLowerCase()}.
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
                  <Link href="/adventure">
                    <Button
                      variant="cyan"
                      size="md"
                      style={{ minHeight: "44px", padding: "10px 24px", fontWeight: 800 }}
                    >
                      Buka di Peta Petualangan 🗺️
                    </Button>
                  </Link>
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
          backgroundColor: "#EDF5FD",
          borderTop: "1px solid var(--border-subtle, #DDE7F3)",
          borderBottom: "1px solid var(--border-subtle, #DDE7F3)",
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
                color: "var(--color-deep-slate, #24344D)",
              }}
            >
              Sahabat Belajar yang Selalu Mendukungmu
            </h2>
            <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "1.05rem", lineHeight: 1.6 }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-deep-slate, #24344D)", marginBottom: "4px" }}>
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
                      padding: "16px 20px",
                      borderRadius: "16px",
                      backgroundColor: isActive ? "#EDF8FF" : "#FFFFFF",
                      border: isActive
                        ? "2px solid var(--color-sky-blue-deep, #0284C7)"
                        : "1px solid var(--border-subtle, #DDE7F3)",
                      boxShadow: isActive ? "0 2px 10px rgba(2, 132, 199, 0.15)" : "var(--shadow-sm)",
                      transition: "all 180ms ease",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 800,
                          color: isActive ? "var(--color-sky-blue-deep, #0284C7)" : "var(--color-slate-dim, #7C8BA1)",
                          marginBottom: "4px",
                        }}
                      >
                        TINGKAT {item.level}
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-deep-slate, #24344D)" }}>
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
                border: "1.5px solid var(--color-sky-blue, #BFE8FF)",
                boxShadow: "var(--shadow-md)",
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
                        showGlow={false}
                        isCircle={true}
                      />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-deep-slate, #24344D)" }}>Kibo</h4>
                          <Badge variant={currentHint.badgeVariant} size="sm">
                            Mentor AI
                          </Badge>
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "var(--color-sky-blue-deep, #0284C7)", fontWeight: 700 }}>
                          {currentHint.title}
                        </span>
                      </div>
                    </div>

                    {/* Gelembung Percakapan */}
                    <div
                      style={{
                        backgroundColor: "#F4F9FF",
                        border: "1.5px solid var(--color-soft-purple, #D9CCFF)",
                        borderRadius: "18px",
                        padding: "20px",
                        position: "relative",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1.05rem",
                          lineHeight: 1.6,
                          color: "var(--color-deep-slate, #24344D)",
                          fontWeight: 600,
                        }}
                      >
                        &ldquo;{currentHint.kiboSays}&rdquo;
                      </p>
                    </div>

                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-slate-muted, #526581)",
                        borderTop: "1px solid var(--border-subtle, #DDE7F3)",
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
                color: "var(--color-deep-slate, #24344D)",
              }}
            >
              Belajar Tanpa Rasa Takut Salah
            </h2>
            <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "1.05rem", lineHeight: 1.6 }}>
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
            <div className="glass-card interactive-card" style={{ padding: "28px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "14px" }}>🔄</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "8px", color: "var(--color-deep-slate, #24344D)" }}>
                Bebas Coba Berulang Kali
              </h3>
              <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Tidak ada pengurangan nilai atau sistem kalah yang membuat takut. Anak didorong untuk bereksperimen, mencoba lagi, dan belajar dari kesalahan.
              </p>
            </div>

            <div className="glass-card interactive-card" style={{ padding: "28px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "14px" }}>👀</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "8px", color: "var(--color-deep-slate, #24344D)" }}>
                Hasil Visual Nyata
              </h3>
              <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                Setiap blok yang disusun langsung terlihat dampaknya pada karakter Kibo dan lingkungan dunia simulasi, memudahkan pemahaman sebab-akibat.
              </p>
            </div>

            <div className="glass-card interactive-card" style={{ padding: "28px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "14px" }}>⭐</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "8px", color: "var(--color-deep-slate, #24344D)" }}>
                Bintang Penguasaan Materi
              </h3>
              <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "0.925rem", lineHeight: 1.6 }}>
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
              background: "linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 100%)",
              border: "1.5px solid var(--color-sky-blue, #BFE8FF)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <KiboAvatar size={140} variant="celebrate" showGlow={false} isCircle={true} />

            <div style={{ maxWidth: "620px" }}>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
                  fontWeight: 800,
                  marginBottom: "12px",
                  color: "var(--color-deep-slate, #24344D)",
                }}
              >
                Siap Memulai Petualangan Kodingmu?
              </h2>
              <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "1.1rem", lineHeight: 1.6 }}>
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
                  }}
                >
                  Jelajahi Peta 5 Bab Sekarang 🚀
                </Button>
              </Link>
              <a href="#hero">
                <Button
                  variant="secondary"
                  size="lg"
                  style={{
                    borderRadius: "16px",
                    padding: "16px 28px",
                    fontSize: "1.05rem",
                    fontWeight: 700,
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
