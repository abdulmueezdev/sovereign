import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('[/api/profile] Auth error:', authError?.message)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[/api/profile] Profile fetch error:', profileError.message, profileError.code)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    if (!profile) {
      console.error('[/api/profile] No profile found for user:', user.id)
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
        vitality: profile.attr_constitution,
        intelligence: profile.attr_intelligence,
        focus: profile.attr_wisdom,
        technical: profile.attr_dexterity,
        creativity: profile.attr_creativity,
        leadership: profile.attr_perception,
        charisma: profile.attr_charisma,
        discipline: profile.attr_discipline,
      },
      onboardingComplete: profile.onboarding_complete,
    })
  } catch (err) {
    console.error('Unexpected error in profile GET:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
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

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile: data })
  } catch (err) {
    console.error('Unexpected error in profile PUT:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

