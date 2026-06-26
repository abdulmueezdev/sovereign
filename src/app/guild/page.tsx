'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Sidebar } from '@/components/layout/Sidebar'

interface Member {
  rank: number
  character_name: string
  avatar_url: string
  xp_contributed: number
  is_top_three: boolean
}

interface Standing {
  house_id: string
  house_name: string
  total_xp: number
  progress_pct: number
  is_user_house: boolean
}

interface GuildData {
  house: {
    id: string
    name: string
    weekly_goal: number
    weekly_current: number
    days_remaining: number
  }
  members: Member[]
  standings: Standing[]
  your_contribution: {
    rank: number
    xp: number
  }
}

const toRoman = (num: number) => {
  const lookup: { [key: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }
  let roman = ''
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i
      num -= lookup[i]
    }
  }
  return roman || '0'
}

export default function GuildHubPage() {
  const [data, setData] = useState<GuildData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/guild/weekly', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
        if (res.status === 401) {
          window.location.href = '/login'
          return
        }
        if (!res.ok) {
          throw new Error('Failed to fetch guild data')
        }
        const json = await res.json()
        setData(json)
      } catch (err: any) {
        setError(err.message || 'Error loading guild')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#080808] text-[#E8E6E0]">
        <Sidebar />
        <main className="flex-1 md:ml-[64px] min-h-screen p-8 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="font-mono text-[14px] text-[#5C5C5C] animate-pulse">LOADING HOUSE RECORDS...</div>
        </main>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen bg-[#080808] text-[#E8E6E0]">
        <Sidebar />
        <main className="flex-1 md:ml-[64px] min-h-screen p-8 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="font-mono text-[14px] text-[#C41E1E]">ERROR: {error}</div>
        </main>
      </div>
    )
  }

  const { house, members, standings, your_contribution } = data
  const progressPct = Math.min(100, Math.max(0, (house.weekly_current / house.weekly_goal) * 100))

  return (
    <div className="flex min-h-screen bg-[#080808] text-[#E8E6E0]">
      <Sidebar />
      <main className="flex-1 md:ml-[64px] min-h-screen p-8 md:p-12 lg:p-16">
        <div className="max-w-[1400px] mx-auto animate-fade-in-up">
          
          {/* Top Section */}
          <div className="mb-16">
            <h1 className="font-serif text-[28px] font-bold uppercase tracking-wide">
              {house.name}
            </h1>
            <p className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase mt-1">
              WEEKLY COLLECTIVE ECHOES
            </p>
            
            <div className="mt-8">
              <div className="flex justify-between font-mono text-[12px] mb-2">
                <span>{house.weekly_current.toLocaleString()} / {house.weekly_goal.toLocaleString()} XP</span>
              </div>
              <div className="h-[2px] bg-[#1A1A1A] w-full">
                <div 
                  className="h-full bg-[#C41E1E] shadow-[0_0_8px_rgba(196,30,30,0.5)] transition-all duration-1000" 
                  style={{ width: `${progressPct}%` }} 
                />
              </div>
              <div className="mt-2 font-mono text-[10px] text-[#5C5C5C]">
                {house.days_remaining} {house.days_remaining === 1 ? 'DAY' : 'DAYS'} REMAINING
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Member Contributions (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex flex-col border-t border-[#1A1A1A]">
                {members.length === 0 ? (
                  <div className="py-8 text-center font-mono text-[12px] text-[#5C5C5C]">
                    NO CONTRIBUTIONS THIS CYCLE
                  </div>
                ) : (
                  members.slice(0, 8).map((member, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-[#1A1A1A]">
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-[12px] text-[#5C5C5C] w-8">
                          {toRoman(member.rank)}
                        </span>
                        <span className="font-sans text-[14px]">
                          {member.character_name}
                        </span>
                      </div>
                      <span className={`font-mono text-[14px] ${member.is_top_three ? 'text-[#C41E1E]' : 'text-[#E8E6E0]'}`}>
                        {member.xp_contributed.toLocaleString()} XP
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: House Standings (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <h2 className="font-mono text-[10px] text-[#5C5C5C] tracking-[0.2em] uppercase mb-2">
                HOUSE STANDINGS
              </h2>
              <div className="flex flex-col gap-8">
                {standings.map((standing, i) => (
                  <div 
                    key={i} 
                    className={`pl-4 flex flex-col gap-2 ${standing.is_user_house ? 'border-l-2 border-[#C41E1E]' : 'border-l-2 border-transparent'}`}
                  >
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-serif text-[22px]">{standing.house_id}</h3>
                      <span className="font-mono text-[12px] text-[#5C5C5C]">{standing.total_xp.toLocaleString()} XP</span>
                    </div>
                    <div className="h-[2px] bg-[#1A1A1A] w-full">
                      <div className="h-full bg-[#5C5C5C] transition-all duration-1000" style={{ width: `${standing.progress_pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Section: Your Contribution */}
          <div className="mt-20 border border-[#1A1A1A] p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 relative grayscale border border-[#1A1A1A]">
                <Image 
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${members.find(m => m.rank === your_contribution.rank)?.character_name || 'anon'}`} 
                  alt="Your Avatar" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#C41E1E] tracking-[0.2em] uppercase mb-1">
                  YOUR CONTRIBUTION
                </span>
                <span className="font-sans text-[18px]">{members.find(m => m.rank === your_contribution.rank)?.character_name || 'You'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-8 sm:text-right">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#5C5C5C] mb-1">RANK</span>
                <span className="font-mono text-[16px]">{your_contribution.rank === 999 ? '-' : toRoman(your_contribution.rank)}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#5C5C5C] mb-1">CONTRIBUTED</span>
                <span className="font-mono text-[16px] text-[#C41E1E]">{your_contribution.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
