import Image from 'next/image'
import { Sidebar } from '@/components/layout/Sidebar'

export default function GuildHubPage() {
  const members = [
    { rank: 'I', name: 'Alucard', xp: '1,200', top3: true },
    { rank: 'II', name: 'Aeon', xp: '950', top3: true },
    { rank: 'III', name: 'Seraph', xp: '800', top3: true },
    { rank: 'IV', name: 'Kael', xp: '600', top3: false },
    { rank: 'V', name: 'Lyra', xp: '450', top3: false },
    { rank: 'VI', name: 'Nova', xp: '400', top3: false },
    { rank: 'VII', name: 'Orion', xp: '350', top3: false },
    { rank: 'VIII', name: 'Vega', xp: '250', top3: false },
  ]

  const houses = [
    { name: 'Zenith', xp: '42,500', current: true, fill: '85%' },
    { name: 'Ash', xp: '38,200', current: false, fill: '76%' },
    { name: 'Forge', xp: '31,000', current: false, fill: '62%' },
    { name: 'Crown', xp: '29,400', current: false, fill: '58%' },
  ]

  return (
    <div className="flex min-h-screen bg-[#080808] text-[#E8E6E0]">
      <Sidebar />
      <main className="flex-1 md:ml-[64px] min-h-screen p-8 md:p-12 lg:p-16">
        <div className="max-w-[1400px] mx-auto animate-fade-in-up">
          
          {/* Top Section */}
          <div className="mb-16">
            <h1 className="font-serif text-[28px] font-bold uppercase tracking-wide">
              HOUSE OF ZENITH
            </h1>
            <p className="font-sans text-[11px] text-[#5C5C5C] tracking-[0.2em] uppercase mt-1">
              WEEKLY COLLECTIVE ECHOES
            </p>
            
            <div className="mt-8">
              <div className="flex justify-between font-mono text-[12px] mb-2">
                <span>5,000 / 8,000 XP</span>
              </div>
              <div className="h-[2px] bg-[#1A1A1A] w-full">
                <div 
                  className="h-full bg-[#C41E1E] shadow-[0_0_8px_rgba(196,30,30,0.5)]" 
                  style={{ width: '62.5%' }} 
                />
              </div>
              <div className="mt-2 font-mono text-[10px] text-[#5C5C5C]">
                3 DAYS REMAINING
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Member Contributions (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex flex-col border-t border-[#1A1A1A]">
                {members.map((member, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-[#1A1A1A]">
                    <div className="flex items-center gap-6">
                      <span className="font-mono text-[12px] text-[#5C5C5C] w-8">
                        {member.rank}
                      </span>
                      <span className="font-sans text-[14px]">
                        {member.name}
                      </span>
                    </div>
                    <span className={`font-mono text-[14px] ${member.top3 ? 'text-[#C41E1E]' : 'text-[#E8E6E0]'}`}>
                      {member.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: House Standings (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <h2 className="font-mono text-[10px] text-[#5C5C5C] tracking-[0.2em] uppercase mb-2">
                HOUSE STANDINGS
              </h2>
              <div className="flex flex-col gap-8">
                {houses.map((house, i) => (
                  <div 
                    key={i} 
                    className={`pl-4 flex flex-col gap-2 ${house.current ? 'border-l-2 border-[#C41E1E]' : 'border-l-2 border-transparent'}`}
                  >
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-serif text-[22px]">{house.name}</h3>
                      <span className="font-mono text-[12px] text-[#5C5C5C]">{house.xp} XP</span>
                    </div>
                    <div className="h-[2px] bg-[#1A1A1A] w-full">
                      <div className="h-full bg-[#5C5C5C]" style={{ width: house.fill }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Section: Your Contribution */}
          <div className="mt-20 border border-[#1A1A1A] p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 relative grayscale border border-[#1A1A1A]">
                <Image 
                  src="https://api.dicebear.com/7.x/shapes/svg?seed=Aeon" 
                  alt="Your Avatar" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#C41E1E] tracking-[0.2em] uppercase mb-1">
                  YOUR CONTRIBUTION
                </span>
                <span className="font-sans text-[18px]">Aeon</span>
              </div>
            </div>
            
            <div className="flex items-center gap-8 sm:text-right">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#5C5C5C] mb-1">RANK</span>
                <span className="font-mono text-[16px]">II</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#5C5C5C] mb-1">CONTRIBUTED</span>
                <span className="font-mono text-[16px] text-[#C41E1E]">950 XP</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
