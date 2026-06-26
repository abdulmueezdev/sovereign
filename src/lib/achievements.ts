/**
 * Achievement System — Sovereign Game Logic
 * Runs after every quest completion and level-up.
 */

import { createClient } from '@/lib/supabase/server'

interface Profile {
  level: number
  kingdom_level: number
  [key: string]: unknown
}

export async function checkAchievements(
  userId: string,
  profile: Profile
): Promise<string[]> {
  const supabase = await createClient()

  // Get all achievements not yet earned by this user
  const { data: earnedIds } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId)

  const earnedSet = new Set(earnedIds?.map(a => a.achievement_id) ?? [])

  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*')

  const unearned = allAchievements?.filter(a => !earnedSet.has(a.id)) ?? []
  const unlocked: string[] = []

  for (const achievement of unearned) {
    let earned = false

    switch (achievement.condition_type) {
      case 'quest_count': {
        const { count } = await supabase
          .from('user_quests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'completed')
        earned = (count ?? 0) >= achievement.condition_value
        break
      }
      case 'level':
        earned = profile.level >= achievement.condition_value
        break
      case 'building': {
        const { count } = await supabase
          .from('user_buildings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'built')
        earned = (count ?? 0) >= achievement.condition_value
        break
      }
      case 'domain_quests': {
        const { count } = await supabase
          .from('user_quests')
          .select('*, quest_templates!inner(domain)', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'completed')
          .eq('quest_templates.domain', achievement.condition_domain)
        earned = (count ?? 0) >= achievement.condition_value
        break
      }
      case 'chat': {
        const { count } = await supabase
          .from('companion_messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('role', 'user')
        earned = (count ?? 0) >= achievement.condition_value
        break
      }
      case 'kingdom_level':
        earned = profile.kingdom_level >= achievement.condition_value
        break
      case 'all_domains': {
        const domains = ['body', 'mind', 'craft', 'command']
        const checks = await Promise.all(
          domains.map(async domain => {
            const { count } = await supabase
              .from('user_quests')
              .select('*, quest_templates!inner(domain)', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('status', 'completed')
              .eq('quest_templates.domain', domain)
            return (count ?? 0) > 0
          })
        )
        earned = checks.every(Boolean)
        break
      }
      case 'streak': {
        // 7-day streak check
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const { data: recentCompletions } = await supabase
          .from('user_quests')
          .select('completed_at')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .gte('completed_at', sevenDaysAgo.toISOString())
        const distinctDays = new Set(
          recentCompletions?.map(q => (q.completed_at as string)?.slice(0, 10)) ?? []
        )
        earned = distinctDays.size >= 7
        break
      }
    }

    if (earned) {
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id,
      })
      // Award XP bonus
      if (achievement.xp_bonus > 0) {
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('xp, xp_total')
          .eq('id', userId)
          .single()

        if (currentProfile) {
          await supabase
            .from('profiles')
            .update({
              xp: currentProfile.xp + achievement.xp_bonus,
              xp_total: currentProfile.xp_total + achievement.xp_bonus,
            })
            .eq('id', userId)
        }
      }
      unlocked.push(achievement.id)
    }
  }

  return unlocked
}
