import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: achievements } = await supabase.from('achievements').select('*').order('display_order')
  const { data: userAchievements } = await supabase.from('user_achievements').select('*').eq('user_id', user.id)

  const formattedAchievements = (achievements || []).map(ach => {
    const ua = userAchievements?.find(u => u.achievement_id === ach.id)
    
    let status = 'locked'
    let progress_current = ua?.progress_current || 0
    const progress_target = ach.condition_value

    if (ua?.unlocked_at) {
      status = 'earned'
    } else if (progress_current > 0) {
      status = 'in_progress'
    }

    // Default icons based on domain/type
    let icon_name = '✧'
    if (ach.condition_domain === 'body') icon_name = '⚔'
    else if (ach.condition_domain === 'mind') icon_name = '📜'
    else if (ach.condition_type === 'level_threshold') icon_name = '🔥'
    else if (ach.condition_type === 'total_xp') icon_name = '★'

    return {
      id: ach.id,
      title: ach.title,
      description: ach.description,
      rarity: ach.rarity,
      xp_bonus: ach.xp_bonus,
      status,
      progress_current,
      progress_target,
      icon_name,
      unlocked_at: ua?.unlocked_at || null
    }
  })

  const earned = formattedAchievements.filter(a => a.status === 'earned').length
  const in_progress = formattedAchievements.filter(a => a.status === 'in_progress').length
  const locked = formattedAchievements.filter(a => a.status === 'locked').length
  const total = formattedAchievements.length

  return NextResponse.json({
    total,
    earned,
    in_progress,
    locked,
    completion_pct: total > 0 ? Math.round((earned / total) * 100) : 0,
    achievements: formattedAchievements
  })
}
