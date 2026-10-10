/**
 * KiboCode Core Types Definition
 * Based on docs/PRD.md and docs/TECHNICAL.md
 */

export type ChapterId =
  | "lumina-town"
  | "gate-valley"
  | "sprout-garden"
  | "memory-station"
  | "kibo-core";

export type ConceptType =
  | "sequence"
  | "condition"
  | "loop"
  | "variable"
  | "problem-solving";

export interface ChallengeMeta {
  id: string;
  chapterId: ChapterId;
  order: number;
  title: string;
  concept: ConceptType;
  story: string;
  goal: string;
  availableBlocks: string[];
}

export interface PlayerProgressState {
  playerId: string;
  currentChapterId: ChapterId;
  currentChallengeId: string;
  totalStars: number;
  worldRestoredPct: number;
}
