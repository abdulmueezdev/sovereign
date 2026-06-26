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

  let body: { characterName?: string; kingdomName?: string; companionName?: string; class?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { characterName, kingdomName, companionName, class: selectedClass } = body

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

  // Apply class bonuses to starting attributes
  const bonuses = CLASS_BONUSES[selectedClass]
  const defaultAttrs: Record<string, number> = {
    attr_strength: 10,
    attr_constitution: 10,
    attr_intelligence: 10,
    attr_wisdom: 10,
    attr_dexterity: 10,
    attr_creativity: 10,
    attr_perception: 10,
    attr_charisma: 10,
    attr_discipline: 10,
  }

  // Apply bonuses
  defaultAttrs[bonuses.primary] += bonuses.primaryBonus
  defaultAttrs[bonuses.secondary] += bonuses.secondaryBonus

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
    ...defaultAttrs,
  })

  if (profileError) {
    console.error('Profile creation error:', profileError)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }

  // Initialize buildings for this user
  await initializeUserBuildings(user.id)

  return NextResponse.json({ success: true })
}
