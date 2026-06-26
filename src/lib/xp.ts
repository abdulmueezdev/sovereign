/**
 * XP System — Sovereign Game Logic
 * 
 * XP required to advance FROM level n TO level n+1.
 * Formula: Math.round(250 * Math.pow(level, 1.5))
 * 
 * Level thresholds:
 * Level 1→2:   250 XP  (≈ 1 day for active user)
 * Level 2→3:   707 XP  (≈ 3 days)
 * Level 3→4: 1,299 XP  (≈ 5 days)
 * Level 5→6: 2,795 XP  (≈ 11 days)
 * Level 10→11: 7,906 XP (≈ 32 days)
 * Level 20→21: 22,361 XP (≈ 90 days)
 */

export function xpForLevel(level: number): number {
  return Math.round(250 * Math.pow(level, 1.5))
}

/**
 * Total cumulative XP required to reach a given level from Level 1.
 */
export function totalXpForLevel(targetLevel: number): number {
  let total = 0
  for (let l = 1; l < targetLevel; l++) {
    total += xpForLevel(l)
  }
  return total
}

/**
 * Calculate what level a total XP amount corresponds to.
 * Used when awarding large XP bonuses that may trigger multiple level-ups.
 */
export function levelFromTotalXp(totalXp: number): { level: number; xpIntoLevel: number } {
  let level = 1
  let accumulated = 0
  while (true) {
    const next = xpForLevel(level)
    if (accumulated + next > totalXp) {
      return { level, xpIntoLevel: totalXp - accumulated }
    }
    accumulated += next
    level++
    if (level > 999) break // Safety cap
  }
  return { level, xpIntoLevel: 0 }
}

/**
 * Get the title for a given level.
 */
export function getTitleForLevel(level: number): string {
  const titles = [
    { minLevel: 50, title: 'Sovereign' },
    { minLevel: 40, title: 'Grandmaster' },
    { minLevel: 30, title: 'Master' },
    { minLevel: 25, title: 'Expert' },
    { minLevel: 20, title: 'Practitioner' },
    { minLevel: 15, title: 'Adept' },
    { minLevel: 10, title: 'Journeyman' },
    { minLevel: 8,  title: 'Scout' },
    { minLevel: 5,  title: 'Apprentice' },
    { minLevel: 3,  title: 'Seeker' },
    { minLevel: 1,  title: 'Initiate' },
  ]
  return titles.find(t => level >= t.minLevel)?.title ?? 'Initiate'
}

/**
 * Kingdom Level — every 1000 Kingdom XP = 1 Kingdom Level
 */
export function getKingdomLevel(kingdomXp: number): number {
  return Math.floor(kingdomXp / 1000) + 1
}
