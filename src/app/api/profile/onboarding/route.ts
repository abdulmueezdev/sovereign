import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CLASS_TO_HOUSE, CLASS_BONUSES } from '@/lib/attributes'
import { initializeUserBuildings } from '@/lib/buildings'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { 
    characterName, 
    kingdomName, 
    companionName, 
    class: selectedClass,
    attr_strength,
    attr_vitality,
    attr_intelligence,
    attr_focus,
    attr_technical,
    attr_creativity,
    attr_leadership,
    attr_charisma,
    attr_discipline
  } = body

  // Validate required fields
  if (!characterName || !kingdomName || !companionName || !selectedClass) {
    return NextResponse.json(
      { error: 'Missing required fields: characterName, kingdomName, companionName, class' },
      { status: 400 }
    )
  }

  // Validate character name length
  if (characterName.length < 2 || characterName.length > 30) {
    return NextResponse.json(
      { error: 'Character name must be between 2 and 30 characters' },
      { status: 400 }
    )
  }

  // Validate kingdom name length
  if (kingdomName.length < 2 || kingdomName.length > 40) {
    return NextResponse.json(
      { error: 'Kingdom name must be between 2 and 40 characters' },
      { status: 400 }
    )
  }

  // Validate class
  if (!['scholar', 'warrior', 'builder', 'commander'].includes(selectedClass)) {
    return NextResponse.json(
      { error: 'Invalid class. Must be: scholar, warrior, builder, or commander' },
      { status: 400 }
    )
  }

  // Map class → house_id (Replacement 4)
  const houseId = CLASS_TO_HOUSE[selectedClass]
  if (!houseId) {
    return NextResponse.json({ error: 'Invalid class mapping' }, { status: 500 })
  }

  // Apply class bonuses to starting attributes (mapping frontend names if provided, otherwise default 10)
  const bonuses = CLASS_BONUSES[selectedClass]
  const finalAttrs: Record<string, number> = {
    attr_strength: attr_strength ?? 10,
    attr_vitality: attr_vitality ?? 10,
    attr_intelligence: attr_intelligence ?? 10,
    attr_focus: attr_focus ?? 10,
    attr_technical: attr_technical ?? 10,
    attr_creativity: attr_creativity ?? 10,
    attr_leadership: attr_leadership ?? 10,
    attr_charisma: attr_charisma ?? 10,
    attr_discipline: attr_discipline ?? 10,
  }

  // If frontend didn't pass attributes, apply bonuses to the defaults
  if (attr_strength === undefined) {
    finalAttrs[bonuses.primary] += bonuses.primaryBonus
    finalAttrs[bonuses.secondary] += bonuses.secondaryBonus
  }

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (existingProfile) {
    return NextResponse.json({ error: 'Profile already exists' }, { status: 409 })
  }

  // Create the profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    character_name: characterName,
    kingdom_name: kingdomName,
    companion_name: companionName,
    class: selectedClass,
    house_id: houseId,
    onboarding_complete: true,
    ...finalAttrs,
  })

  if (profileError) {
    console.error('Profile creation error:', JSON.stringify(profileError))
    return NextResponse.json({ 
      error: 'Failed to create profile', 
      details: profileError.message,
      code: profileError.code
    }, { status: 500 })
  }

  // Initialize buildings for this user
  await initializeUserBuildings(user.id)

  return NextResponse.json({ success: true })
}
