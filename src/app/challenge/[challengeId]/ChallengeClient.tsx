"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { KiboAvatar, KiboVariant } from "@/components/kibo/KiboAvatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StreetLamp } from "@/components/gameplay/StreetLamp";
import { DigitalPlatform } from "@/components/gameplay/DigitalPlatform";
import {
  CHALLENGES,
  BlockType,
  AVAILABLE_BLOCK_CONFIGS,
  normalizeChallenge,
} from "@/data/challenges";
import { BlockItem } from "@/features/blocks/types";
import { runSimulation } from "@/features/blocks/engine";
import {
  saveChallengeResult,
  usePlayerProgress,
} from "@/features/progress/storage";

let blockSequenceId = 0;
function createWorkspaceBlockId(type: BlockType): string {
  blockSequenceId += 1;
  return `${type}-seq-${blockSequenceId}`;
}

interface ChallengeClientProps {
  challengeId: string;
}

export default function ChallengeClient({ challengeId }: ChallengeClientProps) {
  const challenge = normalizeChallenge(CHALLENGES[challengeId] ?? CHALLENGES["ch-01"]);
  const progress = usePlayerProgress();
  const savedStars = progress.completedChallenges[challenge.id]?.stars ?? 0;

  // Workspace state: ordered blocks
  const [blocks, setBlocks] = useState<BlockItem[]>([]);

  // Simulation visual state
  const [kiboPos, setKiboPos] = useState<number>(challenge.startPosition);
  const [lampOn, setLampOn] = useState<boolean>(false);
  const [activeTargetIds, setActiveTargetIds] = useState<string[]>([]);
  const [kiboMood, setKiboMood] = useState<KiboVariant>("idle");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Kibo Feedback
  const [feedback, setFeedback] = useState<{
    type: "info" | "success" | "error";
    message: string;
  }>({
    type: "info",
    message: "Coba susun langkahnya dari titik awal hingga tiang lampu.",
  });

  // Modal victory state
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [starsAwarded, setStarsAwarded] = useState<number>(0);

  // Progressive hints state (Level 0 = hidden, 1 to 4)
  const [hintLevel, setHintLevel] = useState<number>(0);

  // Interval timer ref for step-by-step playback
  const runTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (runTimerRef.current) {
        clearInterval(runTimerRef.current);
      }
    };
  }, []);

  // Keyboard accessibility for victory modal (Escape key)
  useEffect(() => {
    if (!showVictoryModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowVictoryModal(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showVictoryModal]);

  // Handle adding block to workspace
  const handleAddBlock = (type: BlockType) => {
    if (isRunning) return;
    if (blocks.length >= challenge.maxBlocks) {
      setFeedback({
        type: "info",
        message: `Maksimal ${challenge.maxBlocks} blok untuk tantangan ini ya.`,
      });
      return;
    }
    const newItem: BlockItem = {
      id: createWorkspaceBlockId(type),
      type,
    };
    setBlocks((prev) => [...prev, newItem]);
    setFeedback({
      type: "info",
      message: `Blok "${AVAILABLE_BLOCK_CONFIGS[type].label}" ditambahkan. Ayo susun langkah berikutnya!`,
    });
  };

  // Handle removing single block
  const handleRemoveBlock = (id: string) => {
    if (isRunning) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Reset stage position without clearing blocks
  const handleResetStage = () => {
    if (runTimerRef.current) {
      clearInterval(runTimerRef.current);
      runTimerRef.current = null;
    }
    setIsRunning(false);
    setActiveStepIndex(null);
    setKiboPos(challenge.startPosition);
    setLampOn(false);
    setActiveTargetIds([]);
    setKiboMood("idle");
    setFeedback({
      type: "info",
      message: "Posisi Kibo dan lampu telah direset. Tekan 'Jalankan Kode' untuk mencoba lagi.",
    });
  };

  // Run the sequence with step-by-step timed execution
  const handleRun = () => {
    if (isRunning) return;

    // Reset visual stage before running
    setKiboPos(challenge.startPosition);
    setLampOn(false);
    setActiveTargetIds([]);
    setActiveStepIndex(null);

    const blockTypes = blocks.map((b) => b.type);
    const result = runSimulation(blockTypes, challenge);

    if (blocks.length === 0) {
      setFeedback({
        type: "error",
        message: result.feedbackMessage,
      });
      setKiboMood(result.kiboMood);
      return;
    }

    setIsRunning(true);
    setFeedback({
      type: "info",
      message: "Kibo sedang melangkah sesuai instruksimu...",
    });

    let currentStep = 0;
    const totalSteps = result.steps.length;

    runTimerRef.current = setInterval(() => {
      if (currentStep < totalSteps) {
        const step = result.steps[currentStep];
        setActiveStepIndex(step.stepIndex);
        setKiboPos(step.kiboPosition);
        setLampOn(step.lampActive);
        setActiveTargetIds(step.activeTargetIds ?? (step.lampActive ? [challenge.targets[0]?.id || "lamp-1"] : []));
        setKiboMood(step.kiboMood);
        setFeedback({
          type: step.status === "failure" ? "error" : "info",
          message: step.message,
        });

        currentStep++;
      } else {
        // Playback finished, evaluate final outcome
        if (runTimerRef.current) {
          clearInterval(runTimerRef.current);
          runTimerRef.current = null;
        }
        setIsRunning(false);
        setActiveStepIndex(null);
        setKiboMood(result.kiboMood);

        if (result.success) {
          setFeedback({
            type: "success",
            message: result.feedbackMessage,
          });
          setStarsAwarded(result.starsEarned);
          setActiveTargetIds(result.activeTargetIds);
          setLampOn(result.lampActive);
          // Simpan progres ke local storage
          saveChallengeResult(challenge.id, result.starsEarned);
          setShowVictoryModal(true);
        } else {
          setFeedback({
            type: "error",
            message: result.feedbackMessage,
          });
        }
      }
    }, 850);
  };

  // Progressive hint reveals (1 to 4)
  const handleRevealNextHint = () => {
    if (hintLevel < challenge.hints.length) {
      const nextLevel = hintLevel + 1;
      setHintLevel(nextLevel);
      setKiboMood("thinking");
      const currentHint = challenge.hints[nextLevel - 1];
      if (currentHint) {
        setFeedback({
          type: "info",
          message: currentHint.text,
        });
      }
    }
  };

  // Posisi horizontal Kibo dalam persentase jalur (smooth transition)
  const getKiboHorizontalPosition = () => {
    const totalTiles = challenge.gridTiles;
    const minPosPct = 18;
    const maxPosPct = 82;
    if (totalTiles <= 1) return "50%";
    const span = maxPosPct - minPosPct;
    const step = span / (totalTiles - 1);
    if (kiboPos >= totalTiles) {
      return `${maxPosPct + 10}%`; // overstep melampaui batas arena
    }
    return `${minPosPct + kiboPos * step}%`;
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px 0 60px 0",
      }}
    >
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* =====================================================================
            1. TOP MISSION BANNER (Sesuai Referensi Visual)
            ===================================================================== */}
        <div
          className="glass-card"
          style={{
            padding: "16px 24px",
            borderRadius: "20px",
            border: "1.5px solid rgba(121, 72, 247, 0.4)",
            backgroundColor: "rgba(10, 15, 29, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Kolom Kiri: Ikon Bohlam + Judul & Target */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Circular Bulb Badge */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #fde047 0%, #f59e0b 60%, #b45309 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.6)",
                flexShrink: 0,
              }}
            >
              💡
            </div>

            <div>
              <h1
                style={{
                  fontSize: "clamp(1.2rem, 2.5vw, 1.55rem)",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: "2px",
                }}
              >
                {challenge.title}
              </h1>
              <p style={{ color: "#c4b5fd", fontSize: "0.925rem", fontWeight: 500 }}>
                {challenge.goal}
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Status & Kembali ke Peta */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/adventure"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--cyan-core)",
                fontSize: "0.85rem",
                fontWeight: 700,
                padding: "8px 14px",
                borderRadius: "12px",
                backgroundColor: "rgba(0, 242, 254, 0.1)",
                border: "1px solid rgba(0, 242, 254, 0.25)",
                transition: "all 150ms ease",
              }}
            >
              ← Peta Petualangan
            </Link>

            {savedStars > 0 && (
              <Badge variant="yellow" size="sm">
                ⭐ {savedStars}/3 Bintang
              </Badge>
            )}

            {/* Kibo Avatar Miniatur */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <KiboAvatar size={42} variant="hero" showGlow={true} isCircle={true} />
            </div>
          </div>
        </div>

        {/* =====================================================================
            2. IMMERSIVE GAME ARENA: LUMINA TOWN 2D LANDSCAPE
            ===================================================================== */}
        <div
          className="glass-card"
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1.5px solid rgba(0, 242, 254, 0.4)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 242, 254, 0.2)",
            minHeight: "380px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            backgroundImage: "url('/assets/environment/lumina-town-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 68%",
          }}
        >
          {/* Subtle Ambient Night Vignette Overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(7, 10, 20, 0.25) 0%, transparent 40%, rgba(7, 10, 20, 0.6) 100%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Banner Papan Nama "Lumina Town" di Kiri Arena */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "20px",
              left: "24px",
              zIndex: 2,
              padding: "6px 14px",
              borderRadius: "10px",
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(6px)",
              color: "#f8fafc",
              fontSize: "0.825rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🏮</span>
            <span>Lumina Town — Gerbang Utama</span>
          </div>

          {/* AREA JALUR & 3 PLATFORM DIGITAL (ISOMETRIC) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "860px",
              margin: "0 auto",
              padding: "0 20px 24px 20px",
              zIndex: 3,
            }}
          >
            {/* Glowing Neon Connecting Beam (Jalur Laser Biru antara Platform) */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "55px",
                left: "18%",
                right: "18%",
                height: "4px",
                background:
                  "linear-gradient(90deg, #00f2fe 0%, #38bdf8 50%, #00f2fe 100%)",
                boxShadow: "0 0 16px var(--cyan-core), 0 0 24px var(--cyan-core)",
                borderRadius: "2px",
                zIndex: 1,
              }}
            >
              {/* Chevron Pulse Indicators on Conduit */}
              {Array.from({ length: Math.max(1, challenge.gridTiles - 1) }).map((_, i) => {
                const chevronLeft = ((i + 0.5) / (challenge.gridTiles - 1)) * 100;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${chevronLeft}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "var(--cyan-core)",
                      fontSize: "14px",
                      fontWeight: 900,
                      textShadow: "0 0 8px var(--cyan-core)",
                    }}
                  >
                    ››
                  </div>
                );
              })}
            </div>

            {/* TRACK CHARACTER KIBO: Berpindah Halus Antar Platform */}
            <div
              style={{
                position: "absolute",
                bottom: "70px",
                left: getKiboHorizontalPosition(),
                transform: "translateX(-50%)",
                transition: "left 650ms cubic-bezier(0.34, 1.3, 0.64, 1), transform 200ms ease",
                zIndex: 5,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  animation: isRunning ? "kiboFloat 1.2s ease-in-out infinite" : "none",
                }}
              >
                <KiboAvatar
                  size={105}
                  variant={kiboMood}
                  showGlow={true}
                  style={{
                    filter: "drop-shadow(0 12px 20px rgba(0, 0, 0, 0.7))",
                  }}
                />
              </div>
            </div>

            {/* Hexagonal Isometric Platforms (Dinamis sesuai data tantangan) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                width: "100%",
                position: "relative",
                zIndex: 2,
                gap: "8px",
              }}
            >
              {Array.from({ length: challenge.gridTiles }).map((_, idx) => {
                const isStart = idx === challenge.startPosition;
                const targetAtTile = challenge.targets.find((t) => t.position === idx);
                const isTarget = Boolean(targetAtTile);
                const isTargetActive = targetAtTile
                  ? activeTargetIds.includes(targetAtTile.id) || (lampOn && challenge.targets.length === 1)
                  : false;
                const isCurrentKibo = kiboPos === idx;

                let label = `PETAK ${idx + 1}`;
                if (isStart) {
                  label = "TITIK AWAL";
                } else if (isTarget) {
                  label = targetAtTile?.label || "TIANG LAMPU";
                } else {
                  label = "JALUR DIGITAL";
                }

                return (
                  <DigitalPlatform
                    key={idx}
                    index={idx + 1}
                    label={label}
                    isActive={isCurrentKibo || isTargetActive}
                    hasChevron={!isStart && !isTarget}
                  >
                    {isTarget && targetAtTile?.type === "lamp" && (
                      <StreetLamp isOn={isTargetActive} />
                    )}
                  </DigitalPlatform>
                );
              })}
            </div>
          </div>
        </div>

        {/* =====================================================================
            3. WORKSPACE & KIBO MENTOR (SPLIT 2 KOLOM SESUAI REFERENSI)
            ===================================================================== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* ===================================================================
              KOLOM KIRI: SUSUN KODE (WORKSPACE & KONTROL EKSEKUSI)
              =================================================================== */}
          <div
            className="glass-card"
            style={{
              padding: "24px",
              borderRadius: "24px",
              border: "1.5px solid rgba(121, 72, 247, 0.35)",
              backgroundColor: "rgba(10, 15, 29, 0.95)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Header: Susun Kode */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #7948f7 0%, #00f2fe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  boxShadow: "0 4px 12px rgba(121, 72, 247, 0.4)",
                }}
              >
                📋
              </div>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", marginBottom: "2px" }}>
                  Susun Kode
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Pilih dan atur blok perintah sesuai urutan.
                </p>
              </div>
            </div>

            {/* Grid 2 Sub-Kolom: Daftar Blok (Kiri) + Kotak Tambah & Aksi (Kanan) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
                gap: "18px",
                alignItems: "start",
              }}
            >
              {/* SUB-KOLOM 1: DAFTAR URUTAN BLOK (PILLS BERWARNA) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {blocks.length === 0 ? (
                  <div
                    style={{
                      padding: "28px 16px",
                      borderRadius: "16px",
                      border: "2px dashed rgba(255, 255, 255, 0.12)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "1.6rem" }}>🧩</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)" }}>
                      Belum ada perintah
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                      Pilih blok di samping untuk memasang langkah.
                    </span>
                  </div>
                ) : (
                  blocks.map((item, index) => {
                    const isCurrentStep = activeStepIndex === index;
                    const isMove = item.type === "MOVE";

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                        }}
                      >
                        {/* Lingkaran Nomor Langkah */}
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: isCurrentStep
                              ? "var(--cyan-core)"
                              : "rgba(255, 255, 255, 0.1)",
                            color: isCurrentStep ? "#070a14" : "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "0.875rem",
                            flexShrink: 0,
                            boxShadow: isCurrentStep ? "0 0 12px var(--cyan-core)" : "none",
                            transition: "all 200ms ease",
                          }}
                        >
                          {index + 1}
                        </div>

                        {/* Pill Berwarna Sesuai Referensi (Biru untuk MOVE, Ungu untuk ACTIVATE) */}
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 16px",
                            borderRadius: "14px",
                            background: isMove
                              ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                              : "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
                            border: isCurrentStep
                              ? "2px solid #ffffff"
                              : isMove
                              ? "1px solid rgba(56, 189, 248, 0.4)"
                              : "1px solid rgba(192, 132, 252, 0.4)",
                            boxShadow: isCurrentStep
                              ? "0 0 18px var(--cyan-glow), inset 0 0 10px rgba(255, 255, 255, 0.3)"
                              : "0 4px 12px rgba(0, 0, 0, 0.25)",
                            transform: isCurrentStep ? "scale(1.02)" : "scale(1)",
                            transition: "all 200ms ease",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "1.15rem" }}>
                              {isMove ? "⬆" : "🔆"}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#ffffff" }}>
                              {AVAILABLE_BLOCK_CONFIGS[item.type].label}
                            </span>
                          </div>

                          {/* Tombol Hapus Blok */}
                          <button
                            type="button"
                            aria-label={`Hapus langkah ke-${index + 1}`}
                            disabled={isRunning}
                            onClick={() => handleRemoveBlock(item.id)}
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              backgroundColor: "rgba(0, 0, 0, 0.25)",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "0.85rem",
                              cursor: isRunning ? "not-allowed" : "pointer",
                              transition: "background-color 150ms ease",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* SUB-KOLOM 2: KOTAK TAMBAH BLOK & TOMBOL KONTROL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Dashed Box: Tambah Blok */}
                <div
                  style={{
                    border: "2px dashed rgba(255, 255, 255, 0.2)",
                    borderRadius: "18px",
                    padding: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    +
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.95rem" }}>
                      Tambah Blok
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Klik tombol untuk menambah perintah:
                    </div>
                  </div>

                  {/* Tombol Cepat Pilihan Blok */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                    <button
                      type="button"
                      id="block-add-move"
                      disabled={isRunning || blocks.length >= challenge.maxBlocks}
                      onClick={() => handleAddBlock("MOVE")}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                        border: "1px solid rgba(56, 189, 248, 0.4)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        cursor: isRunning || blocks.length >= challenge.maxBlocks ? "not-allowed" : "pointer",
                        opacity: isRunning || blocks.length >= challenge.maxBlocks ? 0.6 : 1,
                        transition: "transform 150ms ease, box-shadow 150ms ease",
                      }}
                    >
                      <span>+ ⬆</span>
                      <span>Maju 1 Langkah</span>
                    </button>

                    <button
                      type="button"
                      id="block-add-activate"
                      disabled={isRunning || blocks.length >= challenge.maxBlocks}
                      onClick={() => handleAddBlock("ACTIVATE")}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
                        border: "1px solid rgba(192, 132, 252, 0.4)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        cursor: isRunning || blocks.length >= challenge.maxBlocks ? "not-allowed" : "pointer",
                        opacity: isRunning || blocks.length >= challenge.maxBlocks ? 0.6 : 1,
                        transition: "transform 150ms ease, box-shadow 150ms ease",
                      }}
                    >
                      <span>+ 🔆</span>
                      <span>Nyalakan Lampu</span>
                    </button>
                  </div>
                </div>

                {/* Tombol Aksi: Jalankan Kode ▶ & Reset ↺ */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Button
                    variant="cyan"
                    size="md"
                    id="btn-run-simulation"
                    disabled={isRunning || blocks.length === 0}
                    onClick={handleRun}
                    style={{
                      flex: 1,
                      borderRadius: "14px",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      boxShadow: "0 4px 16px rgba(0, 242, 254, 0.35)",
                      minHeight: "44px",
                    }}
                  >
                    {isRunning ? "Kibo Melangkah... ⏳" : "▶ Jalankan Kode"}
                  </Button>

                  <button
                    type="button"
                    id="btn-reset-simulation"
                    disabled={isRunning}
                    onClick={handleResetStage}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "14px",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: isRunning ? "not-allowed" : "pointer",
                      minHeight: "44px",
                      transition: "background-color 150ms ease",
                    }}
                  >
                    <span>↺</span>
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================
              KOLOM KANAN: AI KIBO MENTOR (BUBBLE CHAT & PETUNJUK)
              =================================================================== */}
          <div
            className="glass-card"
            style={{
              padding: "24px",
              borderRadius: "24px",
              border: "1.5px solid rgba(0, 242, 254, 0.35)",
              backgroundColor: "rgba(10, 15, 29, 0.95)",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Header / Avatar & Speech Bubble Area */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              {/* Kibo Avatar dengan Glowing Halo */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <KiboAvatar size={75} variant={kiboMood} showGlow={true} isCircle={true} />
              </div>

              {/* Chat Speech Bubble */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  padding: "14px 18px",
                  borderRadius: "18px",
                  backgroundColor: "rgba(21, 29, 56, 0.85)",
                  border: "1.5px solid rgba(121, 72, 247, 0.4)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Bubble Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--warm-yellow)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    marginBottom: "4px",
                  }}
                >
                  <span>💡</span>
                  <span>Kibo</span>
                </div>

                {/* Bubble Message */}
                <p
                  style={{
                    fontSize: "0.925rem",
                    color:
                      feedback.type === "success"
                        ? "#a7f3d0"
                        : feedback.type === "error"
                        ? "#fecdd3"
                        : "#ffffff",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {feedback.message}
                </p>
              </div>
            </div>

            {/* Tombol Minta Petunjuk Bertahap */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                paddingTop: "12px",
              }}
            >
              <div style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                Sahabat Berpikir Kibo (Petunjuk Mandiri)
              </div>

              {hintLevel < challenge.hints.length ? (
                <Button
                  variant="primary"
                  size="sm"
                  id="btn-reveal-hint"
                  onClick={handleRevealNextHint}
                  style={{ borderRadius: "10px", fontWeight: 700 }}
                >
                  {hintLevel === 0 ? "Minta Petunjuk 💡" : `Petunjuk (${hintLevel + 1}/4) →`}
                </Button>
              ) : (
                <Badge variant="green" size="sm">
                  Semua Petunjuk Terbuka ✨
                </Badge>
              )}
            </div>

            {/* Riwayat Petunjuk Terbuka */}
            {hintLevel > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {challenge.hints.slice(0, hintLevel).map((hint) => {
                  const badgeVariants = ["cyan", "yellow", "purple", "green"] as const;
                  const badgeColor = badgeVariants[(hint.level - 1) % badgeVariants.length];

                  return (
                    <div
                      key={hint.level}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <Badge variant={badgeColor} size="sm">
                        {hint.title}
                      </Badge>
                      <p style={{ color: "var(--text-main)", fontSize: "0.85rem", marginTop: "4px", lineHeight: 1.4 }}>
                        {hint.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. VICTORY MODAL DIALOG (SAAT SUKSES 3 BINTANG)
          ===================================================================== */}
      {showVictoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="victory-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
          onClick={() => setShowVictoryModal(false)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: "480px",
              width: "100%",
              padding: "clamp(24px, 5vw, 36px)",
              borderRadius: "28px",
              backgroundColor: "rgba(10, 15, 29, 0.98)",
              border: "2px solid var(--cyan-core)",
              boxShadow: "0 0 40px var(--cyan-glow)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <KiboAvatar size={140} variant="celebrate" showGlow={true} isCircle={true} />

            <div>
              <div style={{ fontSize: "2.2rem", marginBottom: "6px" }}>
                {"⭐".repeat(starsAwarded)}
              </div>
              <h2
                id="victory-modal-title"
                style={{
                  fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                Misi Selesai! Hebat! 🎉
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Kamu berhasil membantu Kibo menyalakan lampu jalan pertama di Lumina Town dengan urutan instruksi yang tepat!
              </p>
            </div>

            <div
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "14px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#a7f3d0",
                fontSize: "0.875rem",
                fontWeight: 700,
              }}
            >
              Progres tersimpan: {starsAwarded} Bintang diperoleh! ⭐
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Link href="/adventure" style={{ flex: 1, minWidth: "160px" }}>
                <Button
                  variant="cyan"
                  size="lg"
                  id="btn-victory-back-map"
                  style={{
                    width: "100%",
                    borderRadius: "14px",
                    fontWeight: 800,
                    boxShadow: "0 4px 16px rgba(0, 242, 254, 0.4)",
                  }}
                >
                  Kembali ke Peta 🗺️
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                id="btn-victory-replay"
                onClick={() => {
                  setShowVictoryModal(false);
                  handleResetStage();
                }}
                style={{
                  borderRadius: "14px",
                  fontWeight: 700,
                  minWidth: "120px",
                }}
              >
                Main Lagi ↺
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
