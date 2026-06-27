import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const tables = [
    'profiles','quest_templates','user_quests','quest_objectives',
    'buildings','user_buildings','companion_messages','achievements',
    'user_achievements','weekly_xp','skills','user_skills'
  ];

  const results: Record<string, string> = {};
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table).select('*', { count: 'exact', head: true });
    results[table] = error ? `ERROR: ${error.message}` : `${count} rows`;
  }

  const { data: sample } = await supabase.from('profiles').select('*').limit(1);
  results['profiles_columns'] = sample?.[0]
    ? Object.keys(sample[0]).join(', ')
    : 'empty or inaccessible';

  return NextResponse.json(results, { status: 200 });
}
