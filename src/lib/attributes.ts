/**
 * Attribute System — Sovereign Game Logic
 * 
 * Class starting bonuses (applied during onboarding):
 * Scholar:   Intelligence +5, Focus +3
 * Warrior:   Strength +5, Vitality +3
 * Builder:   Technical +5, Creativity +3
 * Commander: Leadership +5, Charisma +3
 * 
 * Quest completion awards:
 * primary_attr +2, secondary_attr +1
 */

import { createClient } from '@/lib/supabase/server'

// Class → House mapping (Replacement 4)
export const CLASS_TO_HOUSE: Record<string, string> = {
  scholar: 'zenith',
  warrior: 'ash',
  builder: 'forge',
  commander: 'crown',
}

// Class → starting attribute bonuses
export const CLASS_BONUSES: Record<string, { primary: string; primaryBonus: number; secondary: string; secondaryBonus: number }> = {
  scholar:   { primary: 'attr_intelligence', primaryBonus: 5, secondary: 'attr_focus',       secondaryBonus: 3 },
  warrior:   { primary: 'attr_strength',     primaryBonus: 5, secondary: 'attr_vitality', secondaryBonus: 3 },
  builder:   { primary: 'attr_technical',    primaryBonus: 5, secondary: 'attr_creativity',   secondaryBonus: 3 },
  commander: { primary: 'attr_leadership',   primaryBonus: 5, secondary: 'attr_charisma',     secondaryBonus: 3 },
}

/**
 * Award attribute points after quest completion.
 * primary_attr gets +2, secondary_attr gets +1.
 */
export async function awardAttributePoints(
  userId: string,
  primaryAttr: string,
  secondaryAttr: string
) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select(`${primaryAttr}, ${secondaryAttr}`)
    .eq('id', userId)
    .single()

  if (!profile) return

  await supabase
    .from('profiles')
    .update({
      [primaryAttr]: (profile[primaryAttr as keyof typeof profile] as number) + 2,
      [secondaryAttr]: (profile[secondaryAttr as keyof typeof profile] as number) + 1,
    })
    .eq('id', userId)
}

/**
 * Update discipline streak.
 * If user completed a quest yesterday, discipline +1.
 * Discipline never decreases (no punishment).
 */
export async function updateDisciplineStreak(userId: string) {
  const supabase = await createClient()

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const today = new Date()

  const { data: yesterdayQuest } = await supabase
    .from('user_quests')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .gte('completed_at', yesterday.toISOString().slice(0, 10))
    .lt('completed_at', today.toISOString().slice(0, 10))
    .limit(1)

  if (yesterdayQuest && yesterdayQuest.length > 0) {
    // Continued streak — gain 1 discipline
    const { data: profile } = await supabase
      .from('profiles')
      .select('attr_discipline')
      .eq('id', userId)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({ attr_discipline: profile.attr_discipline + 1 })
        .eq('id', userId)
    }
  }
  // No else — discipline never decreases
}
