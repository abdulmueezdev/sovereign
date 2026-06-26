'use client'

import { useUser } from '@/contexts/UserContext'
import { UserProvider } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function OnboardingContent() {
  const { user, profile, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
    // If profile exists and onboarding is complete, redirect to dashboard
    if (!loading && profile?.onboarding_complete) {
      router.push('/dashboard')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="font-serif text-2xl text-muted-foreground">Preparing your realm...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center animate-fade-in-up">
        <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
          Create Your Sovereign
        </h1>
        <p className="text-muted-foreground mb-8">
          Onboarding flow will be built in the next task.
          For now, your account is created and you can log in.
        </p>
        <p className="text-sm text-muted-foreground">
          This page is a placeholder. The full onboarding (character name, class selection, companion naming) will be Task 2.
        </p>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <UserProvider>
      <OnboardingContent />
    </UserProvider>
  )
}
