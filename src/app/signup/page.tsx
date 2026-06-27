'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/lib/schemas'
import { z } from 'zod'

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormValues) => {
    setError(null)
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Auto-redirect to onboarding since dev mode auto-confirms email
      router.push('/onboarding')
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
          <div className="space-y-6 text-center max-w-sm mx-auto">
            <h1 className="font-cormorant text-[32px] font-bold text-[#E8E6E0]">
              Registration Closed
            </h1>
            <p className="font-grotesk text-[13px] text-[#5C5C5C] leading-relaxed">
              New kingdoms are not accepting sovereigns at this time.
              If you were granted access, proceed to the gate.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#C41E1E] text-white font-grotesk text-[11px] tracking-[0.2em] uppercase px-10 py-3 hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150"
            >
              Proceed to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
