'use client'

import { useUser } from '@/contexts/UserContext'
import { UserProvider } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Sidebar } from '@/components/layout/Sidebar'
import { QuestCard } from '@/components/quests/QuestCard'
import { ToastContainer, useToast } from '@/components/ui/Toast'
import { LevelUpGate } from '@/components/overlays/LevelUpGate'

import { DEMO_QUESTS_ACTIVE, DEMO_QUESTS_DORMANT, DEMO_QUESTS_FULFILLED } from '@/lib/demo-data'
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

function QuestsContent() {
  const { user, profile: userProfile, loading: authLoading } = useUser()
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()

  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'completed'>('active')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  const [quests, setQuests] = useState<any[]>([])

  const [levelUpData, setLevelUpData] = useState<{ open: boolean; newLevel: number; newTitle: string }>({
    open: false,
    newLevel: 1,
    newTitle: ''
  })

  useEffect(() => {
    if (IS_DEMO) return
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const fetchQuests = async (tab: string) => {
    setLoading(true)
    setError(false)
    if (IS_DEMO) {
      if (tab === 'active') setQuests(DEMO_QUESTS_ACTIVE)
      else if (tab === 'available') setQuests(DEMO_QUESTS_DORMANT)
      else setQuests(DEMO_QUESTS_FULFILLED)
      setLoading(false)
      return
    }

    try {
      const endpoint = tab === 'active' ? '/api/quests/active' 
                     : tab === 'available' ? '/api/quests/available' 
                     : '/api/quests/completed'
                     
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setQuests(data)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (IS_DEMO) {
      fetchQuests(activeTab)
      return
    }
    if (user && userProfile?.onboarding_complete) {
      fetchQuests(activeTab)
    }
  }, [user, userProfile, activeTab])

  const handleStartQuest = async (questTemplateId: string) => {
    if (IS_DEMO) {
      const template = DEMO_QUESTS_DORMANT.find(q => q.id === questTemplateId)
      DEMO_QUESTS_ACTIVE.push({
        id: `demo-${Date.now()}`,
        quest_template_id: questTemplateId,
        status: 'active',
        started_at: new Date().toISOString(),
        quest_templates: template as any,
        objectives_completed: [],
      })
      setActiveTab('active')
      addToast({ type: 'success', message: 'QUEST MANIFESTED' })
      return
    }

    try {
      const res = await fetch('/api/quests/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questTemplateId }),
      })
      if (!res.ok) throw new Error()
      addToast({ type: 'success', message: 'QUEST MANIFESTED' })
      fetchQuests(activeTab)
    } catch (err) {
      addToast({ type: 'error', message: 'FAILED TO MANIFEST' })
    }
  }

  const handleCompleteQuest = async (questId: string, xpReward: number) => {
    if (IS_DEMO) {
      const idx = DEMO_QUESTS_ACTIVE.findIndex(q => q.id === questId)
      if (idx !== -1) {
        DEMO_QUESTS_ACTIVE.splice(idx, 1)
        addToast({ type: 'xp', message: `+${xpReward} XP EARNED` })
        fetchQuests(activeTab)
      }
      return
    }

    try {
      const res = await fetch(`/api/quests/${questId}/complete`, { method: 'POST' })
      if (!res.ok) throw new Error()
      addToast({ type: 'xp', message: `+${xpReward} XP EARNED` })
      fetchQuests(activeTab)
    } catch (err) {
      addToast({ type: 'error', message: 'FAILED TO COMPLETE' })
    }
  }

  if (authLoading || (loading && quests.length === 0 && !error)) {
    return (
      <div className="flex-1 p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-4xl animate-pulse">
          <div className="h-8 bg-[#1A1A1A] w-1/3 mb-12" />
          <div className="h-64 bg-[#1A1A1A] w-full" />
        </div>
      </div>
    )
  }

  if (!IS_DEMO && (!user || (!userProfile?.onboarding_complete && !authLoading))) {
    return null
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <LevelUpGate
        open={levelUpData.open}
        characterName={userProfile?.character_name || 'Sovereign'}
        newLevel={levelUpData.newLevel}
        newTitle={levelUpData.newTitle}
        onClose={() => setLevelUpData({ ...levelUpData, open: false })}
      />

      <div className="flex-1 min-h-screen p-8 md:p-12 lg:p-16">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            
            <div className="mb-12">
              <h1 className="font-serif text-[48px] font-bold text-[#E8E6E0] mb-2 leading-none">
                The Board
              </h1>
              <p className="font-sans text-[14px] text-[#5C5C5C]">
                Manifest your will. Choose your trials.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#1A1A1A] mb-8">
              {[
                { id: 'active', label: 'Manifest' },
                { id: 'available', label: 'Dormant' },
                { id: 'completed', label: 'Fulfilled' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-[#C41E1E] text-[#E8E6E0]' 
                      : 'border-transparent text-[#5C5C5C] hover:text-[#E8E6E0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex flex-col border-b border-[#1A1A1A] min-h-[400px]">
              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-[#1A1A1A] border-t-[#C41E1E] rounded-none animate-spin" />
                </div>
              ) : error ? (
                <div className="py-12 text-[#C41E1E] font-mono text-[11px] uppercase tracking-widest text-center">
                  FAILED TO SYNCHRONIZE WITH THE VOID.
                </div>
              ) : quests.length === 0 ? (
                <div className="py-12 text-[#5C5C5C] font-mono text-[11px] uppercase tracking-widest text-center">
                  No {activeTab} echoes found.
                </div>
              ) : (
                quests.map((quest: any, i: number) => {
                  const questTemplate = quest.quest_templates || quest;
                  return (
                    <QuestCard
                      key={quest.id}
                      index={i}
                      id={quest.id}
                      title={questTemplate.title}
                      description={questTemplate.description}
                      domain={questTemplate.domain}
                      xpReward={questTemplate.xp_reward || questTemplate.xpReward}
                      rarity={questTemplate.rarity || 'common'}
                      progress={0}
                      status={activeTab === 'active' ? 'active' : activeTab === 'available' ? 'available' : 'completed'}
                      objectives={questTemplate.objectives ? questTemplate.objectives.map((o:any, idx:number) => ({ id: `${idx}`, text: o, completed: quest.objectives_completed?.[idx] || false })) : []}
                      onContinue={
                        activeTab === 'available' ? () => handleStartQuest(quest.id) :
                        activeTab === 'active' ? () => handleCompleteQuest(quest.id, questTemplate.xp_reward || questTemplate.xpReward) : undefined
                      }
                    />
                  )
                })
              )}
            </div>

        </div>
      </div>
    </>
  )
}

export default function QuestsPage() {
  return (
    <UserProvider>
      <QuestsContent />
    </UserProvider>
  )
}
