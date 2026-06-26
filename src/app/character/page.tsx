'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

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

  if (loading) return <div className="text-[#5C5C5C] font-mono text-sm tracking-widest uppercase">Initializing Entity...</div>
  if (error) return <div className="text-[#C41E1E] font-mono text-sm">Corruption Detected: {error}</div>
  if (!profile) return null

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

  // Animate bars on mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col md:flex-row gap-16 animate-fade-in pb-16 md:pb-0">
      {/* Left Column */}
      <div className="w-full md:w-[40%] flex flex-col">
        <div className="relative w-[280px] h-[380px] mb-8" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}>
          <Image src={avatarUrl} alt="Avatar" fill className="object-cover opacity-80" />
        </div>

        <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-2 uppercase">Entity Record</div>
        <h1 className="font-display text-6xl font-bold text-[#E8E6E0] mb-2 leading-none">{profile.characterName}</h1>
        <div className="font-display italic text-base text-[#5C5C5C] mb-8">
          Seeker of the {profile.houseId.charAt(0).toUpperCase() + profile.houseId.slice(1)} Order
        </div>

        <div className="w-[100px] h-px bg-[#1A1A1A] mb-8" />

        <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-2 uppercase">Temporal Fragments</div>
        <div className="font-display text-4xl text-[#C41E1E] mb-6">{toRoman(profile.level)}</div>

        <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-3 uppercase flex justify-between">
          <span>Essence Alignment</span>
          <span>{profile.xp} / {profile.xpToNext}</span>
        </div>
        <div className="h-1 bg-[#1A1A1A] w-full relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#C41E1E] transition-all duration-[1.2s] ease-out-expo"
            style={{ width: mounted ? `${xpPercent}%` : '0%' }}
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-[60%] flex flex-col gap-16 pt-8 md:pt-0">
        
        <section>
          <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-8 uppercase border-b border-[#1A1A1A] pb-4">
            Spheres of Being
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {attributes.map((attr, i) => (
              <div key={attr.key} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="font-mono text-[10px] text-[#E8E6E0] tracking-widest">{attr.label}</span>
                  <span className="font-mono text-xs text-[#C41E1E]">{attr.val}</span>
                </div>
                <div className="h-px bg-[#1A1A1A] w-full relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#E8E6E0] transition-all duration-700 ease-out-expo"
                    style={{ 
                      width: mounted ? `${Math.min(100, attr.val * 5)}%` : '0%',
                      transitionDelay: `${i * 50}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-8 uppercase border-b border-[#1A1A1A] pb-4">
            Manifested Echoes
          </div>
          <div className="flex flex-col gap-6">
            {achievements.map(ach => (
              <div key={ach.id} className={`flex items-start gap-4 ${ach.earned ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`mt-1 text-xs ${ach.earned ? 'text-[#C41E1E]' : 'text-[#5C5C5C]'}`}>◆</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className={`font-display text-lg ${ach.earned ? 'text-[#E8E6E0]' : 'text-[#5C5C5C]'}`}>{ach.title}</span>
                    {!ach.earned && <span className="font-mono text-[8px] text-[#C41E1E] tracking-widest border border-[#C41E1E]/30 px-1 py-0.5">LOCKED</span>}
                  </div>
                  <span className="font-mono text-[10px] text-[#5C5C5C] max-w-md leading-relaxed">{ach.description}</span>
                  {ach.earned && ach.earnedAt && (
                    <span className="font-mono text-[9px] text-[#3A3A3A] mt-1">Realized: {new Date(ach.earnedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
