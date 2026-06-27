import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Gemini call with exponential backoff
async function callGemini(body: any, retries = 3): Promise<string> {
  const modelName = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';
  for (let i = 0; i < retries; i++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    )
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
      continue
    }
    if (!res.ok) throw new Error(`Gemini ${res.status}`)
    const data = await res.json()
    return data.candidates[0].content.parts[0].text
  }
  throw new Error('Gemini failed after retries')
}

// Groq fallback — same pattern, different URL
async function callGroq(messages: any[]): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages, max_tokens: 200 })
  })
  if (!res.ok) throw new Error(`Groq ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message } = await request.json()
  if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 })

  // 1. Fetch user profile + last messages
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: history } = await supabase
    .from('companion_messages')
    .select('role, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(6)

  const reversedHistory = (history || []).reverse()

  // Save user message immediately
  await supabase.from('companion_messages').insert({
    user_id: user.id,
    role: 'user',
    content: message
  })

  // 3. RULE-BASED MATCHING
  let reply = '';
  let source = 'rule-based';

  const lower = message.toLowerCase();
  if (lower.includes('quest') || lower.includes('task')) {
    reply = `The board holds ${profile.max_active_quests ?? 'several'} active echoes. Visit the Quest Board to manifest your next challenge.`;
  } else if (lower.includes('struggling') || lower.includes('difficult') || lower.includes('hard')) {
    reply = `Even the strongest sovereigns face resistance. Return to the Quest Board and find one small action you can complete today. Momentum is built one echo at a time.`;
  } else if (lower.includes('level') || lower.includes('xp') || lower.includes('progress')) {
    reply = `You stand at level ${profile.level ?? 1}. The board awaits your next conquest.`;
  } else if (lower.includes('kingdom')) {
    reply = `${profile.kingdom_name ?? 'Your kingdom'} grows with every quest fulfilled. Visit the Kingdom to manifest new structures.`;
  } else {
    // 4. Gemini Call
    source = 'gemini'
    const systemPrompt = `You are Aegis, the Architect. A stoic, enigmatic AI companion guiding the user (${profile?.character_name || 'traveler'}) through their self-improvement journey (Sovereign). Speak in short, cryptic, but encouraging sentences. No markdown, no emojis. Maximum 3 sentences.`
    
    try {
      const contents = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Acknowledged." }] },
        ...reversedHistory.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ]

      reply = await callGemini({
        contents,
        generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
      })
    } catch (err) {
      console.error("Gemini failed:", err)
      // 5. Groq Fallback
      source = 'groq'
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          ...reversedHistory.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          { role: 'user', content: message }
        ]
        reply = await callGroq(messages)
      } catch (err2) {
        console.error("Groq failed:", err2)
        // 6. Generic Fallback
        source = 'fallback'
        reply = "The connection waivers. My insights are clouded. Return later."
      }
    }
  }

  // 7. Save companion response
  const safeResponse = reply?.trim() || "The void stirs. Your kingdom awaits action. Visit the Quest Board to manifest your next challenge."

  await supabase.from('companion_messages').insert({
    user_id: user.id,
    role: 'companion',
    content: safeResponse.substring(0, 2000)
  })

  // 8. Prune to last 10 messages
  const { data: allMessages } = await supabase
    .from('companion_messages')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (allMessages && allMessages.length > 10) {
    const idsToDelete = allMessages.slice(10).map(m => m.id)
    await supabase.from('companion_messages').delete().in('id', idsToDelete)
  }

  // 9. Return
  return NextResponse.json({ reply: safeResponse, source })
}
