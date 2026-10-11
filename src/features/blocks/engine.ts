import { ChallengeDetail, normalizeChallenge } from "@/data/challenges";
import { BlockType } from "@/data/challenges";
import { SimulationResult, SimulationStep } from "./types";

/**
 * Pure Deterministic Block Simulation Engine
 *
 * Sesuai panduan Prompt 05 & docs/TECHNICAL.md:
 * - Tidak menggunakan eval() atau eksekusi kode dinamis sembarang.
 * - Mengevaluasi urutan instruksi secara deterministik langkah demi langkah.
 * - Berbasis parameter konfigurasi tantangan dinamis (petak, target, blok optimal).
 */
export function runSimulation(
  blocks: BlockType[],
  challenge: ChallengeDetail
): SimulationResult {
  const normConfig = normalizeChallenge(challenge);
  const maxTilePosition = normConfig.gridTiles - 1;

  // Validasi urutan kosong
  if (blocks.length === 0) {
    return {
      success: false,
      finalPosition: normConfig.startPosition,
      lampActive: false,
      activeTargetIds: [],
      steps: [],
      feedbackMessage:
        "Belum ada instruksi yang dipasang. Klik atau seret blok perintah untuk membantu Kibo melangkah!",
      kiboMood: "thinking",
      starsEarned: 0,
    };
  }

  let currentPos = normConfig.startPosition;
  const activatedTargetIds = new Set<string>();
  const steps: SimulationStep[] = [];
  let simulationHalted = false;
  let failureReason = "";

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (simulationHalted) {
      break;
    }

    if (block === "MOVE") {
      // Periksa apakah Kibo sedang berdiri di petak gerbang yang masih tertutup
      const gateAtCurrentPos = normConfig.targets.find(
        (t) => t.position === currentPos && t.type === "gate"
      );
      if (gateAtCurrentPos && !activatedTargetIds.has(gateAtCurrentPos.id)) {
        simulationHalted = true;
        failureReason = `Duar! ${gateAtCurrentPos.label || "Gerbang Pintar"} masih tertutup! Kibo tidak bisa lewat. Gunakan perintah kondisi [Jika Tertutup: Buka Gerbang] terlebih dahulu ya.`;
        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }

      const nextPos = currentPos + 1;
      if (nextPos > maxTilePosition) {
        // Melangkah melampaui batas arena petak
        currentPos = nextPos;
        simulationHalted = true;
        failureReason =
          "Kibo melangkah terlalu jauh melebihi jalur digital! Periksa kembali jumlah langkah yang diperlukan.";
        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      } else {
        currentPos = nextPos;
        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          status: "success",
          message: `Kibo maju 1 langkah ke petak ${currentPos + 1}.`,
          kiboMood: "idle",
        });
      }
    } else if (block === "IF_GATE") {
      const gateAtPos = normConfig.targets.find(
        (t) => t.position === currentPos && t.type === "gate"
      );

      if (gateAtPos) {
        activatedTargetIds.add(gateAtPos.id);
        const gateMsg =
          gateAtPos.activationMessage ||
          "Kondisi diperiksa: Gerbang Pintar tertutup! Sensor merespons dan gerbang kini terbuka!";
        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          status: "success",
          message: gateMsg,
          kiboMood: "happy",
        });
      } else {
        simulationHalted = true;
        failureReason =
          "Kibo memeriksa sekitar, tapi di petak ini tidak ada Gerbang Pintar untuk dibuka!";
        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }
    } else if (block === "ACTIVATE") {
      const targetAtPos = normConfig.targets.find((t) => t.position === currentPos);

      if (targetAtPos) {
        // Cek ketergantungan urutan: apakah prasyarat target sudah aktif?
        if (targetAtPos.dependsOn && !activatedTargetIds.has(targetAtPos.dependsOn)) {
          simulationHalted = true;
          failureReason =
            targetAtPos.prerequisiteMessage ||
            `Perangkat ${targetAtPos.label || "ini"} belum bisa diaktifkan karena sumber dayanya belum dinyalakan terlebih dahulu! Aktifkan perangkat sebelumnya ya.`;
          steps.push({
            stepIndex: i,
            blockType: block,
            kiboPosition: currentPos,
            lampActive: activatedTargetIds.size > 0,
            activeTargetIds: Array.from(activatedTargetIds),
            status: "failure",
            message: failureReason,
            kiboMood: "confused",
          });
          break;
        }

        activatedTargetIds.add(targetAtPos.id);
        const activationMsg =
          targetAtPos.activationMessage ||
          (targetAtPos.type === "generator"
            ? "Generator Daya diaktifkan! Arus daya digital mengalir!"
            : targetAtPos.type === "crystal"
            ? "Kristal Cahaya Agung bersinar megah! Seluruh Lumina Town kembali benderang!"
            : "Saklar disentuh! Lampu jalan Lumina Town kembali bersinar terang!");

        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: true,
          activeTargetIds: Array.from(activatedTargetIds),
          status: "success",
          message: activationMsg,
          kiboMood: "happy",
        });
      } else {
        // Belum sampai di petak target saklar
        simulationHalted = true;
        failureReason =
          "Kibo belum sampai di depan saklar atau tiang lampu! Di petak ini tidak ada saklar yang bisa dinyalakan.";
        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }
    }
  }

  const requiredTargets = normConfig.targets.filter((t) => t.required);
  const allRequiredTargetsActive =
    requiredTargets.length > 0 &&
    requiredTargets.every((t) => activatedTargetIds.has(t.id));

  // Evaluasi kondisi keberhasilan akhir
  if (allRequiredTargetsActive && !simulationHalted) {
    // Keberhasilan: hitung bintang berdasarkan konfigurasi optimal tantangan
    const isOptimal = blocks.length <= normConfig.optimalBlocks;
    const stars = isOptimal ? 3 : 2;

    let successMsg = isOptimal
      ? "Luar biasa! Urutan instruksimu tepat dan efisien. Lampu kota kembali menyala!"
      : "Bagus sekali! Lampu kota menyala, tapi kamu bisa mencoba membuatnya lebih ringkas untuk 3 bintang penuh!";

    if (normConfig.id === "ch-04") {
      successMsg = isOptimal
        ? "Luar biasa! Gerbang Pintar berhasil dibuka dengan logika IF-THEN yang tepat, dan Menara Cahaya kembali bersinar!"
        : "Bagus sekali! Menara Cahaya berhasil dinyalakan, coba buat susunan blok lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-05") {
      successMsg = isOptimal
        ? "Luar biasa! Lumina Town telah pulih seutuhnya! Seluruh lampu, generator, dan Kristal Cahaya Agung bersinar megah! ✨"
        : "Bagus sekali! Seluruh Lumina Town berhasil dipulihkan, tapi kamu bisa mencoba membuatnya lebih ringkas untuk 3 bintang penuh!";
    }

    return {
      success: true,
      finalPosition: currentPos,
      lampActive: true,
      activeTargetIds: Array.from(activatedTargetIds),
      steps,
      feedbackMessage: successMsg,
      kiboMood: "celebrate",
      starsEarned: stars,
    };
  }

  // Kegagalan: Kibo berhenti sebelum seluruh target menyala
  let finalFeedback = failureReason;
  let finalMood: "confused" | "thinking" = "confused";

  if (!finalFeedback) {
    const unactivatedTarget = requiredTargets.find((t) => !activatedTargetIds.has(t.id));
    if (unactivatedTarget && currentPos === unactivatedTarget.position) {
      finalFeedback =
        `Kibo sudah berdiri tepat di depan ${unactivatedTarget.label || "tiang lampu"}, tapi saklarnya belum dinyalakan! Tambahkan instruksi Nyalakan Lampu ya.`;
      finalMood = "thinking";
    } else if (activatedTargetIds.size > 0 && unactivatedTarget) {
      finalFeedback =
        `Sebagian lampu sudah menyala, tapi ${unactivatedTarget.label || "lampu lainnya"} masih padam! Periksa kembali apakah Kibo sudah menyalakan setiap lampu di jalurnya.`;
      finalMood = "thinking";
    } else {
      finalFeedback =
        "Kibo belum sampai di tiang lampu. Periksa kembali urutan langkah maju Kibo!";
      finalMood = "thinking";
    }
  }

  return {
    success: false,
    finalPosition: currentPos,
    lampActive: activatedTargetIds.size > 0,
    activeTargetIds: Array.from(activatedTargetIds),
    steps,
    feedbackMessage: finalFeedback,
    kiboMood: finalMood,
    starsEarned: 0,
  };
}
