'use client'

import React, { useState, useMemo } from 'react'

// Mock Data Generator
type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary'
type State = 'Earned' | 'InProgress' | 'Locked'

interface Achievement {
  id: string
  title: string
  description: string
  xp: number
  icon: string
  state: State
  rarity: Rarity
  progress?: { current: number; max: number }
}

const generateMockAchievements = (): Achievement[] => {
  const achievements: Achievement[] = []

  // Examples from prompt
  achievements.push({ id: '1', title: 'First Blood', description: 'Complete your first quest', xp: 100, icon: '⚔', state: 'Earned', rarity: 'Common' })
  achievements.push({ id: '2', title: "Scholar's Path", description: 'Complete 10 Scholar domain quests', xp: 250, icon: '📜', state: 'Earned', rarity: 'Rare' })
  achievements.push({ id: '3', title: 'Iron Will', description: 'Reach 50 Discipline', xp: 500, icon: '🛡', state: 'Earned', rarity: 'Epic' })
  achievements.push({ id: '4', title: 'Kingdom Founder', description: 'Build your first monument', xp: 300, icon: '♔', state: 'Earned', rarity: 'Rare' })
  achievements.push({ id: '5', title: 'Echo Collector', description: 'Earn 5,000 total XP', xp: 1000, icon: '★', state: 'Earned', rarity: 'Legendary' })

  // Fill remaining earned (19 more to make 24)
  for (let i = 0; i < 19; i++) {
    achievements.push({
      id: `e-${i}`,
      title: `Echo Resonance ${i + 1}`,
      description: `Synchronize with the void anomaly ${i + 1} times to prove your dedication.`,
      xp: 150 + i * 50,
      icon: ['✧', '⚡', '🌀', '💎'][i % 4],
      state: 'Earned',
      rarity: ['Common', 'Rare', 'Epic'][i % 3] as Rarity
    })
  }

  // In-progress examples
  achievements.push({ id: '6', title: 'Marathon Runner', description: 'Complete 50 quests', xp: 750, icon: '🏃', state: 'InProgress', rarity: 'Epic', progress: { current: 32, max: 50 } })
  achievements.push({ id: '7', title: 'House Loyalist', description: 'Earn 10,000 XP for your House', xp: 2000, icon: '🎌', state: 'InProgress', rarity: 'Legendary', progress: { current: 6400, max: 10000 } })

  // Fill remaining in-progress (10 more to make 12)
  for (let i = 0; i < 10; i++) {
    const max = (i + 2) * 10
    const current = Math.floor(max * 0.4)
    achievements.push({
      id: `p-${i}`,
      title: `Void Architect ${i + 1}`,
      description: `Construct ${max} structures in your domain.`,
      xp: 200 + i * 100,
      icon: '🏗',
      state: 'InProgress',
      rarity: 'Rare',
      progress: { current, max }
    })
  }

  // Locked examples
  achievements.push({ id: '8', title: 'Transcendence', description: 'Reach Level 20', xp: 5000, icon: '🔥', state: 'Locked', rarity: 'Legendary' })
  achievements.push({ id: '9', title: 'Void Walker', description: 'Complete a quest at 3 AM', xp: 200, icon: '🌙', state: 'Locked', rarity: 'Epic' })

  // Fill remaining locked (10 more to make 12)
  for (let i = 0; i < 10; i++) {
    achievements.push({
      id: `l-${i}`,
      title: `Abyssal Challenger ${i + 1}`,
      description: `Defeat the manifestation of your greatest fear ${i + 1} times.`,
      xp: 1000 + i * 250,
      icon: '💀',
      state: 'Locked',
      rarity: ['Rare', 'Epic', 'Legendary'][i % 3] as Rarity
    })
  }

  return achievements
}

const mockAchievements = generateMockAchievements()

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const tabs = ['ALL', 'EARNED', 'LOCKED']

  const filteredAchievements = useMemo(() => {
    if (activeTab === 'ALL') return mockAchievements
    if (activeTab === 'EARNED') return mockAchievements.filter(a => a.state === 'Earned' || a.state === 'InProgress')
    if (activeTab === 'LOCKED') return mockAchievements.filter(a => a.state === 'Locked')
    return mockAchievements
  }, [activeTab])

  const renderRarityIndicator = (rarity: Rarity) => {
    if (rarity === 'Common') return null
    if (rarity === 'Rare') return <span className="font-mono text-[10px] text-[#5C5C5C] ml-2">◆</span>
    if (rarity === 'Epic') return <span className="font-mono text-[10px] text-[#C41E1E] ml-2">◆</span>
    if (rarity === 'Legendary') return <span className="font-mono text-[10px] text-[#C41E1E] ml-2">★</span>
  }

  return (
    <div className="max-w-[1400px] mx-auto text-[#E8E6E0] min-h-[calc(100vh-56px)] md:min-h-screen relative flex flex-col pb-32">
      
      {/* Header */}
      <div className="pt-8 md:pt-12 mb-12">
        <h1 className="font-serif text-[40px] font-bold uppercase leading-none">
          MILESTONES
        </h1>
        <p className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase mt-3">
          CLAIMED AND UNCLAIMED
        </p>
      </div>

      {/* Stats Row */}
      <div className="mb-12">
        <div className="font-mono text-[14px] text-[#E8E6E0] mb-3">
          24 / 48 CLAIMED
        </div>
        <div className="h-[2px] bg-[#1A1A1A] w-full max-w-[400px]">
          <div 
            className="h-full" 
            style={{ 
              width: '50%',
              background: 'linear-gradient(90deg, #C41E1E 0%, #8B0000 100%)' 
            }} 
          />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#5C5C5C] mt-2">
          50% COMPLETION
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
                  : 'text-[#5C5C5C] hover:text-[#E8E6E0] border-b-2 border-transparent'
                }
              `}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1A] border border-[#1A1A1A]">
        {filteredAchievements.map((achievement) => {
          const isEarned = achievement.state === 'Earned' || achievement.state === 'InProgress'
          const isLocked = achievement.state === 'Locked'
          const isInProgress = achievement.state === 'InProgress'

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
                {achievement.icon}
              </div>

              {/* Text Info */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center mb-2">
                  <h3 className={`
                    font-serif text-[18px] font-bold leading-tight
                    ${isLocked ? 'text-[#3A3A3A]' : 'text-[#E8E6E0]'}
                    ${achievement.rarity === 'Legendary' ? 'italic' : ''}
                  `}>
                    {achievement.title}
                  </h3>
                  {renderRarityIndicator(achievement.rarity)}
                </div>

                <p className="font-sans text-[12px] text-[#5C5C5C] line-clamp-2 leading-relaxed mb-6">
                  {achievement.description}
                </p>

                <div className="mt-auto">
                  {isInProgress && achievement.progress ? (
                    <div className="flex flex-col mb-4">
                      <div className="h-[2px] bg-[#1A1A1A] w-full mb-2">
                        <div 
                          className="h-full bg-[#C41E1E]" 
                          style={{ width: `${(achievement.progress.current / achievement.progress.max) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-[#5C5C5C]">
                        {achievement.progress.current.toLocaleString()} / {achievement.progress.max.toLocaleString()}
                      </span>
                    </div>
                  ) : null}

                  <span className={`
                    font-mono text-[11px] uppercase tracking-wider
                    ${isLocked ? 'text-[#3A3A3A]' : 'text-[#C41E1E]'}
                  `}>
                    {achievement.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
    </div>
  )
}
