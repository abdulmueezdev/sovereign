'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Validate password length (Supabase minimum is 6)
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Check if email confirmation is required
      setSuccess(true)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md animate-fade-in-up text-center">
          <h1 className="font-serif text-5xl font-bold tracking-wide text-foreground mb-6">
            Sovereign
          </h1>
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-xl font-medium text-foreground mb-3">
              The Void Awaits
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Check your email to confirm your account. Once confirmed, you can enter the kingdom and begin your journey.
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="bg-crimson hover:bg-crimson/90 text-white font-medium tracking-wide"
            >
              Proceed to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl font-bold tracking-wide text-foreground">
            Sovereign
          </h1>
          <p className="mt-3 text-sm text-muted-foreground tracking-widest uppercase">
            Claim Your Kingdom
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground text-sm tracking-wide">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 h-11"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground text-sm tracking-wide">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 h-11"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-muted-foreground text-sm tracking-wide">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              minLength={6}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 h-11"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-crimson hover:bg-crimson/90 text-white font-medium tracking-wide transition-colors"
          >
            {loading ? 'Forging Your Path...' : 'Begin Your Journey'}
          </Button>
        </form>

        {/* Login link */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have a kingdom?{' '}
          <Link href="/login" className="text-crimson hover:text-crimson/80 transition-colors font-medium">
            Enter
          </Link>
        </p>
      </div>
    </div>
  )
}
