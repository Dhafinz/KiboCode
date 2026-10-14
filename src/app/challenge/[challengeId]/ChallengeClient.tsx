"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { KiboAvatar, KiboVariant } from "@/components/kibo/KiboAvatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StreetLamp } from "@/components/gameplay/StreetLamp";
import { PowerGenerator } from "@/components/gameplay/PowerGenerator";
import { LightCrystal } from "@/components/gameplay/LightCrystal";
import { SmartGate } from "@/components/gameplay/SmartGate";
import { EnergyBridge } from "@/components/gameplay/EnergyBridge";
import { GardenPlant } from "@/components/gameplay/GardenPlant";
import { DigitalPlatform } from "@/components/gameplay/DigitalPlatform";
import { MemoryStationVault } from "@/components/gameplay/MemoryStationVault";
import { KiboCoreChamber } from "@/components/gameplay/KiboCoreChamber";
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
  isChallengeUnlocked,
  getPrerequisiteChallenge,
  isAllChallengesCompleted,
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
  const [currentMemoryValue, setCurrentMemoryValue] = useState<number | null>(null);
  const [kiboMood, setKiboMood] = useState<KiboVariant>("idle");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const initialFeedbackMessage =
    challenge.chapterId === "kibo-core"
      ? "Siapkan Kode Pemulihan 5 di Kotak Memori, buka Gerbang Keamanan, percepat langkah melintasi koridor data, dan salurkan energi ke Altar Inti Kibo!"
      : challenge.chapterId === "memory-station"
      ? "Simpan nilai data ke dalam Kotak Memori Kibo, lalu gunakan nilainya pada terminal, reaktor, atau kubah."
      : challenge.chapterId === "sprout-garden"
      ? "Coba susun langkahnya untuk menyiram tanaman dan merawat kebun."
      : challenge.chapterId === "gate-valley"
      ? "Coba susun langkahnya untuk membuka gerbang dan menyeberangi jembatan."
      : "Coba susun langkahnya dari titik awal hingga tiang lampu.";

  // Kibo Feedback
  const [feedback, setFeedback] = useState<{
    type: "info" | "success" | "error";
    message: string;
  }>({
    type: "info",
    message: initialFeedbackMessage,
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

  // Reset seluruh kondisi permainan dan susunan blok ke kondisi awal
  const handleResetStage = () => {
    if (runTimerRef.current) {
      clearInterval(runTimerRef.current);
      runTimerRef.current = null;
    }
    setIsRunning(false);
    setActiveStepIndex(null);
    setBlocks([]); // Menghapus seluruh blok yang telah disusun pemain
    setKiboPos(challenge.startPosition);
    setLampOn(false);
    setActiveTargetIds([]);
    setCurrentMemoryValue(null);
    setKiboMood("idle");
    setFeedback({
      type: "info",
      message: "Susunan blok dan arena telah direset ke kondisi awal. Ayo susun perintah baru untuk Kibo!",
    });
  };

  // Run the sequence with step-by-step timed execution
  const handleRun = () => {
    if (isRunning) return;

    // Reset visual stage before running
    setKiboPos(challenge.startPosition);
    setLampOn(false);
    setActiveTargetIds([]);
    setCurrentMemoryValue(null);
    setActiveStepIndex(null);
    setKiboMood("idle");

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
        setActiveTargetIds(step.activeTargetIds ?? (step.lampActive ? [challenge.targets[0]?.id || "target-1"] : []));
        if (step.memoryValue !== undefined) {
          setCurrentMemoryValue(step.memoryValue);
        }
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
        if (result.memoryValue !== undefined) {
          setCurrentMemoryValue(result.memoryValue);
        }

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

  // Posisi horizontal Kibo dalam persentase jalur (100% selaras dengan pusat petak)
  const getKiboHorizontalPosition = () => {
    const totalTiles = challenge.gridTiles;
    if (totalTiles <= 1) return "50%";
    if (kiboPos >= totalTiles) {
      return `${((totalTiles + 0.2) / totalTiles) * 100}%`; // overstep melampaui batas arena
    }
    return `${((kiboPos + 0.5) / totalTiles) * 100}%`;
  };

  const isUnlocked = isChallengeUnlocked(challenge.id, progress);
  const prereqChallenge = getPrerequisiteChallenge(challenge.id);
  const nextChallenge =
    Object.values(CHALLENGES).find(
      (c) => c.chapterId === challenge.chapterId && c.order === challenge.order + 1
    ) ||
    (challenge.id === "ch-05"
      ? CHALLENGES["ch-06"]
      : challenge.id === "ch-08"
      ? CHALLENGES["ch-09"]
      : challenge.id === "ch-11"
      ? CHALLENGES["ch-12"]
      : challenge.id === "ch-14"
      ? CHALLENGES["ch-15"]
      : undefined);

  if (!isUnlocked) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "24px 0 60px 0",
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link
              href="/adventure"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--cyan-core)",
                fontSize: "0.95rem",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "12px",
                backgroundColor: "rgba(0, 242, 254, 0.1)",
                border: "1px solid rgba(0, 242, 254, 0.25)",
                transition: "all 150ms ease",
              }}
            >
              ← Kembali ke Peta Petualangan
            </Link>
          </div>

          <div
            className="glass-card"
            style={{
              padding: "clamp(32px, 5vw, 48px)",
              borderRadius: "24px",
              border: "1.5px solid #FFE49A",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
              boxShadow: "0 12px 32px rgba(36, 52, 77, 0.08)",
              maxWidth: "600px",
              margin: "32px auto 0 auto",
            }}
          >
            <KiboAvatar size={130} variant="thinking" showGlow={true} isCircle={true} />

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
              <Badge variant="yellow" size="md">
                🔒 Misi Masih Terkunci
              </Badge>
              <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 800, color: "#24344D" }}>
                {challenge.title}
              </h1>
              <p style={{ color: "#526581", fontSize: "1rem", lineHeight: 1.6, maxWidth: "500px" }}>
                Wah, Kibo belum bisa membuka gerbang misi ini! Kamu perlu menyelesaikan misi sebelumnya terlebih dahulu agar Kibo mengumpulkan energi yang cukup.
              </p>
            </div>

            {prereqChallenge && (
              <div
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  borderRadius: "16px",
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 700 }}>
                    PRASYARAT MISI:
                  </div>
                  <div style={{ fontWeight: 800, color: "#24344D", fontSize: "1rem" }}>
                    {prereqChallenge.title}
                  </div>
                </div>
                <Link href={`/challenge/${prereqChallenge.id}`}>
                  <Button variant="primary" size="sm" style={{ borderRadius: "10px", fontWeight: 700 }}>
                    Mainkan Misi Prasyarat ▶
                  </Button>
                </Link>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/adventure">
                <Button variant="outline" size="md" style={{ borderRadius: "12px" }}>
                  🗺️ Buka Peta Dunia
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            border: "1.5px solid #DDE7F3",
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 6px 20px rgba(36, 52, 77, 0.05)",
          }}
        >
          {/* Kolom Kiri: Ikon Bohlam + Judul & Target */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Circular Mission Badge */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background:
                  challenge.chapterId === "memory-station"
                    ? "radial-gradient(circle, #c084fc 0%, #8b5cf6 60%, #4c1d95 100%)"
                    : challenge.chapterId === "sprout-garden"
                    ? "radial-gradient(circle, #34d399 0%, #10b981 60%, #065f46 100%)"
                    : challenge.chapterId === "gate-valley"
                    ? "radial-gradient(circle, #fdba74 0%, #f97316 60%, #c2410c 100%)"
                    : "radial-gradient(circle, #fde047 0%, #f59e0b 60%, #b45309 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                boxShadow: "0 4px 12px rgba(36, 52, 77, 0.12)",
                flexShrink: 0,
              }}
            >
              {challenge.chapterId === "memory-station"
                ? "💾"
                : challenge.chapterId === "sprout-garden"
                ? "🌱"
                : challenge.chapterId === "gate-valley"
                ? "⛩️"
                : "💡"}
            </div>

            <div>
              <h1
                style={{
                  fontSize: "clamp(1.2rem, 2.5vw, 1.55rem)",
                  fontWeight: 800,
                  color: "var(--color-deep-slate, #24344D)",
                  marginBottom: "2px",
                }}
              >
                {challenge.title}
              </h1>
              <p style={{ color: "var(--color-slate-muted, #526581)", fontSize: "0.925rem", fontWeight: 600 }}>
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
                color: "var(--color-deep-slate, #24344D)",
                fontSize: "0.85rem",
                fontWeight: 700,
                padding: "8px 14px",
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                border: "1px solid var(--border-subtle, #DDE7F3)",
                boxShadow: "var(--shadow-sm)",
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
              <KiboAvatar size={42} variant="hero" showGlow={false} isCircle={true} style={{ border: "1.5px solid var(--color-sky-blue, #BFE8FF)", backgroundColor: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        {/* =====================================================================
            2. IMMERSIVE GAME ARENA: LUMINA TOWN 2D LANDSCAPE (Friendly Future)
            ===================================================================== */}
        <div
          className="glass-card"
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1.5px solid var(--border-subtle, #DDE7F3)",
            boxShadow: "var(--shadow-md)",
            minHeight: "380px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            backgroundImage:
              challenge.chapterId === "kibo-core"
                ? "radial-gradient(circle at 50% 25%, rgba(217, 204, 255, 0.45) 0%, rgba(191, 232, 255, 0.35) 45%, rgba(244, 249, 255, 0.88) 80%), url('/assets/environment/lumina-town-bg.jpg')"
                : challenge.chapterId === "memory-station"
                ? "radial-gradient(circle at 50% 25%, rgba(191, 232, 255, 0.45) 0%, rgba(244, 249, 255, 0.85) 75%), url('/assets/environment/lumina-town-bg.jpg')"
                : "radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.3) 0%, rgba(244, 249, 255, 0.78) 75%), url('/assets/environment/lumina-town-bg.jpg')",
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

          {/* Top Arena Header: Chapter Banner (Kiri) & HUD Kotak Memori (Kanan) */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              right: "16px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              pointerEvents: "none",
            }}
          >
            {/* Banner Papan Nama Arena */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                pointerEvents: "auto",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  padding: "6px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid var(--border-subtle, #DDE7F3)",
                  boxShadow: "var(--shadow-sm)",
                  color: "var(--color-deep-slate, #24344D)",
                  fontSize: "0.825rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  width: "fit-content",
                }}
              >
                <span>
                  {challenge.chapterId === "kibo-core"
                    ? "🔮"
                    : challenge.chapterId === "memory-station"
                    ? "💾"
                    : challenge.chapterId === "gate-valley"
                    ? "⛩️"
                    : challenge.chapterId === "sprout-garden"
                    ? "🌱"
                    : "🏮"}
                </span>
                <span>
                  {challenge.chapterId === "kibo-core"
                    ? "Kibo Core"
                    : challenge.chapterId === "memory-station"
                    ? "Memory Station"
                    : challenge.chapterId === "gate-valley"
                    ? "Gate Valley"
                    : challenge.chapterId === "sprout-garden"
                    ? "Sprout Garden"
                    : "Lumina Town"}{" "}
                  — Misi 0{challenge.order}: {challenge.title.split("(")[0].trim()}
                </span>
              </div>

              {/* Nexus 4-Wilayah Convergence Indicator khusus Kibo Core */}
              {challenge.chapterId === "kibo-core" && (
                <div
                  aria-hidden="true"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    borderRadius: "10px",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid var(--color-soft-purple, #D9CCFF)",
                    boxShadow: "var(--shadow-sm)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--color-slate-muted, #526581)",
                    width: "fit-content",
                  }}
                >
                  <span style={{ color: "var(--color-sky-blue-deep, #0284C7)", fontWeight: 800 }}>Pusat Kendali:</span>
                  <span title="Lumina Town: Lentera Penuntun">💡 Lumina</span>
                  <span style={{ opacity: 0.35 }}>•</span>
                  <span title="Gate Valley: Gerbang Keamanan">⛩️ Valley</span>
                  <span style={{ opacity: 0.35 }}>•</span>
                  <span title="Sprout Garden: Koridor Pengulangan">🌱 Garden</span>
                  <span style={{ opacity: 0.35 }}>•</span>
                  <span title="Memory Station: Kotak Memori Kode 5">💾 Memory</span>
                </div>
              )}
            </div>

            {/* HUD Kotak Memori Kibo (Tampil jika chapter memory-station atau kibo-core) */}
            {(challenge.chapterId === "memory-station" || challenge.chapterId === "kibo-core") && (
              <div
                id="hud-kibo-memory-box"
                style={{
                  pointerEvents: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 14px",
                  borderRadius: "14px",
                  backgroundColor: "#FFFFFF",
                  border:
                    currentMemoryValue !== null
                      ? "1.5px solid var(--color-sky-blue-deep, #0284C7)"
                      : "1.5px dashed var(--color-soft-purple, #D9CCFF)",
                  boxShadow:
                    currentMemoryValue !== null
                      ? "0 2px 10px rgba(2, 132, 199, 0.2)"
                      : "var(--shadow-sm)",
                  transition: "all 300ms ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      color: "var(--color-soft-purple-deep, #6366F1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>💾</span>
                    <span>KOTAK MEMORI</span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: currentMemoryValue !== null ? "var(--color-sky-blue-deep, #0284C7)" : "var(--color-slate-dim, #7C8BA1)",
                    }}
                  >
                    {currentMemoryValue !== null ? "Tersimpan" : "Kosong"}
                  </span>
                </div>

                {/* Slot Angka Memori */}
                <div
                  id="hud-kibo-memory-value"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      currentMemoryValue !== null
                        ? "#EDF8FF"
                        : "#F8FAFC",
                    border:
                      currentMemoryValue !== null
                        ? "2px solid var(--color-sky-blue-deep, #0284C7)"
                        : "1.5px dashed var(--border-subtle, #DDE7F3)",
                    boxShadow:
                      currentMemoryValue !== null
                        ? "0 2px 8px rgba(2, 132, 199, 0.15)"
                        : "none",
                    color: currentMemoryValue !== null ? "var(--color-sky-blue-deep, #0284C7)" : "var(--color-slate-dim, #7C8BA1)",
                    fontSize: currentMemoryValue !== null ? "1.35rem" : "0.95rem",
                    fontWeight: 900,
                    fontFamily: "monospace",
                    transition: "all 250ms ease",
                    transform: currentMemoryValue !== null ? "scale(1.05)" : "scale(1)",
                  }}
                  title={currentMemoryValue !== null ? `Nilai: ${currentMemoryValue}` : "Memori kosong"}
                >
                  {currentMemoryValue !== null ? currentMemoryValue : "—"}
                </div>
              </div>
            )}
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
            {/* Connecting Beam Antara Platform (Friendly Future Tech Trail) */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "55px",
                left: `${(0.5 / challenge.gridTiles) * 100}%`,
                right: `${(0.5 / challenge.gridTiles) * 100}%`,
                height: "4px",
                background:
                  challenge.chapterId === "kibo-core"
                    ? "linear-gradient(90deg, #FDE047 0%, #F59E0B 22%, #10B981 50%, #38BDF8 78%, #A855F7 100%)"
                    : "linear-gradient(90deg, #BFE8FF 0%, #38BDF8 50%, #BFE8FF 100%)",
                boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)",
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
                      color: "var(--color-sky-blue-deep, #0284C7)",
                      fontSize: "14px",
                      fontWeight: 900,
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
                {/* Floating Pocket Memory Badge di atas Kibo */}
                {(challenge.chapterId === "memory-station" || challenge.chapterId === "kibo-core") && (
                  <div
                    style={{
                      marginBottom: "4px",
                      padding: "2px 10px",
                      borderRadius: "9999px",
                      backgroundColor:
                        currentMemoryValue !== null
                          ? "#EDF8FF"
                          : "#FFFFFF",
                      border:
                        currentMemoryValue !== null
                          ? "1.5px solid var(--color-sky-blue-deep, #0284C7)"
                          : "1px dashed var(--border-subtle, #DDE7F3)",
                      color:
                        currentMemoryValue !== null
                          ? "var(--color-sky-blue-deep, #0284C7)"
                          : "var(--color-slate-dim, #7C8BA1)",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      boxShadow: "var(--shadow-sm)",
                      transition: "all 250ms ease",
                    }}
                  >
                    <span>💾</span>
                    <span>{currentMemoryValue !== null ? `Memori: ${currentMemoryValue}` : "Kosong"}</span>
                  </div>
                )}

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
                display: "grid",
                gridTemplateColumns: `repeat(${challenge.gridTiles}, minmax(0, 1fr))`,
                alignItems: "flex-end",
                width: "100%",
                position: "relative",
                zIndex: 2,
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

                const isCompact = challenge.gridTiles >= 6;
                let label = `PETAK ${idx + 1}`;
                if (isStart) {
                  label = challenge.chapterId === "kibo-core" ? "AWAL" : "TITIK AWAL";
                } else if (isTarget) {
                  const defaultTargetLabel =
                    challenge.chapterId === "kibo-core"
                      ? "ALTAR INTI"
                      : challenge.chapterId === "memory-station"
                      ? "STASIUN MEMORI"
                      : challenge.chapterId === "sprout-garden"
                      ? "KEBUN DIGITAL"
                      : challenge.chapterId === "gate-valley"
                      ? "RINTANGAN LEMBAH"
                      : "TIANG LAMPU";

                  if (challenge.chapterId === "kibo-core") {
                    label = targetAtTile?.id === "core-gate" ? "GERBANG" : "ALTAR INTI";
                  } else {
                    label = targetAtTile?.label || defaultTargetLabel;
                  }
                } else {
                  label = challenge.chapterId === "kibo-core" ? `PETAK ${idx + 1}` : "JALUR DIGITAL";
                }

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      width: "100%",
                    }}
                  >
                    <DigitalPlatform
                      index={idx + 1}
                      label={label}
                      isActive={isCurrentKibo || isTargetActive}
                      hasChevron={!isStart && !isTarget}
                      isCompact={isCompact}
                    >
                      {/* Lentera Penuntun Lumina Town di Titik Awal Kibo Core */}
                      {isStart && challenge.chapterId === "kibo-core" && (
                        <div
                          title="Lentera Penuntun Lumina Town (Cahaya Awal Petualangan)"
                          style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            height: "100%",
                            opacity: 0.9,
                            transform: "scale(0.72) translateY(6px)",
                            transformOrigin: "bottom center",
                          }}
                        >
                          <StreetLamp isOn={true} />
                        </div>
                      )}
                      {isTarget && (
                        <>
                          {targetAtTile?.type === "lamp" && (
                            <StreetLamp isOn={isTargetActive} />
                          )}
                          {targetAtTile?.type === "generator" && (
                            <PowerGenerator isOn={isTargetActive} />
                          )}
                          {targetAtTile?.type === "crystal" && (
                            <LightCrystal isOn={isTargetActive} />
                          )}
                          {targetAtTile?.type === "gate" && (
                            <SmartGate isOpen={isTargetActive} />
                          )}
                          {targetAtTile?.type === "bridge" && (
                            <EnergyBridge isActive={isTargetActive} />
                          )}
                          {targetAtTile?.type === "sprout" && (
                            <GardenPlant type="sprout" isBloomed={isTargetActive} />
                          )}
                          {targetAtTile?.type === "flower" && (
                            <GardenPlant type="flower" isBloomed={isTargetActive} />
                          )}
                          {targetAtTile?.type === "fountain" && (
                            <GardenPlant type="fountain" isBloomed={isTargetActive} />
                          )}
                          {(targetAtTile?.type === "terminal" ||
                            targetAtTile?.type === "reactor" ||
                            targetAtTile?.type === "vault") && (
                            <MemoryStationVault
                              type={targetAtTile.type}
                              isActive={isTargetActive}
                              requiredValue={targetAtTile.requiredValue}
                              currentMemoryValue={currentMemoryValue}
                              label={targetAtTile.label}
                              isKiboHere={isCurrentKibo}
                            />
                          )}
                          {targetAtTile?.type === "core" && (
                            <KiboCoreChamber
                              isActive={isTargetActive}
                              requiredValue={targetAtTile.requiredValue}
                              currentMemoryValue={currentMemoryValue}
                              label={targetAtTile.label}
                              isKiboHere={isCurrentKibo}
                            />
                          )}
                        </>
                      )}
                    </DigitalPlatform>
                  </div>
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
              border: "1.5px solid var(--border-subtle, #DDE7F3)",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {/* Header: Susun Kode */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #0284C7 0%, #6366F1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  boxShadow: "0 2px 8px rgba(2, 132, 199, 0.2)",
                  color: "#FFFFFF",
                }}
              >
                📋
              </div>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-deep-slate, #24344D)", marginBottom: "2px" }}>
                  Susun Kode
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--color-slate-muted, #526581)" }}>
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
                      border: "2px dashed var(--border-subtle, #DDE7F3)",
                      backgroundColor: "#F8FAFC",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "1.6rem" }}>🧩</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-slate-muted, #526581)" }}>
                      Belum ada perintah
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--color-slate-dim, #7C8BA1)" }}>
                      Pilih blok di samping untuk memasang langkah.
                    </span>
                  </div>
                ) : (
                  blocks.map((item, index) => {
                    const isCurrentStep = activeStepIndex === index;
                    const isMove = item.type === "MOVE";
                    const isGate = item.type === "IF_GATE";
                    const isBridge = item.type === "IF_BRIDGE";
                    const isWater = item.type === "WATER";
                    const isRepeat = item.type === "REPEAT_2" || item.type === "REPEAT_3";
                    const isEndLoop = item.type === "END_LOOP";
                    const isSetValue = item.type.startsWith("SET_VALUE_");
                    const isUseValue = item.type === "USE_VALUE";
                    const blockCfg = AVAILABLE_BLOCK_CONFIGS[item.type];

                    // Deteksi apakah blok ini berada di dalam pengulangan (loop)
                    let openLoop = false;
                    for (let k = 0; k < index; k++) {
                      if (blocks[k].type === "REPEAT_2" || blocks[k].type === "REPEAT_3") {
                        openLoop = true;
                      } else if (blocks[k].type === "END_LOOP") {
                        openLoop = false;
                      }
                    }
                    const isInsideLoop = openLoop && !isEndLoop;

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          paddingLeft: isInsideLoop ? "18px" : "0",
                          borderLeft: isInsideLoop ? "3px solid var(--color-mint-green-deep, #059669)" : "3px solid transparent",
                          transition: "all 150ms ease",
                        }}
                      >
                        {/* Lingkaran Nomor Langkah */}
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: isCurrentStep
                              ? "var(--color-sky-blue, #BFE8FF)"
                              : isInsideLoop
                              ? "#EEFAF2"
                              : "#F1F5F9",
                            border: isCurrentStep
                              ? "2px solid var(--color-sky-blue-deep, #0284C7)"
                              : "1px solid var(--border-subtle, #DDE7F3)",
                            color: isCurrentStep
                              ? "var(--color-deep-slate, #24344D)"
                              : isInsideLoop
                              ? "var(--color-mint-green-deep, #059669)"
                              : "var(--color-deep-slate, #24344D)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "0.875rem",
                            flexShrink: 0,
                            transition: "all 200ms ease",
                          }}
                        >
                          {index + 1}
                        </div>

                        {/* Pill Berwarna Sesuai Jenis Blok */}
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 16px",
                            borderRadius: "14px",
                            background: isRepeat
                              ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                              : isEndLoop
                              ? "linear-gradient(135deg, #047857 0%, #064e3b 100%)"
                              : isWater
                              ? "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)"
                              : isBridge
                              ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                              : isGate
                              ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)"
                              : isSetValue
                              ? "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)"
                              : isUseValue
                              ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                              : isMove
                              ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                              : "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
                            border: isCurrentStep
                              ? "2px solid #FFFFFF"
                              : "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: isCurrentStep
                              ? "0 4px 14px rgba(2, 132, 199, 0.35)"
                              : "0 2px 6px rgba(36, 52, 77, 0.08)",
                            transform: isCurrentStep ? "scale(1.02)" : "scale(1)",
                            transition: "all 200ms ease",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "1.15rem" }}>
                              {blockCfg?.icon || (isMove ? "⬆" : "🔆")}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#ffffff" }}>
                              {blockCfg?.label || item.type}
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
                    border: "2px dashed var(--border-subtle, #DDE7F3)",
                    borderRadius: "18px",
                    padding: "16px",
                    backgroundColor: "#F8FAFC",
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
                      backgroundColor: "#FFFFFF",
                      border: "1px solid var(--border-subtle, #DDE7F3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: "var(--color-deep-slate, #24344D)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    +
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, color: "var(--color-deep-slate, #24344D)", fontSize: "0.95rem" }}>
                      Tambah Blok
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-slate-dim, #7C8BA1)" }}>
                      Klik tombol untuk menambah perintah:
                    </div>
                  </div>

                  {/* Tombol Cepat Pilihan Blok (Dinamis sesuai availableBlocks) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                    {challenge.availableBlocks.map((bType) => {
                      const cfg = AVAILABLE_BLOCK_CONFIGS[bType];
                      const isMove = bType === "MOVE";
                      const isGate = bType === "IF_GATE";
                      const isBridge = bType === "IF_BRIDGE";
                      const isWater = bType === "WATER";
                      const isRepeat = bType === "REPEAT_2" || bType === "REPEAT_3";
                      const isEndLoop = bType === "END_LOOP";
                      const isSetValue = bType.startsWith("SET_VALUE_");
                      const isUseValue = bType === "USE_VALUE";
                      const btnId =
                        bType === "MOVE"
                          ? "block-add-move"
                          : bType === "ACTIVATE"
                          ? "block-add-activate"
                          : `block-add-${bType.toLowerCase().replace(/_/g, "-")}`;

                      return (
                        <button
                          key={bType}
                          type="button"
                          id={btnId}
                          disabled={isRunning || blocks.length >= challenge.maxBlocks}
                          onClick={() => handleAddBlock(bType)}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "12px",
                            background: isRepeat
                              ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                              : isEndLoop
                              ? "linear-gradient(135deg, #047857 0%, #064e3b 100%)"
                              : isWater
                              ? "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)"
                              : isBridge
                              ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                              : isGate
                              ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)"
                              : isSetValue
                              ? "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)"
                              : isUseValue
                              ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                              : isMove
                              ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                              : "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "#ffffff",
                            fontWeight: 800,
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            cursor:
                              isRunning || blocks.length >= challenge.maxBlocks
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              isRunning || blocks.length >= challenge.maxBlocks ? 0.6 : 1,
                            boxShadow: "0 2px 6px rgba(36, 52, 77, 0.08)",
                            transition: "transform 150ms ease, box-shadow 150ms ease",
                          }}
                        >
                          <span>+ {cfg?.icon || "▶"}</span>
                          <span>{cfg?.label || bType}</span>
                        </button>
                      );
                    })}
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
                      backgroundColor: "#FFFFFF",
                      border: "1.5px solid var(--border-subtle, #DDE7F3)",
                      color: "var(--color-deep-slate, #24344D)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: isRunning ? "not-allowed" : "pointer",
                      minHeight: "44px",
                      boxShadow: "var(--shadow-sm)",
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
              border: "1.5px solid #DDE7F3",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              boxShadow: "0 8px 24px rgba(36, 52, 77, 0.06)",
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
                  backgroundColor: "#F4F9FF",
                  border: "1.5px solid #D9CCFF",
                  boxShadow: "0 4px 14px rgba(36, 52, 77, 0.04)",
                }}
              >
                {/* Bubble Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#92400E",
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
                        ? "#059669"
                        : feedback.type === "error"
                        ? "#E11D48"
                        : "#24344D",
                    lineHeight: 1.5,
                    fontWeight: 600,
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
                borderTop: "1px solid #E2E8F0",
                paddingTop: "12px",
              }}
            >
              <div style={{ fontSize: "0.825rem", color: "#526581", fontWeight: 600 }}>
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
                        padding: "12px 14px",
                        borderRadius: "14px",
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <Badge variant={badgeColor} size="sm">
                        {hint.title}
                      </Badge>
                      <p style={{ color: "#24344D", fontSize: "0.875rem", marginTop: "6px", lineHeight: 1.45, fontWeight: 500 }}>
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
            backgroundColor: "rgba(36, 52, 77, 0.5)",
            backdropFilter: "blur(6px)",
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
              backgroundColor: "#FFFFFF",
              border: "2px solid #B9F2D0",
              boxShadow: "0 20px 50px rgba(36, 52, 77, 0.18)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <KiboAvatar size={140} variant="celebrate" showGlow={true} isCircle={true} />

            {(() => {
              const allMissionsFinished = isAllChallengesCompleted({
                ...progress,
                completedChallenges: {
                  ...progress.completedChallenges,
                  [challenge.id]: {
                    challengeId: challenge.id,
                    stars: Math.max(progress.completedChallenges[challenge.id]?.stars ?? 0, starsAwarded),
                    completedAt: new Date().toISOString(),
                  },
                },
              });

              const totalPlayableCount = Object.keys(CHALLENGES).length;
              const currentCompletedCount = Object.keys({
                ...progress.completedChallenges,
                [challenge.id]: true,
              }).length;
              const currentWorldPct = Math.min(
                100,
                parseFloat(((currentCompletedCount / totalPlayableCount) * 100).toFixed(1))
              );

              const victoryTitle =
                challenge.id === "ch-05"
                  ? "Lumina Town Pulih Sepenuhnya! 🌟"
                  : challenge.id === "ch-08"
                  ? "Gate Valley Pulih Sepenuhnya! ⛩️"
                  : challenge.id === "ch-11"
                  ? "Sprout Garden Pulih Sepenuhnya! 🌱"
                  : challenge.id === "ch-14"
                  ? "Memory Station Pulih Sepenuhnya! 💾"
                  : challenge.id === "ch-15"
                  ? allMissionsFinished
                    ? "Kibo World Pulih Sepenuhnya! 🌟🔮✨"
                    : "Altar Inti Kibo Pulih! 🌟"
                  : "Misi Selesai! Hebat! 🎉";

              const victoryDescription =
                challenge.id === "ch-05"
                  ? "Luar biasa! Kamu berhasil menuntaskan seluruh 5 misi di Lumina Town! Seluruh lentera, generator, dan Kristal Cahaya Agung kini bersinar benderang."
                  : challenge.id === "ch-08"
                  ? "Luar biasa! Kamu berhasil menuntaskan seluruh misi di Gate Valley! Seluruh gerbang penjaga dan jembatan energi telah pulih sempurna."
                  : challenge.id === "ch-11"
                  ? "Luar biasa! Kamu berhasil menuntaskan seluruh misi di Sprout Garden! Seluruh tunas, barisan bunga mawar, dan Air Mancur Megah telah mekar bersemi mempesona!"
                  : challenge.id === "ch-14"
                  ? "Luar biasa! Kamu berhasil menuntaskan seluruh misi di Memory Station! Seluruh terminal data, reaktor plasma, dan Kubah Memori Utama telah aktif dengan kode angka yang presisi!"
                  : challenge.id === "ch-15"
                  ? allMissionsFinished
                    ? "Selamat! Kamu berhasil mereaktivasi Altar Inti Kibo dan memulihkan seluruh Kibo World! Seluruh 5 wilayah kini telah terbebas dari System Glitch berkat penguasaan kode agungmu!"
                    : `Hebat! Altar Inti Kibo berhasil direaktivasi! Tuntaskan seluruh misi di wilayah lain untuk membebaskan Kibo World seutuhnya (Pemulihan Dunia: ${currentWorldPct}%).`
                  : `Kamu berhasil menyelesaikan misi "${challenge.title}" dengan urutan instruksi yang tepat!`;

              return (
                <>
                  <div>
                    <div style={{ fontSize: "2.2rem", marginBottom: "6px" }}>
                      {"⭐".repeat(starsAwarded)}
                    </div>
                    <h2
                      id="victory-modal-title"
                      style={{
                        fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                        fontWeight: 800,
                        color: "#24344D",
                        marginBottom: "8px",
                      }}
                    >
                      {victoryTitle}
                    </h2>
                    <p style={{ color: "#526581", fontSize: "0.95rem", lineHeight: 1.6 }}>
                      {victoryDescription}
                    </p>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "14px",
                      backgroundColor: "#EEFAF2",
                      border: "1.5px solid #B9F2D0",
                      color: "#166534",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}
                  >
                    <span>Progres tersimpan: {starsAwarded} Bintang diperoleh! ⭐</span>
                    <span>Dunia Pulih: {currentWorldPct}% 🔋</span>
                  </div>
                </>
              );
            })()}

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {nextChallenge && (
                <Link href={`/challenge/${nextChallenge.id}`} style={{ flex: 1, minWidth: "180px" }}>
                  <Button
                    variant="primary"
                    size="lg"
                    id="btn-victory-next-challenge"
                    style={{
                      width: "100%",
                      borderRadius: "14px",
                      fontWeight: 800,
                    }}
                  >
                    Misi Berikutnya: {nextChallenge.title.split("(")[0].trim()} ▶
                  </Button>
                </Link>
              )}

              <Link href="/adventure" style={{ flex: 1, minWidth: "140px" }}>
                <Button
                  variant={nextChallenge ? "outline" : "primary"}
                  size="lg"
                  id="btn-victory-back-map"
                  style={{
                    width: "100%",
                    borderRadius: "14px",
                    fontWeight: 700,
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
