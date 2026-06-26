import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('class, skill_points_available, skill_points_total').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: skills } = await supabase.from('skills').select('*').eq('class', profile.class).order('tier')
  const { data: userSkills } = await supabase.from('user_skills').select('skill_id').eq('user_id', user.id)

  const boughtSkillIds = new Set((userSkills || []).map(us => us.skill_id))

  const formattedSkills = (skills || []).map(skill => {
    const isBought = boughtSkillIds.has(skill.id)
    
    let isAvailable = false
    if (!isBought) {
      if (skill.tier === 1) {
        isAvailable = profile.skill_points_available >= skill.cost
      } else if (skill.prerequisite_skill_id) {
        const prereqBought = boughtSkillIds.has(skill.prerequisite_skill_id)
        isAvailable = prereqBought && profile.skill_points_available >= skill.cost
      }
    }

    const status = isBought ? 'bought' : isAvailable ? 'available' : 'locked'
    
    // Simple icon mapping based on effect
    let icon_name = '✦'
    if (skill.effect_type === 'attr_bonus') icon_name = '🧠'
    if (skill.effect_type === 'xp_multiplier') icon_name = '📖'
    if (skill.effect_type === 'quest_unlock') icon_name = '👁'
    if (skill.effect_type === 'max_quests') icon_name = '🏛'

    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      tier: skill.tier,
      cost: skill.cost,
      status,
      prerequisite_skill_id: skill.prerequisite_skill_id,
      icon_name,
      effect_description: skill.description // Using description for effect description as specified
    }
  })

  return NextResponse.json({
    class: profile.class,
    skill_points_available: profile.skill_points_available,
    skill_points_total: profile.skill_points_total,
    skills: formattedSkills
  })
}
