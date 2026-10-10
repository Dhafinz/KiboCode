# KiboCode

> **"Learn to Code. Help Kibo. Solve Problems."**

KiboCode adalah platform web petualangan edukatif interaktif untuk anak sekolah dasar (SD) yang mengajarkan logika dasar pemrograman. Melalui visual block coding, anak-anak diajak berpikir komputasional langkah demi langkah untuk membantu **Kibo** memperbaiki dan memulihkan sistem yang rusak di **Kibo World**.

---

## Teknologi Utama

Proyek ini dibangun menggunakan stack modern yang ringan, stabil, dan terfokus untuk kebutuhan kompetisi edukasi:

- **Framework Web**: [Next.js](https://nextjs.org/) 16 (App Router)
- **UI Library**: [React](https://react.dev/) 19
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) 5
- **Styling**: Vanilla CSS dengan custom design tokens, tema petualangan digital *deep navy*, aksen neon cyan/purple, dan efek *glassmorphism* (Font: Plus Jakarta Sans)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) 6 dengan [SQLite](https://sqlite.org/) lokal (`prisma/dev.db`)

---

## Panduan Menjalankan Proyek Secara Lokal

### 1. Prasyarat

Pastikan Node.js (v20+ disarankan) dan npm sudah terpasang di sistem Anda.

### 2. Instalasi Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment

Salin berkas template environment:

```bash
cp .env.example .env
```

Pastikan variabel `DATABASE_URL` mengarah ke database SQLite lokal:

```env
DATABASE_URL="file:./dev.db"
```

### 4. Menjalankan Server Pengembangan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

### 5. Memeriksa Database (Prisma Studio)

Untuk menginspeksi tabel database lokal (seperti model `PlayerProgress`) secara visual di antarmuka web:

```bash
npx prisma studio
```

Prisma Studio akan terbuka di [http://localhost:5555](http://localhost:5555).

### 6. Perintah Pemeriksaan Kualitas & Build

Sesuai script yang terdaftar di `package.json`:

- **Typecheck**: `npm run typecheck` — Memeriksa tipe data TypeScript (`tsc --noEmit`).
- **Linting**: `npm run lint` — Memeriksa standar kode menggunakan ESLint.
- **Production Build**: `npm run build` — Melakukan kompilasi bundle produksi Next.js.
- **Production Run**: `npm run start` — Menjalankan server aplikasi bundle hasil build.

---

## Indeks Dokumentasi Proyek (`docs/`)

Seluruh dokumentasi produk dan arsitektur aktif tersentralisasi di dalam folder `docs/`:

1. **[`docs/PRD.md`](docs/PRD.md)** — *Product Requirements Document*: Visi produk, target pengguna siswa SD kelas 1–6, 5 wilayah Kibo World, alur inti bermain, prinsip edukasi, dan batasan ruang lingkup MVP.
2. **[`docs/DESIGN.md`](docs/DESIGN.md)** — *Design Specification*: Panduan visual Kibo World, palet warna (Kibo Purple, Cyan Core, Deep Navy, Warm Yellow), tipografi, ekspresi karakter, serta pedoman UI tantangan dan blok kode.
3. **[`docs/TECHNICAL.md`](docs/TECHNICAL.md)** — *Technical Specification*: Arsitektur aplikasi Next.js, model data tantangan, integrasi database SQLite & Prisma, alur API server-side untuk AI Kibo, serta standar aksesibilitas dan performa.
4. **[`docs/AI_RULES.md`](docs/AI_RULES.md)** — *AI Behavior Rules*: Pedoman dan batasan Kibo AI sebagai mentor ramah anak; mencakup sistem petunjuk bertingkat 4 level (*Thinking*, *Direction*, *Concept*, *Guided Solution*) dan kesadaran kesalahan kontekstual.
5. **[`docs/CONTENT.md`](docs/CONTENT.md)** — *Learning Content Specification*: Kurikulum 5 bab pembelajaran (Lumina Town, Gate Valley, Sprout Garden, Memory Station, Kibo Core) dengan total 15 level tantangan logika pemrograman.
6. **[`docs/PROGRESS.md`](docs/PROGRESS.md)** — *Project Progress Tracking*: **Sumber kebenaran status progres pengerjaan terbaru** (Phase 0 Foundation hingga Phase 7 Polish).
7. **[`docs/DECISIONS.md`](docs/DECISIONS.md)** — *Product Decisions Log*: Daftar keputusan strategis produk dan arsitektur yang telah disetujui dan dikunci oleh Product Manager (PM).
8. **[`MASTER_PROMPT.md`](MASTER_PROMPT.md)** — *Master AI Agent Rules*: Pedoman operasional kerja, batasan kewenangan, dan protokol verifikasi untuk AI Coding Agent.

---

## Status Progres & Single Source of Truth

Berkas **[`docs/PROGRESS.md`](docs/PROGRESS.md)** adalah **satu-satunya sumber kebenaran (*single source of truth*)** mengenai status implementasi fitur dan fase pekerjaan. Setiap perubahan atau penyelesaian task harus diverifikasi melalui pengujian sebelum ditandai selesai di berkas tersebut.

---

## Aset Master Karakter Kibo

Berkas **`assets/kibo/kibo-master-reference.png`** merupakan **aset visual master resmi** karakter Kibo yang telah disetujui oleh Product Manager (PM). 

- Kibo adalah makhluk digital (*Digital Blob*) yang ramah, positif, suportif, dan memiliki *Kibo Core* bercahaya di tubuhnya.
- **Dilarang keras mendesain ulang Kibo**, mengubah proporsi, warna dasar, atau menggantinya dengan maskot/robot/karakter lain tanpa persetujuan eksplisit dari PM.

---

## Aturan Kontribusi & Keamanan

1. **Jaga Konsistensi Visi**: Jangan mengubah visi produk atau menambahkan cakupan di luar MVP (seperti leaderboard, marketplace, inventory, atau multiplayer) tanpa persetujuan PM.
2. **Keamanan Rahasia (.env)**: **Dilarang keras meng-commit file `.env` atau mengekspos API key AI ke dalam Git repository.** Seluruh pemanggilan AI harus dilakukan dari sisi server (`/api/kibo`).
3. **Verifikasi Sebelum Selesai**: Selalu jalankan `npm run typecheck`, `npm run lint`, dan pastikan tidak ada runtime error sebelum menyatakan suatu task selesai.
