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
    fetchDashboard()
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
      <div className="flex-1 p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full">
          <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
            <div className="h-8 bg-[#1A1A1A] w-1/3" />
            <div className="h-4 bg-[#1A1A1A] w-1/4 mb-8" />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4 space-y-4">
                <div className="h-32 bg-[#1A1A1A]" />
                <div className="h-24 bg-[#1A1A1A]" />
              </div>
              <div className="col-span-5 space-y-4">
                <div className="h-48 bg-[#1A1A1A]" />
              </div>
              <div className="col-span-3 space-y-4">
                <div className="h-32 bg-[#1A1A1A]" />
              </div>
            </div>
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
          <p className="font-mono text-[14px] text-[#5C5C5C] uppercase mt-2">COULD NOT RETRIEVE YOUR DATA.</p>
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
                  <h2 className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase mb-6">
                    WEEKLY CADENCE
                  </h2>
                  <div className="border border-[#1A1A1A] h-48 flex items-center justify-center p-6">
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex justify-between items-baseline">
                        <span className="font-mono text-[10px] text-[#5C5C5C] uppercase">Cadence</span>
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
                <h2 className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase mb-6">
                  MANIFESTED ECHOES
                </h2>
                <div className="flex flex-col border-b border-[#1A1A1A]">
                  {quests.length === 0 ? (
                    <div className="py-8 text-[#5C5C5C] font-sans text-sm">No active quests. The void is still.</div>
                  ) : (
                    quests.map((quest: any, i: number) => (
                      <QuestCard
                        key={quest.id}
                        index={i}
                        id={quest.id}
                        title={quest.title || quest.quest_templates?.title}
                        description={quest.description || quest.quest_templates?.description}
                        domain={quest.domain || quest.quest_templates?.domain}
                        xpReward={quest.xpReward || quest.quest_templates?.xp_reward}
                        rarity={quest.rarity}
                        progress={quest.progress}
                        dueDate={quest.dueDate}
                        status={quest.status}
                        objectives={quest.objectives || quest.quest_templates?.objectives}
                        onContinue={handleQuestComplete}
                      />
                    ))
                  )}
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-col gap-16">
                <div>
                  <h2 className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase mb-6">
                    DOMINION
                  </h2>
                  <KingdomThumbnail 
                    name={kingdom.name || kingdom[0]?.name}
                    level={kingdom.level || 1}
                    buildings={kingdom.buildings || kingdom}
                  />
                </div>

                <div>
                  <h2 className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase mb-6">
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
