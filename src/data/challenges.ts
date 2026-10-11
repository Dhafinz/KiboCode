import { ChapterId, ConceptType } from "@/types";

export type BlockType = "MOVE" | "ACTIVATE" | "IF_GATE";

export interface BlockConfig {
  type: BlockType;
  label: string;
  keyword: string;
  icon: string;
  color: string;
  description: string;
}

export const AVAILABLE_BLOCK_CONFIGS: Record<BlockType, BlockConfig> = {
  MOVE: {
    type: "MOVE",
    label: "Maju 1 Langkah",
    keyword: "MOVE",
    icon: "👣",
    color: "#7948f7",
    description: "Kibo melangkah 1 petak ke depan di jalur digital.",
  },
  ACTIVATE: {
    type: "ACTIVATE",
    label: "Nyalakan Lampu",
    keyword: "ACTIVATE",
    icon: "💡",
    color: "#00f2fe",
    description: "Mengaktifkan saklar sistem untuk menghidupkan lampu jalan.",
  },
  IF_GATE: {
    type: "IF_GATE",
    label: "Jika Tertutup: Buka Gerbang",
    keyword: "IF_GATE",
    icon: "🚪",
    color: "#f59e0b",
    description: "Jika Kibo di depan gerbang tertutup, buka gerbang agar bisa lewat.",
  },
};

export type TargetType = "lamp" | "generator" | "crystal" | "gate";

export interface ChallengeTarget {
  id: string;
  type: TargetType;
  position: number;
  label?: string;
  required: boolean;
  dependsOn?: string;
  prerequisiteMessage?: string;
  activationMessage?: string;
}

export interface ChallengeDetail {
  id: string;
  chapterId: ChapterId;
  order: number;
  title: string;
  concept: ConceptType;
  conceptLabel: string;
  story: string;
  goal: string;
  availableBlocks: BlockType[];
  maxBlocks: number;
  optimalBlocks: number; // Jumlah blok ideal untuk 3 bintang
  // Layout dunia simulasi
  gridTiles: number; // Jumlah petak jalur (misal 3, 4, 5...)
  startPosition: number; // Posisi awal Kibo
  lampPosition: number; // Posisi tiang lampu utama (kompatibilitas)
  targets: ChallengeTarget[]; // Daftar target objektif pada petak
  // Petunjuk bertahap (Progressive Hints sesuai docs/AI_RULES.md)
  hints: {
    level: 1 | 2 | 3 | 4;
    title: string;
    text: string;
  }[];
}

export const CHALLENGES: Record<string, ChallengeDetail> = {
  "ch-01": {
    id: "ch-01",
    chapterId: "lumina-town",
    order: 1,
    title: "Lampu Pertama (First Light)",
    concept: "sequence",
    conceptLabel: "Urutan Langkah (Sequence)",
    story:
      "Sebuah System Glitch membuat lampu jalan di gerbang Lumina Town kehilangan instruksinya dan padam. Kibo harus berjalan ke tiang lampu dan mengaktifkan saklarnya agar jalan kembali terang!",
    goal: "Susun instruksi agar Kibo berjalan ke depan tiang lampu (2 langkah) lalu aktifkan lampu.",
    availableBlocks: ["MOVE", "ACTIVATE"],
    maxBlocks: 6,
    optimalBlocks: 3,
    gridTiles: 3,
    startPosition: 0,
    lampPosition: 2,
    targets: [
      {
        id: "lamp-1",
        type: "lamp",
        position: 2,
        label: "TIANG LAMPU",
        required: true,
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Kibo berdiri di petak pertama dan tiang lampu ada di petak ketiga. Menurutmu, berapa langkah yang harus diambil Kibo?",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Kibo harus melangkah maju 2 kali dengan blok MOVE agar berdiri tepat di depan tiang lampu.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Setelah Kibo sampai di depan tiang lampu, gunakan blok ACTIVATE untuk menyalakan saklar lampu!",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan yang benar: MOVE → MOVE → ACTIVATE. Ayo pasang ketiga blok ini lalu tekan tombol Jalankan!",
      },
    ],
  },
  "ch-02": {
    id: "ch-02",
    chapterId: "lumina-town",
    order: 2,
    title: "Terangi Jalanan (Light the Street)",
    concept: "sequence",
    conceptLabel: "Urutan Panjang (Multi-Target)",
    story:
      "System Glitch telah memadamkan deretan lampu di jalanan Lumina Town! Kibo harus menyusuri jalur dan menyalakan dua tiang lampu secara berurutan agar jalanan kembali benderang.",
    goal: "Susun instruksi agar Kibo menyalakan lampu pertama di petak 2, lalu maju ke petak 4 untuk menyalakan lampu kedua.",
    availableBlocks: ["MOVE", "ACTIVATE"],
    maxBlocks: 8,
    optimalBlocks: 5,
    gridTiles: 4,
    startPosition: 0,
    lampPosition: 3,
    targets: [
      {
        id: "lamp-1",
        type: "lamp",
        position: 1,
        label: "LAMPU 1",
        required: true,
      },
      {
        id: "lamp-2",
        type: "lamp",
        position: 3,
        label: "LAMPU 2",
        required: true,
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Ada dua tiang lampu yang padam di jalan ini. Lampu mana yang paling dekat dengan posisi awal Kibo?",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Kibo perlu melangkah 1 kali ke petak 2 untuk menyalakan lampu pertama, lalu melangkah lagi menuju lampu kedua di petak 4.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Gunakan blok ACTIVATE setiap kali Kibo berdiri tepat di depan tiang lampu sebelum melanjutkan perjalanan.",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan lengkap 5 blok: MOVE → ACTIVATE → MOVE → MOVE → ACTIVATE. Ayo pasang kelima blok ini lalu tekan Jalankan!",
      },
    ],
  },
  "ch-03": {
    id: "ch-03",
    chapterId: "lumina-town",
    order: 3,
    title: "Jalan Malam (Night Walk)",
    concept: "sequence",
    conceptLabel: "Sequence Lanjutan (Jalur Panjang)",
    story:
      "Malam semakin larut di Lumina Town. Untuk memulihkan seluruh sistem pencahayaan kota, Kibo harus menyusuri jalur malam yang lebih panjang: nyalakan lentera pemandu di tengah jalan, lalu lanjutkan hingga ke Menara Cahaya Utama di ujung kota!",
    goal: "Pandu Kibo menyusuri jalan malam: nyalakan Lentera Jalur di petak 3, lalu lanjutkan perjalanan untuk menyalakan Menara Cahaya di petak 5.",
    availableBlocks: ["MOVE", "ACTIVATE"],
    maxBlocks: 8,
    optimalBlocks: 6,
    gridTiles: 5,
    startPosition: 0,
    lampPosition: 4,
    targets: [
      {
        id: "lamp-mid",
        type: "lamp",
        position: 2,
        label: "LENTERA JALUR",
        required: true,
      },
      {
        id: "lamp-core",
        type: "lamp",
        position: 4,
        label: "MENARA CAHAYA",
        required: true,
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Jalur malam ini membentang 5 petak. Ada Lentera Jalur di petak 3 dan Menara Cahaya di petak 5.",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Kibo perlu melangkah 2 kali untuk sampai ke lentera pertama, nyalakan lampunya, lalu melangkah 2 kali lagi menuju Menara Cahaya.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Ingat prinsip urutan: setiap aksi harus disusun berurutan dari langkah maju, menyalakan lampu, hingga melangkah lagi.",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan lengkap 6 blok: MOVE → MOVE → ACTIVATE → MOVE → MOVE → ACTIVATE. Ayo pasang dan pulihkan Lumina Town!",
      },
    ],
  },
  "ch-04": {
    id: "ch-04",
    chapterId: "lumina-town",
    order: 4,
    title: "Gerbang Pintar (Smart Gate)",
    concept: "condition",
    conceptLabel: "Kondisi Logika (IF–THEN)",
    story:
      "Sebuah Gerbang Pintar digital menutup jalan menuju Menara Cahaya Barat! Gerbang ini terkunci dan tidak bisa dilewati kecuali Kibo memeriksa kondisinya dan memberi perintah buka gerbang. Bantu Kibo membuka gerbang lalu menyalakan Menara Cahaya!",
    goal: "Pandu Kibo ke depan Gerbang Pintar di petak 3, buka gerbang dengan perintah IF_GATE, lalu maju ke petak 4 untuk menyalakan Menara Cahaya.",
    availableBlocks: ["MOVE", "IF_GATE", "ACTIVATE"],
    maxBlocks: 8,
    optimalBlocks: 5,
    gridTiles: 4,
    startPosition: 0,
    lampPosition: 3,
    targets: [
      {
        id: "smart-gate",
        type: "gate",
        position: 2,
        label: "GERBANG PINTAR",
        required: true,
        activationMessage:
          "Kondisi diperiksa: Gerbang Pintar tertutup! Sensor merespons dan gerbang kini terbuka!",
      },
      {
        id: "lamp-west",
        type: "lamp",
        position: 3,
        label: "MENARA CAHAYA",
        required: true,
        activationMessage:
          "Menara Cahaya Barat berhasil dinyalakan! Jalanan kota kembali terang benderang!",
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Ada Gerbang Pintar di petak 3 yang menutup jalan. Apa yang terjadi jika Kibo langsung melangkah maju menabrak gerbang yang masih tertutup?",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Kibo harus melangkah 2 kali dengan blok MOVE agar berdiri tepat di depan Gerbang Pintar di petak 3 sebelum membuka pintu.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Konsep IF-THEN: Gunakan blok 'Jika Tertutup: Buka Gerbang' saat Kibo di depan gerbang. Setelah gerbang terbuka, Kibo bisa melangkah 1 kali lagi untuk menyalakan Menara Cahaya.",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan lengkap 5 blok: MOVE → MOVE → IF_GATE → MOVE → ACTIVATE. Ayo pasang kelimanya lalu tekan tombol Jalankan!",
      },
    ],
  },
  "ch-05": {
    id: "ch-05",
    chapterId: "lumina-town",
    order: 5,
    title: "Harmoni Cahaya (Festival of Lights)",
    concept: "sequence",
    conceptLabel: "Rangkaian Penuh Lumina Town (Grand Sequence)",
    story:
      "Saatnya memulihkan Lumina Town seutuhnya! Di Alun-Alun Utama, Kibo harus menyalakan Stasiun Relay Daya di petak 2, Lentera Taman di petak 4, dan Kristal Cahaya Agung di petak 6 untuk membuka jalan menuju Gate Valley!",
    goal: "Pandu Kibo menyusuri 6 petak: aktifkan Relay Daya di petak 2, Lentera Taman di petak 4, dan Kristal Cahaya Agung di petak 6.",
    availableBlocks: ["MOVE", "ACTIVATE"],
    maxBlocks: 12,
    optimalBlocks: 8,
    gridTiles: 6,
    startPosition: 0,
    lampPosition: 5,
    targets: [
      {
        id: "relay-station",
        type: "generator",
        position: 1,
        label: "RELAY DAYA",
        required: true,
        activationMessage:
          "Relay Daya aktif! Jaringan listrik alun-alun mulai tersambung!",
      },
      {
        id: "garden-lantern",
        type: "lamp",
        position: 3,
        label: "LENTERA TAMAN",
        required: true,
        dependsOn: "relay-station",
        prerequisiteMessage:
          "Lentera Taman belum mendapat sinyal daya! Kibo harus menyalakan Relay Daya di petak 2 terlebih dahulu.",
        activationMessage:
          "Lentera Taman memancarkan sinar hangat ke seluruh taman kota!",
      },
      {
        id: "grand-crystal",
        type: "crystal",
        position: 5,
        label: "KRISTAL AGUNG",
        required: true,
        dependsOn: "garden-lantern",
        prerequisiteMessage:
          "Kristal Cahaya Agung membutuhkan energi dari Lentera Taman! Pastikan Lentera Taman di petak 4 sudah menyala.",
        activationMessage:
          "Kristal Cahaya Agung bersinar megah! Lumina Town pulih seutuhnya!",
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Jalur Alun-Alun memiliki 6 petak dan 3 target berurutan. Perhatikan letak Relay Daya di petak 2, Lentera di petak 4, dan Kristal di petak 6.",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Maju 1 langkah ke petak 2 dan aktifkan relay, lalu maju 2 langkah ke petak 4 dan aktifkan lentera, lalu maju 2 langkah lagi ke petak 6 untuk kristal.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Pola ritme langkah Kibo sangat teratur: Maju → Aktifkan, lalu Maju 2x → Aktifkan, lalu Maju 2x → Aktifkan.",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan lengkap 8 blok: MOVE → ACTIVATE → MOVE → MOVE → ACTIVATE → MOVE → MOVE → ACTIVATE. Ayo selesaikan dan pulihkan Lumina Town!",
      },
    ],
  },
};

export function normalizeChallenge(challenge: ChallengeDetail): ChallengeDetail {
  const lampPos = challenge.lampPosition ?? (challenge.gridTiles - 1);
  const targets =
    challenge.targets && challenge.targets.length > 0
      ? challenge.targets
      : [
          {
            id: `target-${lampPos}`,
            type: "lamp" as const,
            position: lampPos,
            label: "TIANG LAMPU",
            required: true,
          },
        ];

  return {
    ...challenge,
    optimalBlocks: challenge.optimalBlocks ?? 3,
    startPosition: challenge.startPosition ?? 0,
    lampPosition: lampPos,
    targets,
  };
}

export function getChallengeById(id: string): ChallengeDetail | undefined {
  const challenge = CHALLENGES[id];
  if (!challenge) return undefined;
  return normalizeChallenge(challenge);
}
