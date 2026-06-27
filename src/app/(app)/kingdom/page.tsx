'use client'

import { useEffect, useState } from 'react'
import { Check, X, Building, ChevronRight } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'

import { DEMO_BUILDINGS } from '@/lib/demo-data'
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default function KingdomPage() {
  const [kingdom, setKingdom] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const { addToast } = useToast()

  async function fetchKingdom() {
    if (IS_DEMO) {
      setKingdom({
        kingdom_name: 'The Obsidian Realm',
        attributes: { attr_strength: 12, attr_intelligence: 18, attr_focus: 15, attr_technical: 14, attr_leadership: 10 },
        buildings: DEMO_BUILDINGS
      })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/kingdom')
      if (!res.ok) throw new Error('Failed to fetch kingdom data')
      const data = await res.json()
      setKingdom(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKingdom()
  }, [])

  const handleBuild = async (buildingId: string) => {
    if (IS_DEMO) {
      const updatedBuildings = DEMO_BUILDINGS.map(b => b.id === buildingId ? { ...b, is_built: true } : b)
      setKingdom((prev: any) => ({ ...prev, buildings: updatedBuildings }))
      addToast({ type: 'success', message: 'STRUCTURE MANIFESTED', description: 'Your kingdom grows.' })
      setSelectedBuilding(null)
      return
    }

    setIsBuilding(true)
    try {
      const res = await fetch(`/api/kingdom/${buildingId}/build`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to manifest structure')
      
      addToast({ type: 'success', message: data.message || 'Structure manifested' })
      setSelectedBuilding(null)
      fetchKingdom() // Refresh data
    } catch (err: any) {
      addToast({ type: 'error', message: err.message })
    } finally {
      setIsBuilding(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[#5C5C5C] font-mono text-[11px] tracking-[0.2em] uppercase">Surveying Domain...</div>
      </div>
    )
  }

  if (error || !kingdom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[#C41E1E] font-mono text-[11px] tracking-[0.2em] uppercase">CORRUPTION DETECTED: {error}</div>
      </div>
    )
  }

  // Ensure we have exactly 6 slots for the 3x2 grid if possible, or just use CSS grid
  const allBuildings = kingdom.buildings || []

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col h-[calc(100vh-8rem)] md:h-full -m-4 md:-m-8">
        <div className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto animate-fade-in-up">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-16">
              <div className="text-[11px] text-[#5C5C5C] font-sans tracking-[0.2em] mb-4 uppercase">
                Domain of
              </div>
              <h1 className="font-serif text-[40px] font-bold text-[#E8E6E0] mb-6 uppercase leading-none">
                {kingdom.name}
              </h1>
              <p className="font-serif italic text-[#5C5C5C] text-[18px] max-w-2xl mb-8 leading-relaxed">
                A reflection of your inner fortitude. As you conquer the physical realm, these walls rise in parallel.
              </p>
            </div>

            {/* Grid */}
            <section>
              <div className="text-[11px] text-[#5C5C5C] font-sans tracking-[0.2em] mb-8 uppercase border-b border-[#1A1A1A] pb-4">
                Structures
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allBuildings.map((b: any) => {
                  const isAvailable = b.status === 'available'
                  const isBuilt = b.status === 'built'
                  
                  return (
                    <div 
                      key={b.id} 
                      onClick={() => setSelectedBuilding(b)}
                      className={`flex flex-col p-6 border cursor-pointer transition-colors ${
                        isAvailable ? 'border-[#C41E1E] hover:border-[#E8E6E0]' : 
                        isBuilt ? 'border-[#3A3A3A] hover:border-[#5C5C5C]' : 
                        'border-[#1A1A1A] opacity-40 hover:opacity-100 hover:border-[#3A3A3A]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-12">
                        <div className={`w-8 h-8 flex items-center justify-center ${isAvailable || isBuilt ? 'text-[#E8E6E0]' : 'text-[#3A3A3A]'}`}>
                          <Building size={24} strokeWidth={1} />
                        </div>
                        {isAvailable && (
                          <span className="font-sans text-[10px] tracking-[0.2em] text-[#C41E1E] border border-[#C41E1E]/30 px-2 py-1 uppercase">
                            Available
                          </span>
                        )}
                        {b.status === 'locked' && (
                          <span className="font-sans text-[10px] tracking-[0.2em] text-[#3A3A3A] border border-[#1A1A1A] px-2 py-1 uppercase">
                            Locked
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <h3 className={`font-serif text-[22px] font-bold leading-tight mb-2 ${isAvailable || isBuilt ? 'text-[#E8E6E0]' : 'text-[#5C5C5C]'}`}>
                          {b.name}
                        </h3>
                        <div className="font-mono text-[11px] text-[#5C5C5C] uppercase tracking-[0.1em]">
                          {b.domain} domain
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Right Column / Detail Panel Slider */}
        <div 
          className={`fixed top-0 right-0 w-full sm:w-[400px] h-full bg-[#0C0C0C] border-l border-[#1A1A1A] p-8 flex flex-col transition-transform duration-500 ease-out-expo z-20 overflow-y-auto ${
            selectedBuilding ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedBuilding && (
            <>
              <button 
                onClick={() => setSelectedBuilding(null)}
                className="absolute top-6 right-6 text-[#5C5C5C] hover:text-[#E8E6E0] transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="text-[11px] text-[#5C5C5C] font-sans tracking-[0.2em] mb-6 uppercase">
                Structure Detail
              </div>
              
              <h2 className="font-serif text-[40px] font-bold text-[#E8E6E0] mb-2 leading-none">
                {selectedBuilding.name}
              </h2>
              <div className="font-mono text-[11px] text-[#C41E1E] uppercase tracking-[0.2em] mb-8">
                {selectedBuilding.domain} Domain
              </div>
              
              <p className="font-serif italic text-[#5C5C5C] text-[18px] leading-relaxed mb-12">
                "{selectedBuilding.loreText}"
              </p>

              <div className="space-y-10 flex-1">
                <div>
                  <div className="text-[11px] text-[#3A3A3A] font-sans tracking-[0.2em] mb-4 uppercase">
                    Unlock Condition
                  </div>
                  <div className={`font-mono text-[11px] flex items-center gap-3 uppercase tracking-[0.1em] ${selectedBuilding.status === 'locked' ? 'text-[#5C5C5C]' : 'text-[#E8E6E0]'}`}>
                    {selectedBuilding.status !== 'locked' ? <Check size={16} className="text-[#C41E1E]" /> : <X size={16} className="text-[#3A3A3A]" />}
                    {selectedBuilding.unlockAttribute.replace('attr_', '')} LEVEL {selectedBuilding.unlockThreshold}
                  </div>
                </div>
                
                <div>
                  <div className="text-[11px] text-[#3A3A3A] font-sans tracking-[0.2em] mb-4 uppercase">
                    Effects
                  </div>
                  <ul className="font-mono text-[11px] text-[#5C5C5C] space-y-4 uppercase tracking-[0.1em]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#C41E1E] mt-0.5">◆</span> 
                      <span>Unlocks {selectedBuilding.questUnlockDomain} quests</span>
                    </li>
                    {selectedBuilding.xpBonusPct > 0 && (
                      <li className="flex items-start gap-3">
                        <span className="text-[#C41E1E] mt-0.5">◆</span> 
                        <span>+{selectedBuilding.xpBonusPct}% XP in {selectedBuilding.questUnlockDomain} domain</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-[#1A1A1A]">
                {selectedBuilding.status === 'available' && (
                  <Button 
                    variant="default"
                    onClick={() => handleBuild(selectedBuilding.id)}
                    disabled={isBuilding}
                    className="w-full"
                  >
                    {isBuilding ? 'MANIFESTING...' : 'MANIFEST'}
                  </Button>
                )}
                {selectedBuilding.status === 'locked' && (
                  <Button 
                    variant="secondary"
                    disabled
                    className="w-full opacity-50"
                  >
                    LOCKED
                  </Button>
                )}
                {selectedBuilding.status === 'built' && (
                  <Button 
                    variant="secondary"
                    disabled
                    className="w-full"
                  >
                    MANIFESTED
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Overlay for mobile panel */}
        {selectedBuilding && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 sm:hidden"
            onClick={() => setSelectedBuilding(null)}
          />
        )}
    </div>
  )
}
