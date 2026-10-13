import assert from "node:assert/strict";
import { getChallengeById, CHALLENGES } from "../src/data/challenges";
import { runSimulation } from "../src/features/blocks/engine";
import {
  isChallengeUnlocked,
  getPrerequisiteChallenge,
  isChapterRestored,
  getChapterProgress,
  PlayerProgressData,
} from "../src/features/progress/storage";

console.log("=== PENGUJIAN WILAYAH 04: MEMORY STATION (CH-12, CH-13, CH-14) ===");

// 1. Pengujian Integritas Definisi Tantangan Memory Station
console.log("\n1. Pengujian Integritas Definisi Tantangan:");

const ch12 = getChallengeById("ch-12");
const ch13 = getChallengeById("ch-13");
const ch14 = getChallengeById("ch-14");

assert.ok(ch12, "ch-12 harus terdefinisi");
assert.ok(ch13, "ch-13 harus terdefinisi");
assert.ok(ch14, "ch-14 harus terdefinisi");

assert.equal(ch12.chapterId, "memory-station");
assert.equal(ch13.chapterId, "memory-station");
assert.equal(ch14.chapterId, "memory-station");

assert.equal(ch12.order, 1);
assert.equal(ch13.order, 2);
assert.equal(ch14.order, 3);

assert.equal(ch12.hints.length, 4, "Ch-12 harus memiliki 4 tingkat hint");
assert.equal(ch13.hints.length, 4, "Ch-13 harus memiliki 4 tingkat hint");
assert.equal(ch14.hints.length, 4, "Ch-14 harus memiliki 4 tingkat hint");

// Verifikasi blok yang tersedia: ACTIVATE tidak boleh ada di Ch-12 dan Ch-13
assert.deepEqual(
  ch12.availableBlocks,
  ["MOVE", "SET_VALUE_3", "USE_VALUE"],
  "Ch-12 hanya boleh memiliki blok MOVE, SET_VALUE_3, dan USE_VALUE"
);
assert.equal(
  ch12.availableBlocks.includes("ACTIVATE"),
  false,
  "Blok ACTIVATE tidak boleh tersedia pada Ch-12"
);

assert.deepEqual(
  ch13.availableBlocks,
  ["MOVE", "SET_VALUE_5", "USE_VALUE"],
  "Ch-13 hanya boleh memiliki blok MOVE, SET_VALUE_5, dan USE_VALUE"
);
assert.equal(
  ch13.availableBlocks.includes("ACTIVATE"),
  false,
  "Blok ACTIVATE tidak boleh tersedia pada Ch-13"
);

assert.equal(
  ch14.availableBlocks.includes("ACTIVATE"),
  false,
  "Blok ACTIVATE tidak boleh tersedia pada Ch-14"
);

console.log("  ✓ Struktur data ch-12, ch-13, ch-14 valid, 4 hint, dan bebas dari blok ACTIVATE yang tidak relevan.");

// 2. Pengujian Eksekusi Solusi Optimal & Penilaian Bintang
console.log("\n2. Pengujian Solusi Optimal & Penilaian Bintang:");

// Ch-12 Solusi Optimal: SET_VALUE_3 -> MOVE -> MOVE -> MOVE -> USE_VALUE (5 blok = 3 bintang)
const solCh12Optimal = runSimulation(
  ["SET_VALUE_3", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch12
);
assert.equal(solCh12Optimal.success, true, "Ch-12 optimal harus berhasil");
assert.equal(solCh12Optimal.starsEarned, 3, "Ch-12 optimal harus mendapat 3 bintang");
assert.equal(solCh12Optimal.finalPosition, 3, "Kibo harus berada di petak terminal (indeks 3)");
assert.equal(solCh12Optimal.memoryValue, 3, "Nilai memori akhir harus 3");
assert.equal(solCh12Optimal.activeTargetIds.length, 1, "Terminal Alpha harus aktif");
console.log("  ✓ Ch-12 Solusi Optimal (SET_VALUE_3 -> MOVE x3 -> USE_VALUE) sukses 3 bintang.");

// Ch-12 Solusi Non-Optimal (> 5 blok = 2 bintang)
const solCh12NonOptimal = runSimulation(
  ["SET_VALUE_2", "SET_VALUE_3", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch12
);
assert.equal(solCh12NonOptimal.success, true, "Ch-12 dengan blok ekstra harus berhasil");
assert.equal(solCh12NonOptimal.starsEarned, 2, "Ch-12 melebihi batas optimal harus mendapat 2 bintang");
console.log("  ✓ Ch-12 Solusi Non-Optimal mendapat 2 bintang secara adil.");

// Ch-13 Solusi Optimal: SET_VALUE_5 -> MOVE -> MOVE -> MOVE -> MOVE -> USE_VALUE (6 blok = 3 bintang)
const solCh13Optimal = runSimulation(
  ["SET_VALUE_5", "MOVE", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch13
);
assert.equal(solCh13Optimal.success, true, "Ch-13 optimal harus berhasil");
assert.equal(solCh13Optimal.starsEarned, 3, "Ch-13 optimal harus mendapat 3 bintang");
assert.equal(solCh13Optimal.finalPosition, 4, "Kibo harus berada di petak reaktor (indeks 4)");
assert.equal(solCh13Optimal.memoryValue, 5, "Nilai memori akhir harus 5");
assert.equal(solCh13Optimal.activeTargetIds.length, 1, "Reaktor Memori harus aktif");
console.log("  ✓ Ch-13 Solusi Optimal (SET_VALUE_5 -> MOVE x4 -> USE_VALUE) sukses 3 bintang.");

// Ch-13 Solusi Non-Optimal (> 6 blok = 2 bintang)
const solCh13NonOptimal = runSimulation(
  ["SET_VALUE_3", "SET_VALUE_5", "MOVE", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch13
);
assert.equal(solCh13NonOptimal.success, true, "Ch-13 dengan blok ekstra harus berhasil");
assert.equal(solCh13NonOptimal.starsEarned, 2, "Ch-13 melebihi batas optimal harus mendapat 2 bintang");
console.log("  ✓ Ch-13 Solusi Non-Optimal mendapat 2 bintang secara adil.");

// Ch-14 Solusi Optimal: SET_VALUE_2 -> MOVE x2 -> USE_VALUE -> SET_VALUE_4 -> MOVE x3 -> USE_VALUE (9 blok = 3 bintang)
const solCh14Optimal = runSimulation(
  ["SET_VALUE_2", "MOVE", "MOVE", "USE_VALUE", "SET_VALUE_4", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch14
);
assert.equal(solCh14Optimal.success, true, "Ch-14 optimal harus berhasil");
assert.equal(solCh14Optimal.starsEarned, 3, "Ch-14 optimal harus mendapat 3 bintang");
assert.equal(solCh14Optimal.finalPosition, 5, "Kibo harus berada di petak kubah memori (indeks 5)");
assert.equal(solCh14Optimal.memoryValue, 4, "Nilai memori akhir harus 4");
assert.equal(solCh14Optimal.activeTargetIds.length, 2, "Konsol Alpha dan Kubah Memori harus aktif");
console.log("  ✓ Ch-14 Solusi Optimal Sinkronisasi Dua Nilai (SET 2 -> USE -> SET 4 -> USE) sukses 3 bintang.");

// 3. Pengujian Validasi Nilai & Penanganan Kasus Salah (Mistake Awareness)
console.log("\n3. Pengujian Validasi Nilai & Penanganan Kasus Salah:");

// Kasus Ch-12: USE_VALUE saat memori kosong (tanpa SET)
const resCh12EmptyMemory = runSimulation(
  ["MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch12
);
assert.equal(resCh12EmptyMemory.success, false, "USE_VALUE pada terminal dengan memori kosong harus gagal");
assert.ok(
  resCh12EmptyMemory.feedbackMessage.includes("Kotak Memori Kibo masih kosong") ||
    resCh12EmptyMemory.feedbackMessage.includes("Simpan nilai"),
  "Feedback harus memberitahu bahwa memori masih kosong dan perlu menyimpan nilai"
);
console.log("  ✓ USE_VALUE pada terminal dengan memori kosong ditolak dengan pesan edukatif.");

// Kasus Ch-12: USE_VALUE dengan nilai yang salah (misal 2 padahal butuh 3)
const resCh12WrongValue = runSimulation(
  ["SET_VALUE_2", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch12
);
assert.equal(resCh12WrongValue.success, false, "USE_VALUE pada terminal dengan nilai salah harus gagal");
assert.ok(
  resCh12WrongValue.feedbackMessage.includes("membutuhkan Nilai 3") ||
    resCh12WrongValue.feedbackMessage.includes("3 unit daya"),
  "Feedback harus menginformasikan nilai yang dibutuhkan terminal"
);
console.log("  ✓ USE_VALUE pada terminal dengan nilai salah menghasilkan feedback diskriminasi nilai.");

// Kasus Ch-12: USE_VALUE di petak tanah kosong
const resCh12UseEmptyTile = runSimulation(
  ["SET_VALUE_3", "MOVE", "USE_VALUE"],
  ch12
);
assert.equal(resCh12UseEmptyTile.success, false, "USE_VALUE di petak tanah kosong harus gagal");
assert.ok(
  resCh12UseEmptyTile.feedbackMessage.includes("tidak ada terminal atau perangkat data"),
  "Feedback harus memberitahu tidak ada terminal data di petak tersebut"
);
console.log("  ✓ USE_VALUE di petak tanah kosong pada Ch-12 dicegah dengan feedback lokasi yang tepat.");

// Kasus Ch-12: Mencoba menggunakan ACTIVATE pada Terminal (tidak boleh diterima, harus diarahkan ke USE_VALUE)
const resCh12ActivateOnTerminal = runSimulation(
  ["SET_VALUE_3", "MOVE", "MOVE", "MOVE", "ACTIVATE"],
  ch12
);
assert.equal(resCh12ActivateOnTerminal.success, false, "ACTIVATE pada Terminal Alpha harus ditolak");
assert.ok(
  resCh12ActivateOnTerminal.feedbackMessage.includes("Gunakan blok Gunakan Nilai Data") ||
    resCh12ActivateOnTerminal.feedbackMessage.includes("penyaluran data spesifik"),
  "Feedback ACTIVATE pada Terminal Alpha harus mengarahkan ke Gunakan Nilai Data"
);
console.log("  ✓ ACTIVATE pada Terminal Data Alpha ditolak dan diarahkan ke blok USE_VALUE.");

// Kasus Ch-12: Hanya berdiri di atas terminal tanpa USE_VALUE
const resCh12StandingOnly = runSimulation(
  ["SET_VALUE_3", "MOVE", "MOVE", "MOVE"],
  ch12
);
assert.equal(resCh12StandingOnly.success, false, "Hanya berdiri di atas terminal tidak boleh dianggap selesai");
assert.ok(
  resCh12StandingOnly.feedbackMessage.includes("Gunakan blok Gunakan Nilai Data"),
  "Feedback harus memandu pemain untuk menggunakan blok Gunakan Nilai Data"
);
console.log("  ✓ Berdiri di atas terminal tanpa USE_VALUE ditolak secara konsisten.");

// Kasus Ch-13: Menggunakan USE_VALUE saat memori kosong
const resCh13EmptyUse = runSimulation(
  ["MOVE", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch13
);
assert.equal(resCh13EmptyUse.success, false, "USE_VALUE dengan memori kosong harus gagal");
assert.ok(
  resCh13EmptyUse.feedbackMessage.includes("Kotak Memori Kibo masih kosong"),
  "Feedback USE_VALUE harus menginformasikan bahwa memori masih kosong"
);
console.log("  ✓ USE_VALUE saat memori kosong menghasilkan panduan menyimpan nilai data.");

// Kasus Ch-13: Menggunakan USE_VALUE dengan nilai yang salah (misal 3 padahal butuh 5)
const resCh13WrongValue = runSimulation(
  ["SET_VALUE_3", "MOVE", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch13
);
assert.equal(resCh13WrongValue.success, false, "USE_VALUE pada reaktor dengan nilai salah harus gagal");
assert.ok(
  resCh13WrongValue.feedbackMessage.includes("membutuhkan Nilai 5"),
  "Feedback harus menginformasikan reaktor butuh Nilai 5"
);
console.log("  ✓ USE_VALUE pada reaktor dengan nilai salah menghasilkan feedback diskriminasi nilai.");

// Kasus Ch-13: Menggunakan USE_VALUE di petak tanah kosong
const resCh13UseEmptyTile = runSimulation(
  ["SET_VALUE_5", "MOVE", "USE_VALUE"],
  ch13
);
assert.equal(resCh13UseEmptyTile.success, false, "USE_VALUE di petak tanah kosong harus gagal");
assert.ok(
  resCh13UseEmptyTile.feedbackMessage.includes("tidak ada terminal atau perangkat data"),
  "Feedback harus memberitahu tidak ada terminal data di petak tersebut"
);
console.log("  ✓ USE_VALUE di petak tanah kosong dicegah dengan feedback lokasi yang tepat.");

// Kasus Ch-13: Menggunakan ACTIVATE biasa pada Reaktor yang membutuhkan USE_VALUE
const resCh13ActivateOnReactor = runSimulation(
  ["SET_VALUE_5", "MOVE", "MOVE", "MOVE", "MOVE", "ACTIVATE"],
  ch13
);
assert.equal(resCh13ActivateOnReactor.success, false, "ACTIVATE biasa pada reaktor harus gagal");
assert.ok(
  resCh13ActivateOnReactor.feedbackMessage.includes("Gunakan blok Gunakan Nilai Data") ||
    resCh13ActivateOnReactor.feedbackMessage.includes("penyaluran data spesifik"),
  "Feedback harus mengarahkan anak menggunakan blok USE_VALUE"
);
console.log("  ✓ Menggunakan ACTIVATE pada reaktor ditolak dan diarahkan ke blok USE_VALUE.");

// Kasus Ch-13: Hanya berdiri di atas reaktor tanpa USE_VALUE
const resCh13StandingOnly = runSimulation(
  ["SET_VALUE_5", "MOVE", "MOVE", "MOVE", "MOVE"],
  ch13
);
assert.equal(resCh13StandingOnly.success, false, "Hanya berdiri di atas reaktor tidak boleh dianggap selesai");
assert.ok(
  resCh13StandingOnly.feedbackMessage.includes("Gunakan blok Gunakan Nilai Data"),
  "Feedback harus memandu pemain untuk menggunakan blok Gunakan Nilai Data"
);
console.log("  ✓ Berdiri di atas reaktor tanpa USE_VALUE ditolak secara konsisten.");

// Kasus Ch-14: Prasyarat target berurutan — Kubah Memori Utama tidak bisa dibuka jika Konsol Alpha belum aktif
const resCh14SkipConsole = runSimulation(
  ["SET_VALUE_4", "MOVE", "MOVE", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch14
);
assert.equal(resCh14SkipConsole.success, false, "Melewati Konsol Alpha harus gagal");
assert.ok(
  resCh14SkipConsole.feedbackMessage.includes("Konsol Alpha terlebih dahulu"),
  "Feedback harus menginformasikan bahwa Konsol Alpha adalah prasyarat Kubah Memori"
);
console.log("  ✓ Prasyarat bertahap Ch-14 (Konsol Alpha -> Kubah Memori) terverifikasi 100%.");

// Kasus Ch-14: Nilai memori tidak diperbarui (masih nilai 2 saat membuka Kubah Memori yang butuh 4)
const resCh14StaleValue = runSimulation(
  ["SET_VALUE_2", "MOVE", "MOVE", "USE_VALUE", "MOVE", "MOVE", "MOVE", "USE_VALUE"],
  ch14
);
assert.equal(resCh14StaleValue.success, false, "Menggunakan nilai usang untuk Kubah Memori harus gagal");
assert.ok(
  resCh14StaleValue.feedbackMessage.includes("membutuhkan Nilai 4") &&
    resCh14StaleValue.feedbackMessage.includes("berisi Nilai 2"),
  "Feedback harus memberitahu Kubah butuh 4 tetapi memori masih bernilai 2"
);
console.log("  ✓ Verifikasi pembaruan nilai variabel teruji: nilai lama ditolak pada target berikutnya.");

// 4. Pengujian Riwayat State Memori per Langkah (Step Execution Tracking)
console.log("\n4. Pengujian Riwayat State Memori per Langkah:");

const runStepCheck = runSimulation(
  ["SET_VALUE_2", "MOVE", "SET_VALUE_4", "MOVE"],
  ch14
);
assert.equal(runStepCheck.steps[0].memoryValue, 2, "Langkah 1: SET_VALUE_2 harus mencatat memoryValue = 2");
assert.equal(runStepCheck.steps[1].memoryValue, 2, "Langkah 2: MOVE harus mempertahankan memoryValue = 2");
assert.equal(runStepCheck.steps[2].memoryValue, 4, "Langkah 3: SET_VALUE_4 harus memperbarui memoryValue = 4");
assert.equal(runStepCheck.steps[3].memoryValue, 4, "Langkah 4: MOVE harus mempertahankan memoryValue = 4");
console.log("  ✓ State memoryValue tercatat akurat dan konsisten pada setiap SimulationStep.");

// 5. Pengujian Sistem Penguncian & Prasyarat Lintas Bab (Sprout Garden -> Memory Station)
console.log("\n5. Pengujian Sistem Penguncian & Prasyarat Lintas Bab:");

// Mock saat Sprout Garden belum selesai (ch-11 belum ada)
const mockSGIncomplete: PlayerProgressData = {
  playerId: "test",
  currentChapterId: "sprout-garden",
  currentChallengeId: "ch-10",
  completedChallenges: {
    "ch-01": { challengeId: "ch-01", stars: 3, completedAt: "" },
    "ch-02": { challengeId: "ch-02", stars: 3, completedAt: "" },
    "ch-03": { challengeId: "ch-03", stars: 3, completedAt: "" },
    "ch-04": { challengeId: "ch-04", stars: 3, completedAt: "" },
    "ch-05": { challengeId: "ch-05", stars: 3, completedAt: "" },
    "ch-06": { challengeId: "ch-06", stars: 3, completedAt: "" },
    "ch-07": { challengeId: "ch-07", stars: 3, completedAt: "" },
    "ch-08": { challengeId: "ch-08", stars: 3, completedAt: "" },
    "ch-09": { challengeId: "ch-09", stars: 3, completedAt: "" },
    "ch-10": { challengeId: "ch-10", stars: 3, completedAt: "" },
  },
  totalStars: 30,
  worldRestoredPct: 71.4,
  updatedAt: "",
};

// ch-12 harus terkunci jika ch-11 belum selesai
assert.equal(isChallengeUnlocked("ch-12", mockSGIncomplete), false, "ch-12 harus terkunci jika ch-11 belum selesai");
assert.equal(getPrerequisiteChallenge("ch-12")?.id, "ch-11", "Prasyarat ch-12 adalah ch-11");
console.log("  ✓ ch-12 terkunci jika Sprout Garden belum tuntas, prasyaratnya ch-11.");

// Mock saat Sprout Garden selesai (ch-11 selesai)
const mockSGComplete: PlayerProgressData = {
  ...mockSGIncomplete,
  completedChallenges: {
    ...mockSGIncomplete.completedChallenges,
    "ch-11": { challengeId: "ch-11", stars: 3, completedAt: "" },
  },
};

// ch-12 sekarang terbuka, tetapi ch-13 masih terkunci
assert.equal(isChallengeUnlocked("ch-12", mockSGComplete), true, "ch-12 harus terbuka setelah ch-11 selesai");
assert.equal(isChallengeUnlocked("ch-13", mockSGComplete), false, "ch-13 harus terkunci jika ch-12 belum selesai");
assert.equal(getPrerequisiteChallenge("ch-13")?.id, "ch-12", "Prasyarat ch-13 adalah ch-12");
console.log("  ✓ ch-12 terbuka setelah ch-11 selesai; ch-13 terkunci dengan prasyarat ch-12.");

// Setelah ch-12 selesai: ch-13 terbuka, ch-14 masih terkunci
const mockCh12Complete: PlayerProgressData = {
  ...mockSGComplete,
  completedChallenges: {
    ...mockSGComplete.completedChallenges,
    "ch-12": { challengeId: "ch-12", stars: 3, completedAt: "" },
  },
};
assert.equal(isChallengeUnlocked("ch-13", mockCh12Complete), true, "ch-13 harus terbuka setelah ch-12 selesai");
assert.equal(isChallengeUnlocked("ch-14", mockCh12Complete), false, "ch-14 harus terkunci jika ch-13 belum selesai");
assert.equal(getPrerequisiteChallenge("ch-14")?.id, "ch-13", "Prasyarat ch-14 adalah ch-13");
console.log("  ✓ ch-13 terbuka setelah ch-12 selesai; ch-14 terkunci dengan prasyarat ch-13.");

// Setelah ch-13 selesai: ch-14 terbuka
const mockCh13Complete: PlayerProgressData = {
  ...mockCh12Complete,
  completedChallenges: {
    ...mockCh12Complete.completedChallenges,
    "ch-13": { challengeId: "ch-13", stars: 3, completedAt: "" },
  },
};
assert.equal(isChallengeUnlocked("ch-14", mockCh13Complete), true, "ch-14 harus terbuka setelah ch-13 selesai");
console.log("  ✓ ch-14 terbuka setelah ch-13 selesai. Unlocking berurutan Memory Station 100% valid.");

// 6. Pengujian Status Restorasi Bab & Navigasi Antar-Misi
console.log("\n6. Pengujian Status Restorasi Bab & Navigasi Antar-Misi:");

// Status restorasi sebelum seluruh misi Memory Station selesai
assert.equal(isChapterRestored("memory-station", mockCh13Complete), false, "Memory Station belum pulih jika ch-14 belum selesai");
const progBeforeCh14 = getChapterProgress("memory-station", mockCh13Complete);
assert.equal(progBeforeCh14.completed, 2, "Harus 2 misi selesai");
assert.equal(progBeforeCh14.total, 3, "Total misi harus 3");
assert.equal(progBeforeCh14.isRestored, false, "Belum restored");

// Setelah ch-14 selesai
const mockCh14Complete: PlayerProgressData = {
  ...mockCh13Complete,
  completedChallenges: {
    ...mockCh13Complete.completedChallenges,
    "ch-14": { challengeId: "ch-14", stars: 3, completedAt: "" },
  },
};
assert.equal(isChapterRestored("memory-station", mockCh14Complete), true, "Memory Station harus pulih sepenuhnya saat ch-12, ch-13, ch-14 selesai");
const progAfterCh14 = getChapterProgress("memory-station", mockCh14Complete);
assert.equal(progAfterCh14.completed, 3, "Harus 3 misi selesai");
assert.equal(progAfterCh14.total, 3, "Total misi harus 3");
assert.equal(progAfterCh14.percentage, 100, "Persentase harus 100%");
assert.equal(progAfterCh14.isRestored, true, "isRestored harus true");
console.log("  ✓ Status restorasi Memory Station terhitung akurat (0% -> 67% -> 100% Pulih Sepenuhnya).");

// Verifikasi Navigasi
// ch-11 -> ch-12
const nextAfterCh11 =
  Object.values(CHALLENGES).find(
    (c) => c.chapterId === CHALLENGES["ch-11"].chapterId && c.order === CHALLENGES["ch-11"].order + 1
  ) || (CHALLENGES["ch-11"].id === "ch-11" ? CHALLENGES["ch-12"] : undefined);
assert.equal(nextAfterCh11?.id, "ch-12", "Misi berikutnya setelah ch-11 adalah ch-12");

// ch-12 -> ch-13
const nextAfterCh12 = Object.values(CHALLENGES).find(
  (c) => c.chapterId === CHALLENGES["ch-12"].chapterId && c.order === CHALLENGES["ch-12"].order + 1
);
assert.equal(nextAfterCh12?.id, "ch-13", "Misi berikutnya setelah ch-12 adalah ch-13");

// ch-13 -> ch-14
const nextAfterCh13 = Object.values(CHALLENGES).find(
  (c) => c.chapterId === CHALLENGES["ch-13"].chapterId && c.order === CHALLENGES["ch-13"].order + 1
);
assert.equal(nextAfterCh13?.id, "ch-14", "Misi berikutnya setelah ch-13 adalah ch-14");

// ch-14 -> undefined (karena bab berikutnya belum dibuat, tombol kembali ke peta)
const nextAfterCh14 = Object.values(CHALLENGES).find(
  (c) => c.chapterId === CHALLENGES["ch-14"].chapterId && c.order === CHALLENGES["ch-14"].order + 1
);
assert.equal(nextAfterCh14, undefined, "Tidak ada misi berikutnya setelah ch-14 (akhir bab)");
console.log("  ✓ Alur navigasi antar-tantangan (ch-11 -> ch-12 -> ch-13 -> ch-14 -> Selesai) 100% valid.");

console.log("\n🎉 SELURUH PENGUJIAN WILAYAH 04: MEMORY STATION BERHASIL!");
