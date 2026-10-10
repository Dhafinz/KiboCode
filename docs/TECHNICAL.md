# Kibo — Technical Specification

## 1. Technical Goal

Build a reliable, responsive Next.js web application for the Kibo coding-learning experience.

Keep architecture simple enough for the competition deadline and robust enough for the 15-challenge MVP.

## 2. Recommended Stack

- Next.js 16+ / App Router
- React 19+
- TypeScript
- Prisma ORM
- SQLite for initial MVP/development
- PostgreSQL/Supabase as production option if persistent cloud storage is required
- Server-side API route for AI requests

Use free/open-source or competition-compatible dependencies where practical.

## 3. High-Level Architecture

```text
Browser
  ↓
Next.js UI
  ├── Home
  ├── Adventure / World Map
  ├── Challenge UI
  └── Progress
       ↓
Custom Block Coding Engine
       ↓
Challenge Logic / Validation
       ↓
Progress Storage

Challenge failure / Ask Kibo
       ↓
/api/kibo
       ↓
AI Provider
```

## 4. AI API Security

AI API keys must remain server-side.

The browser must never contain a private provider API key.

Expected flow:

```text
Client
  ↓
POST /api/kibo
  ↓
Server validates/sanitizes context
  ↓
AI Provider
  ↓
Kibo response
  ↓
Client
```

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

## 8. Progress Model

Progress should support:
- completed challenges,
- best stars,
- attempts,
- concepts learned,
- achievements,
- world restoration state.

For MVP, local browser persistence is acceptable if it keeps the system simpler.

If cloud persistence is required:
```text
Next.js
  ↓
Prisma
  ↓
PostgreSQL / Supabase
```

Do not introduce authentication unless a real product requirement appears.

## 9. Database Strategy

Development:
`SQLite`

Production option:
`PostgreSQL`

Use Prisma to reduce database coupling.

Do not switch database technology without documenting the decision in `DECISIONS.md`.

## 10. Routing

Suggested routes:

```text
/
 /adventure
 /challenge/[challengeId]
 /progress
 /how-to-play
```

API:
```text
/api/kibo
```

Exact routing may be adjusted if the implementation remains aligned with the PRD.

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
