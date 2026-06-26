'use client'

import React, { useState } from 'react'

type Skill = {
  title: string
  desc: string
  icon: string
  cost: number
}

const CLASSES = ['SCHOLAR', 'WARRIOR', 'BUILDER', 'COMMANDER']

const SKILL_DATA: Record<string, Skill[]> = {
  SCHOLAR: [
    { title: 'Deep Focus', desc: '+2 Intelligence for every quest completed', icon: '🧠', cost: 1 },
    { title: 'Arcane Memory', desc: '+10% XP from all reading and study quests', icon: '📖', cost: 1 },
    { title: "Scholar's Eye", desc: 'Unlock rare quest templates in the Quest Board', icon: '👁', cost: 2 },
    { title: 'Mind Palace', desc: '+5 maximum active quests at once', icon: '🏛', cost: 2 },
    { title: 'Transcendence', desc: 'Double primary attribute gain from all quests', icon: '✦', cost: 3 }
  ],
  WARRIOR: [
    { title: 'Iron Body', desc: '+2 Strength for every quest completed', icon: '⚔', cost: 1 },
    { title: 'Battle Hardened', desc: '+10% XP from combat quests', icon: '🛡', cost: 1 },
    { title: "Berserker's Rage", desc: 'Unlock rare combat quests in the Quest Board', icon: '🔥', cost: 2 },
    { title: "Warlord's Command", desc: '+5 maximum active quests at once', icon: '🎌', cost: 2 },
    { title: 'Avatar of Ash', desc: 'Double primary attribute gain from all quests', icon: '💀', cost: 3 }
  ],
  BUILDER: [
    { title: "Craftsman's Eye", desc: '+2 Dexterity for every quest completed', icon: '⚒', cost: 1 },
    { title: 'Efficient Labor', desc: '+10% XP from building quests', icon: '⚙', cost: 1 },
    { title: "Architect's Vision", desc: 'Unlock rare building quests in the Quest Board', icon: '📐', cost: 2 },
    { title: 'Foundry Master', desc: '+5 maximum active quests at once', icon: '🏭', cost: 2 },
    { title: 'Forge Incarnate', desc: 'Double primary attribute gain from all quests', icon: '🌋', cost: 3 }
  ],
  COMMANDER: [
    { title: 'Tactical Mind', desc: '+2 Charisma for every quest completed', icon: '♟', cost: 1 },
    { title: 'Rallying Cry', desc: '+10% XP from leadership quests', icon: '🗣', cost: 1 },
    { title: "Strategist's Gambit", desc: 'Unlock rare leadership quests in the Quest Board', icon: '📜', cost: 2 },
    { title: "Legion's Heart", desc: '+5 maximum active quests at once', icon: '🦅', cost: 2 },
    { title: 'Crown Unbound', desc: 'Double primary attribute gain from all quests', icon: '👑', cost: 3 }
  ]
}

export default function SkillTreePage() {
  const [activeClass, setActiveClass] = useState('SCHOLAR')
  const [skillPoints, setSkillPoints] = useState(3)
  
  // Track how many skills are purchased per class
  const [purchases, setPurchases] = useState<Record<string, number>>({
    SCHOLAR: 0,
    WARRIOR: 0,
    BUILDER: 0,
    COMMANDER: 0
  })

  // Track currently selected node index per class
  const [selectedNodes, setSelectedNodes] = useState<Record<string, number | null>>({
    SCHOLAR: null,
    WARRIOR: null,
    BUILDER: null,
    COMMANDER: null
  })

  const currentSkills = SKILL_DATA[activeClass]
  const purchasedCount = purchases[activeClass] || 0
  const selectedNode = selectedNodes[activeClass]

  const handleNodeClick = (index: number) => {
    // Only allow selecting AVAILABLE nodes
    if (index === purchasedCount) {
      setSelectedNodes(prev => ({
        ...prev,
        [activeClass]: prev[activeClass] === index ? null : index // toggle
      }))
    }
  }

  const handleInvest = (cost: number) => {
    if (skillPoints >= cost) {
      setSkillPoints(prev => prev - cost)
      setPurchases(prev => ({
        ...prev,
        [activeClass]: (prev[activeClass] || 0) + 1
      }))
      setSelectedNodes(prev => ({
        ...prev,
        [activeClass]: null // Deselect after purchase
      }))
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto text-[#E8E6E0] min-h-[calc(100vh-56px)] md:min-h-screen relative flex flex-col pb-32">
      
      {/* Skill Points Display (Sticky Top Right relative to container) */}
      <div className="absolute top-8 right-8 flex items-center gap-3">
        <span className="font-mono text-[14px] text-[#C41E1E] uppercase">
          SKILL POINTS: {skillPoints}
        </span>
        <div className="w-2 h-2 bg-[#C41E1E]" />
      </div>

      {/* Header */}
      <div className="pt-8 md:pt-12 mb-8">
        <h1 className="font-serif text-[40px] font-bold uppercase leading-none">
          THE PATH
        </h1>
        <p className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase mt-3 mb-2">
          {activeClass} CLASS
        </p>
        <p className="font-mono text-[14px] text-[#C41E1E]">
          {skillPoints} SKILL POINTS AVAILABLE
        </p>
      </div>

      {/* Class Switcher */}
      <div className="flex flex-wrap items-center gap-6 mb-16 border-b border-[#1A1A1A] pb-4">
        {CLASSES.map(cls => (
          <button
            key={cls}
            onClick={() => setActiveClass(cls)}
            className={`font-sans text-[11px] uppercase tracking-[0.2em] transition-colors
              ${activeClass === cls 
                ? 'text-[#E8E6E0]' 
                : 'text-[#3A3A3A] hover:text-[#5C5C5C]'
              }
            `}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Skill Tree */}
      <div className="flex flex-col items-center">
        {currentSkills.map((skill, index) => {
          const isBought = index < purchasedCount
          const isAvailable = index === purchasedCount
          const isLocked = index > purchasedCount
          const isSelected = selectedNode === index

          // Determine line color from previous node
          // Line exists above the node if index > 0
          const hasLineAbove = index > 0
          const lineIsActive = hasLineAbove && index <= purchasedCount // Previous was bought

          return (
            <div key={index} className="flex flex-col items-center">
              
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
                  onClick={() => handleNodeClick(index)}
                  disabled={!isAvailable}
                  className={`
                    w-[64px] h-[64px] md:w-[80px] md:h-[80px] flex items-center justify-center transition-all duration-300 relative
                    ${isBought ? 'border-2 border-[#C41E1E] bg-[#C41E1E] text-white' : ''}
                    ${isAvailable ? 'border-2 border-[#C41E1E] bg-transparent text-[#C41E1E] cursor-pointer' : ''}
                    ${isLocked ? 'border-2 border-[#1A1A1A] bg-transparent text-[#3A3A3A] cursor-not-allowed' : ''}
                    ${isSelected ? 'shadow-[0_0_0_2px_rgba(196,30,30,0.3)]' : ''}
                  `}
                >
                  <span className="text-2xl md:text-3xl">{skill.icon}</span>
                </button>

                {/* Node Details (always visible below node) */}
                <div className="flex flex-col items-center mt-4 text-center">
                  <h3 className={`font-serif text-[18px] font-bold leading-tight mb-1
                    ${isLocked ? 'text-[#3A3A3A]' : 'text-[#E8E6E0]'}
                  `}>
                    {skill.title}
                  </h3>
                  <p className="font-sans text-[12px] text-[#5C5C5C] max-w-[240px] leading-relaxed mb-2">
                    {skill.desc}
                  </p>
                  <span className={`font-mono text-[11px] uppercase tracking-wider
                    ${isBought ? 'text-[#5C5C5C]' : ''}
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
                      onClick={() => handleInvest(skill.cost)}
                      disabled={skillPoints < skill.cost}
                      className={`
                        bg-[#C41E1E] text-white font-sans text-[11px] uppercase tracking-[0.2em] px-8 py-3 transition-all
                        ${skillPoints >= skill.cost 
                          ? 'hover:bg-[#E8282B] active:scale-[0.97]' 
                          : 'opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      INVEST
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
