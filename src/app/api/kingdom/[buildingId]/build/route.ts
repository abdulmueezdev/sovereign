import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ buildingId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const buildingId = (await params).buildingId

  // Check if building is actually available to build
  const { data: userBuilding, error: ubError } = await supabase
    .from('user_buildings')
    .select('status')
    .eq('user_id', user.id)
    .eq('building_id', buildingId)
    .single()

  if (ubError || !userBuilding) {
    return NextResponse.json({ error: 'Building not available to build' }, { status: 400 })
  }

  if (userBuilding.status === 'built') {
    return NextResponse.json({ error: 'Building already built' }, { status: 400 })
  }
  
  if (userBuilding.status !== 'available') {
    return NextResponse.json({ error: 'Building requirements not met yet' }, { status: 400 })
  }

  // Update status to built
  const { error: updateError } = await supabase
    .from('user_buildings')
    .update({ 
      status: 'built',
      built_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .eq('building_id', buildingId)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to build structure' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Structure manifested successfully' })
}
