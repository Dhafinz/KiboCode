import { ChapterId, ConceptType } from "@/types";

export type BlockType =
  | "MOVE"
  | "ACTIVATE"
  | "IF_GATE"
  | "IF_BRIDGE"
  | "WATER"
  | "REPEAT_2"
  | "REPEAT_3"
  | "END_LOOP";

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
    label: "Nyalakan Lampu / Aktifkan",
    keyword: "ACTIVATE",
    icon: "💡",
    color: "#00f2fe",
    description: "Mengaktifkan saklar sistem, tiang lampu, atau pompa pengairan.",
  },
  IF_GATE: {
    type: "IF_GATE",
    label: "Jika Tertutup: Buka Gerbang",
    keyword: "IF_GATE",
    icon: "🚪",
    color: "#f59e0b",
    description: "Jika Kibo di depan gerbang tertutup, buka gerbang agar bisa lewat.",
  },
  IF_BRIDGE: {
    type: "IF_BRIDGE",
    label: "Jika Terputus: Hubungkan Jembatan",
    keyword: "IF_BRIDGE",
    icon: "🌉",
    color: "#0ea5e9",
    description: "Jika Kibo di depan jembatan energi yang terputus, hubungkan jembatan agar aman diseberangi.",
  },
  WATER: {
    type: "WATER",
    label: "Siram Tanaman",
    keyword: "WATER",
    icon: "💧",
    color: "#06b6d4",
    description: "Menyiram tunas atau bunga digital agar mekar dan tumbuh segar.",
  },
  REPEAT_2: {
    type: "REPEAT_2",
    label: "Ulangi 2 Kali",
    keyword: "REPEAT_2",
    icon: "🔁",
    color: "#10b981",
    description: "Mengulang blok instruksi di dalamnya sebanyak 2 kali.",
  },
  REPEAT_3: {
    type: "REPEAT_3",
    label: "Ulangi 3 Kali",
    keyword: "REPEAT_3",
    icon: "🔄",
    color: "#059669",
    description: "Mengulang blok instruksi di dalamnya sebanyak 3 kali.",
  },
  END_LOOP: {
    type: "END_LOOP",
    label: "Akhir Pengulangan",
    keyword: "END_LOOP",
    icon: "⏹️",
    color: "#047857",
    description: "Menandai batas akhir dari blok pengulangan (loop).",
  },
};

export type TargetType =
  | "lamp"
  | "generator"
  | "crystal"
  | "gate"
  | "bridge"
  | "sprout"
  | "flower"
  | "fountain";

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
  lampPosition?: number; // Posisi tiang lampu utama (kompatibilitas)
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
  "ch-06": {
    id: "ch-06",
    chapterId: "gate-valley",
    order: 1,
    title: "Gerbang Penjaga (Guardian Gate)",
    concept: "condition",
    conceptLabel: "Kondisi Tunggal (Single IF)",
    story:
      "Kibo tiba di pintu masuk Gate Valley! Sebuah Gerbang Penjaga kuno mengunci jalan masuk lembah karena glitch sistem. Kibo harus memeriksa kondisi gerbang, membukanya dengan perintah IF_GATE, lalu melangkah ke Totem Lembah untuk menyalakannya!",
    goal: "Pandu Kibo maju ke Petak 2 di depan Gerbang Penjaga, buka gerbang dengan perintah IF_GATE, lalu lanjutkan langkah ke Petak 4 untuk mengaktifkan Totem Lembah.",
    availableBlocks: ["MOVE", "IF_GATE", "ACTIVATE"],
    maxBlocks: 8,
    optimalBlocks: 5,
    gridTiles: 4,
    startPosition: 0,
    lampPosition: 3,
    targets: [
      {
        id: "guardian-gate",
        type: "gate",
        position: 1,
        label: "GERBANG PENJAGA",
        required: true,
        activationMessage:
          "Kondisi diperiksa: Gerbang Penjaga tertutup! Sensor merespons dan gerbang kini terbuka! Selamat datang di Gate Valley!",
      },
      {
        id: "valley-totem",
        type: "crystal",
        position: 3,
        label: "TOTEM LEMBAH",
        required: true,
        activationMessage:
          "Totem Kristal Lembah bersinar terang! Gerbang pertama Gate Valley berhasil dipulihkan!",
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Gerbang Penjaga berada tepat di Petak 2. Mengapa Kibo tidak bisa langsung melangkah ke Petak 3 tanpa membuka gerbang terlebih dahulu?",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Maju 1 langkah ke Petak 2 tepat di depan gerbang. Setelah gerbang terbuka, Kibo perlu melangkah 2 kali lagi menuju Totem Lembah di Petak 4.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Konsep IF-THEN: Gunakan blok 'Jika Tertutup: Buka Gerbang' saat Kibo berdiri di depan gerbang sebelum melanjutkan perjalanan.",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan lengkap 5 blok: MOVE → IF_GATE → MOVE → MOVE → ACTIVATE. Ayo pasang kelima blok ini lalu jalankan program!",
      },
    ],
  },
  "ch-07": {
    id: "ch-07",
    chapterId: "gate-valley",
    order: 2,
    title: "Jembatan Energi (Energy Bridge)",
    concept: "condition",
    conceptLabel: "Pilihan Kondisi (Condition Action)",
    story:
      "Sebuah jurang plasma digital membelah jalanan Gate Valley! Di Petak 3, Jembatan Energi tampak terputus dan berbahaya untuk dilangkahi. Kibo harus mengenali rintangan jembatan dan memilih perintah kondisi yang tepat untuk menghubungkan aliran energi jembatan sebelum menyeberang ke Stasiun Daya!",
    goal: "Pandu Kibo ke Petak 3 di depan jembatan energi yang terputus, hubungkan jembatan dengan IF_BRIDGE, lalu seberangi celah menuju Petak 5 untuk menyalakan Stasiun Daya Lembah.",
    availableBlocks: ["MOVE", "IF_GATE", "IF_BRIDGE", "ACTIVATE"],
    maxBlocks: 10,
    optimalBlocks: 6,
    gridTiles: 5,
    startPosition: 0,
    lampPosition: 4,
    targets: [
      {
        id: "energy-bridge",
        type: "bridge",
        position: 2,
        label: "JEMBATAN ENERGI",
        required: true,
        activationMessage:
          "Kondisi diperiksa: Jembatan energi terputus! Aliran daya plasma terhubung dan jembatan kini kokoh diseberangi! ⚡",
      },
      {
        id: "valley-power",
        type: "generator",
        position: 4,
        label: "STASIUN DAYA",
        required: true,
        activationMessage:
          "Stasiun Daya Lembah diaktifkan! Gelombang energi mengalir ke seluruh Gate Valley!",
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Perhatikan rintangan di Petak 3. Ini adalah Jembatan Energi yang terputus, bukan Gerbang! Blok kondisi mana yang cocok?",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Kibo harus melangkah 2 kali dengan MOVE ke Petak 3 di depan celah jembatan, lalu menghubungkan jembatan sebelum melangkah 2 kali lagi ke Petak 5.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Memilih Kondisi yang Tepat: Gunakan blok 'Jika Terputus: Hubungkan Jembatan' (IF_BRIDGE). Jangan keliru menggunakan blok gerbang ya!",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan lengkap 6 blok: MOVE → MOVE → IF_BRIDGE → MOVE → MOVE → ACTIVATE. Ayo pasang dan sambungkan jembatan energi!",
      },
    ],
  },
  "ch-08": {
    id: "ch-08",
    chapterId: "gate-valley",
    order: 3,
    title: "Persimpangan Lembah (Valley Crossroads)",
    concept: "condition",
    conceptLabel: "Logika Multi-Kondisi (Multi-Condition Logic)",
    story:
      "Tantangan puncak di Gate Valley! Di Jalur Persimpangan Lembah, Kibo menghadapi dua rintangan berbeda secara berurutan: Gerbang Penjaga di Petak 2 dan Jembatan Energi di Petak 4. Kibo harus menerapkan logika kondisi yang sesuai pada setiap situasi agar dapat mencapai dan menyalakan Kristal Agung Lembah di Petak 6!",
    goal: "Atasi kedua rintangan secara adaptif: buka Gerbang Penjaga di Petak 2 dengan IF_GATE, hubungkan Jembatan Energi di Petak 4 dengan IF_BRIDGE, lalu aktifkan Kristal Agung Lembah di Petak 6.",
    availableBlocks: ["MOVE", "IF_GATE", "IF_BRIDGE", "ACTIVATE"],
    maxBlocks: 12,
    optimalBlocks: 8,
    gridTiles: 6,
    startPosition: 0,
    lampPosition: 5,
    targets: [
      {
        id: "crossroad-gate",
        type: "gate",
        position: 1,
        label: "GERBANG PENJAGA",
        required: true,
        activationMessage:
          "Gerbang Penjaga dibuka! Jalur persimpangan lembah mulai terbuka!",
      },
      {
        id: "crossroad-bridge",
        type: "bridge",
        position: 3,
        label: "JEMBATAN ENERGI",
        required: true,
        activationMessage:
          "Jembatan Energi terhubung! Lintasan menuju pelataran kristal aman diseberangi!",
      },
      {
        id: "master-crystal",
        type: "crystal",
        position: 5,
        label: "KRISTAL AGUNG",
        required: true,
        activationMessage:
          "Kristal Agung Gate Valley bersinar ungu benderang! Seluruh Gate Valley telah pulih seutuhnya! 🌟",
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Ada dua rintangan di jalur ini: Gerbang Penjaga di Petak 2 dan Jembatan Energi di Petak 4. Kibo harus menggunakan blok kondisi yang tepat untuk masing-masing rintangan.",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Maju ke Petak 2 dan buka gerbang. Maju 2 kali ke Petak 4 dan hubungkan jembatan. Lalu maju 2 kali lagi ke Petak 6 untuk menyalakan kristal agung.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Penerapan Multi-Kondisi: Gunakan IF_GATE saat di depan gerbang, dan gunakan IF_BRIDGE saat di depan jembatan. Lalu gunakan ACTIVATE di depan kristal.",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan lengkap 8 blok: MOVE → IF_GATE → MOVE → MOVE → IF_BRIDGE → MOVE → MOVE → ACTIVATE. Ayo pasang dan pulihkan Gate Valley!",
      },
    ],
  },
  "ch-09": {
    id: "ch-09",
    chapterId: "sprout-garden",
    order: 1,
    title: "Tunas Pertama (First Sprout)",
    concept: "loop",
    conceptLabel: "Loop (Pengulangan Sederhana)",
    story:
      "Selamat datang di Sprout Garden! Saluran air otomatis terputus dan tunas-tunas digital di kebun mulai layu. Bantu Kibo menyiram 3 tunas berturut-turut menggunakan blok pengulangan (loop) agar tidak perlu menyusun langkah yang sama berulang kali!",
    goal: "Gunakan blok Loop untuk mengulang gerakan maju dan menyiram 3 tunas secara efisien.",
    gridTiles: 4,
    startPosition: 0,
    lampPosition: 3,
    optimalBlocks: 4,
    maxBlocks: 8,
    availableBlocks: ["MOVE", "WATER", "REPEAT_3", "END_LOOP"],
    targets: [
      {
        id: "sprout-1",
        type: "sprout",
        position: 1,
        label: "TUNAS HIJAU 1",
        required: true,
        activationMessage: "Tunas pertama disiram dan mulai bersemi segar! 🌱",
      },
      {
        id: "sprout-2",
        type: "sprout",
        position: 2,
        label: "TUNAS HIJAU 2",
        required: true,
        activationMessage: "Tunas kedua disiram dan daun mudanya mekar! 🌿",
      },
      {
        id: "sprout-3",
        type: "sprout",
        position: 3,
        label: "TUNAS HIJAU 3",
        required: true,
        activationMessage:
          "Tunas ketiga disiram dan mekar indah! Ketiga tunas di petak kebun telah pulih! 🌸",
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Perhatikan polanya: ada 3 tunas di Petak 2, 3, dan 4 yang perlu disiram secara berurutan. Jangan tulis perintah secara manual berulang-ulang jika bisa diulang!",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Untuk setiap tunas, polanya adalah Maju 1 Langkah lalu Siram Tanaman. Pola [Maju → Siram] ini perlu diulang sebanyak 3 kali.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Konsep Pengulangan (Loop): Pasang blok Ulangi 3 Kali, masukkan Maju dan Siram di dalamnya, lalu akhiri dengan Akhir Pengulangan.",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan 4 blok optimal: REPEAT_3 → MOVE → WATER → END_LOOP. Pasang blok ini untuk mendapatkan 3 bintang penuh!",
      },
    ],
  },
  "ch-10": {
    id: "ch-10",
    chapterId: "sprout-garden",
    order: 2,
    title: "Kebun Berbaris (Garden Rows)",
    concept: "loop",
    conceptLabel: "Sequence & Loop (Kombinasi Urutan & Loop)",
    story:
      "Di kebun berbaris, Kibo harus melintasi jalan setapak terlebih dahulu sebelum mencapai barisan bunga mawar digital. Setelah menyiram ketiga baris bunga, Kibo harus mengaktifkan Katup Pengairan Utama di ujung kebun!",
    goal: "Gabungkan langkah persiapan, blok loop untuk menyiram bunga berbaris, dan langkah aktivasi katup di akhir jalur.",
    gridTiles: 6,
    startPosition: 0,
    lampPosition: 5,
    optimalBlocks: 7,
    maxBlocks: 10,
    availableBlocks: ["MOVE", "WATER", "REPEAT_3", "END_LOOP", "ACTIVATE"],
    targets: [
      {
        id: "flower-1",
        type: "flower",
        position: 2,
        label: "BUNGA BARIS 1",
        required: true,
        activationMessage:
          "Bunga baris pertama disiram dan kelopaknya mekar merah merekah! 🌷",
      },
      {
        id: "flower-2",
        type: "flower",
        position: 3,
        label: "BUNGA BARIS 2",
        required: true,
        activationMessage:
          "Bunga baris kedua disiram dan harum segar semerbak! 🌷",
      },
      {
        id: "flower-3",
        type: "flower",
        position: 4,
        label: "BUNGA BARIS 3",
        required: true,
        activationMessage:
          "Bunga baris ketiga mekar sempurna! Seluruh barisan bunga telah segar! 🌷",
      },
      {
        id: "garden-pump",
        type: "fountain",
        position: 5,
        label: "KATUP PENGAIRAN",
        required: true,
        activationMessage:
          "Katup Pengairan Utama terbuka! Air segar mengalir deras ke seluruh saluran kebun berbaris! 🌊",
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Petak 2 adalah jalan setapak kosong. Tiga bunga berbaris di Petak 3, 4, dan 5. Di Petak 6 ada Katup Pengairan Utama yang harus diaktifkan.",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Maju dulu 1 langkah ke Petak 2 di luar loop. Lalu gunakan blok Ulangi 3 Kali untuk [Maju → Siram]. Terakhir, di luar loop maju ke Petak 6 dan aktifkan Katup Pengairan.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Kombinasi Urutan & Loop: Letakkan aksi yang tidak berulang di luar blok loop, dan masukkan pola yang berulang ke dalam blok loop.",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan 7 blok optimal: MOVE → REPEAT_3 → MOVE → WATER → END_LOOP → MOVE → ACTIVATE. Ayo pasang dan buktikan efisiensinya!",
      },
    ],
  },
  "ch-11": {
    id: "ch-11",
    chapterId: "sprout-garden",
    order: 3,
    title: "Festival Bunga (Flower Festival)",
    concept: "loop",
    conceptLabel: "Compound Loop (Pola Majemuk & Air Mancur Megah)",
    story:
      "Puncak perayaan di Sprout Garden adalah Festival Bunga! Terdapat dua blok taman bunga kembar yang luas dan Air Mancur Megah di alun-alun. Rawat seluruh bunga dengan pola berulang majemuk, lalu nyalakan Air Mancur Megah untuk memulihkan seluruh Sprout Garden!",
    goal: "Gunakan pengulangan 2 kali untuk merawat sepasang bunga di tiap blok taman, lalu aktifkan Air Mancur Megah di garis akhir.",
    gridTiles: 6,
    startPosition: 0,
    lampPosition: 5,
    optimalBlocks: 8,
    maxBlocks: 12,
    availableBlocks: ["MOVE", "WATER", "REPEAT_2", "END_LOOP", "ACTIVATE"],
    targets: [
      {
        id: "fest-flower-1",
        type: "flower",
        position: 1,
        label: "BUNGA TAMAN A1",
        required: true,
        activationMessage: "Bunga Melati Taman A mekar benderang! 🌸",
      },
      {
        id: "fest-flower-2",
        type: "flower",
        position: 2,
        label: "BUNGA TAMAN A2",
        required: true,
        activationMessage: "Bunga Mawar Taman A bermekaran megah! 🌺",
      },
      {
        id: "fest-flower-3",
        type: "flower",
        position: 3,
        label: "BUNGA TAMAN B1",
        required: true,
        activationMessage: "Bunga Melati Taman B mekar benderang! 🌸",
      },
      {
        id: "fest-flower-4",
        type: "flower",
        position: 4,
        label: "BUNGA TAMAN B2",
        required: true,
        activationMessage: "Bunga Mawar Taman B bermekaran megah! 🌺",
      },
      {
        id: "grand-fountain",
        type: "fountain",
        position: 5,
        label: "AIR MANCUR MEGAH",
        required: true,
        activationMessage:
          "Air Mancur Megah menyemburkan pelangi air yang indah! Seluruh Sprout Garden telah pulih seutuhnya! ⛲🌈",
      },
    ],
    hints: [
      {
        level: 1,
        title: "Level 1: Berpikir (Thinking)",
        text: "Festival bunga memiliki 2 taman kembar: Taman A (Petak 2 & 3) dan Taman B (Petak 4 & 5). Pola merawat dua bunga berturut-turut ini berulang sebanyak 2 kali!",
      },
      {
        level: 2,
        title: "Level 2: Arah (Direction)",
        text: "Untuk setiap taman kembar, polanya adalah Maju → Siram → Maju → Siram. Gunakan blok Ulangi 2 Kali untuk pola ini, lalu maju ke Air Mancur di Petak 6 dan aktifkan.",
      },
      {
        level: 3,
        title: "Level 3: Konsep (Concept)",
        text: "Pola Majemuk dalam Loop: Loop tidak hanya mengulang 1 instruksi, tapi bisa mengulang serangkaian langkah: REPEAT_2 → [MOVE, WATER, MOVE, WATER] → END_LOOP.",
      },
      {
        level: 4,
        title: "Level 4: Solusi Terpandu (Guided Solution)",
        text: "Urutan 8 blok optimal: REPEAT_2 → MOVE → WATER → MOVE → WATER → END_LOOP → MOVE → ACTIVATE. Ayo pulihkan Sprout Garden seutuhnya!",
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
