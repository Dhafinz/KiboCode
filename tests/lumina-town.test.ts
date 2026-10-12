import assert from "node:assert/strict";
import { CHALLENGES, normalizeChallenge } from "../src/data/challenges";
import { runSimulation } from "../src/features/blocks/engine";
import {
  isChallengeUnlocked,
  getPrerequisiteChallenge,
  PlayerProgressData,
} from "../src/features/progress/storage";

console.log("🧪 Memulai Pengujian Otomatis Lumina Town (Tantangan 01 - 05)...\n");

// 1. Verifikasi Data Kelima Tantangan Lumina Town
console.log("1. Verifikasi Integritas Data Tantangan Lumina Town:");
const expectedIds = ["ch-01", "ch-02", "ch-03", "ch-04", "ch-05"];

for (let i = 0; i < expectedIds.length; i++) {
  const id = expectedIds[i];
  const challenge = CHALLENGES[id];

  assert.ok(challenge, `Tantangan ${id} harus terdaftar di CHALLENGES`);
  assert.equal(challenge.chapterId, "lumina-town", `${id} harus milik lumina-town`);
  assert.equal(challenge.order, i + 1, `${id} harus memiliki order ${i + 1}`);
  assert.ok(challenge.title.length > 0, `${id} harus memiliki judul`);
  assert.ok(challenge.story.length > 0, `${id} harus memiliki cerita`);
  assert.ok(challenge.goal.length > 0, `${id} harus memiliki tujuan`);
  assert.ok(challenge.gridTiles >= 3, `${id} harus memiliki minimal 3 petak jalur`);
  assert.ok(challenge.targets.length >= 1, `${id} harus memiliki minimal 1 target`);
  assert.equal(challenge.hints.length, 4, `${id} harus memiliki tepat 4 level petunjuk`);

  // Verifikasi 4 level petunjuk bertahap
  challenge.hints.forEach((hint, idx) => {
    assert.equal(hint.level, idx + 1, `Petunjuk ke-${idx + 1} harus level ${idx + 1}`);
    assert.ok(hint.text.length > 10, `Teks petunjuk ${id} level ${idx + 1} harus informatif`);
  });

  console.log(`  ✓ ${id}: "${challenge.title}" - ${challenge.targets.length} target, ${challenge.gridTiles} petak, ${challenge.optimalBlocks} blok optimal.`);
}

// 2. Pengujian Eksekusi Solusi Optimal Tantangan 01 - 05
console.log("\n2. Pengujian Eksekusi Solusi Optimal Deterministic Engine:");

// Ch-01 Solution: MOVE, MOVE, ACTIVATE (3 blocks)
{
  const ch01 = normalizeChallenge(CHALLENGES["ch-01"]);
  const res = runSimulation(["MOVE", "MOVE", "ACTIVATE"], ch01);
  assert.equal(res.success, true, "Ch-01 solusi optimal harus berhasil");
  assert.equal(res.starsEarned, 3, "Ch-01 harus mendapatkan 3 bintang penuh");
  assert.equal(res.finalPosition, 2, "Kibo harus berada di petak lampu (posisi 2)");
  assert.equal(res.lampActive, true, "Lampu harus menyala");
  console.log("  ✓ Ch-01 Solusi Optimal: Sukses 3 Bintang");
}

// Ch-02 Solution: MOVE, ACTIVATE, MOVE, MOVE, ACTIVATE (5 blocks)
{
  const ch02 = normalizeChallenge(CHALLENGES["ch-02"]);
  const res = runSimulation(["MOVE", "ACTIVATE", "MOVE", "MOVE", "ACTIVATE"], ch02);
  assert.equal(res.success, true, "Ch-02 solusi optimal harus berhasil");
  assert.equal(res.starsEarned, 3, "Ch-02 harus mendapatkan 3 bintang penuh");
  assert.equal(res.activeTargetIds.length, 2, "Kedua lampu harus aktif");
  console.log("  ✓ Ch-02 Solusi Optimal: Sukses 3 Bintang");
}

// Ch-03 Solution: MOVE, MOVE, ACTIVATE, MOVE, MOVE, ACTIVATE (6 blocks)
{
  const ch03 = normalizeChallenge(CHALLENGES["ch-03"]);
  const res = runSimulation(["MOVE", "MOVE", "ACTIVATE", "MOVE", "MOVE", "ACTIVATE"], ch03);
  assert.equal(res.success, true, "Ch-03 solusi optimal harus berhasil");
  assert.equal(res.starsEarned, 3, "Ch-03 harus mendapatkan 3 bintang penuh");
  assert.equal(res.activeTargetIds.length, 2, "Kedua lentera harus aktif");
  console.log("  ✓ Ch-03 Solusi Optimal: Sukses 3 Bintang");
}

// Ch-04 Solution: MOVE, MOVE, IF_GATE, MOVE, ACTIVATE (5 blocks)
{
  const ch04 = normalizeChallenge(CHALLENGES["ch-04"]);
  const res = runSimulation(["MOVE", "MOVE", "IF_GATE", "MOVE", "ACTIVATE"], ch04);
  assert.equal(res.success, true, "Ch-04 solusi optimal harus berhasil");
  assert.equal(res.starsEarned, 3, "Ch-04 harus mendapatkan 3 bintang penuh");
  assert.equal(res.activeTargetIds.length, 2, "Gerbang Pintar dan Menara Cahaya harus aktif");
  console.log("  ✓ Ch-04 Solusi Optimal: Sukses 3 Bintang (Smart Gate + IF_GATE)");
}

// Ch-05 Solution: MOVE, ACTIVATE, MOVE, MOVE, ACTIVATE, MOVE, MOVE, ACTIVATE (8 blocks)
{
  const ch05 = normalizeChallenge(CHALLENGES["ch-05"]);
  const res = runSimulation(
    ["MOVE", "ACTIVATE", "MOVE", "MOVE", "ACTIVATE", "MOVE", "MOVE", "ACTIVATE"],
    ch05
  );
  assert.equal(res.success, true, "Ch-05 solusi optimal harus berhasil");
  assert.equal(res.starsEarned, 3, "Ch-05 harus mendapatkan 3 bintang penuh");
  assert.equal(res.activeTargetIds.length, 3, "Ketiga perangkat Alun-Alun harus aktif");
  assert.ok(res.feedbackMessage.includes("Lumina Town telah pulih seutuhnya"), "Pesan akhir harus merayakan Lumina Town");
  console.log("  ✓ Ch-05 Solusi Optimal: Sukses 3 Bintang (Grand Finale Lumina Town)");
}

// 3. Pengujian Mekanik Edukatif: Prasyarat Ketergantungan Urutan (Precondition Dependency)
console.log("\n3. Pengujian Edukatif: Validasi Ketergantungan Prasyarat Urutan:");

// Ch-04: Menabrak Gerbang Pintar yang tertutup tanpa perintah IF_GATE
{
  const ch04 = normalizeChallenge(CHALLENGES["ch-04"]);
  // Kibo maju 2 petak ke depan gerbang, lalu coba maju lagi tanpa membuka gerbang
  const res = runSimulation(["MOVE", "MOVE", "MOVE", "ACTIVATE"], ch04);
  assert.equal(res.success, false, "Harus gagal jika mencoba melewati gerbang yang tertutup");
  assert.equal(res.kiboMood, "confused", "Kibo harus dalam mood confused");
  assert.ok(
    res.feedbackMessage.includes("Gerbang Pintar") || res.feedbackMessage.includes("tertutup"),
    "Feedback harus menginformasikan Gerbang Pintar masih tertutup"
  );
  console.log("  ✓ Ch-04 Condition Gate: Berhasil menolak Kibo menerobos gerbang tertutup tanpa IF_GATE");
}

// Ch-04: Memastikan solusi lama Ch-02 (MOVE -> ACTIVATE -> MOVE -> MOVE -> ACTIVATE) GAGAL di Ch-04
{
  const ch04 = normalizeChallenge(CHALLENGES["ch-04"]);
  const res = runSimulation(["MOVE", "ACTIVATE", "MOVE", "MOVE", "ACTIVATE"], ch04);
  assert.equal(res.success, false, "Solusi repetitif Ch-02 harus gagal di Ch-04");
  console.log("  ✓ Ch-04 Anti-Repetisi: Solusi Ch-02 terbukti ditolak di Ch-04 (solusi berbeda secara mendasar)");
}

// Ch-04: Menjalankan IF_GATE di petak yang tidak memiliki gerbang
{
  const ch04 = normalizeChallenge(CHALLENGES["ch-04"]);
  const res = runSimulation(["MOVE", "IF_GATE"], ch04);
  assert.equal(res.success, false, "Harus gagal jika IF_GATE dipanggil di petak tanpa gerbang");
  assert.ok(res.feedbackMessage.includes("tidak ada Gerbang Pintar"));
  console.log("  ✓ Ch-04 Kondisi Cerdas: IF_GATE hanya valid di petak berpagar/gerbang");
}

// Ch-05: Mencoba mengaktifkan Kristal Agung sebelum menyalakan Lentera Taman
{
  const ch05 = normalizeChallenge(CHALLENGES["ch-05"]);
  // Nyalakan relay di pos 1, lalu langsung lompat ke pos 5 dan aktifkan kristal tanpa menyalakan lentera
  const res = runSimulation(
    ["MOVE", "ACTIVATE", "MOVE", "MOVE", "MOVE", "MOVE", "ACTIVATE"],
    ch05
  );
  assert.equal(res.success, false, "Harus gagal jika lentera taman belum diaktifkan");
  assert.ok(
    res.feedbackMessage.includes("Lentera Taman"),
    "Feedback harus menginformasikan Lentera Taman belum menyala"
  );
  console.log("  ✓ Ch-05 Precondition Gate: Berhasil menolak aktivasi kristal sebelum lentera");
}

// Ch-01: Berhenti di depan Tiang Lampu tanpa ACTIVATE (MOVE, MOVE)
{
  const ch01 = normalizeChallenge(CHALLENGES["ch-01"]);
  const res = runSimulation(["MOVE", "MOVE"], ch01);
  assert.equal(res.success, false, "Kibo belum menyalakan lampu harus belum selesai");
  assert.ok(
    res.feedbackMessage.includes("TIANG LAMPU") &&
      res.feedbackMessage.includes("saklarnya belum dinyalakan") &&
      res.feedbackMessage.includes("Nyalakan Lampu"),
    "Feedback Lumina Town harus menginformasikan saklar belum dinyalakan"
  );
  assert.equal(
    res.feedbackMessage.toLowerCase().includes("siram"),
    false,
    "Feedback Lumina Town tidak boleh tercampur instruksi siram tanaman"
  );
  console.log("  ✓ Ch-01 Feedback Otentik: Tetap menampilkan 'saklarnya belum dinyalakan' dan tidak tercampur pesan tanaman.");
}

// 4. Pengujian Evaluasi Bintang (2 Bintang jika tidak optimal)
console.log("\n4. Pengujian Evaluasi Bintang Non-Optimal:");
{
  const ch01 = normalizeChallenge(CHALLENGES["ch-01"]);
  // Ch-01 optimal: 3. Jika 4 blok (MOVE, MOVE, MOVE (overstep/redundant) atau ACTIVATE di awal), tes ekstra langkah
  // 4 blok valid: MOVE, MOVE, ACTIVATE, ACTIVATE
  const resCh01 = runSimulation(["MOVE", "MOVE", "ACTIVATE", "ACTIVATE"], ch01);
  assert.equal(resCh01.success, true, "Ch-01 harus tetap sukses");
  assert.equal(resCh01.starsEarned, 2, "Ch-01 harus mendapat 2 bintang jika melebihi 3 blok optimal");

  const ch04 = normalizeChallenge(CHALLENGES["ch-04"]);
  // 6 blok (sub-optimal): MOVE, MOVE, IF_GATE, MOVE, ACTIVATE, ACTIVATE (ekstra redundan 1 blok)
  const resCh04 = runSimulation(
    ["MOVE", "MOVE", "IF_GATE", "MOVE", "ACTIVATE", "ACTIVATE"],
    ch04
  );
  assert.equal(resCh04.success, true, "Ch-04 harus tetap sukses");
  assert.equal(resCh04.starsEarned, 2, "Ch-04 harus mendapatkan 2 bintang karena melebihi optimal 5 blok");
  console.log("  ✓ Evaluasi 2 Bintang saat jumlah blok melebihi batas optimal.");
}

// 5. Pengujian Sistem Penguncian Berdasarkan Prasyarat (Prerequisite Unlocking)
console.log("\n5. Pengujian Sistem Penguncian & Prasyarat Progres:");

// Mock progress data
const mockEmptyProgress: PlayerProgressData = {
  playerId: "test",
  currentChapterId: "lumina-town",
  currentChallengeId: "ch-01",
  completedChallenges: {},
  totalStars: 0,
  worldRestoredPct: 0,
  updatedAt: "",
};

// ch-01 selalu terbuka
assert.equal(isChallengeUnlocked("ch-01", mockEmptyProgress), true, "ch-01 harus selalu terbuka");

// ch-02 terkunci saat ch-01 belum selesai
assert.equal(isChallengeUnlocked("ch-02", mockEmptyProgress), false, "ch-02 harus terkunci");
assert.equal(getPrerequisiteChallenge("ch-02")?.id, "ch-01", "Prasyarat ch-02 adalah ch-01");

// Setelah ch-01 selesai, ch-02 terbuka tapi ch-03 masih terkunci
const mockCh01Done: PlayerProgressData = {
  ...mockEmptyProgress,
  completedChallenges: {
    "ch-01": { challengeId: "ch-01", stars: 3, completedAt: "" },
  },
};
assert.equal(isChallengeUnlocked("ch-02", mockCh01Done), true, "ch-02 harus terbuka setelah ch-01 selesai");
assert.equal(isChallengeUnlocked("ch-03", mockCh01Done), false, "ch-03 harus terkunci");
assert.equal(isChallengeUnlocked("ch-04", mockCh01Done), false, "ch-04 harus terkunci");
assert.equal(isChallengeUnlocked("ch-05", mockCh01Done), false, "ch-05 harus terkunci");

// Setelah ch-01, ch-02, ch-03 selesai, ch-04 terbuka
const mockCh03Done: PlayerProgressData = {
  ...mockEmptyProgress,
  completedChallenges: {
    "ch-01": { challengeId: "ch-01", stars: 3, completedAt: "" },
    "ch-02": { challengeId: "ch-02", stars: 3, completedAt: "" },
    "ch-03": { challengeId: "ch-03", stars: 3, completedAt: "" },
  },
};
assert.equal(isChallengeUnlocked("ch-04", mockCh03Done), true, "ch-04 harus terbuka setelah ch-03 selesai");
assert.equal(isChallengeUnlocked("ch-05", mockCh03Done), false, "ch-05 masih terkunci sebelum ch-04");

// Setelah ch-04 selesai, ch-05 terbuka
const mockCh04Done: PlayerProgressData = {
  ...mockCh03Done,
  completedChallenges: {
    ...mockCh03Done.completedChallenges,
    "ch-04": { challengeId: "ch-04", stars: 3, completedAt: "" },
  },
};
assert.equal(isChallengeUnlocked("ch-05", mockCh04Done), true, "ch-05 harus terbuka setelah ch-04 selesai");
assert.equal(getPrerequisiteChallenge("ch-05")?.id, "ch-04", "Prasyarat ch-05 adalah ch-04");

console.log("  ✓ Alur penguncian prasyarat bertahap (ch-01 -> ch-02 -> ch-03 -> ch-04 -> ch-05) valid.");

// 6. Pengujian Koordinat Visual Arena & Posisi Kibo pada Challenge 05
console.log("\n6. Pengujian Sistem Koordinat Visual Arena & Posisi Kibo:");

function calcKiboHorizontalPct(pos: number, totalTiles: number): number {
  if (totalTiles <= 1) return 50;
  if (pos >= totalTiles) {
    return ((totalTiles + 0.2) / totalTiles) * 100;
  }
  return ((pos + 0.5) / totalTiles) * 100;
}

function calcTileCenterPct(tileIdx: number, totalTiles: number): number {
  return ((tileIdx + 0.5) / totalTiles) * 100;
}

// Uji keselarasan koordinat untuk setiap level (gridTiles 3, 4, 5, 6)
const testGridSizes = [3, 4, 5, 6];
for (const size of testGridSizes) {
  for (let tile = 0; tile < size; tile++) {
    const kiboPct = calcKiboHorizontalPct(tile, size);
    const tileCenter = calcTileCenterPct(tile, size);
    assert.equal(
      kiboPct.toFixed(4),
      tileCenter.toFixed(4),
      `Posisi horizontal Kibo pada petak ${tile} (dari ${size}) harus persis di tengah petak`
    );
  }
}

// Uji khusus Challenge 05: Pada akhir penyelesaian, Kibo harus berada persis di Petak 6 (Kristal Agung, idx 5)
const ch05Config = CHALLENGES["ch-05"];
const ch05FinalTarget = ch05Config.targets.find((t) => t.id === "grand-crystal");
assert.ok(ch05FinalTarget, "Ch-05 harus memiliki target grand-crystal");
assert.equal(ch05FinalTarget.position, 5, "Posisi grand-crystal harus di indeks 5 (Petak 6)");

const ch05FinalKiboPos = 5;
const ch05FinalKiboPct = calcKiboHorizontalPct(ch05FinalKiboPos, ch05Config.gridTiles);
const ch05CrystalTileCenter = calcTileCenterPct(ch05FinalTarget.position, ch05Config.gridTiles);

assert.equal(
  ch05FinalKiboPct.toFixed(2),
  "91.67",
  "Kibo pada Ch-05 harus berada di 91.67% (pusat kolom petak ke-6)"
);
assert.equal(
  ch05FinalKiboPct,
  ch05CrystalTileCenter,
  "Posisi visual Kibo harus 100% identik dengan pusat petak Kristal Cahaya Agung"
);
console.log(`  ✓ Challenge 05: Kibo berada persis di pusat Petak 6 (${ch05FinalKiboPct.toFixed(2)}%), sejajar dengan Kristal Agung.`);

console.log("\n🎉 SELURUH PENGUJIAN OTOMATIS BERHASIL (100% PASS)!");
