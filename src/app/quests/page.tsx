'use client'

import { useUser } from '@/contexts/UserContext'
import { UserProvider } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Sidebar } from '@/components/layout/Sidebar'
import { QuestCard } from '@/components/quests/QuestCard'
import { ToastContainer, useToast } from '@/components/ui/Toast'
import { LevelUpGate } from '@/components/overlays/LevelUpGate'

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
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const fetchQuests = async (tab: string) => {
    setLoading(true)
    setError(false)
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
    if (user && userProfile?.onboarding_complete) {
      fetchQuests(activeTab)
    }
  }, [user, userProfile, activeTab])

  const handleQuestComplete = () => {
    addToast({ type: 'xp', message: `++ XP AWARDED` })
    
    fetch('/api/profile').then(res => res.json()).then(newProfile => {
      if (userProfile && newProfile.level > userProfile.level) {
        setLevelUpData({
          open: true,
          newLevel: newProfile.level,
          newTitle: 'Master of the Void'
        })
      }
      fetchQuests(activeTab)
    })
  }

  if (authLoading || (loading && quests.length === 0 && !error)) {
    return (
      <div className="flex min-h-screen bg-[#080808]">
        <Sidebar />
        <main className="flex-1 md:ml-[64px] p-8 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-4xl animate-pulse">
            <div className="h-8 bg-[#1A1A1A] w-1/3 mb-12" />
            <div className="h-64 bg-[#1A1A1A] w-full" />
          </div>
        </main>
      </div>
    )
  }

  if (!user || (!userProfile?.onboarding_complete && !authLoading)) {
    return null
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <LevelUpGate
        open={levelUpData.open}
        characterName={userProfile?.characterName || 'Sovereign'}
        newLevel={levelUpData.newLevel}
        newTitle={levelUpData.newTitle}
        onClose={() => setLevelUpData({ ...levelUpData, open: false })}
      />

      <div className="flex min-h-screen bg-[#080808]">
        <Sidebar />
        
        <main className="flex-1 md:ml-[64px] min-h-screen p-8 md:p-12 lg:p-16">
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
                { id: 'active', label: 'Active' },
                { id: 'available', label: 'Dormant' },
                { id: 'completed', label: 'Fulfilled' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`font-mono text-[11px] tracking-[0.2em] uppercase px-8 py-4 border-b-2 transition-colors ${
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
                  <div className="w-6 h-6 border-2 border-[#1A1A1A] border-t-[#C41E1E] rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="py-12 text-[#C41E1E] font-mono text-[11px] uppercase tracking-widest text-center">
                  Failed to synchronize with the void.
                </div>
              ) : quests.length === 0 ? (
                <div className="py-12 text-[#5C5C5C] font-mono text-[11px] uppercase tracking-widest text-center">
                  No {activeTab} echoes found.
                </div>
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
                    objectives={quest.objectives || []}
                    onContinue={activeTab === 'active' ? handleQuestComplete : undefined}
                  />
                ))
              )}
            </div>

          </div>
        </main>
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
