'use client'

import React, { useState, useEffect, useMemo } from 'react'

type Rarity = 'common' | 'rare' | 'epic' | 'legendary'
type Status = 'earned' | 'in_progress' | 'locked'

interface AchievementData {
  id: string
  title: string
  description: string
  rarity: Rarity
  xp_bonus: number
  status: Status
  progress_current: number
  progress_target: number
  icon_name: string
  unlocked_at: string | null
}

interface AchievementsResponse {
  total: number
  earned: number
  in_progress: number
  locked: number
  completion_pct: number
  achievements: AchievementData[]
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [data, setData] = useState<AchievementsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const tabs = ['ALL', 'EARNED', 'LOCKED']

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch('/api/achievements', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
        if (res.status === 401) {
          window.location.href = '/login'
          return
        }
        if (!res.ok) {
          throw new Error('Failed to fetch achievements')
        }
        const json = await res.json()
        setData(json)
      } catch (err: any) {
        setError(err.message || 'Error loading achievements')
      } finally {
        setLoading(false)
      }
    }
    fetchAchievements()
  }, [])

  const filteredAchievements = useMemo(() => {
    if (!data) return []
    if (activeTab === 'ALL') return data.achievements
    if (activeTab === 'EARNED') return data.achievements.filter(a => a.status === 'earned' || a.status === 'in_progress')
    if (activeTab === 'LOCKED') return data.achievements.filter(a => a.status === 'locked')
    return data.achievements
  }, [activeTab, data])

  const renderRarityIndicator = (rarity: Rarity) => {
    if (rarity === 'common') return null
    if (rarity === 'rare') return <span className="font-mono text-[10px] text-[#767676] ml-2">◆</span>
    if (rarity === 'epic') return <span className="font-mono text-[10px] text-[#C41E1E] ml-2">◆</span>
    if (rarity === 'legendary') return <span className="font-mono text-[10px] text-[#C41E1E] ml-2">★</span>
  }

  return (
    <div className="max-w-[1400px] mx-auto text-[#E8E6E0] min-h-[calc(100vh-56px)] md:min-h-screen relative flex flex-col pb-32">
      
      {/* Header */}
      <div className="pt-8 md:pt-12 mb-12">
        <h1 className="font-serif text-[40px] font-bold uppercase leading-none">
          MILESTONES
        </h1>
        <p className="font-sans text-[11px] text-[#767676] tracking-[0.2em] uppercase mt-3">
          CLAIMED AND UNCLAIMED
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center font-mono text-[14px] text-[#767676] animate-pulse py-12">
          READING RECORDS...
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center font-mono text-[14px] text-[#C41E1E] py-12">
          ERROR: {error}
        </div>
      ) : data && (
        <>
          {/* Stats Row */}
          <div className="mb-12">
            <div className="font-mono text-[14px] text-[#E8E6E0] mb-3">
              {data.earned} / {data.total} CLAIMED
            </div>
            <div className="h-[2px] bg-[#1A1A1A] w-full max-w-[400px]">
              <div 
                className="h-full transition-all duration-1000" 
                style={{ 
                  width: `${data.completion_pct}%`,
                  background: 'linear-gradient(90deg, #C41E1E 0%, #8B0000 100%)' 
                }} 
              />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#767676] mt-2">
              {data.completion_pct}% COMPLETION
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-6 md:gap-8 mb-8 border-b border-[#1A1A1A]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-sans text-[11px] uppercase tracking-[0.2em] transition-colors
                    ${isActive 
                      ? 'border-b-2 border-[#C41E1E] text-[#E8E6E0]' 
                      : 'text-[#767676] hover:text-[#E8E6E0] border-b-2 border-transparent'
                    }
                  `}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {filteredAchievements.length === 0 ? (
            <div className="flex-1 flex items-center justify-center font-mono text-[12px] text-[#767676] py-12 uppercase tracking-widest text-center border border-[#1A1A1A]">
              NO MILESTONES FOUND
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1A] border border-[#1A1A1A]">
              {filteredAchievements.map((achievement) => {
                const isEarned = achievement.status === 'earned' || achievement.status === 'in_progress'
                const isLocked = achievement.status === 'locked'
                const isInProgress = achievement.status === 'in_progress'

                return (
                  <div 
                    key={achievement.id}
                    className={`
                      flex flex-col bg-[#080808] p-6
                      ${isEarned && !isInProgress ? 'border-l-2 border-l-[#C41E1E]' : ''}
                      ${isInProgress ? 'border-l-2 border-l-[#8B3A2A]' : ''}
                      ${!isLocked ? 'hover:bg-[#0C0C0C] transition-colors duration-150 cursor-default' : ''}
                    `}
                  >
                    {/* Icon Area */}
                    <div 
                      className={`
                        w-12 h-12 border border-[#2A2A2A] flex items-center justify-center mb-6 text-xl shrink-0
                        ${isLocked ? 'text-[#3A3A3A] grayscale opacity-50' : 'text-[#E8E6E0]'}
                      `}
                    >
                      {achievement.icon_name}
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className={`
                          font-serif text-[18px] font-bold leading-tight
                          ${isLocked ? 'text-[#3A3A3A]' : 'text-[#E8E6E0]'}
                          ${achievement.rarity === 'legendary' ? 'italic' : ''}
                        `}>
                          {achievement.title}
                        </h3>
                        {renderRarityIndicator(achievement.rarity)}
                      </div>

                      <p className="font-sans text-[12px] text-[#767676] line-clamp-2 leading-relaxed mb-6">
                        {achievement.description}
                      </p>

                      <div className="mt-auto">
                        {isInProgress && achievement.progress_target > 0 ? (
                          <div className="flex flex-col mb-4">
                            <div className="h-[2px] bg-[#1A1A1A] w-full mb-2">
                              <div 
                                className="h-full bg-[#C41E1E]" 
                                style={{ width: `${(achievement.progress_current / achievement.progress_target) * 100}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-[#767676]">
                              {achievement.progress_current.toLocaleString()} / {achievement.progress_target.toLocaleString()}
                            </span>
                          </div>
                        ) : null}

                        <span className={`
                          font-mono text-[11px] uppercase tracking-wider
                          ${isLocked ? 'text-[#3A3A3A]' : 'text-[#C41E1E]'}
                        `}>
                          {achievement.xp_bonus.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
      
    </div>
  )
}
