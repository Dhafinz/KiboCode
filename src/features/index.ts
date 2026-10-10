/**
 * Features Domain Organization
 *
 * Current implemented modules:
 * - blocks: Block engine types, deterministic simulation runner (Prompt 04)
 * - progress: Local storage progress persistence and star tracking (Prompt 04)
 */

export * from "./blocks/types";
export * from "./blocks/engine";
export * from "./progress/storage";

export const FEATURE_FLAGS = {
  blockEngine: true,
  aiMentor: false, // Predefined progressive hints are active; live LLM deferred
  progressTracking: true,
};
