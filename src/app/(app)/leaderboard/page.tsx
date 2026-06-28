'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Ranking {
  rank: number
  character_name: string
  house_id: string
  level: number
  xp_total: number
  avatar_url: string
}

interface LeaderboardData {
  rankings: Ranking[]
  your_rank: Ranking | null
  total_count: number
  filter: string
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const tabs = ['ALL', 'ZENITH', 'ASH', 'FORGE', 'CROWN']

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)
      try {
        const res = await fetch(`/api/leaderboard?filter=${activeTab.toLowerCase()}&page=1&limit=50`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
        if (res.status === 401) {
          window.location.href = '/login'
          return
        }
        if (!res.ok) {
          throw new Error('Failed to fetch leaderboard')
        }
        const json = await res.json()
        setData(json)
      } catch (err: any) {
        setError(err.message || 'Error loading leaderboard')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [activeTab])

  return (
    <div className="max-w-[1400px] mx-auto text-[#E8E6E0] min-h-[calc(100vh-56px)] md:min-h-screen relative flex flex-col pb-32">
      
      {/* Header */}
      <div className="pt-8 md:pt-12 mb-12">
        <h1 className="font-serif text-[40px] font-bold uppercase leading-none">
          THE RANKINGS
        </h1>
        <p className="font-sans text-[11px] text-[#767676] tracking-[0.2em] uppercase mt-3">
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
                  : 'text-[#767676] hover:text-[#E8E6E0] border-b-2 border-transparent'
                }
              `}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center font-mono text-[14px] text-[#767676] animate-pulse py-12">
          GATHERING ECHOES...
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center font-mono text-[14px] text-[#C41E1E] py-12">
          ERROR: {error}
        </div>
      ) : !data || data.rankings.length === 0 ? (
        <div className="flex-1 flex items-center justify-center font-mono text-[12px] text-[#767676] py-12 text-center uppercase tracking-widest">
          NO ECHOES RECORDED
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {data.rankings.map((row) => {
            const isTop3 = row.rank <= 3
            // If activeTab is not ALL, you might still want to highlight if it's the current user, but since the endpoint doesn't return `isCurrentUser`, we can compare with your_rank
            const isCurrentUser = data.your_rank?.character_name === row.character_name
            
            return (
              <div 
                key={`${row.rank}-${row.character_name}`}
                className={`
                  flex items-center justify-between py-4 border-b border-[#1A1A1A] transition-colors duration-150
                  ${isTop3 ? 'bg-[#0C0C0C]' : 'hover:bg-[#0C0C0C]'}
                  ${isCurrentUser ? 'border-l-2 border-l-[#C41E1E] pl-3' : 'pl-4'}
                  pr-4
                `}
              >
                <div className="flex items-center flex-1">
                  {/* RANK */}
                  <div className={`w-[60px] font-mono text-[14px] shrink-0 ${isTop3 ? 'text-[#C41E1E]' : 'text-[#767676]'}`}>
                    {row.rank === 1 ? '♔ 1' : row.rank}
                  </div>

                  {/* AVATAR + NAME */}
                  <div className="flex items-center gap-4 flex-1 min-w-[120px]">
                    <div className="w-8 h-8 relative grayscale border border-[#1A1A1A] shrink-0">
                      <Image 
                        src={row.avatar_url} 
                        alt={row.character_name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <span className="font-sans text-[14px] truncate">{row.character_name}</span>
                  </div>
                </div>

                {/* HOUSE */}
                <div className="hidden md:flex flex-1 justify-center shrink-0">
                  <span 
                    className={`
                      font-sans text-[11px] uppercase border px-2 py-1 tracking-widest
                      ${row.house_id === 'ZENITH' ? 'border-[#C41E1E] text-[#C41E1E]' : 'border-[#2A2A2A] text-[#767676]'}
                    `}
                  >
                    {row.house_id}
                  </span>
                </div>

                {/* LEVEL & XP */}
                <div className="flex items-center justify-end gap-6 md:gap-12 flex-1 shrink-0">
                  <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 text-right">
                    <span className="font-mono text-[10px] text-[#767676] md:hidden">LVL</span>
                    <span className="font-serif text-[22px] font-bold">{row.level}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 text-right w-[80px] md:w-auto">
                    <span className="font-mono text-[10px] text-[#767676] md:hidden">XP</span>
                    <span className="font-mono text-[14px] text-[#E8E6E0]">
                      {row.xp_total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* YOUR POSITION STICKY ROW */}
      {data && data.your_rank && (
        <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 bg-[#080808] border-t-2 border-[#C41E1E]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between md:ml-[64px]">
            <div className="flex items-center flex-1">
              <div className="w-[60px] font-mono text-[14px] text-[#E8E6E0] shrink-0">
                {data.your_rank.rank}
              </div>
              <div className="flex items-center gap-4 flex-1 min-w-[120px]">
                <div className="w-8 h-8 relative grayscale border border-[#1A1A1A] shrink-0">
                  <Image 
                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${data.your_rank.character_name}`} 
                    alt={data.your_rank.character_name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <span className="font-sans text-[14px] font-medium text-[#C41E1E] truncate">{data.your_rank.character_name}</span>
              </div>
            </div>

            <div className="hidden md:flex flex-1 justify-center shrink-0">
              <span className="font-sans text-[11px] uppercase border border-[#C41E1E] text-[#C41E1E] px-2 py-1 tracking-widest">
                {data.your_rank.house_id}
              </span>
            </div>

            <div className="flex items-center justify-end gap-6 md:gap-12 flex-1 shrink-0">
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 text-right">
                <span className="font-mono text-[10px] text-[#767676] md:hidden">LVL</span>
                <span className="font-serif text-[22px] font-bold">{data.your_rank.level}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 text-right w-[80px] md:w-auto">
                <span className="font-mono text-[10px] text-[#767676] md:hidden">XP</span>
                <span className="font-mono text-[14px] text-[#E8E6E0]">
                  {data.your_rank.xp_total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
