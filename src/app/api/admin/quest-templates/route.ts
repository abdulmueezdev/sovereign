import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const STAFF_EMAILS = ['admin@sovereign.local', 'test@test.com']

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email || !STAFF_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: templates, error } = await supabase
    .from('quest_templates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json({ templates })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email || !STAFF_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  
  const { error } = await supabase
    .from('quest_templates')
    .insert({
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      domain: body.domain,
      difficulty: body.difficulty,
      xp_reward: body.xpReward,
      rarity: body.rarity,
      duration_days: body.durationDays,
      objectives: body.objectives, // JSON
      primary_attr: body.primaryAttr,
      secondary_attr: body.secondaryAttr,
      min_level: body.minLevel
    })

  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  return NextResponse.json({ success: true })
}
