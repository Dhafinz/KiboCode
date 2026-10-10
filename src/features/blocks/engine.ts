import { ChallengeDetail } from "@/data/challenges";
import { BlockType } from "@/data/challenges";
import { SimulationResult, SimulationStep } from "./types";

/**
 * Pure Deterministic Block Simulation Engine
 *
 * Sesuai panduan Prompt 04 & docs/TECHNICAL.md:
 * - Tidak menggunakan eval() atau eksekusi kode dinamis sembarang.
 * - Mengevaluasi urutan instruksi secara deterministik langkah demi langkah.
 * - Memisahkan validasi logika dari komponen tampilan antarmuka.
 */
export function runSimulation(
  blocks: BlockType[],
  challenge: ChallengeDetail
): SimulationResult {
  // Validasi urutan kosong
  if (blocks.length === 0) {
    return {
      success: false,
      finalPosition: challenge.startPosition,
      lampActive: false,
      steps: [],
      feedbackMessage:
        "Belum ada instruksi yang dipasang. Klik atau seret blok perintah untuk membantu Kibo melangkah!",
      kiboMood: "thinking",
      starsEarned: 0,
    };
  }

  let currentPos = challenge.startPosition;
  let isLampOn = false;
  const steps: SimulationStep[] = [];
  let simulationHalted = false;
  let failureReason = "";

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (simulationHalted) {
      break;
    }

    if (block === "MOVE") {
      const nextPos = currentPos + 1;
      if (nextPos > challenge.lampPosition) {
        // Melangkah melampaui tiang lampu
        currentPos = nextPos;
        simulationHalted = true;
        failureReason =
          "Kibo melangkah terlalu jauh melebihi tiang lampu! Periksa kembali jumlah langkah yang diperlukan.";
        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: isLampOn,
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
          lampActive: isLampOn,
          status: "success",
          message: `Kibo maju 1 langkah ke petak ${currentPos + 1}.`,
          kiboMood: "idle",
        });
      }
    } else if (block === "ACTIVATE") {
      if (currentPos === challenge.lampPosition) {
        isLampOn = true;
        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: true,
          status: "success",
          message: "Saklar disentuh! Lampu jalan Lumina Town kembali bersinar terang!",
          kiboMood: "happy",
        });
      } else {
        // Belum sampai di depan tiang lampu
        simulationHalted = true;
        failureReason =
          "Kibo belum sampai di depan tiang lampu! Di petak ini tidak ada saklar yang bisa dinyalakan.";
        steps.push({
          stepIndex: i,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: false,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }
    }
  }

  // Evaluasi kondisi keberhasilan akhir
  if (isLampOn && currentPos === challenge.lampPosition && !simulationHalted) {
    // Keberhasilan: hitung bintang
    // Optimal sequence untuk Challenge 01 adalah tepat 3 blok (MOVE -> MOVE -> ACTIVATE)
    const isOptimal = blocks.length === 3;
    const stars = isOptimal ? 3 : 2;

    return {
      success: true,
      finalPosition: currentPos,
      lampActive: true,
      steps,
      feedbackMessage: isOptimal
        ? "Luar biasa! Urutan instruksimu tepat dan efisien. Lampu kota kembali menyala!"
        : "Bagus sekali! Lampu kota menyala, tapi kamu bisa mencoba membuatnya lebih ringkas untuk 3 bintang penuh!",
      kiboMood: "celebrate",
      starsEarned: stars,
    };
  }

  // Kegagalan: Kibo berhenti sebelum lampu menyala
  let finalFeedback = failureReason;
  let finalMood: "confused" | "thinking" = "confused";

  if (!finalFeedback) {
    if (currentPos === challenge.lampPosition && !isLampOn) {
      finalFeedback =
        "Kibo sudah berdiri tepat di depan tiang lampu, tapi lampunya belum menyala! Jangan lupa beri instruksi Nyalakan Lampu ya.";
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
    lampActive: isLampOn,
    steps,
    feedbackMessage: finalFeedback,
    kiboMood: finalMood,
    starsEarned: 0,
  };
}
