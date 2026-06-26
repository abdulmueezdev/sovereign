import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { houseId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { houseId } = body

  if (!houseId || !['ash', 'zenith', 'forge', 'crown'].includes(houseId)) {
    return NextResponse.json(
      { error: 'Invalid house. Must be: ash, zenith, forge, or crown' },
      { status: 400 }
    )
  }

  // Check once-per-week limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('house_id, house_changed_at')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (profile.house_changed_at) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    if (new Date(profile.house_changed_at) > oneWeekAgo) {
      return NextResponse.json(
        { error: 'Can only change house once per week' },
        { status: 400 }
      )
    }
  }

  // Update house
  const { error } = await supabase
    .from('profiles')
    .update({
      house_id: houseId,
      house_changed_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to update house' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
