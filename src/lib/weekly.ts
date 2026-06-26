/**
 * Weekly XP System — Sovereign Game Logic
 * Replacement 5: Self-resetting via new rows per week
 */

/**
 * Get the Monday of the current ISO week (UTC).
 * All leaderboard queries filter by this value.
 */
export function getCurrentWeekMonday(): string {
  const now = new Date()
  const day = now.getUTCDay() || 7
  if (day !== 1) now.setUTCDate(now.getUTCDate() - day + 1)
  now.setUTCHours(0, 0, 0, 0)
  return now.toISOString().slice(0, 10)
}
