import {
  BlockType,
  ChallengeDetail,
  ChallengeTarget,
  normalizeChallenge,
} from "@/data/challenges";
import { ChapterId } from "@/types";
import { SimulationResult, SimulationStep } from "./types";

interface UnrolledInstruction {
  blockType: BlockType;
  originalIndex: number;
}

/**
 * Validates loop structures and deterministic unrolls repeated blocks.
 *
 * Safety boundaries:
 * - Checks matched REPEAT and END_LOOP pairs
 * - Rejects empty loop bodies
 * - Limits unrolled instructions to a maximum of 50 to prevent infinite or runaway execution
 */
function unrollLoopBlocks(
  blocks: BlockType[]
): { success: true; unrolled: UnrolledInstruction[] } | { success: false; errorMessage: string } {
  // Syntax & nesting validation
  const loopStack: { type: BlockType; index: number }[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b === "REPEAT_2" || b === "REPEAT_3") {
      loopStack.push({ type: b, index: i });
    } else if (b === "END_LOOP") {
      if (loopStack.length === 0) {
        return {
          success: false,
          errorMessage: `Ada blok [Akhir Pengulangan] di langkah ${i + 1} tanpa blok [Ulangi] sebelumnya! Pastikan kamu membuka blok pengulangan terlebih dahulu ya.`,
        };
      }
      loopStack.pop();
    }
  }

  if (loopStack.length > 0) {
    const unclosed = loopStack[0];
    const repeatLabel = unclosed.type === "REPEAT_2" ? "Ulangi 2 Kali" : "Ulangi 3 Kali";
    return {
      success: false,
      errorMessage: `Blok [${repeatLabel}] di langkah ${unclosed.index + 1} belum ditutup! Tambahkan blok [Akhir Pengulangan] untuk menandai batas akhir pengulangannya.`,
    };
  }

  // Linear unrolling
  const unrolled: UnrolledInstruction[] = [];
  let i = 0;

  while (i < blocks.length) {
    const b = blocks[i];
    if (b === "REPEAT_2" || b === "REPEAT_3") {
      const count = b === "REPEAT_2" ? 2 : 3;
      const repeatLabel = b === "REPEAT_2" ? "Ulangi 2 Kali" : "Ulangi 3 Kali";

      // Find matching END_LOOP
      let depth = 1;
      let endIdx = -1;
      for (let j = i + 1; j < blocks.length; j++) {
        if (blocks[j] === "REPEAT_2" || blocks[j] === "REPEAT_3") {
          depth++;
        } else if (blocks[j] === "END_LOOP") {
          depth--;
          if (depth === 0) {
            endIdx = j;
            break;
          }
        }
      }

      const innerBlocks: { blockType: BlockType; originalIndex: number }[] = [];
      for (let j = i + 1; j < endIdx; j++) {
        innerBlocks.push({ blockType: blocks[j], originalIndex: j });
      }

      if (innerBlocks.length === 0) {
        return {
          success: false,
          errorMessage: `Blok [${repeatLabel}] di langkah ${i + 1} masih kosong! Letakkan perintah (seperti Maju atau Siram) di dalam blok pengulangan ya.`,
        };
      }

      for (let iter = 0; iter < count; iter++) {
        for (const inner of innerBlocks) {
          unrolled.push(inner);
          if (unrolled.length > 50) {
            return {
              success: false,
              errorMessage:
                "Pengulangan instruksi terlalu banyak melebihi batas aman (50 langkah)! Buat susunan blok lebih terarah ya.",
            };
          }
        }
      }

      i = endIdx + 1;
    } else if (b === "END_LOOP") {
      i++;
    } else {
      unrolled.push({ blockType: b, originalIndex: i });
      if (unrolled.length > 50) {
        return {
          success: false,
          errorMessage:
            "Jumlah langkah instruksi terlalu banyak melebihi batas aman! Buat susunan blok lebih ringkas ya.",
        };
      }
      i++;
    }
  }

  return { success: true, unrolled };
}

/**
 * Helper untuk menyusun feedback edukatif saat Kibo berdiri di depan target yang belum aktif.
 * Pesan disesuaikan dengan jenis target spesifik (tanaman, gerbang, jembatan, katup air, saklar lampu).
 */
function getTargetStandingInstruction(target: ChallengeTarget): string {
  const label = target.label || "target";
  switch (target.type) {
    case "sprout":
    case "flower":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi belum disiram! Tambahkan instruksi Siram Tanaman ya.`;
    case "gate":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi gerbang masih tertutup! Gunakan instruksi [Jika Tertutup: Buka Gerbang] ya.`;
    case "bridge":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi jembatan masih terputus! Gunakan instruksi [Jika Terputus: Hubungkan Jembatan] ya.`;
    case "fountain":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi katup air belum diputar! Gunakan blok Aktifkan untuk memutar katup air ya.`;
    case "generator":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi generator belum dinyalakan! Tambahkan instruksi [Nyalakan Lampu / Aktifkan] ya.`;
    case "crystal":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi kristal belum diaktifkan! Tambahkan instruksi [Nyalakan Lampu / Aktifkan] ya.`;
    case "terminal":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi nilai data belum disalurkan! Gunakan blok Gunakan Nilai Data ya.`;
    case "reactor":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi reaktor belum dinyalakan! Gunakan blok Gunakan Nilai Data ya.`;
    case "vault":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi kubah memori belum dibuka! Salurkan data dengan blok Gunakan Nilai Data ya.`;
    case "core":
      return `Kibo sudah berdiri tepat di depan ${label}, tapi inti belum diaktifkan! Salurkan energi pemulihan dengan blok Gunakan Nilai Data ya.`;
    case "lamp":
    default:
      return `Kibo sudah berdiri tepat di depan ${target.label || "tiang lampu"}, tapi saklarnya belum dinyalakan! Tambahkan instruksi Nyalakan Lampu ya.`;
  }
}

/**
 * Helper untuk menyusun feedback saat sebagian target telah aktif namun target lainnya belum.
 */
function getPartialCompletionFeedback(
  chapterId: ChapterId,
  unactivatedTarget: ChallengeTarget
): string {
  const label = unactivatedTarget.label || "target lainnya";
  if (chapterId === "sprout-garden") {
    if (unactivatedTarget.type === "fountain") {
      return `Tanaman sudah disiram mekar, tapi ${label} belum diaktifkan! Tambahkan instruksi [Nyalakan Lampu / Aktifkan] di ujung kebun ya.`;
    }
    return `Sebagian tanaman sudah mekar, tapi ${label} masih layu! Periksa kembali apakah Kibo sudah menyiram setiap tanaman di kebun.`;
  }

  if (chapterId === "gate-valley") {
    return `Sebagian rintangan telah dilewati, tapi ${label} belum diselesaikan! Periksa kembali setiap gerbang, jembatan, dan kristal di lembah.`;
  }

  if (chapterId === "memory-station") {
    return `Sebagian stasiun data telah aktif, tapi ${label} belum diaktifkan! Periksa kembali alur pengiriman data Kibo.`;
  }

  if (chapterId === "kibo-core") {
    return `Sebagian sistem telah aktif, tapi ${label} belum diaktifkan! Periksa kembali instruksi pemulihan Kibo Core.`;
  }

  return `Sebagian lampu sudah menyala, tapi ${label} masih padam! Periksa kembali apakah Kibo sudah menyalakan setiap lampu di jalurnya.`;
}

/**
 * Helper feedback kegagalan jika Kibo berhenti sebelum mencapai petak target manapun.
 */
function getUnreachedTargetFeedback(chapterId: ChapterId): string {
  if (chapterId === "sprout-garden") {
    return "Kibo belum selesai menyiram seluruh tanaman di kebun. Periksa kembali urutan langkah dan pengulangan Kibo!";
  }
  if (chapterId === "gate-valley") {
    return "Kibo belum mencapai tujuan akhir di lembah. Periksa kembali urutan langkah maju dan rintangan Kibo!";
  }
  if (chapterId === "memory-station") {
    return "Kibo belum mencapai terminal atau stasiun data target. Periksa kembali urutan langkah Kibo!";
  }
  if (chapterId === "kibo-core") {
    return "Kibo belum mencapai Gerbang Keamanan atau Altar Inti Kibo. Periksa kembali urutan langkah Kibo!";
  }
  return "Kibo belum sampai di tiang lampu. Periksa kembali urutan langkah maju Kibo!";
}

/**
 * Helper feedback ketika perintah ACTIVATE dijalankan di petak tanpa target saklar/katup/totem.
 */
function getEmptyActivateFeedback(chapterId: ChapterId): string {
  if (chapterId === "sprout-garden") {
    return "Kibo belum sampai di depan katup air atau pompa pengairan! Di petak ini tidak ada perangkat pengairan yang bisa diaktifkan.";
  }
  if (chapterId === "gate-valley") {
    return "Kibo belum sampai di depan saklar atau totem lembah! Di petak ini tidak ada saklar atau totem yang bisa diaktifkan.";
  }
  if (chapterId === "memory-station") {
    return "Kibo belum sampai di depan terminal data atau reaktor! Di petak ini tidak ada perangkat data yang bisa diaktifkan.";
  }
  if (chapterId === "kibo-core") {
    return "Kibo belum sampai di depan Altar Inti Kibo! Di petak ini tidak ada perangkat inti yang bisa diaktifkan.";
  }
  return "Kibo belum sampai di depan saklar atau tiang lampu! Di petak ini tidak ada saklar yang bisa dinyalakan.";
}

/**
 * Pure Deterministic Block Simulation Engine
 *
 * Sesuai panduan Prompt 05, Prompt 08 & docs/TECHNICAL.md:
 * - Tidak menggunakan eval() atau eksekusi kode dinamis sembarang.
 * - Mengevaluasi urutan instruksi secara deterministik langkah demi langkah.
 * - Mendukung sequence, conditional (IF_GATE, IF_BRIDGE), dan bounded loop (REPEAT_2, REPEAT_3, END_LOOP).
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
      memoryValue: null,
      steps: [],
      feedbackMessage:
        "Belum ada instruksi yang dipasang. Klik atau seret blok perintah untuk membantu Kibo melangkah!",
      kiboMood: "thinking",
      starsEarned: 0,
    };
  }

  // Parse dan unroll blok loop
  const parseResult = unrollLoopBlocks(blocks);
  if (!parseResult.success) {
    return {
      success: false,
      finalPosition: normConfig.startPosition,
      lampActive: false,
      activeTargetIds: [],
      memoryValue: null,
      steps: [],
      feedbackMessage: parseResult.errorMessage,
      kiboMood: "confused",
      starsEarned: 0,
    };
  }

  const unrolled = parseResult.unrolled;
  let currentPos = normConfig.startPosition;
  let currentMemoryValue: number | null = null;
  const activatedTargetIds = new Set<string>();
  const steps: SimulationStep[] = [];
  let simulationHalted = false;
  let failureReason = "";

  for (let s = 0; s < unrolled.length; s++) {
    const { blockType: block, originalIndex } = unrolled[s];

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
        failureReason = `Duar! ${gateAtCurrentPos.label || "Gerbang"} masih tertutup! Kibo tidak bisa lewat. Gunakan perintah kondisi [Jika Tertutup: Buka Gerbang] terlebih dahulu ya.`;
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }

      // Periksa apakah Kibo sedang berdiri di petak jembatan energi yang masih terputus
      const bridgeAtCurrentPos = normConfig.targets.find(
        (t) => t.position === currentPos && t.type === "bridge"
      );
      if (bridgeAtCurrentPos && !activatedTargetIds.has(bridgeAtCurrentPos.id)) {
        simulationHalted = true;
        failureReason = `Awas! ${bridgeAtCurrentPos.label || "Jembatan Energi"} masih terputus! Kibo bisa terjatuh ke jurang digital. Gunakan perintah kondisi [Jika Terputus: Hubungkan Jembatan] terlebih dahulu ya.`;
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
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
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      } else {
        currentPos = nextPos;
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
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
          "Kondisi diperiksa: Gerbang tertutup! Sensor merespons dan gerbang kini terbuka!";
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "success",
          message: gateMsg,
          kiboMood: "happy",
        });
      } else {
        const bridgeAtPos = normConfig.targets.find(
          (t) => t.position === currentPos && t.type === "bridge"
        );
        simulationHalted = true;
        failureReason = bridgeAtPos
          ? `Ups! Di depan Kibo adalah ${bridgeAtPos.label || "Jembatan Energi"}, bukan Gerbang! Gunakan perintah kondisi [Jika Terputus: Hubungkan Jembatan] ya.`
          : "Kibo memeriksa sekitar, tapi di petak ini tidak ada Gerbang Pintar untuk dibuka!";
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }
    } else if (block === "IF_BRIDGE") {
      const bridgeAtPos = normConfig.targets.find(
        (t) => t.position === currentPos && t.type === "bridge"
      );

      if (bridgeAtPos) {
        activatedTargetIds.add(bridgeAtPos.id);
        const bridgeMsg =
          bridgeAtPos.activationMessage ||
          "Kondisi diperiksa: Jembatan energi terputus! Aliran daya plasma terhubung dan jembatan kini kokoh diseberangi! ⚡";
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "success",
          message: bridgeMsg,
          kiboMood: "happy",
        });
      } else {
        const gateAtPos = normConfig.targets.find(
          (t) => t.position === currentPos && t.type === "gate"
        );
        simulationHalted = true;
        failureReason = gateAtPos
          ? `Ups! Di depan Kibo adalah ${gateAtPos.label || "Gerbang"}, bukan Jembatan Energi! Gunakan perintah kondisi [Jika Tertutup: Buka Gerbang] ya.`
          : "Kibo memeriksa sekitar, tapi di petak ini tidak ada Jembatan Energi yang perlu dihubungkan!";
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }
    } else if (block === "WATER") {
      const plantAtPos = normConfig.targets.find(
        (t) => t.position === currentPos && (t.type === "sprout" || t.type === "flower")
      );

      if (plantAtPos) {
        activatedTargetIds.add(plantAtPos.id);
        const waterMsg =
          plantAtPos.activationMessage ||
          `💧 Siram Tanaman berhasil! ${plantAtPos.label || "Tanaman"} di petak ${currentPos + 1} kini mekar segar!`;
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "success",
          message: waterMsg,
          kiboMood: "happy",
        });
      } else {
        const fountainAtPos = normConfig.targets.find(
          (t) => t.position === currentPos && t.type === "fountain"
        );
        simulationHalted = true;
        failureReason = fountainAtPos
          ? `Ups! Di depan Kibo adalah ${fountainAtPos.label || "Air Mancur"}, bukan tanaman untuk disiram! Gunakan perintah [Nyalakan Lampu / Aktifkan] untuk memutar katup air ya.`
          : "Kibo menyiram tanah kosong! Di petak ini tidak ada tunas atau tanaman yang perlu disiram.";
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }
    } else if (
      block === "SET_VALUE_2" ||
      block === "SET_VALUE_3" ||
      block === "SET_VALUE_4" ||
      block === "SET_VALUE_5"
    ) {
      let valToSet = 0;
      if (block === "SET_VALUE_2") valToSet = 2;
      else if (block === "SET_VALUE_3") valToSet = 3;
      else if (block === "SET_VALUE_4") valToSet = 4;
      else if (block === "SET_VALUE_5") valToSet = 5;

      currentMemoryValue = valToSet;
      steps.push({
        stepIndex: originalIndex,
        blockType: block,
        kiboPosition: currentPos,
        lampActive: activatedTargetIds.size > 0,
        activeTargetIds: Array.from(activatedTargetIds),
        memoryValue: currentMemoryValue,
        status: "success",
        message: `Kotak Memori terisi: Nilai ${valToSet} berhasil disimpan! 💾`,
        kiboMood: "happy",
      });
    } else if (block === "USE_VALUE") {
      const targetAtPos = normConfig.targets.find((t) => t.position === currentPos);

      if (!targetAtPos) {
        // Berada di petak kosong tanpa target
        simulationHalted = true;
        failureReason =
          "Kibo mencoba menyalurkan nilai data, tapi di petak ini tidak ada terminal atau perangkat data yang membutuhkan nilai!";
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }

      // Target ada di petak ini, apakah target menerima data memori?
      if (
        targetAtPos.type !== "terminal" &&
        targetAtPos.type !== "reactor" &&
        targetAtPos.type !== "vault" &&
        targetAtPos.type !== "core"
      ) {
        simulationHalted = true;
        failureReason = `Ups! ${targetAtPos.label || "Perangkat ini"} tidak membutuhkan nilai data dari Kotak Memori! Periksa kembali instruksi yang sesuai ya.`;
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }

      // Cek apakah prasyarat urutan sudah terpenuhi
      if (targetAtPos.dependsOn && !activatedTargetIds.has(targetAtPos.dependsOn)) {
        simulationHalted = true;
        failureReason =
          targetAtPos.prerequisiteMessage ||
          `Perangkat ${targetAtPos.label || "ini"} belum bisa diaktifkan karena sumber dayanya belum dinyalakan terlebih dahulu! Aktifkan perangkat sebelumnya ya.`;
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }

      // Cek apakah memori Kibo kosong
      if (currentMemoryValue === null) {
        simulationHalted = true;
        failureReason =
          "Kotak Memori Kibo masih kosong! Simpan nilai data terlebih dahulu sebelum menggunakan blok Gunakan Nilai Data ya.";
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }

      // Cek apakah nilai cocok dengan requiredValue (jika target meminta nilai tertentu)
      if (
        targetAtPos.requiredValue !== undefined &&
        currentMemoryValue !== targetAtPos.requiredValue
      ) {
        simulationHalted = true;
        failureReason = `${targetAtPos.label || "Perangkat ini"} membutuhkan Nilai ${targetAtPos.requiredValue}, tetapi Kotak Memori Kibo berisi Nilai ${currentMemoryValue}! Simpan nilai yang sesuai ya.`;
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "failure",
          message: failureReason,
          kiboMood: "confused",
        });
        break;
      }

      // Berhasil disalurkan dan diaktifkan
      activatedTargetIds.add(targetAtPos.id);
      const useSuccessMsg =
        targetAtPos.activationMessage ||
        `${targetAtPos.label || "Perangkat data"} menerima Nilai ${currentMemoryValue} dan berhasil diaktifkan! 💾✨`;

      steps.push({
        stepIndex: originalIndex,
        blockType: block,
        kiboPosition: currentPos,
        lampActive: true,
        activeTargetIds: Array.from(activatedTargetIds),
        memoryValue: currentMemoryValue,
        status: "success",
        message: useSuccessMsg,
        kiboMood: "happy",
      });
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
            stepIndex: originalIndex,
            blockType: block,
            kiboPosition: currentPos,
            lampActive: activatedTargetIds.size > 0,
            activeTargetIds: Array.from(activatedTargetIds),
            memoryValue: currentMemoryValue,
            status: "failure",
            message: failureReason,
            kiboMood: "confused",
          });
          break;
        }

        // Cek apakah target memerlukan blok USE_VALUE khusus (seperti terminal, reactor, vault, atau core)
        if (
          targetAtPos.type === "terminal" ||
          targetAtPos.type === "reactor" ||
          targetAtPos.type === "vault" ||
          targetAtPos.type === "core"
        ) {
          simulationHalted = true;
          failureReason = `${targetAtPos.label || "Perangkat ini"} memerlukan penyaluran data spesifik! Gunakan blok Gunakan Nilai Data ya.`;
          steps.push({
            stepIndex: originalIndex,
            blockType: block,
            kiboPosition: currentPos,
            lampActive: activatedTargetIds.size > 0,
            activeTargetIds: Array.from(activatedTargetIds),
            memoryValue: currentMemoryValue,
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
            : targetAtPos.type === "fountain"
            ? "Katup diputar! Air mancur digital menyemburkan air jernih ke seluruh taman! ⛲"
            : "Saklar disentuh! Lampu jalan Lumina Town kembali bersinar terang!");

        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: true,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
          status: "success",
          message: activationMsg,
          kiboMood: "happy",
        });
      } else {
        // Belum sampai di petak target saklar
        simulationHalted = true;
        failureReason = getEmptyActivateFeedback(normConfig.chapterId);
        steps.push({
          stepIndex: originalIndex,
          blockType: block,
          kiboPosition: currentPos,
          lampActive: activatedTargetIds.size > 0,
          activeTargetIds: Array.from(activatedTargetIds),
          memoryValue: currentMemoryValue,
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
    // Untuk ch-15 (Kibo Core), solusi optimal berbasis loop dapat berupa compound loop (8 blok)
    // atau sequential loop ganda REPEAT_3 (10 blok). Solusi manual tanpa loop (10 blok tanpa REPEAT_3) dinilai 2 bintang.
    let isOptimal = blocks.length <= normConfig.optimalBlocks;
    if (normConfig.id === "ch-15") {
      const usesLoop = blocks.includes("REPEAT_3");
      isOptimal = usesLoop && blocks.length <= 10;
    }
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
    } else if (normConfig.id === "ch-06") {
      successMsg = isOptimal
        ? "Luar biasa! Gerbang Penjaga berhasil dibuka dengan logika kondisi, dan Totem Lembah bersinar megah! Selamat datang di Gate Valley! ⛩️"
        : "Bagus sekali! Gerbang berhasil dilewati, coba buat susunan blok lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-07") {
      successMsg = isOptimal
        ? "Hebat sekali! Kibo berhasil mengenali kondisi dan menghubungkan Jembatan Energi melintasi celah digital! 🌉"
        : "Bagus sekali! Jembatan berhasil diseberangi, coba buat susunan blok lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-08") {
      successMsg = isOptimal
        ? "Luar biasa! Gate Valley telah pulih seutuhnya! Seluruh rintangan gerbang dan jembatan berhasil dilewati, Kristal Agung Lembah bersinar benderang! 🌟"
        : "Bagus sekali! Seluruh Gate Valley berhasil dipulihkan, tapi kamu bisa mencoba membuatnya lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-09") {
      successMsg = isOptimal
        ? "Luar biasa! Tunas Pertama berhasil mekar dengan blok pengulangan (loop) yang rapi dan hemat! 🌱"
        : "Bagus sekali! Seluruh tunas berhasil disiram, coba gunakan blok Ulangi agar instruksimu lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-10") {
      successMsg = isOptimal
        ? "Hebat! Barisan bunga mekar indah dan Katup Pengairan berhasil dinyalakan dengan kombinasi urutan dan loop! 🌷"
        : "Bagus sekali! Kebun berbaris berhasil disiram, coba buat susunan blok lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-11") {
      successMsg = isOptimal
        ? "Luar biasa! Festival Bunga berlangsung megah! Seluruh bunga mekar dan Air Mancur Megah menyala, Sprout Garden pulih seutuhnya! ⛲🌸✨"
        : "Bagus sekali! Festival Bunga berhasil dirayakan, tapi coba buat susunan blok lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-12") {
      successMsg = isOptimal
        ? "Luar biasa! Terminal Data Alpha berhasil diisi daya dari Kotak Memori dengan urutan instruksi yang tepat dan efisien! 💾✨"
        : "Bagus sekali! Terminal Data Alpha berhasil diaktifkan, tapi coba buat susunan blok lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-13") {
      successMsg = isOptimal
        ? "Hebat sekali! Nilai data berhasil disalurkan dan Reaktor Memori kembali aktif benderang! ⚡🔋"
        : "Bagus sekali! Reaktor Memori berhasil dinyalakan, coba buat susunan blok lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-14") {
      successMsg = isOptimal
        ? "Luar biasa! Sinkronisasi dua nilai data berhasil sempurna! Seluruh Memory Station kini pulih seutuhnya! 🏛️💾🌟"
        : "Bagus sekali! Memory Station berhasil dipulihkan, tapi coba buat susunan blok lebih ringkas untuk 3 bintang penuh!";
    } else if (normConfig.id === "ch-15") {
      successMsg = isOptimal
        ? "Luar biasa! Inti Dunia Kibo telah pulih seutuhnya! Seluruh Kibo World kini bersinar terang berkat penguasaan kode agungmu! 🌟🏛️✨"
        : "Bagus sekali! Inti Dunia Kibo berhasil dipulihkan, tapi kamu bisa mencoba membuatnya lebih ringkas untuk 3 bintang penuh!";
    }

    return {
      success: true,
      finalPosition: currentPos,
      lampActive: true,
      activeTargetIds: Array.from(activatedTargetIds),
      memoryValue: currentMemoryValue,
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
    const targetAtCurrentPos = requiredTargets.find(
      (t) => t.position === currentPos && !activatedTargetIds.has(t.id)
    );

    if (targetAtCurrentPos) {
      finalFeedback = getTargetStandingInstruction(targetAtCurrentPos);
      finalMood = "thinking";
    } else if (activatedTargetIds.size > 0) {
      const nextUnactivated = requiredTargets.find((t) => !activatedTargetIds.has(t.id));
      if (nextUnactivated) {
        finalFeedback = getPartialCompletionFeedback(normConfig.chapterId, nextUnactivated);
        finalMood = "thinking";
      }
    } else {
      finalFeedback = getUnreachedTargetFeedback(normConfig.chapterId);
      finalMood = "thinking";
    }
  }

  return {
    success: false,
    finalPosition: currentPos,
    lampActive: activatedTargetIds.size > 0,
    activeTargetIds: Array.from(activatedTargetIds),
    memoryValue: currentMemoryValue,
    steps,
    feedbackMessage: finalFeedback,
    kiboMood: finalMood,
    starsEarned: 0,
  };
}
