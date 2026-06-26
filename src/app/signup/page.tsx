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
          <div className="mb-10">
            <h1 className="font-serif text-[40px] font-bold text-[#E8E6E0] leading-none mb-2">
              BEGIN
            </h1>
            <p className="font-mono text-[10px] text-[#5C5C5C] tracking-[0.2em] uppercase">
              Claim Your Kingdom
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 border border-[#1A1A1A] bg-[rgba(255,255,255,0.02)]">
              <h2 className="font-sans text-[11px] text-[#C41E1E] uppercase tracking-[0.2em] mb-4">
                Registration Currently Disabled
              </h2>
              <p className="font-sans text-[13px] text-[#E8E6E0] mb-6 leading-relaxed">
                New accounts cannot be created at this time. Please use the following credentials to access the experience:
              </p>
              
              <div className="space-y-2 font-mono text-[11px] text-[#5C5C5C]">
                <div>
                  <span className="uppercase tracking-[0.2em] text-[#E8E6E0]">ID:</span> admin@gmail.com
                </div>
                <div>
                  <span className="uppercase tracking-[0.2em] text-[#E8E6E0]">Password:</span> admin123
                </div>
              </div>
            </div>
            
            <Link 
              href="/login"
              className="w-full flex items-center justify-center bg-[#1A1A1A] text-[#E8E6E0] font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#C41E1E] hover:text-[#FAFAF9] transition-colors"
            >
              PROCEED TO LOGIN
            </Link>
          </div>

          <p className="mt-8 font-sans text-[13px] text-[#5C5C5C]">
            Already have a kingdom?{' '}
            <Link href="/login" className="text-[#5C5C5C] hover:text-[#E8E6E0] transition-colors duration-150">
              Enter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
