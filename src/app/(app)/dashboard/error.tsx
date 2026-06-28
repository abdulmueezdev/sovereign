'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <p className="font-cormorant text-[28px] italic text-[#E8E6E0] mb-4">
          The void shifts unexpectedly.
        </p>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C41E1E] mb-8">
          {error.message}
        </p>
        <button 
          onClick={reset}
          className="bg-[#C41E1E] text-white font-grotesk text-[11px] tracking-[0.2em] uppercase px-10 py-3 hover:bg-[#E8282B] active:scale-[0.97] transition-all duration-150"
        >
          Return to the Realm
        </button>
      </div>
    </div>
  )
}
