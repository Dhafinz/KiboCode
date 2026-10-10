import { useSyncExternalStore } from "react";
import { ChapterId } from "@/types";

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
const TOTAL_CHALLENGES_IN_WORLD = 15;

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
    return DEFAULT_PROGRESS;
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
  if (typeof window === "undefined") {
    return DEFAULT_PROGRESS;
  }

  try {
    const current = loadProgress();
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

    // Hitung persentase pemulihan dunia (dari total 15 misi)
    const completedCount = Object.keys(updatedCompleted).length;
    const worldRestoredPct = Math.min(
      100,
      parseFloat(((completedCount / TOTAL_CHALLENGES_IN_WORLD) * 100).toFixed(1))
    );

    const updatedData: PlayerProgressData = {
      ...current,
      completedChallenges: updatedCompleted,
      totalStars,
      worldRestoredPct,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    inMemoryCache = updatedData;
    isCacheLoaded = true;
    notifyListeners();
    return updatedData;
  } catch (err) {
    console.error("Gagal menyimpan progres ke localStorage:", err);
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
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    inMemoryCache = DEFAULT_PROGRESS;
    notifyListeners();
  } catch (err) {
    console.warn("Gagal mereset localStorage:", err);
  }
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
