/**
 * Common utility functions for KiboCode
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPercentage(val: number): string {
  return `${Math.min(100, Math.max(0, Math.round(val)))}%`;
}
