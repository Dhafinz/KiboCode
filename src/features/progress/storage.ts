import { useSyncExternalStore } from "react";
import { ChapterId } from "@/types";
import { CHALLENGES, ChallengeDetail } from "@/data/challenges";

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

const STORAGE_KEY = "kibocode_player_progress_v1";

const DEFAULT_PROGRESS: PlayerProgressData = {
  playerId: "local_player",
  currentChapterId: "lumina-town",
  currentChallengeId: "ch-01",
  completedChallenges: {},
  totalStars: 0,
  worldRestoredPct: 0,
  updatedAt: "2026-01-01T00:00:00.000Z",
};

/**
 * Validates untrusted parsed JSON against PlayerProgressData structure
 */
function isValidProgressData(data: unknown): data is PlayerProgressData {
  if (!data || typeof data !== "object") return false;

  const candidate = data as Partial<PlayerProgressData>;
  if (typeof candidate.playerId !== "string") return false;
  if (typeof candidate.currentChapterId !== "string") return false;
  if (typeof candidate.currentChallengeId !== "string") return false;
  if (!candidate.completedChallenges || typeof candidate.completedChallenges !== "object") return false;
  if (typeof candidate.totalStars !== "number") return false;
  if (typeof candidate.worldRestoredPct !== "number") return false;

  return true;
}

// In-memory cache & listeners for useSyncExternalStore subscription
let inMemoryCache: PlayerProgressData = DEFAULT_PROGRESS;
let isCacheLoaded = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.warn("Error in progress listener:", e);
    }
  });
}

/**
 * Safe local storage reader (SSR safe & handles corrupted data)
 */
export function loadProgress(): PlayerProgressData {
  if (typeof window === "undefined") {
    return inMemoryCache;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(raw);
    if (isValidProgressData(parsed)) {
      return parsed;
    }

    // Data format mismatch, fallback
    return DEFAULT_PROGRESS;
  } catch (err) {
    console.warn("Gagal membaca progres dari localStorage, menggunakan default:", err);
    return DEFAULT_PROGRESS;
  }
}

/**
 * Saves challenge result and updates total stars & world restoration percentage
 */
export function saveChallengeResult(
  challengeId: string,
  stars: number
): PlayerProgressData {
  try {
    if (!CHALLENGES[challengeId]) {
      console.warn(`ID tantangan "${challengeId}" tidak valid. Catatan progres diabaikan.`);
      return loadProgress();
    }

    const current = loadProgress();

    if (!isChallengeUnlocked(challengeId, current)) {
      console.warn(`Tantangan "${challengeId}" masih terkunci. Catatan progres diabaikan.`);
      return current;
    }

    const existingRecord = current.completedChallenges[challengeId];

    // Simpan bintang tertinggi (tidak pernah mengurangi bintang jika sudah 3)
    const bestStars = existingRecord ? Math.max(existingRecord.stars, stars) : stars;

    const updatedCompleted = {
      ...current.completedChallenges,
      [challengeId]: {
        challengeId,
        stars: bestStars,
        completedAt: new Date().toISOString(),
      },
    };

    // Hitung ulang total bintang dari seluruh tantangan yang sudah selesai
    const totalStars = Object.values(updatedCompleted).reduce(
      (sum, item) => sum + (item?.stars || 0),
      0
    );

    // Hitung persentase pemulihan dunia dari progres aktual
    const totalPlayableCount = Object.keys(CHALLENGES).length;
    const completedCount = Object.keys(updatedCompleted).length;
    const worldRestoredPct = Math.min(
      100,
      parseFloat(((completedCount / totalPlayableCount) * 100).toFixed(1))
    );

    const updatedData: PlayerProgressData = {
      ...current,
      completedChallenges: updatedCompleted,
      totalStars,
      worldRestoredPct,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      } catch (err) {
        console.error("Gagal menyimpan progres ke localStorage:", err);
      }
    }

    inMemoryCache = updatedData;
    isCacheLoaded = true;
    notifyListeners();
    return updatedData;
  } catch (err) {
    console.error("Gagal menyimpan progres:", err);
    return DEFAULT_PROGRESS;
  }
}

/**
 * Helper to check if a challenge has been successfully completed
 */
export function isChallengeCompleted(challengeId: string): boolean {
  const progress = loadProgress();
  return Boolean(progress.completedChallenges[challengeId]);
}

/**
 * Helper to get the prerequisite challenge that must be completed first
 */
export function getPrerequisiteChallenge(
  challengeId: string
): ChallengeDetail | undefined {
  const challenge = CHALLENGES[challengeId];
  if (!challenge) {
    return undefined;
  }

  // Jika tantangan pertama di Gate Valley (ch-06), prasyaratnya adalah ch-05 (akhir Lumina Town)
  if (challenge.chapterId === "gate-valley" && challenge.order === 1) {
    return CHALLENGES["ch-05"];
  }

  // Jika tantangan pertama di Sprout Garden (ch-09), prasyaratnya adalah ch-08 (akhir Gate Valley)
  if (challenge.chapterId === "sprout-garden" && challenge.order === 1) {
    return CHALLENGES["ch-08"];
  }

  // Jika tantangan pertama di Memory Station (ch-12), prasyaratnya adalah ch-11 (akhir Sprout Garden)
  if (challenge.chapterId === "memory-station" && challenge.order === 1) {
    return CHALLENGES["ch-11"];
  }

  if (challenge.order <= 1) {
    return undefined;
  }

  const prevOrder = challenge.order - 1;
  return Object.values(CHALLENGES).find(
    (c) => c.chapterId === challenge.chapterId && c.order === prevOrder
  );
}

/**
 * Helper to check if all challenges in a given chapter have been completed
 */
export function isChapterRestored(
  chapterId: ChapterId,
  progressData?: PlayerProgressData
): boolean {
  const current = progressData ?? loadProgress();
  const chapterChallenges = Object.values(CHALLENGES).filter(
    (c) => c.chapterId === chapterId
  );
  if (chapterChallenges.length === 0) return false;
  return chapterChallenges.every((c) => Boolean(current.completedChallenges[c.id]));
}

/**
 * Returns calculated progress metrics for a chapter based on actual player progress
 */
export function getChapterProgress(
  chapterId: ChapterId,
  progressData?: PlayerProgressData
): {
  completed: number;
  total: number;
  percentage: number;
  isRestored: boolean;
} {
  const current = progressData ?? loadProgress();
  const chapterChallenges = Object.values(CHALLENGES).filter(
    (c) => c.chapterId === chapterId
  );
  const total = chapterChallenges.length;
  const completed = chapterChallenges.filter(
    (c) => Boolean(current.completedChallenges[c.id])
  ).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return {
    completed,
    total,
    percentage,
    isRestored: total > 0 && completed === total,
  };
}

/**
 * Checks if a challenge is unlocked based on player progress.
 * Rule:
 * - Challenge 01 (Lumina Town) is unlocked by default.
 * - Challenge with order > 1 is unlocked IF the previous prerequisite challenge is completed.
 */
export function isChallengeUnlocked(
  challengeId: string,
  progressData?: PlayerProgressData
): boolean {
  const challenge = CHALLENGES[challengeId];
  if (!challenge) return false;

  // Hanya tantangan pertama dari Lumina Town yang selalu terbuka secara default
  if (challenge.id === "ch-01") {
    return true;
  }

  const current = progressData ?? loadProgress();
  const prereq = getPrerequisiteChallenge(challengeId);

  if (!prereq) return true;

  // Terbuka jika tantangan prasyarat sudah berhasil diselesaikan
  return Boolean(current.completedChallenges[prereq.id]);
}

/**
 * Helper to get the number of stars earned for a challenge (0 if not completed)
 */
export function getChallengeStars(challengeId: string): number {
  const progress = loadProgress();
  return progress.completedChallenges[challengeId]?.stars ?? 0;
}

/**
 * Helper to clear local progress (useful for testing or reset)
 */
export function clearProgress(): void {
  inMemoryCache = DEFAULT_PROGRESS;
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Gagal mereset localStorage:", err);
    }
  }
  notifyListeners();
}

function getProgressSnapshot(): PlayerProgressData {
  if (!isCacheLoaded && typeof window !== "undefined") {
    inMemoryCache = loadProgress();
    isCacheLoaded = true;
  }
  return inMemoryCache;
}

function getProgressServerSnapshot(): PlayerProgressData {
  return DEFAULT_PROGRESS;
}

function subscribeToProgress(callback: () => void): () => void {
  listeners.add(callback);

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      inMemoryCache = loadProgress();
      callback();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

/**
 * React 19 safe Hook to consume reactive PlayerProgressData without cascading renders
 */
export function usePlayerProgress(): PlayerProgressData {
  return useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getProgressServerSnapshot
  );
}
