'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'

// Mock Data Generator
const HOUSES = ['ZENITH', 'ASH', 'FORGE', 'CROWN']
const FIRST_NAMES = ['Kael', 'Lyra', 'Nova', 'Orion', 'Vega', 'Seraph', 'Aeon', 'Rex', 'Jace', 'Elara', 'Vane', 'Jax', 'Sila', 'Ronin', 'Kyra']

function generateMockData() {
  const data = []
  let currentXP = 45000
  for (let i = 1; i <= 50; i++) {
    if (i === 17) {
      data.push({
        rank: 17,
        name: 'YourCharacterName',
        house: 'ZENITH',
        level: 5,
        xp: 4230,
        isCurrentUser: true,
      })
      currentXP -= 100
      continue
    }

    currentXP -= Math.floor(Math.random() * 1500) + 100
    if (currentXP < 0) currentXP = 50

    const level = Math.max(1, Math.floor(currentXP / 3000))
    const house = HOUSES[Math.floor(Math.random() * HOUSES.length)]
    const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] + (Math.floor(Math.random() * 99) + 1)

    data.push({
      rank: i,
      name,
      house,
      level: Math.min(15, level),
      xp: currentXP,
      isCurrentUser: false,
    })
  }
  return data
}

const mockData = generateMockData()

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('ALL')

  const tabs = ['ALL', 'ZENITH', 'ASH', 'FORGE', 'CROWN']

  const filteredData = useMemo(() => {
    if (activeTab === 'ALL') return mockData
    return mockData.filter(d => d.house === activeTab)
  }, [activeTab])

  const currentUser = mockData.find(d => d.isCurrentUser)!

  return (
    <div className="max-w-[1400px] mx-auto text-[#E8E6E0] min-h-[calc(100vh-56px)] md:min-h-screen relative flex flex-col pb-32">
      
      {/* Header */}
      <div className="pt-8 md:pt-12 mb-12">
        <h1 className="font-serif text-[40px] font-bold uppercase leading-none">
          THE RANKINGS
        </h1>
        <p className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase mt-3">
          GLOBAL ECHOES
        </p>
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

      {/* Leaderboard Table (Desktop Header - Optional but good for clarity, although user didn't explicitly ask for table headers, flex container columns implied. I will skip headers and just list rows as spec'd) */}
      
      <div className="flex flex-col flex-1">
        {filteredData.map((row) => {
          const isTop3 = row.rank <= 3
          return (
            <div 
              key={row.rank}
              className={`
                flex items-center justify-between py-4 border-b border-[#1A1A1A] transition-colors duration-150
                ${isTop3 ? 'bg-[#0C0C0C]' : 'hover:bg-[#0C0C0C]'}
                ${row.isCurrentUser ? 'border-l-2 border-l-[#C41E1E] pl-3' : 'pl-4'}
                pr-4
              `}
            >
              <div className="flex items-center flex-1">
                {/* RANK */}
                <div className={`w-[60px] font-mono text-[14px] shrink-0 ${isTop3 ? 'text-[#C41E1E]' : 'text-[#5C5C5C]'}`}>
                  {row.rank === 1 ? '♔ 1' : row.rank}
                </div>

                {/* AVATAR + NAME */}
                <div className="flex items-center gap-4 flex-1 min-w-[120px]">
                  <div className="w-8 h-8 relative grayscale border border-[#1A1A1A] shrink-0">
                    <Image 
                      src={`https://api.dicebear.com/7.x/shapes/svg?seed=${row.name}`} 
                      alt={row.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <span className="font-sans text-[14px] truncate">{row.name}</span>
                </div>
              </div>

              {/* HOUSE */}
              <div className="hidden md:flex flex-1 justify-center shrink-0">
                <span 
                  className={`
                    font-sans text-[11px] uppercase border px-2 py-1 tracking-widest
                    ${row.house === 'ZENITH' ? 'border-[#C41E1E] text-[#C41E1E]' : 'border-[#2A2A2A] text-[#5C5C5C]'}
                  `}
                >
                  {row.house}
                </span>
              </div>

              {/* LEVEL & XP */}
              <div className="flex items-center justify-end gap-6 md:gap-12 flex-1 shrink-0">
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 text-right">
                  <span className="font-mono text-[10px] text-[#5C5C5C] md:hidden">LVL</span>
                  <span className="font-serif text-[22px] font-bold">{row.level}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 text-right w-[80px] md:w-auto">
                  <span className="font-mono text-[10px] text-[#5C5C5C] md:hidden">XP</span>
                  <span className="font-mono text-[14px] text-[#E8E6E0]">
                    {row.xp.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* YOUR POSITION STICKY ROW */}
      <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 bg-[#080808] border-t-2 border-[#C41E1E]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between md:ml-[64px]">
          <div className="flex items-center flex-1">
            <div className="w-[60px] font-mono text-[14px] text-[#E8E6E0] shrink-0">
              {currentUser.rank}
            </div>
            <div className="flex items-center gap-4 flex-1 min-w-[120px]">
              <div className="w-8 h-8 relative grayscale border border-[#1A1A1A] shrink-0">
                <Image 
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${currentUser.name}`} 
                  alt={currentUser.name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <span className="font-sans text-[14px] font-medium text-[#C41E1E] truncate">{currentUser.name}</span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-center shrink-0">
            <span className="font-sans text-[11px] uppercase border border-[#C41E1E] text-[#C41E1E] px-2 py-1 tracking-widest">
              {currentUser.house}
            </span>
          </div>

          <div className="flex items-center justify-end gap-6 md:gap-12 flex-1 shrink-0">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 text-right">
              <span className="font-mono text-[10px] text-[#5C5C5C] md:hidden">LVL</span>
              <span className="font-serif text-[22px] font-bold">{currentUser.level}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 text-right w-[80px] md:w-auto">
              <span className="font-mono text-[10px] text-[#5C5C5C] md:hidden">XP</span>
              <span className="font-mono text-[14px] text-[#E8E6E0]">
                {currentUser.xp.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
