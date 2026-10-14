# Kibo — Learning Content Specification

## 1. Content Structure

MVP:
- 5 chapters
- 15 challenges total (didistribusikan dalam format 5–3–3–3–1 sesuai kurva kesulitan bertahap untuk anak SD)

Difficulty increases gradually.

## 2. Chapter 1 — Lumina Town

**Concept:** Sequence

Story:
A System Glitch caused the lights in Lumina Town to lose their instructions.

### Challenge 01 — Lampu Pertama (First Light)
Goal:
Susun instruksi agar Kibo berjalan ke depan tiang lampu (2 langkah) lalu aktifkan lampu.

Main concept:
Urutan Langkah (Sequence).

### Challenge 02 — Terangi Jalanan (Light the Street)
Goal:
Susun instruksi agar Kibo menyalakan lampu pertama di petak 2, lalu maju ke petak 4 untuk menyalakan lampu kedua.

Main concept:
Urutan Panjang (Multi-Target Sequence).

### Challenge 03 — Jalan Malam (Night Walk)
Goal:
Pandu Kibo menyusuri jalan malam: nyalakan Lentera Jalur di petak 3, lalu lanjutkan perjalanan untuk menyalakan Menara Cahaya di petak 5.

Main concept:
Sequence Lanjutan (Jalur Panjang).

### Challenge 04 — Gerbang Pintar (Smart Gate)
Goal:
Pandu Kibo ke depan Gerbang Pintar di petak 3, buka gerbang dengan perintah IF_GATE, lalu maju ke petak 4 untuk menyalakan Menara Cahaya.

Main concept:
Kondisi Logika Dasar (IF–THEN).

### Challenge 05 — Harmoni Cahaya (Festival of Lights)
Goal:
Pandu Kibo menyusuri 6 petak: aktifkan Relay Daya di petak 2, Lentera Taman di petak 4, dan Kristal Cahaya Agung di petak 6.

Main concept:
Rangkaian Penuh Lumina Town (Grand Sequence).

## 3. Chapter 2 — Gate Valley

**Concept:** Condition

Story:
The gates and energy bridges in the valley no longer know when they should open or connect.

### Challenge 06 — Gerbang Penjaga (Guardian Gate)
Goal:
Pandu Kibo maju ke Petak 2 di depan Gerbang Penjaga, buka gerbang dengan perintah IF_GATE, lalu lanjutkan langkah ke Petak 4 untuk mengaktifkan Totem Lembah.

Main concept:
Kondisi Tunggal (Single IF).

### Challenge 07 — Jembatan Energi (Energy Bridge)
Goal:
Pandu Kibo ke Petak 3 di depan jembatan energi yang terputus, hubungkan jembatan dengan IF_BRIDGE, lalu seberangi celah menuju Petak 5 untuk menyalakan Stasiun Daya Lembah.

Main concept:
Pilihan Kondisi (Condition Action — IF_BRIDGE vs IF_GATE).

### Challenge 08 — Persimpangan Lembah (Valley Crossroads)
Goal:
Atasi kedua rintangan secara adaptif: buka Gerbang Penjaga di Petak 2 dengan IF_GATE, hubungkan Jembatan Energi di Petak 4 dengan IF_BRIDGE, lalu aktifkan Kristal Agung Lembah di Petak 6.

Main concept:
Logika Multi-Kondisi (Multi-Condition Sequential Logic).

## 4. Chapter 3 — Sprout Garden

**Concept:** Loop

Story:
The digital garden stopped growing because the watering system lost its instructions.

### Challenge 09 — Tunas Pertama (First Sprout)
Goal:
Gunakan blok Loop untuk mengulang gerakan maju dan menyiram 3 tunas secara efisien.

Main concept:
Loop (Pengulangan Sederhana — REPEAT_3).

### Challenge 10 — Kebun Berbaris (Garden Rows)
Goal:
Gabungkan langkah persiapan, blok loop untuk menyiram bunga berbaris, dan langkah aktivasi katup di akhir jalur.

Main concept:
Sequence & Loop (Kombinasi Urutan Langkah & Pengulangan).

### Challenge 11 — Festival Bunga (Flower Festival)
Goal:
Gunakan pengulangan 2 kali untuk merawat sepasang bunga di tiap blok taman, lalu aktifkan Air Mancur Megah di garis akhir.

Main concept:
Compound Loop (Pola Pengulangan Majemuk & Air Mancur Megah).

## 5. Chapter 4 — Memory Station

**Concept:** Variable

Story:
The memory station lost important values needed by Kibo World.

### Challenge 12 — Kotak Memori Pertama (Save the Data)
Goal:
Simpan nilai 3 ke Kotak Memori Kibo, lalu melangkah ke Terminal Data Alpha dan salurkan nilainya menggunakan blok Gunakan Nilai Data.

Main concept:
Variable (Penyimpanan Nilai — SET).

### Challenge 13 — Kirimkan Nilai Data (Use the Data)
Goal:
Simpan nilai 5 ke dalam memori, lalu gunakan blok Gunakan Nilai Data tepat di depan Reaktor Memori.

Main concept:
Variable (Penyaluran Nilai — SET + USE).

### Challenge 14 — Sinkronisasi Dua Nilai (Data Delivery & Update)
Goal:
Simpan nilai 2 untuk Konsol Alpha di Petak 3, lalu perbarui isi memori dengan nilai 4 untuk Kubah Memori di Petak 6.

Main concept:
Variable (Pembaruan Nilai Berurutan).

## 6. Chapter 5 — Kibo Core

**Concept:** Problem Solving

Story:
Kibo reaches the center of the damaged world. The final system requires combining everything learned.

### Challenge 15 — Inti Kibo (The Kibo Core)
Final grand finale challenge.

Concept:
Problem Solving (Sequence + Condition + Loop + Variable).

Goal:
Simpan kode 5 ke Kotak Memori, buka Gerbang Keamanan dengan IF_GATE, percepat langkah melintasi 6 petak koridor dengan blok pengulangan REPEAT_3, lalu salurkan energi data ke Altar Inti Kibo untuk memulihkan seluruh Kibo World.

## 7. Content Principles

Each challenge must:
- have a clear goal,
- introduce or reinforce one main concept,
- provide visible cause-and-effect,
- be solvable using the available blocks,
- allow retry,
- produce useful failure feedback,
- avoid unnecessary text.

## 8. Difficulty Progression

Progression should move from:
1. simple ordered actions,
2. longer sequences,
3. basic decisions,
4. repeated actions,
5. stored values,
6. combined problem solving.

Do not make early challenges unnecessarily difficult.

## 9. Language

Use simple Bahasa Indonesia.

Avoid complicated explanations.

Block names remain English:
MOVE, TURN, IF, ELSE, REPEAT, etc.

## 10. Reward

Each completed challenge gives stars based on mastery/support.

No punitive loss of progress.

No coins, shop, lootbox, gacha, inventory, or leaderboard.
