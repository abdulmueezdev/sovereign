'use client'
import { useEffect } from 'react'

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Route Error:', error)
  }, [error])

  return (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      <h2 className="font-cormorant text-2xl text-[#E8E6E0] mb-2">The void shifts unexpectedly.</h2>
      <p className="font-cormorant text-lg italic text-[#C41E1E] mb-6">{error.message}</p>
      <button 
        onClick={reset} 
        className="bg-[#C41E1E] text-white font-grotesk text-[11px] tracking-[0.2em] uppercase px-8 py-3 border-none hover:bg-[#E8282B] transition-colors duration-150 active:scale-[0.97]"
      >
        Retry
      </button>
    </div>
  )
}
