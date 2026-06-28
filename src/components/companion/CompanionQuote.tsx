import Link from 'next/link'

export function CompanionQuote() {
  return (
    <div className="flex flex-col gap-4">
      <div className="font-mono text-[10px] text-[#C41E1E] tracking-[0.15em] uppercase">
        AEGIS // ARCHITECT
      </div>
      <blockquote className="font-serif italic text-[18px] text-[#767676] leading-relaxed border-l-[1px] border-[#1A1A1A] pl-4">
        "We stare into the abyss, and the abyss structures our reality."
      </blockquote>
      <div>
        <Link 
          href="/companion" 
          className="font-serif italic text-[18px] text-[#C41E1E] hover:text-[#E8E6E0] transition-colors"
        >
          Commune →
        </Link>
      </div>
    </div>
  )
}
