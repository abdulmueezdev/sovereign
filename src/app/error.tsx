'use client'
import { useEffect } from 'react'

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-4xl text-[#E8E6E0] mb-4">The void shifts unexpectedly.</h1>
        <p className="font-serif text-xl italic text-[#C41E1E] mb-8 break-words">{error.message}</p>
        <button 
          onClick={reset} 
          className="bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-3 border-none hover:bg-[#E8282B] transition-colors duration-150 active:scale-[0.97]"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
