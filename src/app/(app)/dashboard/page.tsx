'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DEMO_PROFILE, DEMO_QUESTS_ACTIVE, DEMO_BUILDINGS } from '@/lib/demo-data'

import { Sidebar } from '@/components/layout/Sidebar'
import { XPBar } from '@/components/ui/XPBar'
import { StatPip } from '@/components/ui/StatPip'
import { QuestCard } from '@/components/quests/QuestCard'
import { KingdomThumbnail } from '@/components/kingdom/KingdomThumbnail'
import { CompanionQuote } from '@/components/companion/CompanionQuote'
import { LevelUpGate } from '@/components/overlays/LevelUpGate'
import { ToastContainer, useToast } from '@/components/ui/Toast'

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default function DashboardPage() {
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()
  
  const [profile, setProfile] = useState<any>(null)
  const [quests, setQuests] = useState<any[]>([])
  const [kingdom, setKingdom] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [levelUpData, setLevelUpData] = useState<{ open: boolean; newLevel: number; newTitle: string }>({
    open: false,
    newLevel: 1,
    newTitle: ''
  })

  const fetchDashboard = async () => {
    if (IS_DEMO) {
      await Promise.resolve()
      setProfile({
        ...DEMO_PROFILE,
        characterName: DEMO_PROFILE.character_name,
        xpToNext: DEMO_PROFILE.xp_to_next_level || 300,
        attributes: {
          strength: DEMO_PROFILE.attr_strength,
          vitality: DEMO_PROFILE.attr_vitality,
          intelligence: DEMO_PROFILE.attr_intelligence,
          focus: DEMO_PROFILE.attr_focus,
          technical: DEMO_PROFILE.attr_technical,
          creativity: DEMO_PROFILE.attr_creativity,
          leadership: DEMO_PROFILE.attr_leadership,
          charisma: DEMO_PROFILE.attr_charisma,
          discipline: DEMO_PROFILE.attr_discipline,
        }
      })
      setQuests(DEMO_QUESTS_ACTIVE)
      setKingdom(DEMO_BUILDINGS)
      setLoading(false)
      return
    }

    try {
      const [profileRes, questsRes, kingdomRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/quests/active'),
        fetch('/api/kingdom')
      ])
      
      if (profileRes.status === 401 || questsRes.status === 401 || kingdomRes.status === 401) {
        router.push('/login')
        return
      }

      if (!profileRes.ok || !questsRes.ok || !kingdomRes.ok) {
        setError(true)
        setLoading(false)
        return
      }
      
      const pData = await profileRes.json()
      if (!pData || !pData.onboarding_complete) {
        router.push('/onboarding')
        return
      }

      setProfile(pData)
      setQuests(await questsRes.json())
      setKingdom(await kingdomRes.json())
      setLoading(false)
    } catch (err) {
      setError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    requestAnimationFrame(() => fetchDashboard())
  }, [])

  const handleQuestComplete = () => {
    addToast({ type: 'xp', message: `++ XP AWARDED` })
    
    if (IS_DEMO) {
      fetchDashboard()
      return
    }

    fetch('/api/profile').then(res => res.json()).then(newProfile => {
      if (profile && newProfile.level > profile.level) {
        setLevelUpData({
          open: true,
          newLevel: newProfile.level,
          newTitle: 'Master of the Void'
        })
      }
      fetchDashboard()
    })
  }

  if (loading) {
    return (
      <div className="flex-1 min-h-screen p-8 md:p-12 lg:p-16 bg-[#080808]">
        <div className="max-w-[1400px] mx-auto animate-pulse space-y-8">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-[#1A1A1A] w-1/3" />
            <div className="h-8 bg-[#1A1A1A] w-16" />
          </div>
          
          {/* XP bar skeleton */}
          <div className="space-y-2">
            <div className="h-[2px] bg-[#1A1A1A] w-full" />
            <div className="flex justify-between">
              <div className="h-4 bg-[#1A1A1A] w-20" />
              <div className="h-4 bg-[#1A1A1A] w-20" />
            </div>
          </div>
          
          {/* Quest cards skeleton (2 cards) */}
          {[1, 2].map((i) => (
            <div key={i} className="border border-[#1A1A1A] p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-6 bg-[#1A1A1A] w-2/3" />
                <div className="h-4 bg-[#1A1A1A] w-16" />
              </div>
              <div className="h-4 bg-[#1A1A1A] w-full" />
              <div className="h-4 bg-[#1A1A1A] w-3/4" />
              <div className="h-[2px] bg-[#1A1A1A] w-full" />
            </div>
          ))}
          
          {/* Attributes skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 bg-[#1A1A1A] w-24" />
                <div className="flex-1 h-[2px] bg-[#1A1A1A]" />
                <div className="h-4 bg-[#1A1A1A] w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-20 animate-fade-in-up">
          <p className="font-mono text-[24px] text-[#C41E1E] uppercase">THE VOID SHIFTS UNEXPECTEDLY.</p>
          <p className="font-mono text-[14px] text-[#767676] uppercase mt-2">COULD NOT RETRIEVE YOUR DATA.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <LevelUpGate
        open={levelUpData.open}
        characterName={profile.characterName}
        newLevel={levelUpData.newLevel}
        newTitle={levelUpData.newTitle}
        onClose={() => setLevelUpData({ ...levelUpData, open: false })}
      />

      <div className="flex-1 min-h-screen p-8 md:p-12 lg:p-16 bg-[#080808] text-[#E8E6E0]">
        <div className="max-w-[1400px] mx-auto animate-fade-in-up">
            
            <div className="mb-16">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#3A3A3A] uppercase">
                  THE VOID
                </p>
              </div>
              
              <XPBar 
                current={profile.xp} 
                max={profile.xpToNext} 
                level={profile.level} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
              
              <div className="lg:col-span-4 flex flex-col gap-16">
                <CompanionQuote />
                
                <div>
                  <h2 className="font-sans text-[11px] text-[#767676] tracking-[0.2em] uppercase mb-6">
                    WEEKLY CADENCE
                  </h2>
                  <div className="border border-[#1A1A1A] h-48 flex items-center justify-center p-6">
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex justify-between items-baseline">
                        <span className="font-mono text-[10px] text-[#767676] uppercase">Cadence</span>
                        <span className="font-mono text-[10px] text-[#C41E1E]">70%</span>
                      </div>
                      <div className="h-[2px] bg-[#1A1A1A] w-full relative">
                        <div 
                          className="absolute top-0 left-0 h-full"
                          style={{ 
                            width: '70%',
                            background: 'linear-gradient(90deg, #C41E1E 0%, #8B0000 100%)',
                            boxShadow: '0 0 6px 1px rgba(196,30,30,0.3)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col">
                <h2 className="font-sans text-[11px] text-[#767676] tracking-[0.2em] uppercase mb-6">
                  MANIFESTED ECHOES
                </h2>
                <div className="flex flex-col border-b border-[#1A1A1A] pb-6">
                  {quests.length === 0 ? (
                    <div className="border border-[#1A1A1A] p-8 text-center">
                      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#3A3A3A] mb-3">NO ACTIVE QUESTS</p>
                      <p className="font-serif text-[20px] italic text-[#767676] mb-6">The board awaits your command.</p>
                      <Link href="/quests" className="inline-block bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-3 hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150">
                        GO TO QUEST BOARD
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quests.slice(0, 2).map((quest: any) => {
                        const title = quest.title || quest.quest_templates?.title;
                        const domain = quest.domain || quest.quest_templates?.domain;
                        const progress = quest.progress || 0;
                        return (
                          <div key={quest.id} className="border border-[#1A1A1A] p-5 hover:border-[#2A2A2A] transition-colors bg-[#0C0C0C]">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <span className="font-mono text-[10px] tracking-[0.15em] text-[#767676] uppercase block mb-1">
                                  {domain}
                                </span>
                                <h3 className="font-serif text-[20px] font-bold text-[#E8E6E0] leading-tight">
                                  {title}
                                </h3>
                              </div>
                              <Link href="/quests" className="font-mono text-[9px] text-[#C41E1E] hover:text-[#E8282B] uppercase tracking-[0.1em] shrink-0 mt-1">
                                CONTINUE →
                              </Link>
                            </div>
                            <div className="w-full h-[2px] bg-[#1A1A1A] relative">
                              <div
                                className="absolute top-0 left-0 h-full transition-all duration-[800ms]"
                                style={{ 
                                  width: `${progress}%`,
                                  background: 'linear-gradient(90deg, #C41E1E 0%, #8B0000 100%)',
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-col gap-16">
                <div>
                  <h2 className="font-sans text-[11px] text-[#767676] tracking-[0.2em] uppercase mb-6">
                    DOMINION
                  </h2>
                  <KingdomThumbnail 
                    name={kingdom.name || kingdom[0]?.name}
                    level={kingdom.level || 1}
                    buildings={kingdom.buildings || kingdom}
                  />
                </div>

                <div>
                  <h2 className="font-sans text-[11px] text-[#767676] tracking-[0.2em] uppercase mb-6">
                    ATTRIBUTES
                  </h2>
                  <div className="flex flex-col">
                    {profile.attributes && Object.entries(profile.attributes).map(([key, value]) => (
                      <StatPip
                        key={key}
                        attribute={key}
                        value={value as number}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
        </div>
      </div>
    </>
  )
}
