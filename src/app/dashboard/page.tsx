'use client'

import { useUser } from '@/contexts/UserContext'
import { UserProvider } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

function DashboardContent() {
  const { user, profile, loading, signOut } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!loading && user && profile && !profile.onboarding_complete) {
      router.push('/onboarding')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="font-serif text-2xl text-muted-foreground">Loading your kingdom...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // No profile yet — redirect to onboarding
  if (!profile) {
    router.push('/onboarding')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {profile.character_name}
            </h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Level {profile.level} — {getTitleForLevel(profile.level)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{profile.kingdom_name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground"
            >
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area — blank for now, will be built in later tasks */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="font-serif text-4xl text-foreground mb-4">Your Kingdom Awaits</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The realm takes shape around your actions. Begin your first quest to start building.
          </p>
        </div>
      </main>
    </div>
  )
}

function getTitleForLevel(level: number): string {
  const titles = [
    { minLevel: 50, title: 'Sovereign' },
    { minLevel: 40, title: 'Grandmaster' },
    { minLevel: 30, title: 'Master' },
    { minLevel: 25, title: 'Expert' },
    { minLevel: 20, title: 'Practitioner' },
    { minLevel: 15, title: 'Adept' },
    { minLevel: 10, title: 'Journeyman' },
    { minLevel: 8,  title: 'Scout' },
    { minLevel: 5,  title: 'Apprentice' },
    { minLevel: 3,  title: 'Seeker' },
    { minLevel: 1,  title: 'Initiate' },
  ]
  return titles.find(t => level >= t.minLevel)?.title ?? 'Initiate'
}

export default function DashboardPage() {
  return (
    <UserProvider>
      <DashboardContent />
    </UserProvider>
  )
}
