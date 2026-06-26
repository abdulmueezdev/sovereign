import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase.from('profiles').select('level, class').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // Get active or recently completed template IDs to exclude
  const { data: userQuests } = await supabase
    .from('user_quests')
    .select('template_id')
    .eq('user_id', user.id)
    .neq('status', 'abandoned')

  const excludeIds = userQuests?.map(q => q.template_id) || []

  // Build query
  let query = supabase
    .from('quest_templates')
    .select('*')
    .eq('is_active', true)
    .lte('min_level', profile.level)

  const { data: available, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch available quests' }, { status: 500 })
  }

  // Filter out excluded and check class affinity
  let filtered = available.filter((q: any) => {
    if (excludeIds.includes(q.id)) return false
    if (q.class_affinity && q.class_affinity.length > 0 && !q.class_affinity.includes(profile.class)) return false
    return true
  })

  // Sort: epic/rare first, then domain
  filtered.sort((a, b) => {
    const rarityScore = { epic: 4, rare: 3, uncommon: 2, common: 1 } as Record<string, number>
    const scoreA = rarityScore[a.rarity] || 0
    const scoreB = rarityScore[b.rarity] || 0
    if (scoreA !== scoreB) return scoreB - scoreA
    return a.domain.localeCompare(b.domain)
  })

  const formatted = filtered.map((q: any) => ({
    id: q.id, // For available quests, template id is the id
    title: q.title,
    description: q.description,
    domain: q.domain,
    xpReward: q.xp_reward,
    rarity: q.rarity,
    progress: 0,
    status: 'available',
    objectives: q.objectives.map((obj: any) => ({ ...obj, completed: false })),
    primaryAttr: q.primary_attr,
    secondaryAttr: q.secondary_attr,
  }))

  return NextResponse.json(formatted)
}
