import assert from "node:assert/strict";
import { getChallengeById, CHALLENGES } from "../src/data/challenges";
import { CHAPTERS } from "../src/data/chapters";
import { runSimulation } from "../src/features/blocks/engine";
import {
  isChallengeUnlocked,
  getPrerequisiteChallenge,
  isChapterRestored,
  getChapterProgress,
  isAllChallengesCompleted,
  PlayerProgressData,
} from "../src/features/progress/storage";

console.log("=== PENGUJIAN KIBO CORE (CH-15): TAHAP 1 & TAHAP 2 ===");

// 1. Pengujian Integritas Definisi Bab Kibo Core & Tantangan ch-15
console.log("\n1. Pengujian Integritas Definisi Bab & Tantangan:");

const coreChapter = CHAPTERS.find((c) => c.id === "kibo-core");
assert.ok(coreChapter, "Bab kibo-core harus terdaftar di CHAPTERS");
assert.equal(coreChapter.totalChallenges, 1, "kibo-core harus memiliki totalChallenges = 1");
assert.equal(coreChapter.order, 5, "kibo-core harus berada pada urutan ke-5");
assert.equal(coreChapter.concept, "problem-solving", "kibo-core harus berkonsep problem-solving");
console.log("  ✓ Definisi bab kibo-core valid dengan totalChallenges = 1.");

const ch15 = getChallengeById("ch-15");
assert.ok(ch15, "ch-15 harus terdefinisi di CHALLENGES");
assert.equal(ch15.chapterId, "kibo-core");
assert.equal(ch15.order, 1);
assert.equal(ch15.concept, "problem-solving");
assert.equal(ch15.gridTiles, 8, "ch-15 harus memiliki 8 petak (0-7)");
assert.equal(ch15.startPosition, 0);
assert.equal(ch15.optimalBlocks, 8, "Batas optimal ch-15 harus tepat 8 blok");
assert.equal(ch15.maxBlocks, 14, "Maksimum blok ch-15 harus 14 blok");

// Verifikasi blok yang tersedia di ch-15
assert.deepEqual(
  ch15.availableBlocks,
  ["MOVE", "IF_GATE", "REPEAT_3", "END_LOOP", "SET_VALUE_5", "USE_VALUE"],
  "Blok tersedia harus MOVE, IF_GATE, REPEAT_3, END_LOOP, SET_VALUE_5, USE_VALUE"
);
assert.equal(
  ch15.availableBlocks.includes("ACTIVATE"),
  false,
  "Blok ACTIVATE tidak boleh ada di ch-15"
);

// Verifikasi targets
assert.equal(ch15.targets.length, 2, "ch-15 harus memiliki 2 target (gate & core)");
const gateTarget = ch15.targets.find((t) => t.id === "core-gate");
assert.ok(gateTarget, "core-gate harus ada");
assert.equal(gateTarget.type, "gate");
assert.equal(gateTarget.position, 1);
assert.equal(gateTarget.required, true);

const coreTarget = ch15.targets.find((t) => t.id === "core-chamber");
assert.ok(coreTarget, "core-chamber harus ada");
assert.equal(coreTarget.type, "core");
assert.equal(coreTarget.position, 7);
assert.equal(coreTarget.required, true);
assert.equal(coreTarget.requiredValue, 5);
assert.equal(coreTarget.dependsOn, "core-gate");

// Verifikasi hints (4 level)
assert.equal(ch15.hints.length, 4, "ch-15 harus memiliki 4 level hint");
assert.equal(ch15.hints[0].level, 1);
assert.equal(ch15.hints[1].level, 2);
assert.equal(ch15.hints[2].level, 3);
assert.equal(ch15.hints[3].level, 4);

console.log("  ✓ Integritas data ch-15, targets, availableBlocks, dan 4 tingkat hint terverifikasi.");

// 2. Pengujian Solusi Optimal (Compound Loop 8 Blok & Sequential Loop 10 Blok = 3 Bintang)
console.log("\n2. Pengujian Solusi Optimal Berbasis Loop:");

// 2a. Solusi Optimal Compound Loop (8 Blok: REPEAT_3 [MOVE, MOVE])
const optimalCompoundSolution = [
  "SET_VALUE_5",
  "MOVE",
  "IF_GATE",
  "REPEAT_3",
  "MOVE",
  "MOVE",
  "END_LOOP",
  "USE_VALUE",
] as const;

assert.equal(optimalCompoundSolution.length, 8, "Solusi optimal compound loop harus tepat 8 blok");
const optimalCompoundSim = runSimulation([...optimalCompoundSolution], ch15);

assert.equal(optimalCompoundSim.success, true, "Solusi compound loop 8 blok harus berhasil");
assert.equal(optimalCompoundSim.starsEarned, 3, "Solusi compound loop harus meraih 3 bintang penuh");
assert.equal(optimalCompoundSim.finalPosition, 7, "Kibo harus berakhir di petak Altar Inti (indeks 7)");
assert.equal(optimalCompoundSim.memoryValue, 5, "Nilai memori akhir harus 5");
assert.equal(optimalCompoundSim.activeTargetIds.length, 2, "Kedua target (gate & core) harus aktif");
assert.ok(
  optimalCompoundSim.feedbackMessage.includes("Inti Dunia Kibo telah pulih seutuhnya"),
  "Pesan kemenangan harus bernarasi pemulihan Kibo World"
);
console.log("  ✓ Solusi optimal compound loop (8 blok) sukses 3 bintang!");

// 2b. Solusi Optimal Sequential Loop Ganda (10 Blok: REPEAT_3 [MOVE] + REPEAT_3 [MOVE])
const optimalSequentialLoopSolution = [
  "SET_VALUE_5",
  "MOVE",
  "IF_GATE",
  "REPEAT_3",
  "MOVE",
  "END_LOOP",
  "REPEAT_3",
  "MOVE",
  "END_LOOP",
  "USE_VALUE",
] as const;

assert.equal(optimalSequentialLoopSolution.length, 10, "Solusi sequential loop adalah 10 blok");
const optimalSeqSim = runSimulation([...optimalSequentialLoopSolution], ch15);
assert.equal(optimalSeqSim.success, true, "Solusi sequential loop ganda harus berhasil");
assert.equal(optimalSeqSim.starsEarned, 3, "Solusi sequential loop ganda (10 blok dengan REPEAT_3) harus meraih 3 bintang");
console.log("  ✓ Solusi optimal sequential loop ganda (10 blok dengan REPEAT_3) sukses 3 bintang!");

// 3. Pengujian Solusi Non-Optimal (Tanpa Loop = 2 Bintang, >10 Blok = 2 Bintang)
console.log("\n3. Pengujian Solusi Non-Optimal:");

// 3a. Solusi manual tanpa loop sama sekali (10 blok tanpa REPEAT_3)
const nonOptimalSolution = [
  "SET_VALUE_5",
  "MOVE",
  "IF_GATE",
  "MOVE",
  "MOVE",
  "MOVE",
  "MOVE",
  "MOVE",
  "MOVE",
  "USE_VALUE",
] as const;

assert.equal(nonOptimalSolution.length, 10, "Solusi manual tanpa loop adalah 10 blok");
const nonOptimalSim = runSimulation([...nonOptimalSolution], ch15);

assert.equal(nonOptimalSim.success, true, "Solusi manual harus tetap berhasil");
assert.equal(nonOptimalSim.starsEarned, 2, "Solusi manual tanpa loop (10 blok tanpa REPEAT_3) harus meraih 2 bintang");
assert.ok(
  nonOptimalSim.feedbackMessage.includes("3 bintang penuh"),
  "Harus memberi dorongan untuk membuat lebih ringkas demi 3 bintang"
);
console.log("  ✓ Solusi manual tanpa loop (10 blok tanpa REPEAT_3) mendapat 2 bintang secara adil.");

// 3b. Solusi melebihi batas (>10 blok)
const excessiveSolution = [
  "SET_VALUE_5",
  "MOVE",
  "IF_GATE",
  "REPEAT_3",
  "MOVE",
  "END_LOOP",
  "REPEAT_3",
  "MOVE",
  "END_LOOP",
  "SET_VALUE_5",
  "USE_VALUE",
] as const;
assert.equal(excessiveSolution.length, 11, "Solusi berlebih memiliki 11 blok");
const excessiveSim = runSimulation([...excessiveSolution], ch15);
assert.equal(excessiveSim.success, true);
assert.equal(excessiveSim.starsEarned, 2, "Solusi >10 blok harus dinilai 2 bintang");
console.log("  ✓ Solusi berlebih (>10 blok) dinilai 2 bintang.");

// 4. Pengujian Kasus Kesalahan & Validasi Engine
console.log("\n4. Pengujian Kasus Kesalahan & Feedback Engine:");

// Kasus 4a: Menabrak gerbang tertutup tanpa IF_GATE
const simHitGate = runSimulation(
  ["SET_VALUE_5", "MOVE", "MOVE", "USE_VALUE"],
  ch15
);
assert.equal(simHitGate.success, false, "Melewati gerbang tertutup harus gagal");
assert.equal(simHitGate.finalPosition, 1, "Kibo harus terhenti di petak gerbang");
assert.ok(
  simHitGate.feedbackMessage.includes("tertutup"),
  "Pesan kegagalan harus menjelaskan gerbang tertutup"
);
console.log("  ✓ Melewati gerbang tanpa IF_GATE terhenti di gerbang dengan feedback yang tepat.");

// Kasus 4b: Tidak mengisi nilai memori (SET_VALUE_5 terlupakan)
const simNoMemory = runSimulation(
  ["MOVE", "IF_GATE", "REPEAT_3", "MOVE", "MOVE", "END_LOOP", "USE_VALUE"],
  ch15
);
assert.equal(simNoMemory.success, false, "Menyalurkan data tanpa nilai harus gagal");
assert.ok(
  simNoMemory.feedbackMessage.includes("Kotak Memori Kibo masih kosong"),
  "Feedback harus mengingatkan bahwa Kotak Memori masih kosong"
);
console.log("  ✓ Menggunakan nilai saat memori kosong ditolak oleh engine.");

// Kasus 4c: Mengisi nilai yang salah (contoh: SET_VALUE_2)
const simWrongValue = runSimulation(
  ["SET_VALUE_2", "MOVE", "IF_GATE", "REPEAT_3", "MOVE", "MOVE", "END_LOOP", "USE_VALUE"],
  ch15
);
assert.equal(simWrongValue.success, false, "Nilai yang salah harus gagal");
assert.ok(
  simWrongValue.feedbackMessage.includes("membutuhkan Nilai 5"),
  "Feedback harus menjelaskan nilai yang dibutuhkan adalah 5"
);
console.log("  ✓ Nilai data yang tidak cocok ditolak oleh engine dengan feedback spesifik.");

// Kasus 4d: Kibo tiba di altar tetapi lupa mengeksekusi USE_VALUE
const simStandingNoAction = runSimulation(
  ["SET_VALUE_5", "MOVE", "IF_GATE", "REPEAT_3", "MOVE", "MOVE", "END_LOOP"],
  ch15
);
assert.equal(simStandingNoAction.success, false, "Berhenti di altar tanpa USE_VALUE harus gagal");
assert.ok(
  simStandingNoAction.feedbackMessage.includes("Salurkan energi pemulihan"),
  "Feedback edukatif harus menginstruksikan penyaluran energi dengan USE_VALUE"
);
console.log("  ✓ Berdiri di depan Altar Inti tanpa USE_VALUE menghasilkan feedback edukatif.");

// Kasus 4e: Kibo terhenti di tengah jalan setelah gerbang terbuka tetapi sebelum mencapai altar
const simIncompletePath = runSimulation(
  ["SET_VALUE_5", "MOVE", "IF_GATE", "MOVE"],
  ch15
);
assert.equal(simIncompletePath.success, false, "Jalan belum selesai harus gagal");
assert.ok(
  simIncompletePath.feedbackMessage.includes("Sebagian sistem telah aktif, tapi ALTAR INTI KIBO belum diaktifkan!"),
  "Feedback harus menyebut target berikutnya yang belum aktif (ALTAR INTI KIBO)"
);
console.log("  ✓ Berhenti setelah gerbang terbuka menghasilkan feedback partial completion spesifik.");

// Kasus 4e2: Kibo berhenti di petak awal sebelum mencapai atau membuka target manapun
const simUnreachedStart = runSimulation(
  ["SET_VALUE_5"],
  ch15
);
assert.equal(simUnreachedStart.success, false, "Berhenti di petak awal harus gagal");
assert.ok(
  simUnreachedStart.feedbackMessage.includes("Gerbang Keamanan atau Altar Inti Kibo"),
  "Feedback harus menyebut Gerbang Keamanan atau Altar Inti Kibo"
);
console.log("  ✓ Berhenti sebelum target manapun aktif menghasilkan feedback unreached target.");

// Kasus 4f: Menggunakan ACTIVATE pada target core
const simActivateOnCore = runSimulation(
  ["SET_VALUE_5", "MOVE", "IF_GATE", "REPEAT_3", "MOVE", "MOVE", "END_LOOP", "ACTIVATE"],
  ch15
);
assert.equal(simActivateOnCore.success, false, "ACTIVATE pada target core harus ditolak");
assert.ok(
  simActivateOnCore.feedbackMessage.includes("penyaluran data spesifik"),
  "ACTIVATE harus mengarahkan ke USE_VALUE"
);
console.log("  ✓ ACTIVATE pada Altar Inti ditolak dan diarahkan ke USE_VALUE.");

// Kasus 4g: Sintaks loop tidak seimbang (REPEAT tanpa END_LOOP)
const simBrokenLoop = runSimulation(
  ["SET_VALUE_5", "MOVE", "IF_GATE", "REPEAT_3", "MOVE", "MOVE", "USE_VALUE"],
  ch15
);
assert.equal(simBrokenLoop.success, false, "Loop tanpa END_LOOP harus gagal");
assert.ok(
  simBrokenLoop.feedbackMessage.includes("belum ditutup"),
  "Pesan kegagalan harus memperingatkan loop belum ditutup"
);
console.log("  ✓ Loop tanpa END_LOOP menghasilkan pesan validasi loop yang jelas.");

// 5. Verifikasi bahwa Tantangan Sebelumnya (ch-01 s/d ch-14) Tetap Utuh
console.log("\n5. Verifikasi Integritas ch-01 s/d ch-14:");
for (let i = 1; i <= 14; i++) {
  const chId = `ch-${String(i).padStart(2, "0")}`;
  const ch = getChallengeById(chId);
  assert.ok(ch, `Tantangan ${chId} harus tetap terdefinisi`);
  assert.notEqual(ch.chapterId, "kibo-core", `${chId} bukan bagian dari kibo-core`);
}
console.log("  ✓ Semua 14 tantangan sebelumnya tetap utuh dan valid.");

// 6. Pengujian Sistem Buka Kunci (Unlocking) & Prasyarat ch-15
console.log("\n6. Pengujian Sistem Buka Kunci & Prasyarat ch-15:");

const prereqCh15 = getPrerequisiteChallenge("ch-15");
assert.ok(prereqCh15, "ch-15 harus memiliki tantangan prasyarat");
assert.equal(prereqCh15.id, "ch-14", "Prasyarat ch-15 harus ch-14 (akhir Memory Station)");

const emptyProgress: PlayerProgressData = {
  playerId: "test_player",
  currentChapterId: "lumina-town",
  currentChallengeId: "ch-01",
  completedChallenges: {},
  totalStars: 0,
  worldRestoredPct: 0,
  updatedAt: new Date().toISOString(),
};

// ch-15 harus terkunci jika ch-14 belum tuntas
assert.equal(
  isChallengeUnlocked("ch-15", emptyProgress),
  false,
  "ch-15 harus terkunci jika belum ada misi yang selesai"
);

// Mock progres hingga ch-13 (Memory Station belum selesai tuntas)
const progressBeforeCh14: PlayerProgressData = {
  ...emptyProgress,
  completedChallenges: Object.fromEntries(
    Array.from({ length: 13 }, (_, i) => [
      `ch-${String(i + 1).padStart(2, "0")}`,
      {
        challengeId: `ch-${String(i + 1).padStart(2, "0")}`,
        stars: 3,
        completedAt: new Date().toISOString(),
      },
    ])
  ),
};
assert.equal(
  isChallengeUnlocked("ch-15", progressBeforeCh14),
  false,
  "ch-15 harus tetap terkunci jika ch-14 belum selesai"
);

// Mock progres setelah ch-14 tuntas (Memory Station 100% pulih)
const progressWithCh14: PlayerProgressData = {
  ...progressBeforeCh14,
  completedChallenges: {
    ...progressBeforeCh14.completedChallenges,
    "ch-14": {
      challengeId: "ch-14",
      stars: 3,
      completedAt: new Date().toISOString(),
    },
  },
};
assert.equal(
  isChallengeUnlocked("ch-15", progressWithCh14),
  true,
  "ch-15 harus terbuka saat ch-14 sudah selesai"
);
console.log("  ✓ ch-15 terkunci jika ch-14 belum selesai, dan terbuka saat ch-14 tuntas.");

// 7. Pengujian Navigasi Misi Berikutnya (ch-14 ke ch-15 & ch-15 adalah Final)
console.log("\n7. Pengujian Navigasi Antar-Misi:");

function getNextChallengeFor(challengeId: string) {
  const challenge = CHALLENGES[challengeId];
  if (!challenge) return undefined;
  return (
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
      : undefined)
  );
}

const nextAfterCh14 = getNextChallengeFor("ch-14");
assert.ok(nextAfterCh14, "Harus ada misi berikutnya setelah ch-14");
assert.equal(nextAfterCh14.id, "ch-15", "Misi berikutnya setelah ch-14 harus ch-15");

const nextAfterCh15 = getNextChallengeFor("ch-15");
assert.equal(
  nextAfterCh15,
  undefined,
  "ch-15 adalah misi finale, tidak boleh ada tombol misi berikutnya"
);
console.log("  ✓ Tombol misi berikutnya dari ch-14 mengarah ke ch-15, dan ch-15 tidak memiliki misi berikutnya.");

// 8. Pengujian Progres & Restorasi Bab Kibo Core (Single Challenge Finale)
console.log("\n8. Pengujian Progres & Restorasi Bab Kibo Core:");

const coreProgBefore = getChapterProgress("kibo-core", progressWithCh14);
assert.equal(coreProgBefore.total, 1, "kibo-core harus memiliki total 1 tantangan");
assert.equal(coreProgBefore.completed, 0, "kibo-core sebelum ch-15 selesai bernilai 0");
assert.equal(coreProgBefore.percentage, 0, "Persentase kibo-core sebelum tuntas adalah 0%");
assert.equal(coreProgBefore.isRestored, false, "kibo-core belum pulih");
assert.equal(isChapterRestored("kibo-core", progressWithCh14), false);

// Mock setelah ch-15 tuntas
const progressWithCh15: PlayerProgressData = {
  ...progressWithCh14,
  completedChallenges: {
    ...progressWithCh14.completedChallenges,
    "ch-15": {
      challengeId: "ch-15",
      stars: 3,
      completedAt: new Date().toISOString(),
    },
  },
};

const coreProgAfter = getChapterProgress("kibo-core", progressWithCh15);
assert.equal(coreProgAfter.total, 1, "kibo-core memiliki total 1 tantangan");
assert.equal(coreProgAfter.completed, 1, "kibo-core memiliki 1 tantangan selesai");
assert.equal(coreProgAfter.percentage, 100, "Menyelesaikan ch-15 berarti kibo-core 100% pulih");
assert.equal(coreProgAfter.isRestored, true, "kibo-core harus berstatus pulih sepenuhnya");
assert.equal(isChapterRestored("kibo-core", progressWithCh15), true);
console.log("  ✓ Progres kibo-core dihitung dari 1 tantangan: ch-15 selesai = 100% pulih sepenuhnya.");

// 9. Pengujian Kompatibilitas Progres 15 Tantangan
console.log("\n9. Pengujian Kompatibilitas 15 Tantangan:");
for (let i = 1; i <= 15; i++) {
  const chId = `ch-${String(i).padStart(2, "0")}`;
  assert.ok(progressWithCh15.completedChallenges[chId], `${chId} harus tercatat dalam completedChallenges`);
  assert.equal(progressWithCh15.completedChallenges[chId].stars, 3);
}
console.log("  ✓ Catatan progres seluruh 15 tantangan (ch-01 s/d ch-15) saling kompatibel dan lengkap.");

// 10. Pengujian Perhitungan Progres Dunia & Bintang (Misi Nyata vs Terbuka)
console.log("\n10. Pengujian Perhitungan Progres Dunia & Total Bintang:");

// 10a. Sebelum ch-15 selesai (14 dari 15 misi selesai)
const totalPlayableCount = Object.keys(CHALLENGES).length;
assert.equal(totalPlayableCount, 15, "Total seluruh tantangan wajib adalah 15");

const completedBefore15 = Object.keys(progressWithCh14.completedChallenges).length;
assert.equal(completedBefore15, 14, "Tantangan selesai sebelum ch-15 harus tepat 14");
assert.equal(
  isChallengeUnlocked("ch-15", progressWithCh14),
  true,
  "ch-15 sudah terbuka pada progressWithCh14"
);
assert.equal(
  Boolean(progressWithCh14.completedChallenges["ch-15"]),
  false,
  "Misi yang baru terbuka (ch-15) TIDAK BOLEH dihitung di completedChallenges"
);

const expectedPctBefore15 = parseFloat(((14 / 15) * 100).toFixed(1)); // 93.3%
assert.equal(expectedPctBefore15, 93.3);

const totalStarsBefore15 = Object.values(progressWithCh14.completedChallenges).reduce(
  (sum, item) => sum + item.stars,
  0
);
assert.equal(totalStarsBefore15, 42, "Total bintang sebelum ch-15 adalah 42 (14 * 3)");
assert.equal(
  isAllChallengesCompleted(progressWithCh14),
  false,
  "isAllChallengesCompleted harus false sebelum ch-15 selesai"
);
console.log("  ✓ Sebelum ch-15 selesai: 14/15 misi (93.3%), ch-15 terbuka tidak terhitung, isAllChallengesCompleted = false.");

// 10b. Setelah ch-15 selesai (15 dari 15 misi selesai)
const completedAfter15 = Object.keys(progressWithCh15.completedChallenges).length;
assert.equal(completedAfter15, 15, "Tantangan selesai setelah ch-15 harus tepat 15");

const expectedPctAfter15 = parseFloat(((15 / 15) * 100).toFixed(1)); // 100%
assert.equal(expectedPctAfter15, 100.0);

const totalStarsAfter15 = Object.values(progressWithCh15.completedChallenges).reduce(
  (sum, item) => sum + item.stars,
  0
);
assert.equal(totalStarsAfter15, 45, "Total bintang setelah ch-15 harus tepat 45 (15 * 3) tanpa duplikasi");
assert.equal(
  isAllChallengesCompleted(progressWithCh15),
  true,
  "isAllChallengesCompleted harus true saat seluruh 15 misi selesai"
);
console.log("  ✓ Setelah ch-15 selesai: 15/15 misi (100%), total 45 bintang tanpa duplikasi, isAllChallengesCompleted = true.");

// 11. Pengujian Guard Kondisi Kemenangan Penuh
console.log("\n11. Pengujian Guard Kondisi Kemenangan Penuh Kibo World:");

// Kasus 11a: Hanya ch-15 yang selesai, misi 1-14 belum selesai
const partialOnlyCh15: PlayerProgressData = {
  ...emptyProgress,
  completedChallenges: {
    "ch-15": {
      challengeId: "ch-15",
      stars: 3,
      completedAt: new Date().toISOString(),
    },
  },
};
assert.equal(
  isAllChallengesCompleted(partialOnlyCh15),
  false,
  "isAllChallengesCompleted harus FALSE jika hanya ch-15 yang selesai tanpa misi 1-14"
);
const partial15Count = Object.keys(partialOnlyCh15.completedChallenges).length;
const partial15Pct = parseFloat(((partial15Count / 15) * 100).toFixed(1));
assert.equal(partial15Pct, 6.7, "Persentase jika hanya ch-15 selesai adalah 6.7%");
console.log("  ✓ Jika hanya ch-15 selesai tanpa menyelesaikan misi sebelumnya, kemenangan penuh Kibo World tidak aktif.");

console.log("\n🎉 SELURUH PENGUJIAN KIBO CORE & INTEGRITAS SISTEM BERHASIL DENGAN SEMPURNA! 🎉\n");
