'use client'

export default function KingdomError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#080808] text-[#E8E6E0] flex flex-col items-center justify-center -m-4 md:-m-8">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C41E1E]">CORRUPTION DETECTED</p>
      <h1 className="font-serif text-[48px] font-bold mt-4">The void shifts unexpectedly.</h1>
      <p className="font-sans text-[13px] text-[#5C5C5C] mt-6">Failed to fetch kingdom data.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-8 bg-[#C41E1E] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-8 py-3 hover:bg-[#E8282B] transition-colors"
      >
        RETURN TO THE REALM
      </button>
    </div>
  )
}
