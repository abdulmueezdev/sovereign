'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  character_name: string
  kingdom_name: string
  companion_name: string
  class: 'scholar' | 'warrior' | 'builder' | 'commander'
  house_id: 'ash' | 'zenith' | 'forge' | 'crown'
  level: number
  xp: number
  xp_to_next: number
  xp_total: number
  kingdom_level: number
  kingdom_xp: number
  attr_strength: number
  attr_vitality: number
  attr_intelligence: number
  attr_focus: number
  attr_technical: number
  attr_creativity: number
  attr_leadership: number
  attr_charisma: number
  attr_discipline: number
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}

interface UserContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  refetchProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
  refetchProfile: async () => {},
  signOut: async () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Profile doesn't exist yet — user just signed up, hasn't done onboarding
        console.log('No profile found for user — onboarding needed')
        setProfile(null)
        return
      }
      setProfile(data as Profile)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(null)
    }
  }, [supabase])

  const refetchProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (err) {
        console.error('Error getting session:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [supabase])

  return (
    <UserContext.Provider value={{ user, profile, loading, refetchProfile, signOut }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
