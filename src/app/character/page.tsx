'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Sidebar } from '@/components/layout/Sidebar'

function toRoman(num: number): string {
  const lookup: Record<string, number> = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1}
  let roman = ''
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i
      num -= lookup[i]
    }
  }
  return roman || '0'
}

export default function CharacterPage() {
  const [profile, setProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, achRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/achievements')
        ])

        if (!profileRes.ok || !achRes.ok) throw new Error('Failed to fetch data')
        
        const profileData = await profileRes.json()
        const achData = await achRes.json()

        setProfile(profileData)
        setAchievements(achData.achievements || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#080808]">
        <Sidebar />
        <main className="flex-1 md:ml-[64px] p-8 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="text-[#5C5C5C] font-mono text-[11px] tracking-[0.2em] uppercase">Initializing Entity...</div>
        </main>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen bg-[#080808]">
        <Sidebar />
        <main className="flex-1 md:ml-[64px] p-8 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="text-[#C41E1E] font-mono text-[11px] tracking-[0.2em] uppercase">Corruption Detected: {error}</div>
        </main>
      </div>
    )
  }

  const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${profile.characterName}&backgroundColor=080808`
  const xpPercent = Math.min(100, Math.max(0, (profile.xp / profile.xpToNext) * 100))

  const attributes = [
    { key: 'strength', label: 'STRENGTH', val: profile.attributes.strength },
    { key: 'vitality', label: 'VITALITY', val: profile.attributes.vitality },
    { key: 'intelligence', label: 'INTELLIGENCE', val: profile.attributes.intelligence },
    { key: 'focus', label: 'FOCUS', val: profile.attributes.focus },
    { key: 'technical', label: 'TECHNICAL', val: profile.attributes.technical },
    { key: 'creativity', label: 'CREATIVITY', val: profile.attributes.creativity },
    { key: 'leadership', label: 'LEADERSHIP', val: profile.attributes.leadership },
    { key: 'charisma', label: 'CHARISMA', val: profile.attributes.charisma },
    { key: 'discipline', label: 'DISCIPLINE', val: profile.attributes.discipline },
  ]

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar />
      <main className="flex-1 md:ml-[64px] p-8 md:p-12 lg:p-16 min-h-screen">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 animate-fade-in-up">
          
          {/* Left Column (40%) - Attributes / Stats */}
          <div className="w-full md:w-[40%] flex flex-col">
            <div className="mb-12">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="text-[11px] text-[#5C5C5C] font-sans tracking-[0.2em] mb-4 uppercase">
                    Entity Record
                  </div>
                  <h1 className="font-serif text-[64px] md:text-[80px] font-bold text-[#E8E6E0] mb-2 leading-none">
                    {profile.characterName}
                  </h1>
                  <div className="font-serif italic text-[22px] text-[#5C5C5C]">
                    Seeker of the {profile.houseId.charAt(0).toUpperCase() + profile.houseId.slice(1)} Order
                  </div>
                </div>
                <div className="flex flex-col items-end pt-2">
                  <div className="text-[11px] text-[#5C5C5C] font-sans tracking-[0.2em] mb-2 uppercase">
                    LEVEL
                  </div>
                  <div className="font-serif text-[64px] text-[#C41E1E] leading-none">
                    {toRoman(profile.level)}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#1A1A1A] mb-12" />

            <div className="mb-16">
              <div className="flex justify-between items-baseline mb-4">
                <div className="text-[11px] text-[#5C5C5C] font-sans tracking-[0.2em] uppercase">
                  Temporal Fragments
                </div>
                <span className="font-mono text-[14px] text-[#5C5C5C]">
                  {profile.xp.toLocaleString()} / {profile.xpToNext.toLocaleString()} XP
                </span>
              </div>

              {/* XP Bar */}
              <div className="h-[2px] bg-[#1A1A1A] w-full relative">
                <div 
                  className="absolute top-0 left-0 h-full transition-all duration-[800ms]"
                  style={{ 
                    width: mounted ? `${xpPercent}%` : '0%',
                    background: 'linear-gradient(90deg, #C41E1E 0%, #8B0000 100%)',
                    boxShadow: '0 0 6px 1px rgba(196,30,30,0.3)',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>
            </div>

            <div className="mb-12">
              <div className="text-[11px] text-[#5C5C5C] font-sans tracking-[0.2em] mb-8 uppercase border-b border-[#1A1A1A] pb-4">
                Spheres of Being
              </div>
              <div className="flex flex-col gap-8">
                {attributes.map((attr, i) => (
                  <div key={attr.key} className="flex flex-col gap-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase">
                        {attr.label}
                      </span>
                      <span className="font-serif text-[22px] font-bold text-[#E8E6E0]">
                        {attr.val}
                      </span>
                    </div>
                    {/* 1px attribute bar */}
                    <div className="h-[1px] bg-[#1A1A1A] w-full relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-[#E8E6E0] transition-all duration-700"
                        style={{ 
                          width: mounted ? `${Math.min(100, attr.val * 5)}%` : '0%',
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${i * 50}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (60%) - Quests / Milestones */}
          <div className="w-full md:w-[60%] flex flex-col pt-2 md:pt-0">
            <div className="text-[11px] text-[#5C5C5C] font-sans tracking-[0.2em] mb-8 uppercase border-b border-[#1A1A1A] pb-4">
              Manifested Echoes
            </div>
            
            <div className="flex flex-col gap-6">
              {achievements.length === 0 ? (
                <div className="text-[#5C5C5C] font-sans text-[14px]">No milestones realized yet.</div>
              ) : (
                achievements.map((ach) => (
                  <div key={ach.id} className={`flex flex-col gap-2 p-6 border border-[#1A1A1A] ${ach.earned ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className={`font-serif text-[22px] font-bold ${ach.earned ? 'text-[#E8E6E0]' : 'text-[#5C5C5C]'}`}>
                        {ach.title}
                      </h3>
                      {!ach.earned && (
                        <span className="font-sans text-[10px] text-[#C41E1E] tracking-[0.2em] uppercase border border-[#2A2A2A] px-2 py-1">
                          LOCKED
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-[14px] text-[#5C5C5C] leading-relaxed">
                      {ach.description}
                    </p>
                    {ach.earned && ach.earnedAt && (
                      <div className="font-mono text-[10px] text-[#5C5C5C] tracking-[0.15em] mt-2">
                        REALIZED: {new Date(ach.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}
