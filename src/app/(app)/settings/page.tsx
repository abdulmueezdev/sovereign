'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'

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

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      import('@/lib/demo-data').then(({ DEMO_PROFILE }) => {
        setProfile(DEMO_PROFILE)
        setNames({
          characterName: DEMO_PROFILE.character_name,
          kingdomName: DEMO_PROFILE.kingdom_name,
          companionName: DEMO_PROFILE.companion_name || 'Aegis'
        })
        setHouseId(DEMO_PROFILE.house_id)
        setLoading(false)
      })
      return
    }

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
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      setIsSavingNames(true)
      setTimeout(() => {
        setProfile((prev: any) => ({ ...prev, characterName: names.characterName, kingdomName: names.kingdomName, companionName: names.companionName }))
        showToast('Identities updated successfully')
        setIsSavingNames(false)
      }, 500)
      return
    }

    setIsSavingNames(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(names)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update names')
      showToast('Identities updated successfully')
    } catch (err: any) {
      showToast(err.message)
    } finally {
      setIsSavingNames(false)
    }
  }

  const handleSaveHouse = async () => {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      setIsSavingHouse(true)
      setTimeout(() => {
        setProfile((prev: any) => ({ ...prev, houseId }))
        showToast('House changed successfully')
        setIsSavingHouse(false)
      }, 500)
      return
    }

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

  if (loading) {
    return (
      <div className="flex-1 p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="text-[#5C5C5C] font-mono text-[11px] tracking-[0.2em] uppercase">Accessing Configurations...</div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="flex-1 p-8 md:p-12 lg:p-16 min-h-screen">
      <div className="max-w-2xl mx-auto animate-fade-in-up pb-24 md:pb-0">
          
          <div className="mb-16">
            <div className="text-[11px] text-[#5C5C5C] font-sans tracking-[0.2em] mb-4 uppercase">
              System
            </div>
            <h1 className="font-serif text-[64px] md:text-[80px] font-bold text-[#E8E6E0] mb-2 leading-none">
              Configurations
            </h1>
          </div>

          {/* Identities Section */}
          <section className="mb-16">
            <h2 className="font-sans text-[11px] text-[#5C5C5C] uppercase tracking-[0.2em] mb-8 border-b border-[#1A1A1A] pb-4">
              Identities
            </h2>
            
            <div className="flex flex-col gap-8 mb-12">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] text-[#5C5C5C] uppercase tracking-[0.2em]">Character Name</label>
                <input 
                  type="text" 
                  value={names.characterName} 
                  onChange={e => setNames(prev => ({ ...prev, characterName: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#1A1A1A] text-[#E8E6E0] font-serif text-[22px] py-2 focus:outline-none focus:border-[#C41E1E] focus:shadow-[0_1px_6px_-2px_rgba(196,30,30,0.3)] transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] text-[#5C5C5C] uppercase tracking-[0.2em]">Kingdom Name</label>
                <input 
                  type="text" 
                  value={names.kingdomName} 
                  onChange={e => setNames(prev => ({ ...prev, kingdomName: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#1A1A1A] text-[#E8E6E0] font-serif text-[22px] py-2 focus:outline-none focus:border-[#C41E1E] focus:shadow-[0_1px_6px_-2px_rgba(196,30,30,0.3)] transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] text-[#5C5C5C] uppercase tracking-[0.2em]">Companion Name</label>
                <input 
                  type="text" 
                  value={names.companionName} 
                  onChange={e => setNames(prev => ({ ...prev, companionName: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#1A1A1A] text-[#E8E6E0] font-serif text-[22px] py-2 focus:outline-none focus:border-[#C41E1E] focus:shadow-[0_1px_6px_-2px_rgba(196,30,30,0.3)] transition-all"
                />
              </div>
            </div>

            <Button 
              variant="default"
              onClick={handleSaveNames}
              disabled={isSavingNames}
            >
              {isSavingNames ? 'UPDATING...' : 'UPDATE IDENTITIES'}
            </Button>
          </section>

          {/* Order Affiliation Section */}
          <section className="mb-16">
            <h2 className="font-sans text-[11px] text-[#5C5C5C] uppercase tracking-[0.2em] mb-8 border-b border-[#1A1A1A] pb-4">
              Order Affiliation
            </h2>
            
            <div className="flex flex-col gap-2 mb-8">
              <label className="font-sans text-[11px] text-[#5C5C5C] uppercase tracking-[0.2em]">House</label>
              <select 
                value={houseId} 
                onChange={e => setHouseId(e.target.value)}
                className="w-full bg-transparent border-b border-[#1A1A1A] text-[#E8E6E0] font-serif text-[22px] py-2 focus:outline-none focus:border-[#C41E1E] focus:shadow-[0_1px_6px_-2px_rgba(196,30,30,0.3)] transition-all appearance-none cursor-pointer"
              >
                <option value="ash" className="bg-[#080808] text-[#E8E6E0] font-sans text-[14px]">House Ash (Strength & Vitality)</option>
                <option value="zenith" className="bg-[#080808] text-[#E8E6E0] font-sans text-[14px]">House Zenith (Focus & Discipline)</option>
                <option value="forge" className="bg-[#080808] text-[#E8E6E0] font-sans text-[14px]">House Forge (Technical & Intelligence)</option>
                <option value="crown" className="bg-[#080808] text-[#E8E6E0] font-sans text-[14px]">House Crown (Leadership & Charisma)</option>
              </select>
            </div>

            <div className="flex items-center gap-6">
              <Button 
                variant="secondary"
                onClick={handleSaveHouse}
                disabled={isSavingHouse || houseId === profile.houseId}
              >
                {isSavingHouse ? 'SWITCHING...' : 'SWITCH HOUSE'}
              </Button>
              <span className="font-mono text-[10px] text-[#5C5C5C] tracking-[0.1em] uppercase">
                Note: Limited to once per week.
              </span>
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <h2 className="font-sans text-[11px] text-[#C41E1E] uppercase tracking-[0.2em] mb-8 border-b border-[#1A1A1A] pb-4">
              Danger Zone
            </h2>
            
            <div className="flex gap-4">
              <Button 
                variant="secondary"
                onClick={handleLogout}
              >
                DISCONNECT
              </Button>
            </div>
          </section>
        </div>
      </div>
  )
}
