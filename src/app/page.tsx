'use client'

import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'
import { UserProvider } from '@/contexts/UserContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function LandingContent() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-crimson/5 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center animate-fade-in-up max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
          An Identity System
        </p>
        <h1 className="font-serif text-7xl md:text-8xl font-bold tracking-tight text-foreground mb-4">
          Sovereign
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
          Turn real-life self-improvement into an RPG kingdom-building game.
          Complete quests. Earn XP. Level up. Build your realm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-crimson hover:bg-crimson/90 text-white font-medium tracking-wide px-8 h-12 text-base animate-pulse-glow"
            >
              Claim Your Kingdom
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="border-border text-muted-foreground hover:text-foreground hover:border-crimson/50 px-8 h-12 text-base"
            >
              Enter the Void
            </Button>
          </Link>
        </div>

        {/* Feature hints */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Quests', desc: 'Real-world missions' },
            { label: 'XP & Levels', desc: 'RPG progression' },
            { label: 'Kingdom', desc: 'Build your realm' },
            { label: 'Companion', desc: 'AI guide' },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-sm font-medium text-foreground tracking-wide">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <UserProvider>
      <LandingContent />
    </UserProvider>
  )
}
