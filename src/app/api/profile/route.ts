import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Transform to camelCase for API consistency
  return NextResponse.json({
    id: profile.id,
    characterName: profile.character_name,
    kingdomName: profile.kingdom_name,
    companionName: profile.companion_name,
    class: profile.class,
    houseId: profile.house_id,
    level: profile.level,
    xp: profile.xp,
    xpToNext: profile.xp_to_next,
    xpTotal: profile.xp_total,
    kingdomLevel: profile.kingdom_level,
    kingdomXp: profile.kingdom_xp,
    attributes: {
      strength: profile.attr_strength,
      vitality: profile.attr_vitality,
      intelligence: profile.attr_intelligence,
      focus: profile.attr_focus,
      technical: profile.attr_technical,
      creativity: profile.attr_creativity,
      leadership: profile.attr_leadership,
      charisma: profile.attr_charisma,
      discipline: profile.attr_discipline,
    },
    onboardingComplete: profile.onboarding_complete,
  })
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { characterName?: string, kingdomName?: string, companionName?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const updates: Record<string, string> = {}
  if (body.characterName) updates.character_name = body.characterName
  if (body.kingdomName) updates.kingdom_name = body.kingdomName
  if (body.companionName) updates.companion_name = body.companionName

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields provided to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true, profile: data })
}

