import assert from "node:assert/strict";
import { CHALLENGES, normalizeChallenge } from "../src/data/challenges";
import { runSimulation } from "../src/features/blocks/engine";
import {
  isChallengeUnlocked,
  getPrerequisiteChallenge,
  PlayerProgressData,
} from "../src/features/progress/storage";

console.log("🧪 Memulai Pengujian Otomatis Gate Valley (Tantangan 06 - 08)...\n");

// 1. Verifikasi Integritas Data Tantangan Gate Valley
console.log("1. Verifikasi Integritas Data Tantangan Gate Valley:");
const gateValleyIds = ["ch-06", "ch-07", "ch-08"];

for (let i = 0; i < gateValleyIds.length; i++) {
  const id = gateValleyIds[i];
  const challenge = CHALLENGES[id];

  assert.ok(challenge, `Tantangan ${id} harus terdaftar di CHALLENGES`);
  assert.equal(challenge.chapterId, "gate-valley", `${id} harus milik gate-valley`);
  assert.equal(challenge.order, i + 1, `${id} harus memiliki order ${i + 1}`);
  assert.ok(challenge.title.length > 0, `${id} harus memiliki judul`);
  assert.ok(challenge.story.length > 0, `${id} harus memiliki cerita`);
  assert.ok(challenge.goal.length > 0, `${id} harus memiliki tujuan`);
  assert.ok(challenge.gridTiles >= 4, `${id} harus memiliki minimal 4 petak jalur`);
  assert.ok(challenge.targets.length >= 2, `${id} harus memiliki minimal 2 target`);
  assert.equal(challenge.hints.length, 4, `${id} harus memiliki tepat 4 level petunjuk`);

  // Verifikasi 4 level petunjuk bertahap
  challenge.hints.forEach((hint, idx) => {
    assert.equal(hint.level, idx + 1, `Petunjuk ke-${idx + 1} harus level ${idx + 1}`);
    assert.ok(hint.text.length > 10, `Teks petunjuk ${id} level ${idx + 1} harus informatif`);
  });

  console.log(`  ✓ ${id}: "${challenge.title}" - ${challenge.targets.length} target, ${challenge.gridTiles} petak, ${challenge.optimalBlocks} blok optimal.`);
}

// 2. Pengujian Eksekusi Solusi Optimal Deterministic Engine
console.log("\n2. Pengujian Eksekusi Solusi Optimal Deterministic Engine:");

// Ch-06 Solution: MOVE, IF_GATE, MOVE, MOVE, ACTIVATE (5 blocks)
{
  const ch06 = normalizeChallenge(CHALLENGES["ch-06"]);
  const res = runSimulation(["MOVE", "IF_GATE", "MOVE", "MOVE", "ACTIVATE"], ch06);
  assert.equal(res.success, true, "Ch-06 solusi optimal harus berhasil");
  assert.equal(res.starsEarned, 3, "Ch-06 harus mendapatkan 3 bintang penuh");
  assert.equal(res.activeTargetIds.length, 2, "Gerbang Penjaga dan Totem Lembah harus aktif");
  assert.equal(res.finalPosition, 3, "Kibo harus berada di petak 4 (posisi 3)");
  console.log("  ✓ Ch-06 Solusi Optimal: Sukses 3 Bintang (Guardian Gate + Single IF)");
}

// Ch-07 Solution: MOVE, MOVE, IF_BRIDGE, MOVE, MOVE, ACTIVATE (6 blocks)
{
  const ch07 = normalizeChallenge(CHALLENGES["ch-07"]);
  const res = runSimulation(["MOVE", "MOVE", "IF_BRIDGE", "MOVE", "MOVE", "ACTIVATE"], ch07);
  assert.equal(res.success, true, "Ch-07 solusi optimal harus berhasil");
  assert.equal(res.starsEarned, 3, "Ch-07 harus mendapatkan 3 bintang penuh");
  assert.equal(res.activeTargetIds.length, 2, "Jembatan Energi dan Stasiun Daya harus aktif");
  assert.equal(res.finalPosition, 4, "Kibo harus berada di petak 5 (posisi 4)");
  console.log("  ✓ Ch-07 Solusi Optimal: Sukses 3 Bintang (Energy Bridge + Condition Action)");
}

// Ch-08 Solution: MOVE, IF_GATE, MOVE, MOVE, IF_BRIDGE, MOVE, MOVE, ACTIVATE (8 blocks)
{
  const ch08 = normalizeChallenge(CHALLENGES["ch-08"]);
  const res = runSimulation(
    ["MOVE", "IF_GATE", "MOVE", "MOVE", "IF_BRIDGE", "MOVE", "MOVE", "ACTIVATE"],
    ch08
  );
  assert.equal(res.success, true, "Ch-08 solusi optimal harus berhasil");
  assert.equal(res.starsEarned, 3, "Ch-08 harus mendapatkan 3 bintang penuh");
  assert.equal(res.activeTargetIds.length, 3, "Gerbang, Jembatan, dan Kristal Agung harus aktif");
  assert.equal(res.finalPosition, 5, "Kibo harus berada di petak 6 (posisi 5)");
  assert.ok(res.feedbackMessage.includes("Gate Valley telah pulih seutuhnya"), "Pesan akhir harus merayakan Gate Valley");
  console.log("  ✓ Ch-08 Solusi Optimal: Sukses 3 Bintang (Valley Crossroads + Multi-Condition)");
}

// 3. Pengujian Mekanik Edukatif: Validasi Rintangan & Pembedaan Kondisi
console.log("\n3. Pengujian Edukatif: Validasi Rintangan & Pembedaan Kondisi:");

// Ch-06: Menerobos Gerbang Penjaga tertutup tanpa IF_GATE
{
  const ch06 = normalizeChallenge(CHALLENGES["ch-06"]);
  const res = runSimulation(["MOVE", "MOVE", "MOVE", "ACTIVATE"], ch06);
  assert.equal(res.success, false, "Harus gagal jika mencoba melewati gerbang tertutup");
  assert.equal(res.kiboMood, "confused", "Kibo harus bingung");
  assert.ok(res.feedbackMessage.includes("tertutup"), "Feedback harus menginformasikan gerbang tertutup");
  console.log("  ✓ Ch-06 Obstacle Gate: Berhasil menolak Kibo menerobos gerbang tertutup tanpa IF_GATE");
}

// Ch-07: Melangkah ke Jembatan Energi yang masih terputus tanpa IF_BRIDGE
{
  const ch07 = normalizeChallenge(CHALLENGES["ch-07"]);
  const res = runSimulation(["MOVE", "MOVE", "MOVE", "MOVE", "ACTIVATE"], ch07);
  assert.equal(res.success, false, "Harus gagal jika mencoba menyeberangi jembatan putus");
  assert.equal(res.kiboMood, "confused", "Kibo harus bingung");
  assert.ok(res.feedbackMessage.includes("terputus"), "Feedback harus menginformasikan jembatan terputus");
  console.log("  ✓ Ch-07 Obstacle Bridge: Berhasil menolak Kibo melangkah ke jembatan terputus tanpa IF_BRIDGE");
}

// Ch-07: Menggunakan IF_GATE di depan Jembatan Energi (salah pilih blok kondisi)
{
  const ch07 = normalizeChallenge(CHALLENGES["ch-07"]);
  const res = runSimulation(["MOVE", "MOVE", "IF_GATE"], ch07);
  assert.equal(res.success, false, "Harus gagal jika IF_GATE digunakan di jembatan");
  assert.ok(
    res.feedbackMessage.toLowerCase().includes("bukan gerbang"),
    "Feedback harus mengedukasi bahwa ini jembatan bukan gerbang"
  );
  console.log("  ✓ Ch-07 Condition Discrimination: Berhasil menolak IF_GATE di jembatan dengan feedback edukatif");
}

// Ch-08: Menggunakan IF_BRIDGE di depan Gerbang Penjaga (tertukar kondisi)
{
  const ch08 = normalizeChallenge(CHALLENGES["ch-08"]);
  const res = runSimulation(["MOVE", "IF_BRIDGE"], ch08);
  assert.equal(res.success, false, "Harus gagal jika IF_BRIDGE digunakan di gerbang");
  assert.ok(
    res.feedbackMessage.toLowerCase().includes("bukan jembatan energi"),
    "Feedback harus mengedukasi bahwa ini gerbang bukan jembatan"
  );
  console.log("  ✓ Ch-08 Condition Discrimination: Berhasil menolak IF_BRIDGE di gerbang dengan feedback edukatif");
}

// Ch-06: Berhenti tepat di depan Gerbang Penjaga (MOVE saja) tanpa membuka gerbang
{
  const ch06 = normalizeChallenge(CHALLENGES["ch-06"]);
  const res = runSimulation(["MOVE"], ch06);
  assert.equal(res.success, false, "Kibo hanya maju ke depan gerbang harus belum selesai");
  assert.equal(res.finalPosition, 1, "Kibo harus berada di petak gerbang (posisi 1)");
  assert.ok(
    res.feedbackMessage.includes("GERBANG PENJAGA") &&
      res.feedbackMessage.includes("Buka Gerbang"),
    "Feedback harus meminta pemain membuka Gerbang Penjaga"
  );
  assert.equal(
    res.feedbackMessage.toLowerCase().includes("saklar"),
    false,
    "Feedback Gate Valley tidak boleh menyebut saklar"
  );
  assert.equal(
    res.feedbackMessage.toLowerCase().includes("lampu"),
    false,
    "Feedback Gate Valley tidak boleh menyebut lampu"
  );
  console.log("  ✓ Berhenti di depan Gerbang Penjaga menghasilkan feedback 'Buka Gerbang' tanpa saklar/lampu.");
}

// 4. Pengujian Evaluasi Bintang Non-Optimal (2 Bintang)
console.log("\n4. Pengujian Evaluasi Bintang Non-Optimal:");
{
  const ch06 = normalizeChallenge(CHALLENGES["ch-06"]);
  // Ch-06 optimal: 5 blok. 6 blok sub-optimal (ekstra ACTIVATE di akhir)
  const resCh06 = runSimulation(["MOVE", "IF_GATE", "MOVE", "MOVE", "ACTIVATE", "ACTIVATE"], ch06);
  assert.equal(resCh06.success, true, "Ch-06 harus tetap sukses");
  assert.equal(resCh06.starsEarned, 2, "Ch-06 harus mendapat 2 bintang jika melebihi 5 blok optimal");

  const ch07 = normalizeChallenge(CHALLENGES["ch-07"]);
  // Ch-07 optimal: 6 blok. 7 blok sub-optimal
  const resCh07 = runSimulation(
    ["MOVE", "MOVE", "IF_BRIDGE", "MOVE", "MOVE", "ACTIVATE", "ACTIVATE"],
    ch07
  );
  assert.equal(resCh07.success, true, "Ch-07 harus tetap sukses");
  assert.equal(resCh07.starsEarned, 2, "Ch-07 harus mendapat 2 bintang jika melebihi 6 blok optimal");

  const ch08 = normalizeChallenge(CHALLENGES["ch-08"]);
  // Ch-08 optimal: 8 blok. 9 blok sub-optimal
  const resCh08 = runSimulation(
    ["MOVE", "IF_GATE", "MOVE", "MOVE", "IF_BRIDGE", "MOVE", "MOVE", "ACTIVATE", "ACTIVATE"],
    ch08
  );
  assert.equal(resCh08.success, true, "Ch-08 harus tetap sukses");
  assert.equal(resCh08.starsEarned, 2, "Ch-08 harus mendapat 2 bintang jika melebihi 8 blok optimal");
  console.log("  ✓ Evaluasi 2 Bintang saat jumlah blok melebihi batas optimal pada Ch-06, Ch-07, dan Ch-08.");
}

// 5. Pengujian Sistem Penguncian & Prasyarat Lintas Bab
console.log("\n5. Pengujian Sistem Penguncian & Prasyarat Lintas Bab (Lumina Town -> Gate Valley):");

// Mock progress data saat Lumina Town belum selesai (hanya sampai ch-04)
const mockLuminaIncomplete: PlayerProgressData = {
  playerId: "test",
  currentChapterId: "lumina-town",
  currentChallengeId: "ch-04",
  completedChallenges: {
    "ch-01": { challengeId: "ch-01", stars: 3, completedAt: "" },
    "ch-02": { challengeId: "ch-02", stars: 3, completedAt: "" },
    "ch-03": { challengeId: "ch-03", stars: 3, completedAt: "" },
    "ch-04": { challengeId: "ch-04", stars: 3, completedAt: "" },
  },
  totalStars: 12,
  worldRestoredPct: 26.7,
  updatedAt: "",
};

// ch-06 harus terkunci jika ch-05 belum selesai
assert.equal(isChallengeUnlocked("ch-06", mockLuminaIncomplete), false, "ch-06 harus terkunci jika ch-05 belum selesai");
assert.equal(getPrerequisiteChallenge("ch-06")?.id, "ch-05", "Prasyarat ch-06 adalah ch-05");

// Setelah Lumina Town selesai (ch-05 selesai)
const mockLuminaComplete: PlayerProgressData = {
  ...mockLuminaIncomplete,
  completedChallenges: {
    ...mockLuminaIncomplete.completedChallenges,
    "ch-05": { challengeId: "ch-05", stars: 3, completedAt: "" },
  },
};

// ch-06 harus terbuka, tetapi ch-07 dan ch-08 masih terkunci
assert.equal(isChallengeUnlocked("ch-06", mockLuminaComplete), true, "ch-06 terbuka setelah ch-05 selesai");
assert.equal(isChallengeUnlocked("ch-07", mockLuminaComplete), false, "ch-07 masih terkunci");
assert.equal(isChallengeUnlocked("ch-08", mockLuminaComplete), false, "ch-08 masih terkunci");
assert.equal(getPrerequisiteChallenge("ch-07")?.id, "ch-06", "Prasyarat ch-07 adalah ch-06");

// Setelah ch-06 selesai, ch-07 terbuka
const mockCh06Complete: PlayerProgressData = {
  ...mockLuminaComplete,
  completedChallenges: {
    ...mockLuminaComplete.completedChallenges,
    "ch-06": { challengeId: "ch-06", stars: 3, completedAt: "" },
  },
};
assert.equal(isChallengeUnlocked("ch-07", mockCh06Complete), true, "ch-07 terbuka setelah ch-06 selesai");
assert.equal(isChallengeUnlocked("ch-08", mockCh06Complete), false, "ch-08 masih terkunci");
assert.equal(getPrerequisiteChallenge("ch-08")?.id, "ch-07", "Prasyarat ch-08 adalah ch-07");

// Setelah ch-07 selesai, ch-08 terbuka
const mockCh07Complete: PlayerProgressData = {
  ...mockCh06Complete,
  completedChallenges: {
    ...mockCh06Complete.completedChallenges,
    "ch-07": { challengeId: "ch-07", stars: 3, completedAt: "" },
  },
};
assert.equal(isChallengeUnlocked("ch-08", mockCh07Complete), true, "ch-08 terbuka setelah ch-07 selesai");

console.log("  ✓ Alur penguncian prasyarat bertahap (ch-05 -> ch-06 -> ch-07 -> ch-08) 100% valid.");

console.log("\n🎉 SELURUH PENGUJIAN OTOMATIS GATE VALLEY BERHASIL (100% PASS)!");
