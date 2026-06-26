import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('house_id, character_name').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const now = new Date()
  const day = now.getUTCDay()
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1) // Monday
  const weekStart = new Date(now.setUTCDate(diff))
  weekStart.setUTCHours(0,0,0,0)
  const weekStartStr = weekStart.toISOString().split('T')[0]

  // Get all weekly_xp for this week
  const { data: allWeeklyXp } = await supabase
    .from('weekly_xp')
    .select(`
      xp_earned,
      house_id,
      profiles:user_id ( character_name, id )
    `)
    .eq('week_start', weekStartStr)
    
  const data = allWeeklyXp || []

  // Standings
  const houses = ['zenith', 'ash', 'forge', 'crown']
  const standings = houses.map(h => {
    const total_xp = data.filter(d => d.house_id === h).reduce((sum, d) => sum + d.xp_earned, 0)
    return {
      house_id: h.toUpperCase(),
      house_name: `HOUSE OF ${h.toUpperCase()}`,
      total_xp,
      progress_pct: Math.min(100, Math.round((total_xp / 8000) * 100)),
      is_user_house: h === profile.house_id
    }
  }).sort((a, b) => b.total_xp - a.total_xp)

  // Members of user's house
  const houseData = data
    .filter(d => d.house_id === profile.house_id)
    .sort((a, b) => b.xp_earned - a.xp_earned)

  const members = houseData.map((d, index) => {
    const p = Array.isArray(d.profiles) ? d.profiles[0] : d.profiles;
    return {
      rank: index + 1,
      character_name: (p as any)?.character_name || 'Unknown',
      avatar_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${(p as any)?.character_name}`,
      xp_contributed: d.xp_earned,
      is_top_three: index < 3
    }
  })

  // User's contribution
  const userRank = members.findIndex(m => m.character_name === profile.character_name) + 1
  const userXp = members.find(m => m.character_name === profile.character_name)?.xp_contributed || 0

  return NextResponse.json({
    house: {
      id: profile.house_id.toUpperCase(),
      name: `HOUSE OF ${profile.house_id.toUpperCase()}`,
      weekly_goal: 8000,
      weekly_current: standings.find(s => s.is_user_house)?.total_xp || 0,
      days_remaining: 7 - (now.getUTCDay() || 7) // Sunday is 7 in this logic
    },
    members,
    standings,
    your_contribution: {
      rank: userRank || 999,
      xp: userXp
    }
  })
}
