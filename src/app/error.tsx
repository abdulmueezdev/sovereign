'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="font-cormorant text-4xl text-[#E8E6E0] mb-4">The void shifts unexpectedly.</h1>
        <p className="font-grotesk text-sm text-[#5C5C5C] mb-8 break-words">{error.message}</p>
        <button 
          onClick={reset} 
          className="px-8 py-3 bg-[#C41E1E] text-white font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-[#E8282B] transition-colors"
        >
          Return to the realm
        </button>
      </div>
    </div>
  )
}
