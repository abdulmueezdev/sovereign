import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { objectiveId, checked } = await request.json()

  // Verify ownership
  const { data: userQuest, error: questError } = await supabase
    .from('user_quests')
    .select('objectives_completed, quest_templates(objectives)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (questError || !userQuest) {
    return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
  }

  let completed = new Set(userQuest.objectives_completed as string[])
  if (checked) {
    completed.add(objectiveId)
  } else {
    completed.delete(objectiveId)
  }

  const completedArray = Array.from(completed)
  const totalObjectives = (userQuest.quest_templates as any).objectives.length
  const progressPct = totalObjectives > 0 ? Math.round((completedArray.length / totalObjectives) * 100) : 0

  const { error: updateError } = await supabase
    .from('user_quests')
    .update({ 
      objectives_completed: completedArray,
      progress_pct: progressPct 
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update objective' }, { status: 500 })
  }

  return NextResponse.json({ success: true, progressPct })
}
