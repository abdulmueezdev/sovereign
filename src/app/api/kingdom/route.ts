import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch kingdom profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('kingdom_name, kingdom_level')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Fetch buildings
  const { data: buildings, error: buildingsError } = await supabase
    .from('buildings')
    .select('*')
    .order('display_order', { ascending: true })

  if (buildingsError) {
    return NextResponse.json({ error: 'Failed to fetch buildings' }, { status: 500 })
  }

  // Fetch user building statuses
  const { data: userBuildings, error: userBuildingsError } = await supabase
    .from('user_buildings')
    .select('building_id, status')
    .eq('user_id', user.id)

  const statusMap = userBuildings?.reduce((acc: any, ub: any) => {
    acc[ub.building_id] = ub.status
    return acc
  }, {}) || {}

  const formattedBuildings = buildings.map((b: any) => ({
    id: b.id,
    name: b.name,
    domain: b.domain,
    iconFilename: b.icon_filename,
    loreText: b.lore_text,
    unlockAttribute: b.unlock_attribute,
    unlockThreshold: b.unlock_threshold,
    questUnlockDomain: b.quest_unlock_domain,
    xpBonusPct: b.xp_bonus_pct,
    status: statusMap[b.id] || 'locked'
  }))

  return NextResponse.json({
    name: profile.kingdom_name,
    level: profile.kingdom_level,
    buildings: formattedBuildings
  })
}
