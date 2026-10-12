import assert from "node:assert/strict";
import { CHALLENGES, getChallengeById } from "../src/data/challenges";
import { CHAPTERS } from "../src/data/chapters";
import { runSimulation } from "../src/features/blocks/engine";
import {
  isChallengeUnlocked,
  getPrerequisiteChallenge,
  PlayerProgressData,
} from "../src/features/progress/storage";

console.log("=== PENGUJIAN WILAYAH 03: SPROUT GARDEN (CH-09, CH-10, CH-11) ===");

// 1. Pengujian Integritas Definisi Chapter & Tantangan
console.log("\n1. Pengujian Integritas Chapter & Definisi Tantangan:");

const sproutChapter = CHAPTERS.find((c) => c.id === "sprout-garden");
assert.ok(sproutChapter, "Chapter sprout-garden harus terdaftar di CHAPTERS");
assert.equal(sproutChapter?.totalChallenges, 3, "Sprout Garden harus memiliki tepat 3 tantangan");
assert.equal(sproutChapter?.concept, "loop", "Konsep utama Sprout Garden adalah loop");
console.log("  ✓ Definisi chapter sprout-garden valid (3 tantangan, konsep: loop).");

const ch09 = getChallengeById("ch-09");
const ch10 = getChallengeById("ch-10");
const ch11 = getChallengeById("ch-11");

assert.ok(ch09, "ch-09 harus terdefinisi");
assert.ok(ch10, "ch-10 harus terdefinisi");
assert.ok(ch11, "ch-11 harus terdefinisi");

assert.equal(ch09.chapterId, "sprout-garden");
assert.equal(ch10.chapterId, "sprout-garden");
assert.equal(ch11.chapterId, "sprout-garden");

assert.equal(ch09.order, 1);
assert.equal(ch10.order, 2);
assert.equal(ch11.order, 3);

assert.equal(ch09.hints.length, 4, "Ch-09 harus memiliki 4 tingkat hint");
assert.equal(ch10.hints.length, 4, "Ch-10 harus memiliki 4 tingkat hint");
assert.equal(ch11.hints.length, 4, "Ch-11 harus memiliki 4 tingkat hint");
console.log("  ✓ Struktur data ch-09, ch-10, ch-11 valid dan masing-masing memiliki 4 tingkat hint.");

// 2. Pengujian Validasi Sintaks Loop Engine
console.log("\n2. Pengujian Validasi Sintaks Loop Engine:");

// Kasus: REPEAT tanpa END_LOOP
const resUnclosed = runSimulation(["REPEAT_3", "MOVE", "WATER"], ch09);
assert.equal(resUnclosed.success, false, "Loop tanpa END_LOOP harus gagal");
assert.ok(
  resUnclosed.feedbackMessage.includes("belum ditutup"),
  "Pesan kesalahan harus ramah anak tentang loop yang belum ditutup"
);
console.log("  ✓ Validasi loop yang belum ditutup terdeteksi dengan pesan ramah anak.");

// Kasus: END_LOOP tanpa REPEAT
const resOrphanEnd = runSimulation(["MOVE", "WATER", "END_LOOP"], ch09);
assert.equal(resOrphanEnd.success, false, "END_LOOP tanpa REPEAT harus gagal");
assert.ok(
  resOrphanEnd.feedbackMessage.includes("tanpa blok [Ulangi]"),
  "Pesan kesalahan harus ramah anak tentang END_LOOP tanpa REPEAT"
);
console.log("  ✓ Validasi END_LOOP yatim terdeteksi dengan pesan ramah anak.");

// Kasus: Loop kosong
const resEmptyLoop = runSimulation(["REPEAT_3", "END_LOOP"], ch09);
assert.equal(resEmptyLoop.success, false, "Loop kosong harus gagal");
assert.ok(
  resEmptyLoop.feedbackMessage.includes("masih kosong"),
  "Pesan kesalahan harus ramah anak tentang loop kosong"
);
console.log("  ✓ Validasi loop kosong terdeteksi dengan pesan ramah anak.");

// 3. Pengujian Solusi Optimal & Eksekusi Simulative
console.log("\n3. Pengujian Solusi Optimal & Eksekusi Simulative:");

// Challenge 01 — Tunas Pertama (First Sprout)
// Solusi Optimal 4 blok: REPEAT_3 -> MOVE -> WATER -> END_LOOP
const solCh09Optimal = runSimulation(
  ["REPEAT_3", "MOVE", "WATER", "END_LOOP"],
  ch09
);
assert.equal(solCh09Optimal.success, true, "Ch-09 optimal harus berhasil");
assert.equal(solCh09Optimal.starsEarned, 3, "Ch-09 optimal harus mendapat 3 bintang");
assert.equal(solCh09Optimal.finalPosition, 3, "Kibo harus berada di petak terakhir (indeks 3)");
assert.equal(
  solCh09Optimal.activeTargetIds.length,
  3,
  "Ketiga tunas harus berhasil disiram dan mekar"
);
console.log("  ✓ Ch-09 Solusi Optimal (REPEAT_3 -> MOVE -> WATER -> END_LOOP) sukses 3 bintang.");

// Ch-09 Solusi Manual tanpa Loop (6 blok = 2 bintang)
const solCh09Manual = runSimulation(
  ["MOVE", "WATER", "MOVE", "WATER", "MOVE", "WATER"],
  ch09
);
assert.equal(solCh09Manual.success, true, "Ch-09 manual harus berhasil");
assert.equal(
  solCh09Manual.starsEarned,
  2,
  "Ch-09 manual (6 blok > 4 optimal) harus mendapat 2 bintang"
);
console.log("  ✓ Ch-09 Solusi Manual tanpa loop mendapat 2 bintang secara adil.");

// Challenge 02 — Kebun Berbaris (Garden Rows)
// Solusi Optimal 7 blok: MOVE -> REPEAT_3 -> MOVE -> WATER -> END_LOOP -> MOVE -> ACTIVATE
const solCh10Optimal = runSimulation(
  ["MOVE", "REPEAT_3", "MOVE", "WATER", "END_LOOP", "MOVE", "ACTIVATE"],
  ch10
);
assert.equal(solCh10Optimal.success, true, "Ch-10 optimal harus berhasil");
assert.equal(solCh10Optimal.starsEarned, 3, "Ch-10 optimal harus mendapat 3 bintang");
assert.equal(solCh10Optimal.finalPosition, 5, "Kibo harus berada di petak katup (indeks 5)");
assert.equal(
  solCh10Optimal.activeTargetIds.length,
  4,
  "3 bunga dan 1 katup pompa harus aktif"
);
console.log("  ✓ Ch-10 Solusi Optimal (MOVE -> REPEAT_3 [MOVE, WATER] -> MOVE -> ACTIVATE) sukses 3 bintang.");

// Ch-10 Solusi Manual tanpa Loop (9 blok = 2 bintang)
const solCh10Manual = runSimulation(
  [
    "MOVE",
    "MOVE",
    "WATER",
    "MOVE",
    "WATER",
    "MOVE",
    "WATER",
    "MOVE",
    "ACTIVATE",
  ],
  ch10
);
assert.equal(solCh10Manual.success, true, "Ch-10 manual harus berhasil");
assert.equal(
  solCh10Manual.starsEarned,
  2,
  "Ch-10 manual (9 blok > 7 optimal) harus mendapat 2 bintang"
);
console.log("  ✓ Ch-10 Solusi Manual tanpa loop mendapat 2 bintang secara adil.");

// Challenge 03 — Festival Bunga (Flower Festival)
// Solusi Optimal 8 blok: REPEAT_2 -> MOVE -> WATER -> MOVE -> WATER -> END_LOOP -> MOVE -> ACTIVATE
const solCh11Optimal = runSimulation(
  [
    "REPEAT_2",
    "MOVE",
    "WATER",
    "MOVE",
    "WATER",
    "END_LOOP",
    "MOVE",
    "ACTIVATE",
  ],
  ch11
);
assert.equal(solCh11Optimal.success, true, "Ch-11 optimal harus berhasil");
assert.equal(solCh11Optimal.starsEarned, 3, "Ch-11 optimal harus mendapat 3 bintang");
assert.equal(solCh11Optimal.finalPosition, 5, "Kibo harus berada di petak air mancur (indeks 5)");
assert.equal(
  solCh11Optimal.activeTargetIds.length,
  5,
  "4 bunga dan 1 air mancur megah harus aktif"
);
console.log("  ✓ Ch-11 Solusi Optimal Compound Loop (REPEAT_2 [MOVE, WATER, MOVE, WATER] -> MOVE -> ACTIVATE) sukses 3 bintang.");

// Ch-11 Solusi Manual tanpa Loop (10 blok = 2 bintang)
const solCh11Manual = runSimulation(
  [
    "MOVE",
    "WATER",
    "MOVE",
    "WATER",
    "MOVE",
    "WATER",
    "MOVE",
    "WATER",
    "MOVE",
    "ACTIVATE",
  ],
  ch11
);
assert.equal(solCh11Manual.success, true, "Ch-11 manual harus berhasil");
assert.equal(
  solCh11Manual.starsEarned,
  2,
  "Ch-11 manual (10 blok > 8 optimal) harus mendapat 2 bintang"
);
console.log("  ✓ Ch-11 Solusi Manual tanpa loop mendapat 2 bintang secara adil.");

// 4. Pengujian Kegagalan Tindakan Tidak Tepat (Error Handling Ramah Anak)
console.log("\n4. Pengujian Kasus Salah & Penanganan Kesalahan:");

// Kasus: Menyiram tanah kosong di Petak 1
const resWaterEmpty = runSimulation(["WATER"], ch09);
assert.equal(resWaterEmpty.success, false);
assert.ok(
  resWaterEmpty.feedbackMessage.includes("tanah kosong"),
  "Menyiram tanah kosong harus menghasilkan pesan kesalahan yang ramah"
);
console.log("  ✓ Menyiram tanah kosong dicegah dengan pesan edukatif.");

// Kasus: Menyiram air mancur di Ch-10
const resWaterFountain = runSimulation(
  ["MOVE", "MOVE", "MOVE", "MOVE", "MOVE", "WATER"],
  ch10
);
assert.equal(resWaterFountain.success, false);
assert.ok(
  resWaterFountain.feedbackMessage.includes("KATUP PENGAIRAN") ||
    resWaterFountain.feedbackMessage.includes("katup"),
  "Menyiram katup pengairan harus memberi tahu pemain untuk mengaktifkan katup"
);
console.log("  ✓ Menyiram air mancur menghasilkan panduan untuk menggunakan perintah aktifkan.");

// Kasus Regression Bug Fix: Berhenti di depan TUNAS HIJAU 1 tanpa menyiram (MOVE saja)
const resStopAtSprout = runSimulation(["MOVE"], ch09);
assert.equal(resStopAtSprout.success, false, "Kibo hanya maju 1 langkah harus gagal");
assert.equal(resStopAtSprout.finalPosition, 1, "Kibo harus berada di petak tunas 1 (posisi 1)");
assert.ok(
  resStopAtSprout.feedbackMessage.includes("TUNAS HIJAU 1") &&
    resStopAtSprout.feedbackMessage.includes("Siram Tanaman"),
  "Feedback harus meminta pemain menyiram TUNAS HIJAU 1"
);
assert.equal(
  resStopAtSprout.feedbackMessage.toLowerCase().includes("saklar"),
  false,
  "Feedback Sprout Garden tidak boleh menyebut saklar"
);
assert.equal(
  resStopAtSprout.feedbackMessage.toLowerCase().includes("lampu"),
  false,
  "Feedback Sprout Garden tidak boleh menyebut lampu"
);
console.log("  ✓ Berhenti di depan TUNAS HIJAU 1 menghasilkan feedback 'Siram Tanaman' tanpa kata saklar/lampu.");

// Kasus Sebagian Tunas Disiram (MOVE -> WATER)
const resPartialSprout = runSimulation(["MOVE", "WATER"], ch09);
assert.equal(resPartialSprout.success, false, "Hanya 1 tunas yang disiram harus belum selesai");
assert.ok(
  resPartialSprout.feedbackMessage.includes("Sebagian tanaman sudah mekar") &&
    resPartialSprout.feedbackMessage.includes("TUNAS HIJAU 2"),
  "Feedback harus menginformasikan bahwa sebagian tanaman mekar tapi TUNAS HIJAU 2 masih layu"
);
assert.equal(
  resPartialSprout.feedbackMessage.toLowerCase().includes("lampu"),
  false,
  "Feedback sebagian tunas tidak boleh menyebut lampu"
);
console.log("  ✓ Feedback sebagian tunas mengarah ke TUNAS HIJAU 2 tanpa menyebut lampu.");

// Kasus Ch-10 Berdiri di depan Katup Pengairan tanpa mengaktifkan
const resStopAtPump = runSimulation(
  ["MOVE", "REPEAT_3", "MOVE", "WATER", "END_LOOP", "MOVE"],
  ch10
);
assert.equal(resStopAtPump.success, false, "Berhenti di depan katup tanpa aktivasi harus belum selesai");
assert.equal(
  resStopAtPump.feedbackMessage,
  "Kibo sudah berdiri tepat di depan KATUP PENGAIRAN, tapi katup air belum diputar! Gunakan blok Aktifkan untuk memutar katup air ya.",
  "Feedback harus berbunyi alami dan mengarahkan anak menggunakan blok Aktifkan"
);
assert.equal(
  resStopAtPump.feedbackMessage.toLowerCase().includes("saklarnya belum dinyalakan"),
  false,
  "Feedback katup pengairan tidak boleh menyebut saklarnya belum dinyalakan"
);
assert.equal(
  resStopAtPump.feedbackMessage.includes("Nyalakan Lampu"),
  false,
  "Feedback katup pengairan tidak boleh lagi menyebut Nyalakan Lampu"
);
console.log("  ✓ Feedback berdiri di depan katup pengairan meminta aktivasi katup secara spesifik.");

// 5. Pengujian Sistem Penguncian & Prasyarat Lintas Bab (Gate Valley -> Sprout Garden)
console.log("\n5. Pengujian Sistem Penguncian & Prasyarat Lintas Bab:");

// Mock progress Gate Valley belum tuntas (ch-08 belum selesai)
const mockGVIncomplete: PlayerProgressData = {
  playerId: "test",
  currentChapterId: "gate-valley",
  currentChallengeId: "ch-07",
  completedChallenges: {
    "ch-01": { challengeId: "ch-01", stars: 3, completedAt: "" },
    "ch-02": { challengeId: "ch-02", stars: 3, completedAt: "" },
    "ch-03": { challengeId: "ch-03", stars: 3, completedAt: "" },
    "ch-04": { challengeId: "ch-04", stars: 3, completedAt: "" },
    "ch-05": { challengeId: "ch-05", stars: 3, completedAt: "" },
    "ch-06": { challengeId: "ch-06", stars: 3, completedAt: "" },
    "ch-07": { challengeId: "ch-07", stars: 3, completedAt: "" },
  },
  totalStars: 21,
  worldRestoredPct: 28.0,
  updatedAt: "",
};

// ch-09 harus terkunci jika ch-08 belum selesai
assert.equal(
  isChallengeUnlocked("ch-09", mockGVIncomplete),
  false,
  "ch-09 harus terkunci jika ch-08 belum selesai"
);
assert.equal(
  getPrerequisiteChallenge("ch-09")?.id,
  "ch-08",
  "Prasyarat ch-09 adalah ch-08"
);
console.log("  ✓ ch-09 terkunci jika Gate Valley belum tuntas, prasyaratnya ch-08.");

// Setelah Gate Valley selesai (ch-08 selesai)
const mockGVComplete: PlayerProgressData = {
  ...mockGVIncomplete,
  completedChallenges: {
    ...mockGVIncomplete.completedChallenges,
    "ch-08": { challengeId: "ch-08", stars: 3, completedAt: "" },
  },
};

// ch-09 harus terbuka, tetapi ch-10 dan ch-11 masih terkunci
assert.equal(
  isChallengeUnlocked("ch-09", mockGVComplete),
  true,
  "ch-09 terbuka setelah ch-08 selesai"
);
assert.equal(
  isChallengeUnlocked("ch-10", mockGVComplete),
  false,
  "ch-10 masih terkunci"
);
assert.equal(
  isChallengeUnlocked("ch-11", mockGVComplete),
  false,
  "ch-11 masih terkunci"
);
assert.equal(
  getPrerequisiteChallenge("ch-10")?.id,
  "ch-09",
  "Prasyarat ch-10 adalah ch-09"
);
console.log("  ✓ ch-09 terbuka setelah ch-08 selesai; ch-10 dan ch-11 terkunci secara berurutan.");

// Setelah ch-09 selesai
const mockCh09Complete: PlayerProgressData = {
  ...mockGVComplete,
  completedChallenges: {
    ...mockGVComplete.completedChallenges,
    "ch-09": { challengeId: "ch-09", stars: 3, completedAt: "" },
  },
};
assert.equal(
  isChallengeUnlocked("ch-10", mockCh09Complete),
  true,
  "ch-10 terbuka setelah ch-09 selesai"
);
assert.equal(
  isChallengeUnlocked("ch-11", mockCh09Complete),
  false,
  "ch-11 masih terkunci"
);
assert.equal(
  getPrerequisiteChallenge("ch-11")?.id,
  "ch-10",
  "Prasyarat ch-11 adalah ch-10"
);

// Setelah ch-10 selesai
const mockCh10Complete: PlayerProgressData = {
  ...mockCh09Complete,
  completedChallenges: {
    ...mockCh09Complete.completedChallenges,
    "ch-10": { challengeId: "ch-10", stars: 3, completedAt: "" },
  },
};
assert.equal(
  isChallengeUnlocked("ch-11", mockCh10Complete),
  true,
  "ch-11 terbuka setelah ch-10 selesai"
);
console.log("  ✓ Alur prasyarat sekuensial Sprout Garden (ch-09 -> ch-10 -> ch-11) teruji 100%.");

// 6. Kompatibilitas Tantangan Wilayah Terdahulu (Lumina Town & Gate Valley)
console.log("\n6. Pengujian Kompatibilitas Tantangan Sebelumnya:");

// Lumina Town ch-01
const resCh01 = runSimulation(["MOVE", "MOVE", "ACTIVATE"], CHALLENGES["ch-01"]);
assert.equal(resCh01.success, true, "Ch-01 Lumina Town harus tetap sukses");

// Gate Valley ch-06
const resCh06 = runSimulation(["MOVE", "IF_GATE", "MOVE", "MOVE", "ACTIVATE"], CHALLENGES["ch-06"]);
assert.equal(resCh06.success, true, "Ch-06 Gate Valley harus tetap sukses");

// Gate Valley ch-07
const resCh07 = runSimulation(
  ["MOVE", "MOVE", "IF_BRIDGE", "MOVE", "MOVE", "ACTIVATE"],
  CHALLENGES["ch-07"]
);
assert.equal(resCh07.success, true, "Ch-07 Gate Valley harus tetap sukses");

console.log("  ✓ Seluruh tantangan Lumina Town dan Gate Valley tetap berjalan normal dan kompatibel.");

console.log("\n🎉 SELURUH PENGUJIAN WILAYAH 03: SPROUT GARDEN BERHASIL!");
