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
    }
  }

  async function markComplete(questId: string) {
    setIsCompleting(true)
    try {
      if (onContinue) {
        await Promise.resolve(onContinue())
      }
      setIsDrawerOpen(false)
    } catch (err) {
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <>
      <div 
        className="group relative flex flex-col py-6 border-b border-[#1A1A1A] hover:bg-[#0C0C0C] transition-colors duration-150 animate-fade-in-up"
        style={{ animationFillMode: 'both', animationDelay: `${index * 60}ms` }}
      >
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 px-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[11px] tracking-[0.15em] text-[#767676] uppercase">
                {domain}
              </span>
              {isDueToday && (
                <span className="font-sans text-[11px] tracking-[0.2em] text-[#C41E1E] uppercase">
                  Due Today
                </span>
              )}
            </div>
            
            <h3 className="font-serif text-[22px] font-bold text-[#E8E6E0] mb-2">
              {title}
            </h3>
            <p className="font-sans text-[14px] text-[#767676] line-clamp-2 leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 min-w-[120px]">
            <div className="text-right">
              <span className="font-sans text-[11px] tracking-[0.2em] text-[#767676] uppercase block mb-1">
                Yield
              </span>
              <span className="font-serif text-[32px] font-bold text-[#E8E6E0] leading-none">
                {xpReward}
              </span>
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-3 hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-[80ms]"
            >
              Continue
            </button>
          </div>
        </div>

        {status === 'active' && progress > 0 && (
          <div className="w-full h-[2px] bg-[#1A1A1A] mt-6 relative mx-4" style={{ width: 'calc(100% - 2rem)' }}>
            <div
              className="absolute top-0 left-0 h-full transition-all duration-[800ms]"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #C41E1E 0%, #8B0000 100%)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div 
            className="absolute inset-0 bg-black/60 pointer-events-auto transition-opacity" 
            onClick={() => setIsDrawerOpen(false)}
          />
          
          <div 
            className="relative w-full sm:w-[400px] h-full max-h-[90vh] my-auto sm:mr-8 bg-[#0C0C0C] border border-[#1A1A1A] pointer-events-auto flex flex-col animate-slide-in-right shadow-2xl"
            style={{ animation: 'slideInRight 300ms var(--ease-out-expo) both' }}
          >
            {/* Header Fixed at Top */}
            <div className="p-6 md:p-8 border-b border-[#1A1A1A] shrink-0 bg-[#0C0C0C]">
              <div className="flex gap-4 mb-4">
                <span className="font-mono text-[11px] tracking-[0.15em] text-[#767676] uppercase">
                  {domain}
                </span>
                <span className="font-mono text-[11px] tracking-[0.15em] text-[#767676] uppercase">
                  {rarity}
                </span>
                <span className="font-mono text-[11px] tracking-[0.15em] text-[#C41E1E] uppercase">
                  {xpReward} XP
                </span>
              </div>
              <h2 className="font-serif text-[24px] md:text-[28px] font-bold text-[#E8E6E0] leading-tight">
                {title}
              </h2>
            </div>

            {/* Content Area flex-1 overflow-y-auto */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              
              <p className="font-sans text-[14px] text-[#E8E6E0] mb-8 leading-relaxed opacity-80">
                {description}
              </p>

              <div className="mb-8">
                <h3 className="font-serif text-[22px] font-bold text-[#E8E6E0] mb-4">
                  Objectives
                </h3>
                
                <div className="space-y-4">
                  {objectives.map((obj) => (
                    <label key={obj.id} className="flex items-start gap-4 cursor-pointer group min-h-[48px] p-2 -ml-2 hover:bg-[#1A1A1A] transition-colors rounded-none">
                      <div className="relative flex items-center justify-center mt-1">
                        <input
                          type="checkbox"
                          checked={obj.completed}
                          onChange={(e) => toggleObjective(id, obj.id, e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 border border-[#2A2A2A] peer-checked:bg-[#C41E1E] peer-checked:border-[#C41E1E] transition-colors flex items-center justify-center" />
                      </div>
                      <span className={`font-sans text-[14px] transition-colors ${obj.completed ? 'text-[#767676] line-through' : 'text-[#E8E6E0]'}`}>
                        {obj.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="font-mono text-[11px] text-[#767676] uppercase tracking-[0.15em] mb-12">
                {completedCount} of {objectives.length} objectives complete
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-[#1A1A1A] bg-[#080808] shrink-0 flex flex-col md:flex-row gap-4">
              <button
                onClick={() => markComplete(id)}
                disabled={!isAllComplete || isCompleting}
                className="w-full md:flex-1 bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-6 py-3 hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-[80ms] disabled:opacity-50 disabled:hover:bg-[#C41E1E] disabled:active:scale-100"
              >
                {isCompleting ? 'Marking...' : 'Mark Complete'}
              </button>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="w-full md:flex-1 bg-transparent text-[#E8E6E0] font-sans text-[11px] tracking-[0.2em] uppercase px-6 py-3 border border-[#2A2A2A] hover:border-[#E8E6E0] transition-colors duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
