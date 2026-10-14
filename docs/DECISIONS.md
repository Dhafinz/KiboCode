# Kibo — Product Decisions

This file records important decisions made by the PM and the reasoning behind them.

## D-001 — Education-first product

**Decision:** Kibo is an educational coding experience where game elements support learning.

**Reason:** The competition is focused on Web Education for Kids. The game should not become a generic entertainment product.

## D-002 — Kibo is a Digital Blob

**Decision:** Kibo is a small digital creature / Digital Blob.

**Reason:** It is distinctive, easy to recognize, expressive, and easier to animate consistently than a complex human/robot character.

## D-003 — Kibo Core

**Decision:** Kibo has a small Kibo Core embedded in its body.

**Reason:** It gives Kibo a recognizable visual identity and connects the character to the world-restoration story.

## D-004 — Kibo World

**Decision:** The world is a small digital world damaged by a System Glitch.

**Reason:** This creates a simple narrative reason for coding challenges without requiring a large open-world game.

## D-005 — Five learning areas

**Decision:**
Lumina Town → Sequence  
Gate Valley → Condition  
Sprout Garden → Loop  
Memory Station → Variable  
Kibo Core → Problem Solving

**Reason:** Gives a clear educational progression.

## D-006 — Fifteen challenges

**Decision:** Total 15 tantangan MVP didistribusikan dalam susunan 5–3–3–3–1 (Lumina Town: 5, Gate Valley: 3, Sprout Garden: 3, Memory Station: 3, Kibo Core: 1 grand finale). *(Catatan historis: Pada inisiasi awal dirancang format 5 bab × 3 tantangan, kemudian disempurnakan pada D-021 agar Lumina Town memberikan fondasi urutan yang lebih kokoh bagi siswa SD dan Kibo Core menjadi klimaks terintegrasi).*

**Reason:** Format 5–3–3–3–1 memberikan transisi kurva kesulitan bertahap yang ideal bagi anak sekolah dasar sekaligus menghadirkan tantangan akhir yang utuh dan berbobot tanpa mengurangi total target 15 tantangan MVP.

## D-007 — Block coding

**Decision:** Use custom block coding instead of text coding.

**Reason:** The target is elementary students. Visual blocks teach programming logic without requiring syntax knowledge.

## D-008 — Custom block engine

**Decision:** Build only the block engine needed by Kibo instead of integrating a full general-purpose game/coding platform.

**Reason:** Keeps scope controlled and allows challenge logic to match the product exactly.

## D-009 — AI is a mentor

**Decision:** Kibo AI uses progressive hints rather than immediately giving solutions.

**Reason:** The educational value comes from helping children think through problems.

## D-010 — AI trigger

**Decision:** AI appears when requested or after a failed program.

**Reason:** Avoid turning the product into an always-on generic chatbot.

## D-011 — No mandatory login

**Decision:** MVP does not require login.

**Reason:** Login is not necessary for the core learning experience and would add complexity.

## D-012 — Progress storage

**Decision:** Seluruh progres pemain MVP disimpan secara aktif pada browser `localStorage` (`kibocode_player_progress_v1`) via hook reaktif `useSyncExternalStore`. Persistensi cloud (PostgreSQL/Supabase) disiapkan sebagai opsi masa depan jika kompetisi mewajibkan akun cloud.

**Reason:** Memberikan performa instan tanpa latensi jaringan, bebas error sesi, SSR-safe, dan tidak membebani siswa SD dengan keharusan login.

## D-013 — SQLite & Prisma as Architecture Foundation

**Decision:** Dependensi Prisma ORM dan basis data SQLite lokal (`prisma/dev.db`) disediakan sebagai fondasi arsitektur database masa depan, namun belum dihubungkan ke alur aktif permainan MVP.

**Reason:** Menjaga kesiapan teknis jika fitur cloud sync atau leaderboard diimplementasikan di kemudian hari, tanpa menambah kompleksitas koneksi jaringan pada fase awal.

## D-014 — Supabase/PostgreSQL production option

**Decision:** Supabase PostgreSQL may be used if production persistence is needed.

**Reason:** The competition hosting expects cloud database options, while Prisma keeps the application database layer portable.

## D-015 — Agent design freedom

**Decision:** The agent may design buttons, cards, typography pairing, spacing, shadows, and micro-interactions.

**Reason:** The PM should define visual direction and constraints, not micromanage every UI component.

## D-016 — Kibo visual source of truth

**Decision:** The approved Kibo Master Design image is authoritative.

**Reason:** Prevents visual drift when AI generates code.

## D-017 — No scope creep

**Decision:** Features such as leaderboard, shop, multiplayer, inventory, and login are out of MVP scope.

**Reason:** They do not directly improve the core educational coding experience enough to justify their implementation cost.

## D-018 — World restoration as progress

**Decision:** Progress changes the visual state of Kibo World.

**Reason:** This makes learning progress meaningful inside the story instead of showing only percentages.

## D-019 — Replay and mastery

**Decision:** Challenges can be replayed without losing progress, and stars can improve.

**Reason:** Children should be encouraged to practice rather than fear mistakes.

## D-020 — Language

**Decision:** Bahasa Indonesia for UI/explanations, English for coding block keywords.

**Reason:** Keeps the learning experience accessible while preserving recognizable programming terminology.

## D-021 — Distribusi 15 Tantangan MVP dan Interaksi Blok

**Decision:**
1. Total 15 tantangan MVP dialokasikan dengan susunan 5–3–3–3–1 (Lumina Town: 5 tantangan, Gate Valley: 3 tantangan, Sprout Garden: 3 tantangan, Memory Station: 3 tantangan, dan Kibo Core: 1 tantangan grand finale terintegrasi).
2. Interaksi penyusunan blok menggunakan mekanisme pilih dan susun (*click-to-add/select-and-arrange*), sementara *drag-and-drop* ditangguhkan.
3. Evaluasi bintang optimal pada Kibo Core (ch-15) mengakomodasi solusi berbasis loop hingga 10 blok (baik *compound loop* 8 blok maupun *sequential loop* ganda 10 blok) untuk meraih 3 bintang penuh.

**Reason:**
Komposisi 5 tantangan pada Lumina Town memberikan pengenalan bertahap yang kokoh bagi anak SD sebelum mempelajari percabangan (*condition*), sedangkan *ch-15* menjadi klimaks tunggal yang memadukan keempat konsep sebelumnya. Mekanisme *click-to-add* meminimalkan kesalahan gestur pada layar sentuh, dan evaluasi bintang yang adaptif menghargai penalaran loop alami siswa tanpa penalti yang keliru.
