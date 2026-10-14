# Kibo — Design Specification

## 1. Design Status

This document defines the visual direction and design constraints.

The AI coding agent may design individual UI components, but must follow this visual direction.

## 2. Overall Visual Identity: Friendly Future

Kibo World dirancang dengan arah visual **Friendly Future** yang cerah, ramah anak, dan nyaman bagi siswa SD:

- cute,
- modern digital adventure,
- playful,
- clean & bright (latar terang yang ramah mata anak),
- friendly,
- imaginative.

Kibo World TIDAK boleh terasa seperti:
- dashboard korporat / generic SaaS,
- dark-mode cyberpunk yang berat atau melelahkan mata anak,
- neon overload / glow berlebihan,
- software balita yang kekanak-kanakan secara berlebih.

## 3. Color Direction (Palet Friendly Future)

Sesuai token desain aktif pada `src/app/globals.css`:

- **Cloud White (`#F4F9FF`)** — Latar belakang utama aplikasi yang bersih, cerah, dan menenangkan.
- **Sky Blue (`#BFE8FF`, deep: `#0284C7`)** — Warna interaktif utama, aksen teknologi bersahabat, dan tombol aksi.
- **Mint Green (`#B9F2D0`, deep: `#059669`)** — Indikator keberhasilan, petak pulih, dan ornamen alam.
- **Warm Yellow (`#FFE49A`, deep: `#D97706`)** — Bintang reward prestasi, pill status bintang, dan pencapaian.
- **Soft Purple (`#D9CCFF`, deep: `#6366F1`)** — Identitas warna Kibo, aksen brand, dan konsep memori.
- **Deep Slate (`#24344D`)** — Warna tipografi utama dengan rasio kontras tinggi (>8:1) di atas permukaan terang.
- **Pure White Surface (`#FFFFFF`)** — Latar kartu, modal, dan platform dengan border lembut (`#DDE7F3`) dan bayangan halus.

*(Catatan historis: Palet prototipe awal yang didominasi Deep Navy gelap dan glow neon berlebih telah ditinggalkan dan dialihkan sepenuhnya ke Friendly Future demi kenyamanan membaca anak SD).*

## 4. Typography

Typography should be:
- highly readable,
- friendly,
- modern,
- suitable for children,
- clearly hierarchical.

The agent may choose the exact font pairing, provided it is readable and consistent.

Avoid overly decorative fonts for body text.

## 5. Kibo Master Reference

The approved Kibo image supplied by the PM is the visual source of truth.

Reference asset:
`assets/kibo/kibo-master-reference.png`

Rules:
- preserve Kibo's identity,
- preserve body proportions,
- preserve face style,
- preserve purple/cyan identity,
- preserve Kibo Core,
- preserve overall cute digital-blob appearance.

DO NOT redesign Kibo.
DO NOT turn Kibo into a robot.
DO NOT turn Kibo into a human or animal.
DO NOT replace Kibo with a generic chatbot avatar.

## 6. Kibo States

Create consistent variants based on the master design:
- Idle
- Happy
- Thinking
- Confused
- Sad
- Celebrate

All states must look like the same character.

## 7. World Map

The World Map is a journey through Kibo World, not a simple list of cards.

Five major areas are connected by a visible path:

Lumina Town → Gate Valley → Sprout Garden → Memory Station → Kibo Core

The map should visually communicate restoration.

Early state:
- damaged,
- inactive,
- locked areas,
- low system activity.

Restored state:
- lights active,
- plants growing,
- systems functioning,
- more energy,
- brighter world.

The exact card/button treatment is delegated to the agent.

## 8. Challenge Screen

The challenge screen must prioritize:
1. world simulation,
2. coding,
3. goal,
4. run/result,
5. contextual help.

Desktop direction:
- world area and coding area can be side-by-side.

Mobile direction:
- stack content vertically.

Suggested order on mobile:
World → Goal → Coding Area → Block Library → Run → Feedback.

## 9. Block Coding Visuals

Blocks should feel like programming blocks, not generic buttons.

Requirements:
- clear categories,
- obvious nesting,
- visual hierarchy,
- drag-and-drop affordance,
- readable labels,
- visible execution state.

The agent decides exact shape, border, shadows, spacing, and animation.

## 10. AI Kibo Presentation

Do not present AI as a generic chat window.

Kibo should visually appear as a contextual mentor.

When a program fails:
- show an appropriate Kibo state,
- explain that something needs another try,
- reference the actual mistake,
- offer the next useful hint.

When the child asks for help:
- Kibo appears naturally within the challenge context.

## 11. Motion

Use subtle, purposeful animation:
- Kibo idle motion,
- block drag feedback,
- program execution,
- world restoration,
- success celebration,
- hover/tap feedback.

Do not over-animate.

Animations should support understanding, not distract from learning.

## 12. Responsive Design

Desktop and mobile are both first-class.

Do not simply shrink desktop UI.

The challenge experience must remain usable on touch screens.

## 13. Asset Rules

Prefer:
- optimized SVG for icons where appropriate,
- compressed raster assets when needed,
- lazy loading for non-critical images,
- consistent illustration style.

Avoid large unnecessary assets.

## 14. Agent Design Freedom

The agent may decide:
- button design,
- card design,
- exact spacing,
- border radius,
- shadows,
- typography pairing,
- navigation implementation,
- component architecture,
- micro-interactions.

These choices must remain consistent with this document and the PRD.
