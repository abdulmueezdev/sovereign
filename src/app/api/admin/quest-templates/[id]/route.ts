import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const STAFF_EMAILS = ['admin@sovereign.local', 'test@test.com']

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email || !STAFF_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const id = (await params).id
  const body = await request.json()
  
  const { error } = await supabase
    .from('quest_templates')
    .update({
      title: body.title,
      description: body.description,
      domain: body.domain,
      difficulty: body.difficulty,
      xp_reward: body.xpReward,
      rarity: body.rarity,
      duration_days: body.durationDays,
      objectives: body.objectives,
      primary_attr: body.primaryAttr,
      secondary_attr: body.secondaryAttr,
      min_level: body.minLevel,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email || !STAFF_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const id = (await params).id
  
  const { error } = await supabase
    .from('quest_templates')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ success: true })
}
