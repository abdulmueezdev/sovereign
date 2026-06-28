import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch quest details
  const { data: userQuest, error: questError } = await supabase
    .from('user_quests')
    .select(`
      status, 
      quest_templates (
        xp_reward, 
        primary_attr, 
        secondary_attr, 
        kingdom_xp_reward,
        domain
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (questError || !userQuest || userQuest.status !== 'active') {
    return NextResponse.json({ error: 'Invalid quest' }, { status: 400 })
  }

  const template = userQuest.quest_templates as any
  const xpReward = template.xp_reward
  const completedAt = new Date()

  // Update quest status
  await supabase
    .from('user_quests')
    .update({ 
      status: 'completed', 
      completed_at: completedAt.toISOString(),
      xp_awarded: xpReward
    })
    .eq('id', id)

  // Fetch user profile to add XP
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  let currentXp = profile.xp + xpReward
  let xpTotal = profile.xp_total + xpReward
  let level = profile.level
  let xpToNext = profile.xp_to_next
  let leveledUp = false
  let newSkillPoints = 0

  while (currentXp >= xpToNext) {
    currentXp -= xpToNext
    level += 1
    // Update xpToNext scaling based on spec: Math.round(250 * Math.pow(level, 1.5))
    xpToNext = Math.round(250 * Math.pow(level, 1.5))
    leveledUp = true
    newSkillPoints += 1
  }

  console.log(`[QuestComplete] User ${user.id} - Original XP: ${profile.xp}, Added: ${xpReward}. New XP: ${currentXp}, New Level: ${level}, Leveled Up: ${leveledUp}`);

  // Update profile
  await supabase
    .from('profiles')
    .update({
      xp: currentXp,
      xp_total: xpTotal,
      level,
      xp_to_next: xpToNext,
      skill_points_available: profile.skill_points_available + newSkillPoints,
      skill_points_total: profile.skill_points_total + newSkillPoints,
      [`attr_${template.primary_attr}`]: profile[`attr_${template.primary_attr}`] + 2,
      [`attr_${template.secondary_attr}`]: profile[`attr_${template.secondary_attr}`] + 1,
    })
    .eq('id', user.id)

  // Upsert weekly_xp
  const now = new Date()
  const day = now.getUTCDay()
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1) // Start of week (Monday)
  const weekStart = new Date(now.setUTCDate(diff))
  weekStart.setUTCHours(0,0,0,0)
  const weekStartStr = weekStart.toISOString().split('T')[0]

  // Unfortunately Supabase RPC or direct upsert with logic is needed. We will fetch and update or insert.
  const { data: weeklyData } = await supabase
    .from('weekly_xp')
    .select('xp_earned')
    .eq('user_id', user.id)
    .eq('week_start', weekStartStr)
    .single()

  if (weeklyData) {
    await supabase.from('weekly_xp')
      .update({ xp_earned: weeklyData.xp_earned + xpReward })
      .eq('user_id', user.id)
      .eq('week_start', weekStartStr)
  } else {
    await supabase.from('weekly_xp')
      .insert({
        user_id: user.id,
        house_id: profile.house_id,
        week_start: weekStartStr,
        xp_earned: xpReward
      })
  }

  // Achievement Evaluation
  // (In a real app, this would be a background job or RPC. We implement the basic loop here).
  const { data: achievements } = await supabase.from('achievements').select('*')
  const { data: userAchievements } = await supabase.from('user_achievements').select('*').eq('user_id', user.id)
  
  const unlockedAchievementIds: string[] = []
  
  if (achievements) {
    for (const ach of achievements) {
      const userAch = userAchievements?.find(ua => ua.achievement_id === ach.id) || {
        progress_current: 0,
        unlocked_at: null
      }
      
      if (userAch.unlocked_at) continue // Already unlocked

      let newProgress = userAch.progress_current

      switch (ach.condition_type) {
        case 'quest_count':
          newProgress += 1
          break
        case 'domain_quests':
          if (template.domain === ach.condition_domain) newProgress += 1
          break
        case 'attribute_threshold':
          newProgress = profile[`attr_${ach.condition_domain || 'discipline'}`] || 0
          break
        case 'total_xp':
          newProgress = xpTotal
          break
        case 'house_xp':
          newProgress = (weeklyData?.xp_earned || 0) + xpReward // Simplified, actually lifetime house xp
          break
        case 'level_threshold':
          newProgress = level
          break
        case 'time_quest':
          const hour = completedAt.getHours()
          if (hour >= 3 && hour < 4) newProgress += 1
          break
        // Add other conditions as needed
      }

      if (newProgress > userAch.progress_current) {
        let isUnlocked = newProgress >= ach.condition_value
        
        const payload: any = {
          user_id: user.id,
          achievement_id: ach.id,
          progress_current: newProgress,
          progress_target: ach.condition_value
        }
        
        if (isUnlocked) {
          payload.unlocked_at = new Date().toISOString()
          unlockedAchievementIds.push(ach.id)
          // Add bonus XP to total
          await supabase.from('profiles').update({ xp_total: xpTotal + ach.xp_bonus }).eq('id', user.id)
          console.log(`[QuestComplete] Unlocked achievement ${ach.id} for user ${user.id}`);
        }
        
        await supabase.from('user_achievements').upsert(payload)
      }
    }
  }

  return NextResponse.json({
    success: true,
    xpAwarded: xpReward,
    leveledUp,
    newLevel: leveledUp ? level : undefined,
    newTitle: leveledUp ? 'Master of the Void' : undefined,
    unlockedBuildings: [],
    unlockedAchievements: unlockedAchievementIds
  })
}
