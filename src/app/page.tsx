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
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Decorative vertical line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#C41E1E]/20 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center animate-fade-in-up flex flex-col items-center">
        
        <p className="font-sans text-[13px] tracking-[0.3em] text-[#5C5C5C] uppercase mb-12">
          SOVEREIGN
        </p>
        
        <h1 className="font-serif text-[64px] md:text-[80px] font-bold text-[#E8E6E0] leading-none mb-6 max-w-4xl">
          Forge Your Kingdom from the Void
        </h1>
        
        <p className="font-serif text-[28px] md:text-[32px] italic text-[#B0AAA0] mb-16 max-w-2xl">
          Complete quests. Earn power. Ascend.
        </p>

        <Link href="/signup">
          <Button variant="default">
            Claim Your Kingdom
          </Button>
        </Link>
        
        <div className="mt-8">
          <Link href="/login" className="font-serif text-[18px] italic text-[#C41E1E] hover:text-[#E8E6E0] transition-colors duration-150">
            Or enter the void as an existing sovereign...
          </Link>
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
