'use client'

import { useUser } from '@/contexts/UserContext'
import { UserProvider } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Sidebar } from '@/components/layout/Sidebar'
import { XPBar } from '@/components/ui/XPBar'
import { StatPip } from '@/components/ui/StatPip'
import { QuestCard } from '@/components/quests/QuestCard'
import { KingdomThumbnail } from '@/components/kingdom/KingdomThumbnail'
import { CompanionQuote } from '@/components/companion/CompanionQuote'
import { LevelUpGate } from '@/components/overlays/LevelUpGate'
import { ToastContainer, useToast } from '@/components/ui/Toast'

import { DEMO_PROFILE, DEMO_QUESTS_ACTIVE, DEMO_BUILDINGS } from '@/lib/demo-data'
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

function DashboardContent() {
  const { user, profile: userProfile, loading: authLoading } = useUser()
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [profile, setProfile] = useState<any>(null)
  const [quests, setQuests] = useState<any[]>([])
  const [kingdom, setKingdom] = useState<any>(null)

  const [levelUpData, setLevelUpData] = useState<{ open: boolean; newLevel: number; newTitle: string }>({
    open: false,
    newLevel: 1,
    newTitle: ''
  })

  useEffect(() => {
    if (IS_DEMO) return
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (IS_DEMO) return
    if (!authLoading && user) {
      if (!userProfile || !userProfile.onboarding_complete) {
        router.push('/onboarding')
      }
    }
  }, [user, userProfile, authLoading, router])

  const fetchDashboard = async () => {
    if (IS_DEMO) {
      setProfile(DEMO_PROFILE)
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
      
      if (!profileRes.ok || !questsRes.ok || !kingdomRes.ok) {
        setError(true)
        setLoading(false)
        return
      }
      
      setProfile(await profileRes.json())
      setQuests(await questsRes.json())
      setKingdom(await kingdomRes.json())
      setLoading(false)
    } catch (err) {
      setError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (IS_DEMO) {
      fetchDashboard()
      return
    }
    if (user && userProfile?.onboarding_complete) {
      fetchDashboard()
    }
  }, [user, userProfile])

  const handleQuestComplete = () => {
    addToast({ type: 'xp', message: `++ XP AWARDED` })
    
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

  if (authLoading || (loading && !error && userProfile?.onboarding_complete)) {
    return (
      <div className="flex-1 p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-[#1A1A1A] w-1/3 mb-4" />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4 h-48 bg-[#1A1A1A]" />
              <div className="col-span-5 h-48 bg-[#1A1A1A]" />
              <div className="col-span-3 h-48 bg-[#1A1A1A]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || (!userProfile?.onboarding_complete && !authLoading)) {
    return null
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

      <div className="flex-1 min-h-screen p-8 md:p-12 lg:p-16">
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
                  <div className="border border-[#1A1A1A] h-48 flex items-center justify-center text-[#3A3A3A] font-mono text-[10px]">
                    [ PROGRESS RING PLACEHOLDER ]
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
                        title={quest.title}
                        description={quest.description}
                        domain={quest.domain}
                        xpReward={quest.xpReward}
                        rarity={quest.rarity}
                        progress={quest.progress}
                        dueDate={quest.dueDate}
                        status={quest.status}
                        objectives={quest.objectives}
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
                    name={kingdom.name}
                    level={kingdom.level}
                    buildings={kingdom.buildings}
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

export default function DashboardPage() {
  return (
    <UserProvider>
      <DashboardContent />
    </UserProvider>
  )
}
