'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export default function SettingsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [names, setNames] = useState({ characterName: '', kingdomName: '', companionName: '' })
  const [isSavingNames, setIsSavingNames] = useState(false)

  const [houseId, setHouseId] = useState('')
  const [isSavingHouse, setIsSavingHouse] = useState(false)
  const [cooldownTime, setCooldownTime] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setProfile(data)
          setNames({
            characterName: data.characterName,
            kingdomName: data.kingdomName,
            companionName: data.companionName
          })
          setHouseId(data.houseId)
        }
        setLoading(false)
      })
  }, [])

  const handleSaveNames = async () => {
    setIsSavingNames(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(names)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update names')
      showToast('Names updated successfully')
    } catch (err: any) {
      showToast(err.message)
    } finally {
      setIsSavingNames(false)
    }
  }

  const handleSaveHouse = async () => {
    setIsSavingHouse(true)
    try {
      const res = await fetch('/api/profile/change-house', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ houseId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to change house')
      showToast('House changed successfully')
      
      // Update local profile to reflect cooldown
      const pRes = await fetch('/api/profile')
      const pData = await pRes.json()
      setProfile(pData)
    } catch (err: any) {
      showToast(err.message)
    } finally {
      setIsSavingHouse(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="text-[#5C5C5C] font-mono text-sm tracking-widest uppercase">Accessing Configurations...</div>
  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-24 md:pb-0">
      <div className="text-[10px] text-[#5C5C5C] font-mono tracking-[0.2em] mb-2 uppercase">System</div>
      <h1 className="font-display text-5xl font-bold text-[#E8E6E0] mb-12">Configurations</h1>

      <section className="mb-12 border border-[#1A1A1A] p-6 bg-[rgba(255,255,255,0.01)]">
        <h2 className="font-mono text-xs text-[#E8E6E0] uppercase tracking-[0.2em] mb-6 border-b border-[#1A1A1A] pb-2">Identities</h2>
        
        <div className="space-y-6 mb-6">
          <div>
            <label className="block font-mono text-[10px] text-[#5C5C5C] uppercase tracking-widest mb-2">Character Name</label>
            <input 
              type="text" 
              value={names.characterName} 
              onChange={e => setNames(prev => ({ ...prev, characterName: e.target.value }))}
              className="w-full bg-[#080808] border border-[#1A1A1A] text-[#E8E6E0] font-sans px-4 py-3 focus:outline-none focus:border-[#C41E1E] transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#5C5C5C] uppercase tracking-widest mb-2">Kingdom Name</label>
            <input 
              type="text" 
              value={names.kingdomName} 
              onChange={e => setNames(prev => ({ ...prev, kingdomName: e.target.value }))}
              className="w-full bg-[#080808] border border-[#1A1A1A] text-[#E8E6E0] font-sans px-4 py-3 focus:outline-none focus:border-[#C41E1E] transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#5C5C5C] uppercase tracking-widest mb-2">Companion Name</label>
            <input 
              type="text" 
              value={names.companionName} 
              onChange={e => setNames(prev => ({ ...prev, companionName: e.target.value }))}
              className="w-full bg-[#080808] border border-[#1A1A1A] text-[#E8E6E0] font-sans px-4 py-3 focus:outline-none focus:border-[#C41E1E] transition-colors"
            />
          </div>
        </div>

        <button 
          onClick={handleSaveNames}
          disabled={isSavingNames}
          className="border border-[#1A1A1A] text-[#E8E6E0] px-6 py-2 font-mono text-xs tracking-widest hover:bg-[#1A1A1A] hover:text-[#C41E1E] transition-colors uppercase disabled:opacity-50"
        >
          {isSavingNames ? 'Saving...' : 'Update Identities'}
        </button>
      </section>

      <section className="mb-12 border border-[#1A1A1A] p-6 bg-[rgba(255,255,255,0.01)]">
        <h2 className="font-mono text-xs text-[#E8E6E0] uppercase tracking-[0.2em] mb-6 border-b border-[#1A1A1A] pb-2">Order Affiliation</h2>
        
        <div className="mb-6">
          <label className="block font-mono text-[10px] text-[#5C5C5C] uppercase tracking-widest mb-2">House</label>
          <select 
            value={houseId} 
            onChange={e => setHouseId(e.target.value)}
            className="w-full bg-[#080808] border border-[#1A1A1A] text-[#E8E6E0] font-sans px-4 py-3 focus:outline-none focus:border-[#C41E1E] transition-colors appearance-none"
          >
            <option value="ash">House Ash (Strength & Vitality)</option>
            <option value="zenith">House Zenith (Focus & Discipline)</option>
            <option value="forge">House Forge (Technical & Intelligence)</option>
            <option value="crown">House Crown (Leadership & Charisma)</option>
          </select>
        </div>

        <button 
          onClick={handleSaveHouse}
          disabled={isSavingHouse || houseId === profile.houseId}
          className="border border-[#1A1A1A] text-[#E8E6E0] px-6 py-2 font-mono text-xs tracking-widest hover:bg-[#1A1A1A] hover:text-[#C41E1E] transition-colors uppercase disabled:opacity-50"
        >
          {isSavingHouse ? 'Switching...' : 'Switch House'}
        </button>
        <p className="mt-4 font-mono text-[9px] text-[#5C5C5C] uppercase tracking-widest">
          Note: You may only change your affiliation once per week.
        </p>
      </section>

      <section className="border border-[#1A1A1A] border-l-[#C41E1E] p-6 bg-[rgba(196,30,30,0.02)]">
        <h2 className="font-mono text-xs text-[#C41E1E] uppercase tracking-[0.2em] mb-6 border-b border-[#1A1A1A] pb-2">Danger Zone</h2>
        
        <div className="flex gap-4">
          <button 
            onClick={handleLogout}
            className="border border-[#1A1A1A] text-[#E8E6E0] px-6 py-2 font-mono text-xs tracking-widest hover:bg-[#C41E1E] hover:text-white transition-colors uppercase"
          >
            Disconnect
          </button>
        </div>
      </section>
    </div>
  )
}
