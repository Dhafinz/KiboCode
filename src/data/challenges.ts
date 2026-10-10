import { ChapterId, ConceptType } from "@/types";

export type BlockType = "MOVE" | "ACTIVATE";

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
};

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
  // Layout dunia simulasi
  gridTiles: number; // Jumlah petak jalur (3 petak: 0, 1, 2)
  startPosition: number; // 0
  lampPosition: number; // 2
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
    gridTiles: 3,
    startPosition: 0,
    lampPosition: 2,
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
};

export function getChallengeById(id: string): ChallengeDetail | undefined {
  return CHALLENGES[id];
}
