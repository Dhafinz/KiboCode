# Kibo — Technical Specification

## 1. Technical Goal

Build a reliable, responsive Next.js web application for the Kibo coding-learning experience.

Keep architecture simple enough for the competition deadline and robust enough for the 15-challenge MVP.

## 2. Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Vanilla CSS (CSS Variables / Design Tokens tema *Friendly Future*)
- **Active Progress Storage**: Browser `localStorage` (`kibocode_player_progress_v1`) via React `useSyncExternalStore`
- **Database Layer (Foundation/Unintegrated)**: Prisma ORM 6 dengan SQLite lokal (`prisma/dev.db`) sebagai skema arsitektur cadangan/masa depan
- **AI Mentorship Engine**: Client-side Deterministic Contextual Progressive Hints (4 tingkat) & failure feedback

## 3. High-Level Architecture (Active MVP)

```text
Browser Client (Next.js 16 / React 19)
  ├── Home (/) [termasuk seksi /#cara-belajar & kartu progres]
  ├── Adventure (/adventure) [termasuk header status pemulihan 5 bab & total bintang]
  └── Challenge UI (/challenge/[challengeId])
        ↓
  Custom Block Coding Engine (runSimulation di engine.ts)
        ├── Deterministic Unrolling (Loop REPEAT_2 / REPEAT_3 / END_LOOP)
        ├── State Simulation (Position, Obstacles IF_GATE / IF_BRIDGE, Variables SET/USE)
        └── Star & Objective Evaluation (1–3 ⭐)
        ↓
  AI Mentor Kibo (Client-Side Contextual Hints & Engine Feedback)
        ↓
  Progress Storage (localStorage: kibocode_player_progress_v1)

Server Endpoints Aktif:
  └── /api/health (status dan kesehatan aplikasi)

Rencana Pengembangan Masa Depan (Deferred):
  └── /api/kibo (Server-side AI LLM Proxy) → External AI Provider
  └── Prisma ORM → Cloud PostgreSQL / Supabase
```

## 4. AI Mentorship Architecture & Future Server-Side Security

Dalam implementasi MVP saat ini:
- AI Mentor Kibo bekerja secara **deterministik di sisi klien** menggunakan kurikulum petunjuk kontekstual 4 level yang terstruktur pada data setiap tantangan (`src/data/challenges.ts`) serta pesan kesalahan spesifik rintangan dari `engine.ts`.
- Tidak ada panggilan API eksternal dan tidak ada API key yang diekspos di sisi browser.

Arsitektur Masa Depan (Jika Server-Side LLM diaktifkan):
Jika di masa depan Kibo AI dihubungkan ke penyedia LLM eksternal:
- Endpoint proxy server-side `POST /api/kibo` harus digunakan agar private API key tidak pernah terekspos ke browser.
- Server wajib memvalidasi dan membersihkan payload konteks tantangan sebelum diteruskan ke penyedia AI.

## 5. AI Context

Send only the context necessary for the current educational interaction.

Suggested payload:

```ts
{
  levelId: string,
  concept: string,
  goal: string,
  currentBlocks: unknown[],
  attemptCount: number,
  mistake: string | null,
  previousHints: string[],
  hintLevel: 1 | 2 | 3 | 4
}
```

Do not expose secrets.

## 6. Block Coding Engine

Build a focused custom engine.

Required capabilities:
- block definitions,
- block ordering,
- nesting,
- drag/drop or touch placement,
- validation,
- execution,
- execution animation,
- failure detection,
- success detection,
- reset/retry.

Do not implement a full general-purpose programming language.

## 7. Challenge Model

Each challenge should have structured data.

Conceptual example:

```ts
type Challenge = {
  id: string
  chapterId: string
  title: string
  concept: string
  story: string
  goal: string
  availableBlocks: string[]
  initialState: unknown
  successCondition: unknown
  failureFeedback: string
  difficulty: number
}
```

Keep challenge content separate from UI code whenever practical.

## 8. Progress Model & Storage Implementation

Model data progres pemain (`src/features/progress/storage.ts`):
```ts
export interface ChallengeProgressRecord {
  challengeId: string;
  stars: number; // 1, 2, 3
  completedAt: string; // ISO string
}

export interface PlayerProgressData {
  playerId: string;
  currentChapterId: ChapterId;
  currentChallengeId: string;
  completedChallenges: Record<string, ChallengeProgressRecord>;
  totalStars: number;
  worldRestoredPct: number;
  updatedAt: string;
}
```

Implementasi aktif pada rilis MVP:
- Disimpan di `localStorage` klien dengan key `kibocode_player_progress_v1`.
- Dibaca dan disinkronkan ke komponen UI menggunakan hook `useSyncExternalStore` (bebas re-render berlebih, SSR-safe dengan in-memory cache fallback).
- Nilai `worldRestoredPct` dihitung ulang secara ketat dari jumlah 15 tantangan yang benar-benar selesai (`(completed / 15) * 100%`).
- Fungsi guard `isAllChallengesCompleted()` memastikan dialog kemenangan utuh Kibo World hanya aktif jika seluruh 15 misi tuntas.

## 9. Database Strategy & Prisma Status

- **Status MVP Saat Ini**: Basis data belum terhubung ke alur aktif permainan. Progres pemain 100% berjalan di `localStorage` peramban.
- **Fondasi Skema**: Berkas `prisma/schema.prisma` dan database SQLite lokal (`prisma/dev.db`) disediakan sebagai fondasi arsitektur database. Model `PlayerProgress` telah didefinisikan sebagai cetak biru untuk ekspansi masa depan.
- **Opsi Produksi / Cloud Sync (Masa Depan)**: Jika integrasi akun cloud diwajibkan di kemudian hari, layer Prisma dapat dialihkan ke Supabase / PostgreSQL tanpa merombak logika inti permainan.

## 10. Routing (Struktur Rute Aktual)

Sesuai struktur fisik direktori `src/app`:

### Rute Halaman Aplikasi:
- `/` — Beranda / Landing Page (dilengkapi kartu progres dinamis dan seksi panduan `/#cara-belajar`)
- `/adventure` — Peta Petualangan Dunia Kibo (peta 5 bab dengan pemulihan dinamis dan total bintang)
- `/challenge/[challengeId]` — Arena permainan & coding untuk 15 tantangan (`ch-01` s/d `ch-15`)

### Rute API Server:
- `/api/health` — Endpoint verifikasi kesiapan sistem dan status aplikasi (aktif)

### Status Halaman yang Dikonsolidasi:
- **Panduan Cara Bermain (`how-to-play`)**: Dikonsolidasikan langsung ke seksi Beranda `/#cara-belajar`.
- **Pemantauan Progres (`progress`)**: Dikonsolidasikan langsung ke kartu Hero Beranda dan header Peta Petualangan `/adventure`.
- **API AI Server (`/api/kibo`)**: Ditangguhkan (MVP menggunakan kurikulum petunjuk kontekstual deterministik di sisi klien).

## 11. Performance

Priorities:
- fast initial page load,
- optimized images,
- lazy loading where useful,
- minimal client-side JavaScript where possible,
- avoid unnecessary libraries,
- avoid oversized assets.

## 12. Accessibility

At minimum:
- readable contrast,
- keyboard-accessible important controls,
- visible focus states,
- usable touch targets,
- meaningful labels,
- avoid relying only on color to communicate success/error.

## 13. SEO

Basic SEO should include:
- meaningful page titles,
- metadata,
- description,
- semantic HTML,
- appropriate headings.

## 14. Deployment

The competition hosting is the primary deployment target.

The environment is expected to support:
- Next.js,
- Node.js runtime,
- SSR,
- API routes,
- external AI API,
- cloud database when needed.

Do not build deployment around Nginx, Cloudflare Tunnel, or a self-managed VM unless the hosting situation actually requires it.

Backup deployment may use Vercel or another compatible environment.

## 15. Testing

Before declaring a task DONE:
- run lint/type checks where configured,
- test the relevant page,
- test the relevant interaction,
- verify no obvious console/runtime errors,
- verify mobile behavior for affected UI,
- verify no regression in existing challenges.

## 16. Engineering Principles

- Keep components maintainable.
- Avoid unnecessary abstraction.
- Avoid destructive refactors.
- Avoid introducing new dependencies without reason.
- Keep educational content data-driven where practical.
- Keep AI logic separate from presentation.
- Keep challenge validation deterministic.
