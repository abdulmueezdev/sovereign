'use client'

import { useState } from 'react'

interface Objective {
  id: string;
  text: string;
  completed: boolean;
}

interface QuestCardProps {
  id: string;
  title: string;
  description: string;
  domain: 'body' | 'mind' | 'craft' | 'command';
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  progress: number;
  dueDate?: string;
  status: 'active' | 'completed' | 'failed' | 'available';
  objectives: Objective[];
  onContinue?: () => void;
  index?: number;
}

export function QuestCard({
  id,
  title,
  description,
  domain,
  xpReward,
  rarity,
  progress,
  dueDate,
  status,
  objectives: initialObjectives,
  onContinue,
  index = 0,
}: QuestCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [objectives, setObjectives] = useState(initialObjectives || [])
  const [isCompleting, setIsCompleting] = useState(false)

  const isDueToday = dueDate && new Date(dueDate).getTime() - new Date().getTime() < 86400000
  const isAllComplete = objectives.length > 0 && objectives.every(o => o.completed)
  const completedCount = objectives.filter(o => o.completed).length

  async function toggleObjective(questId: string, objectiveId: string, checked: boolean) {
    // Optimistic update
    setObjectives(prev => prev.map(o => 
      o.id === objectiveId ? { ...o, completed: checked } : o
    ))

    if (!navigator.onLine) {
      const queueJson = localStorage.getItem('offlineQuestQueue')
      const queue = queueJson ? JSON.parse(queueJson) : []
      queue.push({
        id: crypto.randomUUID(),
        type: 'TOGGLE_OBJECTIVE',
        questId,
        objectiveId,
        checked,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('offlineQuestQueue', JSON.stringify(queue))
      return
    }

    try {
      const res = await fetch(`/api/quests/${questId}/objective`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectiveId, checked })
      })
      if (!res.ok) throw new Error('Failed to save objective status')
    } catch (err) {
      const queueJson = localStorage.getItem('offlineQuestQueue')
      const queue = queueJson ? JSON.parse(queueJson) : []
      queue.push({
        id: crypto.randomUUID(),
        type: 'TOGGLE_OBJECTIVE',
        questId,
        objectiveId,
        checked,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('offlineQuestQueue', JSON.stringify(queue))
      console.error('Offline queue updated after failure:', err)
    }
  }

  async function markComplete(questId: string) {
    setIsCompleting(true)
    try {
      const res = await fetch(`/api/quests/${questId}/complete`, { method: 'POST' })
      const result = await res.json()
      
      if (result.success) {
        setIsDrawerOpen(false)
        if (onContinue) onContinue() // Optional callback to trigger dashboard refresh or toast
      }
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <>
      <div 
        className="group relative flex flex-col py-6 border-t border-[#1A1A1A] hover:bg-[rgba(255,255,255,0.018)] transition-colors duration-150 animate-fade-in-up"
        style={{ animationFillMode: 'both', animationDelay: `${index * 60}ms` }}
      >
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#5C5C5C] uppercase">
                {domain}
              </span>
              {isDueToday && (
                <span className="font-mono text-[10px] tracking-[0.1em] text-[#C41E1E] border border-[#C41E1E] px-1.5 py-0.5 uppercase">
                  Due Today
                </span>
              )}
            </div>
            
            <h3 className="font-serif text-[22px] font-bold text-[#E8E6E0] mb-2">
              {title}
            </h3>
            <p className="font-sans text-[13px] text-[#5C5C5C] line-clamp-2 leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 min-w-[120px]">
            <div className="text-right">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#5C5C5C] uppercase block mb-1">
                Yield
              </span>
              <span className="font-serif text-[32px] font-bold text-[#E8E6E0] leading-none">
                {xpReward}
              </span>
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-6 py-2 hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150"
            >
              Continue
            </button>
          </div>
        </div>

        {status === 'active' && progress > 0 && (
          <div className="w-full h-[2px] bg-[#1A1A1A] mt-6 relative">
            <div
              className="absolute top-0 left-0 h-full bg-[#C41E1E] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 pointer-events-auto transition-opacity" 
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div 
            className="relative w-[360px] h-full bg-[#12131A] border-l border-[#2A2D40] pointer-events-auto flex flex-col animate-slide-in-right"
            style={{ animation: 'slideInRight 300ms var(--ease-out-expo) both' }}
          >
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="flex gap-2 mb-6">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#5C5C5C] uppercase border border-[#2A2D40] px-2 py-1">
                  {domain}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#5C5C5C] uppercase border border-[#2A2D40] px-2 py-1">
                  {rarity}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#C41E1E] uppercase border border-[#2A2D40] px-2 py-1">
                  {xpReward} XP
                </span>
              </div>

              <h2 className="font-serif text-[28px] font-bold text-[#E8E6E0] leading-tight mb-4">
                {title}
              </h2>
              
              <p className="font-serif italic text-[14px] text-[#5C5C5C] mb-8 leading-relaxed">
                {description}
              </p>

              <div className="mb-8">
                <h3 className="font-sans font-medium text-[11px] text-[#E8E6E0] uppercase tracking-[0.1em] mb-4">
                  Objectives
                </h3>
                
                <div className="space-y-4">
                  {objectives.map((obj) => (
                    <label key={obj.id} className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={obj.completed}
                          onChange={(e) => toggleObjective(id, obj.id, e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 border border-[#2A2A2A] peer-checked:bg-[#C41E1E] peer-checked:border-[#C41E1E] transition-colors flex items-center justify-center" />
                      </div>
                      <span className={`font-sans text-[14px] transition-colors ${obj.completed ? 'text-[#5C5C5C] line-through' : 'text-[#E8E6E0]'}`}>
                        {obj.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="font-mono text-[10px] text-[#5C5C5C] uppercase tracking-widest mb-12">
                {completedCount} of {objectives.length} objectives complete
              </div>

              <div className="border-t border-[#2A2D40] pt-6 mb-8">
                <h3 className="font-sans font-medium text-[11px] text-[#E8E6E0] uppercase tracking-[0.1em] mb-4">
                  Rewards
                </h3>
                <div className="flex gap-4">
                  <div className="font-serif text-[24px] text-[#C41E1E]">{xpReward} XP</div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-[#2A2D40] bg-[#12131A] flex flex-col gap-4">
              <button
                onClick={() => markComplete(id)}
                disabled={!isAllComplete || isCompleting}
                className="w-full bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-6 py-4 hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150 disabled:opacity-50 disabled:hover:bg-[#C41E1E] disabled:active:scale-100"
              >
                {isCompleting ? 'Marking...' : 'Mark Complete'}
              </button>
              <button className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase hover:text-[#C41E1E] transition-colors py-2">
                Abandon
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
