'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingSchema } from '@/lib/schemas'
import { z } from 'zod'
import { UserProvider } from '@/contexts/UserContext'

type OnboardingFormValues = z.infer<typeof onboardingSchema>

const CLASSES = [
  { id: 'scholar', name: 'Scholar', description: 'Cognition and prescience. The path of the mind.' },
  { id: 'warrior', name: 'Warrior', description: 'Kinetic flow and corporeal mass. The path of the body.' },
  { id: 'builder', name: 'Builder', description: 'Emanation and artifact. The path of creation.' },
  { id: 'commander', name: 'Commander', description: 'Dominion and influence. The path of leadership.' },
] as const

function OnboardingContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      characterName: '',
      kingdomName: '',
      class: undefined,
      companionName: 'Aegis',
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedClass = watch('class')

  const handleNextStep = async () => {
    if (step === 1) {
      const valid = await trigger(['characterName', 'kingdomName'])
      if (valid) setStep(2)
    } else if (step === 2) {
      const valid = await trigger(['class'])
      if (valid) setStep(3)
    }
  }

  const onSubmit = async (data: OnboardingFormValues) => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/profile/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to complete onboarding')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col justify-center px-[20%]">
      <div className="w-full max-w-[480px]">
        {/* Progress Indicator */}
        <div className="mb-12 font-mono text-[14px] flex gap-2">
          <span className={step >= 1 ? 'text-[#C41E1E]' : 'text-[#3A3A3A]'}>·</span>
          <span className={step >= 2 ? 'text-[#C41E1E]' : 'text-[#3A3A3A]'}>·</span>
          <span className={step >= 3 ? 'text-[#C41E1E]' : 'text-[#3A3A3A]'}>·</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div 
              className="space-y-8 animate-fade-in-up"
              style={{ animation: 'fadeInUp 400ms var(--ease-out-expo) both' }}
            >
              <div>
                <h2 className="font-mono text-[10px] text-[#767676] tracking-[0.2em] uppercase mb-6">
                  IDENTITY
                </h2>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[13px] text-[#767676] block">
                  Character Name
                </label>
                <input
                  type="text"
                  {...register('characterName')}
                  placeholder="Enter your name"
                  className="w-full h-12 bg-transparent border border-[#2A2A2A] text-[#E8E6E0] font-sans px-4 placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C41E1E] transition-colors"
                />
                {errors.characterName && (
                  <p className="font-sans text-[13px] text-[#C41E1E] mt-1">{errors.characterName.message}</p>
                )}
              </div>

              <div className="space-y-2" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                <label className="font-sans text-[13px] text-[#767676] block">
                  Kingdom Name
                </label>
                <input
                  type="text"
                  {...register('kingdomName')}
                  placeholder="Name your realm"
                  className="w-full h-12 bg-transparent border border-[#2A2A2A] text-[#E8E6E0] font-sans px-4 placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C41E1E] transition-colors"
                />
                {errors.kingdomName && (
                  <p className="font-sans text-[13px] text-[#C41E1E] mt-1">{errors.kingdomName.message}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-3 border-none hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150 mt-8"
                style={{ animationDelay: '200ms', animationFillMode: 'both' }}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: CLASS SELECTION */}
          {step === 2 && (
            <div 
              className="space-y-8 animate-fade-in-up"
              style={{ animation: 'fadeInUp 400ms var(--ease-out-expo) both' }}
            >
              <div>
                <h2 className="font-mono text-[10px] text-[#767676] tracking-[0.2em] uppercase mb-6">
                  AFFINITY
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {CLASSES.map((c, index) => {
                  const isSelected = selectedClass === c.id
                  return (
                    <div
                      key={c.id}
                      onClick={() => setValue('class', c.id as any, { shouldValidate: true })}
                      className={`cursor-pointer p-6 transition-all duration-150 border ${
                        isSelected 
                          ? 'border-[#C41E1E] bg-[rgba(196,30,30,0.05)]' 
                          : 'border-[#2A2A2A] bg-transparent hover:border-[#E8E6E0] hover:bg-[rgba(255,255,255,0.02)]'
                      }`}
                      style={{ animation: 'fadeInUp 400ms var(--ease-out-expo) both', animationDelay: `${index * 100}ms` }}
                    >
                      <h3 className="font-serif text-[24px] font-bold text-[#E8E6E0] mb-2">{c.name}</h3>
                      <p className="font-sans text-[13px] text-[#767676] line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  )
                })}
              </div>
              
              {errors.class && (
                <p className="font-sans text-[13px] text-[#C41E1E] mt-1">{errors.class.message}</p>
              )}

              <button
                type="button"
                disabled={!selectedClass}
                onClick={handleNextStep}
                className="bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-3 border-none hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150 disabled:opacity-50 disabled:hover:bg-[#C41E1E] disabled:active:scale-100 mt-8"
                style={{ animation: 'fadeInUp 400ms var(--ease-out-expo) both', animationDelay: '400ms' }}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 3: COMPANION */}
          {step === 3 && (
            <div 
              className="space-y-8 animate-fade-in-up"
              style={{ animation: 'fadeInUp 400ms var(--ease-out-expo) both' }}
            >
              <div>
                <h2 className="font-mono text-[10px] text-[#767676] tracking-[0.2em] uppercase mb-6">
                  ARCHITECT
                </h2>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[13px] text-[#767676] block">
                  Companion Name
                </label>
                <input
                  type="text"
                  {...register('companionName')}
                  placeholder="Aegis"
                  className="w-full h-12 bg-transparent border border-[#2A2A2A] text-[#E8E6E0] font-sans px-4 placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C41E1E] transition-colors"
                />
                {errors.companionName && (
                  <p className="font-sans text-[13px] text-[#C41E1E] mt-1">{errors.companionName.message}</p>
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
                className="bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-3 border-none hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150 disabled:opacity-50 disabled:hover:bg-[#C41E1E] disabled:active:scale-100 mt-8"
                style={{ animationDelay: '100ms', animationFillMode: 'both' }}
              >
                {loading ? 'Entering...' : 'Enter Sovereign'}
              </button>
            </div>
          )}
        </form>
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
