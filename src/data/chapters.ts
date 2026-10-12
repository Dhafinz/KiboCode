import { ChapterId, ConceptType } from "@/types";

export interface Chapter {
  id: ChapterId;
  order: number;
  title: string;
  concept: ConceptType;
  conceptLabel: string;
  description: string;
  totalChallenges: number;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "lumina-town",
    order: 1,
    title: "Lumina Town",
    concept: "sequence",
    conceptLabel: "Sequence (Urutan Langkah)",
    description: "Perbaiki sistem lampu kota yang kehilangan instruksi langkah demi langkah.",
    totalChallenges: 5,
  },
  {
    id: "gate-valley",
    order: 2,
    title: "Gate Valley",
    concept: "condition",
    conceptLabel: "Condition (Kondisi IF/ELSE)",
    description: "Bantu gerbang lembah mengenali kapan harus membuka dan menutup.",
    totalChallenges: 3,
  },
  {
    id: "sprout-garden",
    order: 3,
    title: "Sprout Garden",
    concept: "loop",
    conceptLabel: "Loop (Pengulangan)",
    description: "Pulihkan sistem pengairan otomatis dengan pengulangan aksi efisien.",
    totalChallenges: 3,
  },
  {
    id: "memory-station",
    order: 4,
    title: "Memory Station",
    concept: "variable",
    conceptLabel: "Variable (Variabel & Nilai)",
    description: "Simpan dan gunakan kembali nilai data yang dibutuhkan dunia digital.",
    totalChallenges: 3,
  },
  {
    id: "kibo-core",
    order: 5,
    title: "Kibo Core",
    concept: "problem-solving",
    conceptLabel: "Problem Solving (Kombinasi Logika)",
    description: "Pusat Kibo World, gabungkan seluruh konsep untuk reaktivasi Kibo Core.",
    totalChallenges: 5,
  },
];
