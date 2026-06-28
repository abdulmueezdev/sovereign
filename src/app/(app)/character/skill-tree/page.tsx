'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'

interface Skill {
  id: string
  name: string
  description: string
  tier: number
  cost: number
  status: 'bought' | 'available' | 'locked'
  prerequisite_skill_id: string | null
  icon_name: string
  effect_description: string
}

interface SkillTreeData {
  class: string
  skill_points_available: number
  skill_points_total: number
  skills: Skill[]
}

export default function SkillTreePage() {
  const [data, setData] = useState<SkillTreeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [investing, setInvesting] = useState(false)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/character/skill-tree', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.status === 401) {
        window.location.href = '/login'
        return
      }
      if (!res.ok) {
        throw new Error('Failed to fetch skill tree')
      }
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Error loading skill tree')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    requestAnimationFrame(() => fetchData())
  }, [])

  const handleNodeClick = (skillId: string, status: string) => {
    if (status === 'available') {
      setSelectedNodeId(prev => prev === skillId ? null : skillId)
    }
  }

  const handleInvest = async (skillId: string, cost: number) => {
    if (!data || data.skill_points_available < cost) return
    setInvesting(true)
    try {
      const res = await fetch(`/api/character/skill-tree/${skillId}/unlock`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to unlock skill')
      }
      // Re-fetch tree after success
      await fetchData()
      setSelectedNodeId(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setInvesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#080808] text-[#E8E6E0]">
        <Sidebar />
        <main className="flex-1 md:ml-[64px] min-h-screen p-8 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="font-mono text-[14px] text-[#767676] animate-pulse">READING THE PATH...</div>
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

  const sortedSkills = [...data.skills].sort((a, b) => a.tier - b.tier)

  return (
    <div className="max-w-[1200px] mx-auto text-[#E8E6E0] min-h-[calc(100vh-56px)] md:min-h-screen relative flex flex-col pb-32">
      
      {/* Skill Points Display (Sticky Top Right relative to container) */}
      <div className="absolute top-8 right-8 flex items-center gap-3">
        <span className="font-mono text-[14px] text-[#C41E1E] uppercase">
          SKILL POINTS: {data.skill_points_available}
        </span>
        <div className="w-2 h-2 bg-[#C41E1E]" />
      </div>

      {/* Header */}
      <div className="pt-8 md:pt-12 mb-8 border-b border-[#1A1A1A] pb-4">
        <h1 className="font-serif text-[40px] font-bold uppercase leading-none">
          THE PATH
        </h1>
        <p className="font-sans text-[11px] text-[#767676] tracking-[0.2em] uppercase mt-3 mb-2">
          {data.class} CLASS
        </p>
        <p className="font-mono text-[14px] text-[#C41E1E]">
          {data.skill_points_available} SKILL POINTS AVAILABLE
        </p>
      </div>

      {/* Skill Tree */}
      <div className="flex flex-col items-center mt-12">
        {sortedSkills.map((skill, index) => {
          const isBought = skill.status === 'bought'
          const isAvailable = skill.status === 'available'
          const isLocked = skill.status === 'locked'
          const isSelected = selectedNodeId === skill.id

          // Determine line color from previous node
          // Line exists above the node if index > 0
          const hasLineAbove = index > 0
          
          // Line is active if the PREVIOUS skill was bought OR if it's the first available node
          const previousSkill = index > 0 ? sortedSkills[index - 1] : null
          const lineIsActive = hasLineAbove && (previousSkill?.status === 'bought')

          return (
            <div key={skill.id} className="flex flex-col items-center">
              
              {/* Connection Line */}
              {hasLineAbove && (
                <div 
                  className={`w-[2px] h-[40px] transition-colors duration-300 ${
                    lineIsActive ? 'bg-[#C41E1E]' : 'bg-[#1A1A1A]'
                  }`} 
                />
              )}

              {/* Node and Info Container */}
              <div className="flex flex-col items-center relative">
                
                {/* Node Box */}
                <button
                  onClick={() => handleNodeClick(skill.id, skill.status)}
                  disabled={!isAvailable}
                  className={`
                    w-[64px] h-[64px] md:w-[80px] md:h-[80px] flex items-center justify-center transition-all duration-300 relative
                    ${isBought ? 'border-2 border-[#C41E1E] bg-[#C41E1E] text-white' : ''}
                    ${isAvailable ? 'border-2 border-[#C41E1E] bg-transparent text-[#C41E1E] cursor-pointer' : ''}
                    ${isLocked ? 'border-2 border-[#1A1A1A] bg-transparent text-[#3A3A3A] cursor-not-allowed' : ''}
                    ${isSelected ? 'shadow-[0_0_0_2px_rgba(196,30,30,0.3)]' : ''}
                  `}
                >
                  <span className="text-2xl md:text-3xl">{skill.icon_name}</span>
                </button>

                {/* Node Details (always visible below node) */}
                <div className="flex flex-col items-center mt-4 text-center">
                  <h3 className={`font-serif text-[18px] font-bold leading-tight mb-1
                    ${isLocked ? 'text-[#3A3A3A]' : 'text-[#E8E6E0]'}
                  `}>
                    {skill.name}
                  </h3>
                  <p className="font-sans text-[12px] text-[#767676] max-w-[240px] leading-relaxed mb-2">
                    {skill.description}
                  </p>
                  <span className={`font-mono text-[11px] uppercase tracking-wider
                    ${isBought ? 'text-[#767676]' : ''}
                    ${isAvailable ? 'text-[#C41E1E]' : ''}
                    ${isLocked ? 'text-[#3A3A3A]' : ''}
                  `}>
                    {isBought ? 'CLAIMED' : isLocked ? 'LOCKED' : `${skill.cost} POINT${skill.cost > 1 ? 'S' : ''}`}
                  </span>
                </div>

                {/* Invest Action Container (only visible when selected) */}
                {isSelected && (
                  <div className="mt-6 mb-2 animate-fade-in-up">
                    <button
                      onClick={() => handleInvest(skill.id, skill.cost)}
                      disabled={data.skill_points_available < skill.cost || investing}
                      className={`
                        bg-[#C41E1E] text-white font-sans text-[11px] uppercase tracking-[0.2em] px-8 py-3 transition-all
                        ${data.skill_points_available >= skill.cost && !investing
                          ? 'hover:bg-[#E8282B] active:scale-[0.97]' 
                          : 'opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      {investing ? 'INVESTING...' : 'INVEST'}
                    </button>
                  </div>
                )}
                
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
