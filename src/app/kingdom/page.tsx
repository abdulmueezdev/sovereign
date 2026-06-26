'use client'

import { useEffect, useState } from 'react'
import { Check, X, Building, ChevronRight } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function KingdomPage() {
  const [kingdom, setKingdom] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const { showToast } = useToast()

  async function fetchKingdom() {
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
    setIsBuilding(true)
    try {
      const res = await fetch(`/api/kingdom/${buildingId}/build`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to manifest structure')
      
      showToast(data.message || 'Structure manifested')
      setSelectedBuilding(null)
      fetchKingdom() // Refresh data
    } catch (err: any) {
      showToast(err.message)
    } finally {
      setIsBuilding(false)
    }
  }

  if (loading) return <div className="text-[#5C5C5C] font-mono text-sm tracking-widest uppercase">Surveying Domain...</div>
  if (error) return <div className="text-[#C41E1E] font-mono text-sm">Corruption Detected: {error}</div>
  if (!kingdom) return null

  const builtBuildings = kingdom.buildings.filter((b: any) => b.status === 'built')
  const potentialBuildings = kingdom.buildings.filter((b: any) => b.status !== 'built')

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] relative overflow-hidden animate-fade-in">
      {/* Left Column */}
      <div className="w-full md:w-[55%] flex flex-col gap-12 pr-0 md:pr-12 overflow-y-auto pb-24 md:pb-0 scrollbar-hide">
        
        {/* Header */}
        <div>
          <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-2 uppercase">Domain of</div>
          <h1 className="font-display text-5xl font-bold text-[#E8E6E0] mb-4 uppercase">{kingdom.name}</h1>
          <p className="font-display italic text-[#5C5C5C] text-lg max-w-lg mb-8">
            A reflection of your inner fortitude. As you conquer the physical realm, these walls rise in parallel.
          </p>
          
          <div className="flex gap-6 items-center">
            <button className="border border-[#1A1A1A] text-[#E8E6E0] px-6 py-2 font-mono text-xs tracking-widest hover:bg-[#1A1A1A] hover:text-[#C41E1E] transition-colors uppercase">
              Transcend
            </button>
            <button className="border border-[#1A1A1A] text-[#E8E6E0] px-6 py-2 font-mono text-xs tracking-widest hover:bg-[#1A1A1A] hover:text-[#C41E1E] transition-colors uppercase">
              Commune
            </button>
          </div>
        </div>

        {/* Built Structures */}
        <section>
          <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-6 uppercase border-b border-[#1A1A1A] pb-4">
            Manifested Monuments
          </div>
          {builtBuildings.length === 0 ? (
            <div className="text-[#5C5C5C] font-mono text-xs italic">No structures manifested yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {builtBuildings.map((b: any) => (
                <div 
                  key={b.id} 
                  onClick={() => setSelectedBuilding(b)}
                  className="flex items-center gap-4 p-4 border border-[#1A1A1A] cursor-pointer hover:border-[#3A3A3A] transition-colors group"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#0C0C0C] text-[#C41E1E]">
                    <Building size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-[#E8E6E0] text-lg leading-tight group-hover:text-[#C41E1E] transition-colors">{b.name}</div>
                    <div className="font-mono text-[9px] text-[#5C5C5C] uppercase tracking-wider">{b.domain} domain</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Potential Structures */}
        <section>
          <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-6 uppercase border-b border-[#1A1A1A] pb-4">
            Potential Configurations
          </div>
          <div className="flex flex-col gap-3">
            {potentialBuildings.map((b: any) => (
              <div 
                key={b.id} 
                onClick={() => setSelectedBuilding(b)}
                className={`flex items-center justify-between p-4 border border-[#1A1A1A] cursor-pointer transition-colors ${
                  b.status === 'available' ? 'hover:border-[#C41E1E]/50' : 'hover:border-[#3A3A3A] opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center ${b.status === 'available' ? 'text-[#E8E6E0]' : 'text-[#3A3A3A]'}`}>
                    <Building size={16} />
                  </div>
                  <div>
                    <div className={`font-display text-lg leading-tight ${b.status === 'available' ? 'text-[#E8E6E0]' : 'text-[#5C5C5C]'}`}>{b.name}</div>
                    <div className="font-mono text-[9px] text-[#5C5C5C] uppercase tracking-wider">{b.domain} domain</div>
                  </div>
                </div>
                <div className="font-mono text-[9px] tracking-widest flex items-center gap-2">
                  {b.status === 'available' ? (
                    <span className="text-[#C41E1E]">AVAILABLE</span>
                  ) : (
                    <span className="text-[#3A3A3A]">LOCKED</span>
                  )}
                  <ChevronRight size={14} className="text-[#5C5C5C]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column / Detail Panel */}
      <div 
        className={`fixed md:absolute top-0 right-0 w-[90%] sm:w-[400px] h-full bg-[#0C0C0C] border-l border-[#1A1A1A] p-8 flex flex-col transition-transform duration-500 ease-out-expo z-20 ${
          selectedBuilding ? 'translate-x-0' : 'translate-x-[110%]'
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
            
            <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-4 uppercase">Structure Detail</div>
            <h2 className="font-display text-4xl text-[#E8E6E0] mb-2 leading-none">{selectedBuilding.name}</h2>
            <div className="font-mono text-xs text-[#C41E1E] uppercase tracking-widest mb-8">{selectedBuilding.domain} Domain</div>
            
            <p className="font-display italic text-[#5C5C5C] text-lg leading-relaxed mb-8">
              {selectedBuilding.loreText}
            </p>

            <div className="space-y-6 flex-1">
              <div>
                <div className="text-[9px] text-[#3A3A3A] font-mono tracking-[0.2em] mb-2 uppercase">Unlock Condition</div>
                <div className={`font-mono text-xs flex items-center gap-2 ${selectedBuilding.status === 'locked' ? 'text-[#5C5C5C]' : 'text-[#E8E6E0]'}`}>
                  {selectedBuilding.status !== 'locked' ? <Check size={14} className="text-[#C41E1E]" /> : <span className="w-[14px]" />}
                  {selectedBuilding.unlockAttribute.replace('attr_', '').toUpperCase()} level {selectedBuilding.unlockThreshold}
                </div>
              </div>
              
              <div>
                <div className="text-[9px] text-[#3A3A3A] font-mono tracking-[0.2em] mb-2 uppercase">Effects</div>
                <ul className="font-mono text-xs text-[#5C5C5C] space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-[#C41E1E]">◆</span> Unlocks {selectedBuilding.questUnlockDomain} quests
                  </li>
                  {selectedBuilding.xpBonusPct > 0 && (
                    <li className="flex items-center gap-2">
                      <span className="text-[#C41E1E]">◆</span> +{selectedBuilding.xpBonusPct}% XP in {selectedBuilding.questUnlockDomain} domain
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {selectedBuilding.status === 'available' && (
              <button 
                onClick={() => handleBuild(selectedBuilding.id)}
                disabled={isBuilding}
                className="w-full bg-[#E8E6E0] text-[#080808] font-mono tracking-[0.2em] text-xs py-4 uppercase hover:bg-[#C41E1E] hover:text-[#FAFAF9] transition-colors disabled:opacity-50"
              >
                {isBuilding ? 'Manifesting...' : 'Manifest Structure'}
              </button>
            )}
            {selectedBuilding.status === 'locked' && (
              <div className="w-full border border-[#1A1A1A] text-[#3A3A3A] font-mono tracking-[0.2em] text-xs py-4 text-center uppercase">
                Prerequisites Not Met
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Overlay for mobile panel */}
      {selectedBuilding && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSelectedBuilding(null)}
        />
      )}
    </div>
  )
}
