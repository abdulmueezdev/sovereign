'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/schemas'
import { z } from 'zod'

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col justify-center px-[20%]">
      <div className="w-full max-w-[480px]">
        {/* Entrance animation container */}
        <div 
          className="animate-fade-in-up" 
          style={{ 
            animation: 'fadeInUp 400ms var(--ease-out-expo) both'
          }}
        >
          <div className="mb-10">
            <h1 className="font-serif text-[40px] font-bold text-[#E8E6E0] leading-none mb-2">
              SIGN IN
            </h1>
            <p className="font-mono text-[10px] text-[#5C5C5C] tracking-[0.2em] uppercase">
              Enter the Void
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="font-mono text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase block">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full h-12 bg-transparent border border-[#2A2A2A] text-[#E8E6E0] font-sans px-4 placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C41E1E] transition-colors"
                autoComplete="email"
              />
              {errors.email && (
                <p className="font-sans text-[13px] text-[#C41E1E] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="font-mono text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase block">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter your password"
                className="w-full h-12 bg-transparent border border-[#2A2A2A] text-[#E8E6E0] font-sans px-4 placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C41E1E] transition-colors"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="font-sans text-[13px] text-[#C41E1E] mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="font-sans text-[13px] text-[#C41E1E] py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-3 border-none hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150 mt-4 disabled:opacity-50 disabled:hover:bg-[#C41E1E] disabled:active:scale-100"
            >
              {loading ? 'Entering...' : 'Enter the Kingdom'}
            </button>
          </form>

          <p className="mt-8 font-sans text-[13px] text-[#5C5C5C]">
            No account?{' '}
            <Link href="/signup" className="text-[#5C5C5C] hover:text-[#E8E6E0] transition-colors duration-150">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
