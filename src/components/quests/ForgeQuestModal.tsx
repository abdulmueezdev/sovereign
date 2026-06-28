'use client'

import { useState } from 'react'
import type { CustomQuestFormData } from '@/lib/demo-data'

interface ForgeQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForge: (quest: CustomQuestFormData) => void;
}

export function ForgeQuestModal({ isOpen, onClose, onForge }: ForgeQuestModalProps) {
  const [formData, setFormData] = useState<CustomQuestFormData>({
    name: '',
    description: '',
    objectives: [''],
    domain: 'scholar',
    difficulty: 'Common',
    xpReward: 50
  })

  if (!isOpen) return null

  const handleAddObjective = () => {
    if (formData.objectives.length < 6) {
      setFormData(prev => ({ ...prev, objectives: [...prev.objectives, ''] }))
    }
  }

  const handleRemoveObjective = (index: number) => {
    setFormData(prev => ({ ...prev, objectives: prev.objectives.filter((_, i) => i !== index) }))
  }

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjs = [...formData.objectives]
    newObjs[index] = value
    setFormData(prev => ({ ...prev, objectives: newObjs }))
  }

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const diff = e.target.value as CustomQuestFormData['difficulty']
    let xp = 50
    if (diff === 'Rare') xp = 100
    if (diff === 'Epic') xp = 200
    if (diff === 'Legendary') xp = 400
    setFormData(prev => ({ ...prev, difficulty: diff, xpReward: xp }))
  }

  const canSubmit = formData.name.trim().length > 0 && formData.objectives.some(o => o.trim().length > 0)

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={onClose} />
      
      <div className="relative w-full md:w-[480px] h-full bg-[#0C0C0C] border-l border-[#1A1A1A] pointer-events-auto flex flex-col animate-slide-in-right">
        
        <div className="p-8 border-b border-[#1A1A1A]">
          <h2 className="font-mono text-[10px] uppercase text-[#2A2A2A] tracking-[0.3em]">
            FORGE NEW QUEST
          </h2>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-8">
          <div>
            <input 
              type="text"
              placeholder="Name your endeavor..."
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-transparent border-b border-[#1A1A1A] focus:border-[#5C5C5C] text-[#E8E6E0] font-serif italic text-[24px] pb-2 outline-none transition-colors"
            />
          </div>

          <div>
            <textarea 
              placeholder="Describe the trial..."
              rows={3}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-transparent border border-[#1A1A1A] focus:border-[#5C5C5C] text-[#E8E6E0] font-sans text-[13px] p-4 outline-none resize-none transition-colors placeholder:text-[#3A3A3A]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="font-mono text-[10px] text-[#5C5C5C] uppercase tracking-[0.2em]">Objectives</label>
              {formData.objectives.length < 6 && (
                <button 
                  onClick={handleAddObjective}
                  className="font-mono text-[9px] text-[#C41E1E] hover:text-[#E8282B] uppercase tracking-[0.1em]"
                >
                  + ADD OBJECTIVE
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {formData.objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input 
                    type="text"
                    value={obj}
                    onChange={e => handleObjectiveChange(i, e.target.value)}
                    placeholder={`Objective ${i + 1}`}
                    className="flex-1 bg-transparent border border-[#1A1A1A] focus:border-[#5C5C5C] text-[#E8E6E0] font-sans text-[13px] px-3 py-2 outline-none transition-colors"
                  />
                  {formData.objectives.length > 1 && (
                    <button 
                      onClick={() => handleRemoveObjective(i)}
                      className="font-mono text-[9px] text-[#C41E1E] hover:text-[#E8282B] uppercase tracking-[0.1em] shrink-0"
                    >
                      REMOVE
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[10px] text-[#5C5C5C] uppercase tracking-[0.2em] mb-2">Domain</label>
              <select 
                value={formData.domain}
                onChange={e => setFormData(prev => ({ ...prev, domain: e.target.value as any }))}
                className="w-full bg-transparent border border-[#1A1A1A] text-[#E8E6E0] font-sans text-[13px] px-3 py-2 outline-none focus:border-[#5C5C5C] appearance-none"
              >
                {['scholar', 'warrior', 'builder', 'commander', 'strength', 'vitality', 'intelligence', 'focus', 'technical', 'creativity', 'leadership', 'charisma', 'discipline'].map(d => (
                  <option key={d} value={d} className="bg-[#080808] capitalize">{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#5C5C5C] uppercase tracking-[0.2em] mb-2">Difficulty</label>
              <select 
                value={formData.difficulty}
                onChange={handleDifficultyChange}
                className="w-full bg-transparent border border-[#1A1A1A] text-[#E8E6E0] font-sans text-[13px] px-3 py-2 outline-none focus:border-[#5C5C5C] appearance-none"
              >
                <option value="Common" className="bg-[#080808]">Common</option>
                <option value="Rare" className="bg-[#080808]">Rare</option>
                <option value="Epic" className="bg-[#080808]">Epic</option>
                <option value="Legendary" className="bg-[#080808]">Legendary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#5C5C5C] uppercase tracking-[0.2em] mb-2">XP Reward</label>
            <input 
              type="number"
              value={formData.xpReward}
              onChange={e => setFormData(prev => ({ ...prev, xpReward: parseInt(e.target.value) || 0 }))}
              className="w-full bg-transparent border border-[#1A1A1A] focus:border-[#5C5C5C] text-[#E8E6E0] font-mono text-[13px] px-3 py-2 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="p-8 border-t border-[#1A1A1A] bg-[#080808] flex flex-col md:flex-row gap-4">
          <button 
            onClick={() => onForge(formData)}
            disabled={!canSubmit}
            className="flex-1 bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase py-3 hover:bg-[#E8282B] active:scale-[0.97] transition-all disabled:opacity-50 disabled:hover:bg-[#C41E1E] disabled:active:scale-100"
          >
            MANIFEST QUEST
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-transparent text-[#E8E6E0] font-sans text-[11px] tracking-[0.2em] uppercase py-3 border border-[#2A2A2A] hover:border-[#E8E6E0] transition-colors"
          >
            CANCEL
          </button>
        </div>

      </div>
    </div>
  )
}
