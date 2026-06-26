import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: quests, error } = await supabase
    .from('user_quests')
    .select(`
      id,
      progress_pct,
      status,
      completed_at,
      failed_at,
      quest_templates (
        title,
        description,
        domain,
        xp_reward,
        rarity
      )
    `)
    .eq('user_id', user.id)
    .in('status', ['completed', 'failed'])
    .order('completed_at', { ascending: false, nullsFirst: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch completed quests' }, { status: 500 })
  }

  const formatted = quests.map((q: any) => ({
    id: q.id,
    title: q.quest_templates.title,
    description: q.quest_templates.description,
    domain: q.quest_templates.domain,
    xpReward: q.quest_templates.xp_reward,
    rarity: q.quest_templates.rarity,
    progress: q.progress_pct,
    status: q.status,
    completedAt: q.completed_at || q.failed_at
  }))

  return NextResponse.json(formatted)
}
