/**
 * Building System — Sovereign Game Logic
 */

import { createClient } from '@/lib/supabase/server'

interface Profile {
  [key: string]: unknown
}

/**
 * Check if any locked buildings should become available
 * based on the user's current attribute values.
 * Called after quest completion and attribute updates.
 */
export async function checkBuildingUnlocks(
  userId: string,
  profile: Profile
): Promise<string[]> {
  const supabase = await createClient()

  const { data: lockedBuildings } = await supabase
    .from('user_buildings')
    .select('building_id, buildings(unlock_attribute, unlock_threshold)')
    .eq('user_id', userId)
    .eq('status', 'locked')

  const newlyAvailable: string[] = []

  for (const ub of lockedBuildings ?? []) {
    const buildingData = ub.buildings as { unlock_attribute: string; unlock_threshold: number }
    const currentValue = profile[buildingData.unlock_attribute] as number

    if (currentValue >= buildingData.unlock_threshold) {
      await supabase
        .from('user_buildings')
        .update({ status: 'available' })
        .eq('user_id', userId)
        .eq('building_id', ub.building_id)
      newlyAvailable.push(ub.building_id)
    }
  }

  return newlyAvailable
}

/**
 * Initialize buildings for a new user.
 * Called during onboarding — creates a 'locked' row for every building.
 */
export async function initializeUserBuildings(userId: string) {
  const supabase = await createClient()

  const { data: allBuildings } = await supabase.from('buildings').select('id')

  const rows = allBuildings?.map(b => ({
    user_id: userId,
    building_id: b.id,
    status: 'locked' as const,
  })) ?? []

  if (rows.length > 0) {
    await supabase.from('user_buildings').insert(rows)
  }
}
