# Kibo — Product Requirements Document

## 1. Product Overview

**Product name:** Kibo  
**Working tagline:** Learn to Code. Help Kibo. Solve Problems.

Kibo is an AI-powered interactive coding adventure website for elementary school students. Children learn programming logic by helping Kibo repair a digital world through visual coding challenges.

The product is education-first:
- The game is the learning medium.
- The story provides context.
- Kibo provides personality and emotional connection.
- AI acts as a mentor.
- Coding puzzles are the actual learning activity.

## 2. Competition Alignment

The product is designed for the competition theme:
**Innovating Education Through Technology**

Subtheme:
**Web Education for Kids (untuk anak SD)**

The product must demonstrate:
- clear educational purpose,
- AI used meaningfully in learning,
- interactive coding activities,
- child-friendly UX,
- responsive web experience,
- original product identity,
- working deployment.

## 3. Target Users

Primary target:
- Elementary school students, grades 1–6.

The system must support progressive difficulty because grade 1 and grade 6 students have different abilities.

Language:
- UI and explanations: Bahasa Indonesia.
- Coding block keywords: English, such as MOVE, IF, ELSE, REPEAT, ACTIVATE.

## 4. Problem

Children may see programming as difficult because traditional coding exposes syntax before they understand programming logic.

Kibo solves this by teaching logic through visual block coding, immediate visual results, contextual storytelling, and an AI mentor that guides instead of simply giving answers.

## 5. Product Vision

Help children move from:
"I don't know how coding works"

to:
"I can think step by step and solve problems with code."

## 6. Core Experience

Main loop:

Story → Goal → Build → Run → Result → Hint/Retry → Success

A child:
1. enters a challenge,
2. reads a short story and goal,
3. arranges coding blocks,
4. runs the program,
5. observes Kibo and the world,
6. receives contextual feedback if the program fails,
7. asks Kibo for help when needed,
8. retries,
9. succeeds and restores part of Kibo World.

## 7. World Structure

Five areas form the main adventure:

1. **Lumina Town** — Sequence
2. **Gate Valley** — Condition
3. **Sprout Garden** — Loop
4. **Memory Station** — Variable
5. **Kibo Core** — Problem Solving + combined concepts

MVP target:
- 5 chapters
- 3 challenges per chapter
- 15 challenges total

## 8. Kibo

Kibo is a small digital creature / Digital Blob.

Kibo is:
- cheerful,
- curious,
- playful,
- supportive,
- slightly clumsy,
- nonjudgmental.

Kibo is NOT:
- a robot,
- a human,
- a real animal,
- a formal teacher.

Kibo is the friendly face/personality of the AI mentor.

Kibo has a small Kibo Core embedded in its body.

The approved Kibo Master Design is the visual source of truth. The coding agent must not redesign Kibo.

## 9. Kibo World Story

Kibo lives in a small digital world where systems work according to instructions.

A **System Glitch** causes instructions to be lost. As a result:
- lights do not know when to turn on,
- doors do not know when to open,
- paths do not work correctly,
- small systems behave incorrectly,
- the garden does not know when to water plants.

The child helps Kibo reconstruct the logic and restore the world.

Long-term goal:
**Restore Kibo World and reactivate Kibo Core.**

## 10. Coding System

The MVP uses a custom block coding engine.

Interaction:
- drag and drop,
- snap blocks together,
- run program,
- see visual execution.

Core blocks:
- MOVE
- TURN
- ACTIVATE
- IF
- ELSE
- OPEN
- CLOSE
- REPEAT
- WATER
- SET
- USE

The system should teach programming logic without exposing raw syntax such as `{}`, `;`, or complex text code.

Do not build a full Scratch clone. Build only the capabilities needed for the 15 MVP challenges.

## 11. AI Kibo

AI is not a generic chatbot.

AI appears when:
- the child asks Kibo for help, or
- the child's program fails.

Kibo receives challenge context including:
- current level,
- concept,
- goal,
- current blocks,
- attempt count,
- mistake,
- previous hints.

AI hint progression:
1. Thinking — conceptual question.
2. Direction — more specific clue.
3. Concept — relevant coding concept/block.
4. Guided Solution — clearer guidance after sufficient struggle.

Kibo should understand the mistake and respond to the actual challenge state.

AI must not:
- immediately give the full solution,
- introduce concepts not taught,
- change the challenge goal,
- behave like an unrestricted chatbot,
- give unrelated answers.

## 12. Progress and Mastery

Children can replay every completed challenge.

Replay:
- has no penalty,
- never removes progress,
- can improve stars.

Star concept:
- ⭐ completion,
- ⭐⭐ completion with some support,
- ⭐⭐⭐ strong independent completion/minimal support.

Do not prevent progression because of low stars.

Two progress layers:

### World Progress
Example:
`████████░░ 80%`

The world visually changes from damaged to restored.

### Learning Progress
Tracks:
- Sequence
- Condition
- Loop
- Variable
- Problem Solving

Optional P1 achievements:
- First Code
- Loop Explorer
- Problem Solver
- Kibo's Best Friend

No coins, shop, lootbox, gacha, inventory, or leaderboard.

## 13. MVP Pages

Required:
- `/` — Home / Landing
- `/adventure` — World Map
- challenge pages
- `/progress` — Learning and world progress
- `/how-to-play` — Instructions/About

Not required for MVP:
- login,
- admin dashboard,
- marketplace,
- multiplayer,
- leaderboard,
- public chat,
- avatar customization,
- inventory,
- open world,
- battle system,
- voice AI,
- character collection,
- pet system,
- complex account system,
- social features.

Progress may initially be stored locally in the browser if persistent cloud storage is not necessary.

## 14. Product Principles

1. Education before entertainment.
2. Game is the learning medium.
3. Teach logic, not syntax.
4. AI guides; it does not simply answer.
5. Kibo must feel like a friend.
6. Immediate visual feedback matters.
7. Children can retry without punishment.
8. Keep the MVP polished rather than oversized.
9. Avoid unnecessary systems.
10. Never add features merely because they sound "game-like."

## 15. Success Criteria

The MVP is successful when:
- all 15 challenges can be completed,
- block coding works reliably,
- Kibo responds contextually,
- progress works,
- replay works,
- responsive layouts work on mobile and desktop,
- there are no critical runtime errors,
- the product clearly teaches programming logic,
- the experience feels like one coherent Kibo World.
