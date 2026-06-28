'use client'

import { useState, useEffect } from 'react'
import { DEMO_PROFILE, DEMO_ACHIEVEMENTS } from '@/lib/demo-data'

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default function CharacterPage() {
  const [profile, setProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (IS_DEMO) {
      const mappedProfile = {
        ...DEMO_PROFILE,
        characterName: DEMO_PROFILE.character_name,
        xpToNext: DEMO_PROFILE.xp_to_next_level || 300,
        attributes: {
          strength: DEMO_PROFILE.attr_strength || 0,
          vitality: DEMO_PROFILE.attr_vitality || 0,
          intelligence: DEMO_PROFILE.attr_intelligence || 0,
          focus: DEMO_PROFILE.attr_focus || 0,
          technical: DEMO_PROFILE.attr_technical || 0,
          creativity: DEMO_PROFILE.attr_creativity || 0,
          leadership: DEMO_PROFILE.attr_leadership || 0,
          charisma: DEMO_PROFILE.attr_charisma || 0,
          discipline: DEMO_PROFILE.attr_discipline || 0,
        }
      }
      setProfile(mappedProfile)
      setAchievements(DEMO_ACHIEVEMENTS || [])
      setLoading(false)
      return
    }
    
    // Real API fallback
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-[#E8E6E0] p-8">Loading...</div>
  if (!profile) return <div className="text-[#E8E6E0] p-8">Error loading character</div>

  const attributes = [
    { key: 'strength', label: 'STRENGTH', val: profile.attributes?.strength ?? profile.attr_strength ?? 0 },
    { key: 'vitality', label: 'VITALITY', val: profile.attributes?.vitality ?? profile.attr_vitality ?? 0 },
    { key: 'intelligence', label: 'INTELLIGENCE', val: profile.attributes?.intelligence ?? profile.attr_intelligence ?? 0 },
    { key: 'focus', label: 'FOCUS', val: profile.attributes?.focus ?? profile.attr_focus ?? 0 },
    { key: 'technical', label: 'TECHNICAL', val: profile.attributes?.technical ?? profile.attr_technical ?? 0 },
    { key: 'creativity', label: 'CREATIVITY', val: profile.attributes?.creativity ?? profile.attr_creativity ?? 0 },
    { key: 'leadership', label: 'LEADERSHIP', val: profile.attributes?.leadership ?? profile.attr_leadership ?? 0 },
    { key: 'charisma', label: 'CHARISMA', val: profile.attributes?.charisma ?? profile.attr_charisma ?? 0 },
    { key: 'discipline', label: 'DISCIPLINE', val: profile.attributes?.discipline ?? profile.attr_discipline ?? 0 },
  ]

  return (
    <div className="min-h-screen bg-[#080808] text-[#E8E6E0] p-8 md:p-12 lg:p-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-[48px] md:text-[64px] font-bold">
          {profile.characterName || profile.character_name}
        </h1>
        <p className="font-sans text-[14px] text-[#5C5C5C] mt-2">
          {profile.xp?.toLocaleString()} / {profile.xpToNext?.toLocaleString()} XP
        </p>
        
        <div className="w-full h-[2px] bg-[#1A1A1A] mt-4">
          <div 
            className="h-full bg-gradient-to-r from-[#C41E1E] to-[#8B0000]"
            style={{ 
              width: `${Math.min((profile.xp / profile.xpToNext) * 100, 100)}%`,
              boxShadow: '0 0 6px 1px rgba(196,30,30,0.3)'
            }}
          />
        </div>

        <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#5C5C5C] mt-12 mb-6">
          Spheres of Being
        </h2>
        
        {attributes.map((attr) => (
          <div key={attr.key} className="mb-6">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#E8E6E0]">
                {attr.label}
              </span>
              <span className="font-serif text-[28px] text-[#E8E6E0]">
                {attr.val}
              </span>
            </div>
            <div className="w-full h-[1px] bg-[#1A1A1A] mt-2">
              <div 
                className="h-full bg-[#C41E1E]" 
                style={{ width: `${Math.min((attr.val / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}

        <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#5C5C5C] mt-12 mb-6">
          Manifested Echoes
        </h2>
        
        {achievements.length === 0 ? (
          <p className="font-cormorant text-[18px] italic text-[#3A3A3A]">No milestones realized yet.</p>
        ) : (
          achievements.map((ach) => (
            <div key={ach.id} className="border border-[#1A1A1A] p-4 mb-4">
              <h3 className="font-serif text-[22px] font-bold">{ach.title}</h3>
              {!ach.earned && (
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C41E1E]">LOCKED</span>
              )}
              <p className="font-sans text-[14px] text-[#5C5C5C] mt-2">{ach.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
