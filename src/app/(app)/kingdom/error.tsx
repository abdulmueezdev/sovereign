'use client'
import { AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex-1 min-h-[400px] bg-[#080808] flex items-center justify-center p-8">
      <div className="text-center max-w-md border border-[#1A1A1A] p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C41E1E] to-transparent opacity-50" />
        <AlertTriangle className="w-12 h-12 text-[#C41E1E] mx-auto mb-6" strokeWidth={1} />
        <h2 className="font-serif text-[28px] font-bold text-[#E8E6E0] mb-2 uppercase tracking-wide">
          Fracture Detected
        </h2>
        <p className="font-sans text-[14px] text-[#767676] mb-8 leading-relaxed">
          The void has shifted unexpectedly. Reality fails to manifest here.
        </p>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C41E1E] mb-8 opacity-80 break-words">
          {error.message || 'Unknown corruption'}
        </p>
        <button 
          onClick={reset}
          className="bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-10 py-3 hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E8E6E0]"
        >
          Realign Reality
        </button>
      </div>
    </div>
  )
}
