"use client";

import React from "react";
import Link from "next/link";
import { KiboAvatar } from "@/components/kibo/KiboAvatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CHAPTERS } from "@/data/chapters";
import { CHALLENGES } from "@/data/challenges";
import { usePlayerProgress } from "@/features/progress/storage";

export default function AdventurePage() {
  const progress = usePlayerProgress();

  const ch01Record = progress.completedChallenges["ch-01"];
  const isCh01Completed = Boolean(ch01Record);
  const ch01Stars = ch01Record?.stars ?? 0;
  const totalStars = progress.totalStars;
  const worldRestoredPct = progress.worldRestoredPct;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "32px 0 64px 0",
      }}
    >
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
        {/* Navigation & Progress Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 150ms ease",
            }}
          >
            ← Kembali ke Beranda
          </Link>

          {/* Player Stats Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                color: "var(--warm-yellow)",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              <span>⭐</span>
              <span>{totalStars} Bintang Dikumpulkan</span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(0, 242, 254, 0.12)",
                border: "1px solid rgba(0, 242, 254, 0.3)",
                color: "var(--cyan-core)",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              <span>🔋</span>
              <span>Dunia Pulih: {worldRestoredPct}%</span>
            </div>
          </div>
        </div>

        {/* Hero Banner: World Map Introduction */}
        <div
          className="glass-card"
          style={{
            padding: "clamp(24px, 4vw, 40px)",
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(21, 29, 56, 0.85) 0%, rgba(10, 15, 29, 0.95) 100%)",
            border: "1px solid rgba(121, 72, 247, 0.3)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <Badge variant="cyan" size="sm">
                Peta Dunia Kibo
              </Badge>
              <Badge variant="purple" size="sm">
                5 Wilayah Petualangan
              </Badge>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginBottom: "12px",
                lineHeight: 1.2,
              }}
            >
              Jelajahi & Pulihkan{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00f2fe 0%, #9d7df9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Kibo World
              </span>
            </h1>

            <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6 }}>
              Sebuah System Glitch misterius telah melumpuhkan lima wilayah di Kibo World. Setiap wilayah membutuhkan keahlian logika coding untuk dipulihkan kembali. Mulailah perjalananmu di <strong>Lumina Town</strong> dan hidupkan lentera kota!
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <KiboAvatar
                size={160}
                variant={isCh01Completed ? "celebrate" : "idle"}
                showGlow={true}
                isCircle={true}
              />
              <div
                style={{
                  marginTop: "-16px",
                  zIndex: 2,
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(7, 10, 20, 0.9)",
                  border: "1px solid var(--cyan-core)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                }}
              >
                {isCh01Completed ? "Kibo: Lumina Town Menyala! ✨" : "Kibo: Siap Memulai Misi! 🚀"}
              </div>
            </div>
          </div>
        </div>

        {/* Areas Path List */}
        <div>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "6px" }}>
              Peta 5 Wilayah Kibo World
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Selesaikan tantangan di setiap bab secara berurutan untuk membuka gerbang wilayah berikutnya.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {CHAPTERS.map((ch, idx) => {
              const isFirstArea = idx === 0; // Lumina Town is currently available
              const isAreaUnlocked = isFirstArea;
              const chapterIcons = ["💡", "⛩️", "🌱", "💾", "🔮"];

              return (
                <div
                  key={ch.id}
                  className="glass-card"
                  style={{
                    padding: "24px",
                    borderRadius: "20px",
                    border: isAreaUnlocked
                      ? "1px solid rgba(0, 242, 254, 0.4)"
                      : "1px solid rgba(255, 255, 255, 0.06)",
                    backgroundColor: isAreaUnlocked
                      ? "rgba(21, 29, 56, 0.75)"
                      : "rgba(12, 17, 34, 0.45)",
                    opacity: isAreaUnlocked ? 1 : 0.75,
                    position: "relative",
                  }}
                >
                  {/* Area Header Row */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "16px",
                          backgroundColor: isAreaUnlocked
                            ? "rgba(121, 72, 247, 0.2)"
                            : "rgba(255, 255, 255, 0.05)",
                          border: isAreaUnlocked
                            ? "1px solid rgba(121, 72, 247, 0.4)"
                            : "1px solid rgba(255, 255, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.75rem",
                          flexShrink: 0,
                        }}
                      >
                        {chapterIcons[idx]}
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              color: "var(--text-dim)",
                              letterSpacing: "0.05em",
                            }}
                          >
                            WILAYAH 0{ch.order}
                          </span>
                          {isAreaUnlocked ? (
                            <Badge variant="green" size="sm">
                              Tersedia & Aktif 🟢
                            </Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">
                              Terkunci 🔒
                            </Badge>
                          )}
                        </div>
                        <h3
                          style={{
                            fontSize: "1.35rem",
                            fontWeight: 800,
                            color: isAreaUnlocked ? "#ffffff" : "var(--text-muted)",
                            marginTop: "2px",
                          }}
                        >
                          {ch.title}
                        </h3>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "6px 14px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: isAreaUnlocked ? "var(--cyan-core)" : "var(--text-dim)",
                      }}
                    >
                      Konsep: {ch.conceptLabel}
                    </div>
                  </div>

                  <p
                    style={{
                      color: isAreaUnlocked ? "var(--text-muted)" : "var(--text-dim)",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      marginBottom: "20px",
                    }}
                  >
                    {ch.description}
                  </p>

                  {/* Playable Challenge Card for Lumina Town */}
                  {isFirstArea ? (
                    <div
                      style={{
                        backgroundColor: "rgba(10, 15, 29, 0.8)",
                        border: "1px solid rgba(0, 242, 254, 0.25)",
                        borderRadius: "16px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "12px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "1.4rem" }}>💡</span>
                          <div>
                            <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.05rem" }}>
                              {CHALLENGES["ch-01"].title}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "var(--cyan-core)" }}>
                              Fokus: Urutan Langkah (Sequence) • 3 Petak Jalur
                            </div>
                          </div>
                        </div>

                        {/* Star Rating Badge */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "10px",
                            backgroundColor: isCh01Completed
                              ? "rgba(245, 158, 11, 0.2)"
                              : "rgba(255, 255, 255, 0.06)",
                            border: isCh01Completed
                              ? "1px solid rgba(245, 158, 11, 0.4)"
                              : "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <span style={{ fontSize: "1rem" }}>
                            {isCh01Completed ? "⭐".repeat(ch01Stars) : "⏳"}
                          </span>
                          <span
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              color: isCh01Completed ? "var(--warm-yellow)" : "var(--text-dim)",
                            }}
                          >
                            {isCh01Completed ? `Selesai (${ch01Stars}/3 Bintang)` : "Belum Selesai"}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                        {CHALLENGES["ch-01"].story}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: "12px",
                          paddingTop: "8px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <Link href="/challenge/ch-01">
                          <Button
                            variant="cyan"
                            size="md"
                            id="btn-play-ch-01"
                            style={{
                              borderRadius: "12px",
                              fontWeight: 800,
                              padding: "10px 24px",
                              boxShadow: "0 4px 16px rgba(0, 242, 254, 0.3)",
                            }}
                          >
                            {isCh01Completed ? "Main Lagi ↺" : "Mainkan Misi ▶"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* Locked Area Notice */
                    <div
                      style={{
                        padding: "14px 18px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        border: "1px dashed rgba(255, 255, 255, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>🔒</span>
                      <span style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>
                        Wilayah ini terkunci. Selesaikan tantangan di wilayah sebelumnya untuk membuka gerbang bab ini.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
