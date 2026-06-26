import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const STAFF_EMAILS = ['admin@sovereign.local', 'test@test.com'] // Adjust as needed

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email || !STAFF_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: 'Forbidden. Staff access required.' }, { status: 403 })
  }

  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, character_name, class, level, house_id, updated_at')
    .order('updated_at', { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  return NextResponse.json({ users })
}
