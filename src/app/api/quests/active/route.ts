import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: quests, error } = await supabase
      .from('user_quests')
      .select(`
        id,
        progress_pct,
        due_at,
        status,
        objectives_completed,
        quest_templates (
          id,
          title,
          description,
          domain,
          xp_reward,
          rarity,
          objectives,
          primary_attr,
          secondary_attr
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('due_at', { ascending: true })

    if (error) {
      console.error('Error fetching active quests:', error)
      return NextResponse.json({ error: 'Failed to fetch active quests' }, { status: 500 })
    }

    // Map to flat structure for the frontend
    const formattedQuests = quests.map((q: any) => ({
      id: q.id,
      templateId: q.quest_templates.id,
      title: q.quest_templates.title,
      description: q.quest_templates.description,
      domain: q.quest_templates.domain,
      xpReward: q.quest_templates.xp_reward,
      rarity: q.quest_templates.rarity,
      progress: q.progress_pct,
      dueDate: q.due_at,
      status: q.status,
      objectives: q.quest_templates.objectives.map((obj: any) => ({
        ...obj,
        completed: q.objectives_completed.includes(obj.id)
      })),
      primaryAttr: q.quest_templates.primary_attr,
      secondaryAttr: q.quest_templates.secondary_attr,
    }))

    return NextResponse.json(formattedQuests)
  } catch (err) {
    console.error('Unexpected error in active quests GET:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
