import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  const { skillId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 1. Fetch Profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // 2. Fetch Skill
  const { data: skill } = await supabase.from('skills').select('*').eq('id', skillId).single()
  if (!skill) return NextResponse.json({ error: 'Skill not found' }, { status: 404 })

  // 3. Validation: Verify class matches
  if (skill.class !== profile.class) {
    return NextResponse.json({ error: 'Skill does not match your class' }, { status: 400 })
  }

  // 4. Validation: Verify points
  if (profile.skill_points_available < skill.cost) {
    return NextResponse.json({ error: 'Not enough skill points' }, { status: 400 })
  }

  // 5. Validation: Prerequisites and existing unlock
  const { data: userSkills } = await supabase.from('user_skills').select('skill_id').eq('user_id', user.id)
  const boughtIds = new Set((userSkills || []).map(us => us.skill_id))
  
  if (boughtIds.has(skillId)) {
    return NextResponse.json({ error: 'Skill already unlocked' }, { status: 400 })
  }

  if (skill.prerequisite_skill_id && !boughtIds.has(skill.prerequisite_skill_id)) {
    return NextResponse.json({ error: 'Prerequisite not met' }, { status: 400 })
  }

  // 6. Apply effect
  let updatePayload: any = {
    skill_points_available: profile.skill_points_available - skill.cost
  }

  switch (skill.effect_type) {
    case 'attr_bonus':
      // primary_attr_bonus is like "intelligence +2" -> extract attribute
      const attrMatch = skill.primary_attr_bonus?.match(/([a-zA-Z]+) \+\d+/)
      if (attrMatch && attrMatch[1]) {
        const attrName = `attr_${attrMatch[1].toLowerCase()}`
        updatePayload[attrName] = (profile[attrName] || 10) + (skill.effect_value || 2)
      }
      break
    case 'xp_multiplier':
      updatePayload.xp_multiplier_pct = (profile.xp_multiplier_pct || 0) + (skill.effect_value || 10)
      break
    case 'max_quests':
      updatePayload.max_active_quests = (profile.max_active_quests || 3) + (skill.effect_value || 5)
      break
    case 'attr_double':
      updatePayload.attr_double_enabled = true
      break
    case 'quest_unlock':
      // Checked at quest generation time, no direct profile update
      break
  }

  // Transaction-like (update profile and insert user_skill)
  const { error: profileError } = await supabase.from('profiles').update(updatePayload).eq('id', user.id)
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  const { error: skillError } = await supabase.from('user_skills').insert({
    user_id: user.id,
    skill_id: skillId,
    unlocked_at: new Date().toISOString()
  })
  if (skillError) return NextResponse.json({ error: skillError.message }, { status: 500 })

  // Find next available skills
  const { data: allSkills } = await supabase.from('skills').select('*').eq('class', profile.class)
  const nextAvailable = (allSkills || [])
    .filter(s => s.prerequisite_skill_id === skillId)
    .map(s => s.id)

  // Trigger achievement evaluation for skill unlocking (simplistic implementation here)
  const { data: userAch } = await supabase.from('user_achievements')
    .select('*')
    .eq('user_id', user.id)
    .eq('achievement_id', 'skill_weaver_p2')
    .single()
    
  if (!userAch?.unlocked_at) {
    const { data: achInfo } = await supabase.from('achievements').select('xp_bonus').eq('id', 'skill_weaver_p2').single()
    await supabase.from('user_achievements').upsert({
      user_id: user.id,
      achievement_id: 'skill_weaver_p2',
      progress_current: 1,
      progress_target: 1,
      unlocked_at: new Date().toISOString()
    })
    if (achInfo?.xp_bonus) {
      // Award XP
      await supabase.from('profiles').update({ xp_total: profile.xp_total + achInfo.xp_bonus }).eq('id', user.id)
    }
  }

  // Path Master evaluation (simplified: checking if bought count is 5)
  if (boughtIds.size + 1 >= 5) {
    const { data: pathMasterAch } = await supabase.from('user_achievements')
      .select('*')
      .eq('user_id', user.id)
      .eq('achievement_id', 'path_master_p2')
      .single()
      
    if (!pathMasterAch?.unlocked_at) {
      const { data: achInfo } = await supabase.from('achievements').select('xp_bonus').eq('id', 'path_master_p2').single()
      await supabase.from('user_achievements').upsert({
        user_id: user.id,
        achievement_id: 'path_master_p2',
        progress_current: 5,
        progress_target: 5,
        unlocked_at: new Date().toISOString()
      })
      if (achInfo?.xp_bonus) {
        await supabase.from('profiles').update({ xp_total: profile.xp_total + (achInfo.xp_bonus || 0) }).eq('id', user.id)
      }
    }
  }

  return NextResponse.json({
    success: true,
    skill_id: skillId,
    points_remaining: updatePayload.skill_points_available,
    next_available: nextAvailable
  })
}
