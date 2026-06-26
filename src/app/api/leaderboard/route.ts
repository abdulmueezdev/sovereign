import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '50', 10)
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let query = supabase.from('profiles').select('id, character_name, house_id, level, xp_total', { count: 'exact' })
  
  if (filter !== 'all') {
    query = query.eq('house_id', filter.toLowerCase())
  }
  
  const { data: profiles, count, error } = await query
    .order('xp_total', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rankings = (profiles || []).map((p, index) => ({
    rank: (page - 1) * limit + index + 1,
    character_name: p.character_name,
    house_id: p.house_id.toUpperCase(),
    level: p.level,
    xp_total: p.xp_total,
    avatar_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${p.character_name}`
  }))

  // Find user rank (we could use window functions in RPC, but simplified here)
  const { data: allProfiles } = await supabase.from('profiles').select('id, character_name, house_id, level, xp_total').order('xp_total', { ascending: false })
  const userProfile = allProfiles?.find(p => p.id === user.id)
  const userRankIndex = allProfiles?.findIndex(p => p.id === user.id)

  let your_rank = null
  if (userProfile && userRankIndex !== undefined && userRankIndex !== -1) {
    your_rank = {
      rank: userRankIndex + 1,
      character_name: userProfile.character_name,
      house_id: userProfile.house_id.toUpperCase(),
      level: userProfile.level,
      xp_total: userProfile.xp_total
    }
  }

  return NextResponse.json({
    rankings,
    your_rank,
    total_count: count || 0,
    filter
  })
}
