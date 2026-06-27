import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Codex — Sovereign',
  description: 'How to rule your kingdom.',
};

const SECTIONS = [
  {
    id: '01',
    heading: 'The Concept',
    body: 'Sovereign turns real-world discipline into a kingdom-building game. Every action you complete — training, studying, creating — manifests as progress in your digital realm.'
  },
  {
    id: '02',
    heading: 'The Void & Manifestation',
    body: 'You begin with nothing. The Void is empty. By selecting Quests from the Board and completing them, you earn XP and structure points to build your Kingdom.'
  },
  {
    id: '03',
    heading: 'The Domains',
    body: 'BODY (Physical training), MIND (Learning and meditation), CRAFT (Creation and work), COMMAND (Leadership and organization). Balance them to unlock specific kingdom structures.'
  },
  {
    id: '04',
    heading: 'The Companion',
    body: 'Aegis is your advisor. Seek counsel when lost, or request new trials when the board is empty. The companion remembers your deeds.'
  }
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#E8E6E0] selection:bg-[#C41E1E] selection:text-[#E8E6E0] flex flex-col font-sans">
      {/* HEADER */}
      <header className="flex-none p-8 md:p-12 lg:p-16 flex justify-between items-center animate-fade-in">
        <Link 
          href="/" 
          className="font-mono text-[11px] tracking-[0.2em] text-[#5C5C5C] hover:text-[#E8E6E0] uppercase transition-colors"
        >
          ← Return to Void
        </Link>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-8 md:px-12 lg:px-16 max-w-4xl mx-auto w-full pb-32">
        <div className="mb-24 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h1 className="font-serif text-[48px] md:text-[64px] font-bold mb-4 leading-none text-[#E8E6E0]">
            The Codex
          </h1>
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#5C5C5C] uppercase">
            System Mechanics & Directives
          </p>
        </div>

        <div className="space-y-16">
          {SECTIONS.map((section, index) => (
            <div 
              key={section.id}
              className="group relative pl-8 md:pl-16 animate-fade-in-up"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="absolute left-0 top-1 font-mono text-[11px] tracking-widest text-[#C41E1E]">
                {section.id}
              </div>
              
              <h2 className="font-serif text-[24px] font-bold mb-4 text-[#E8E6E0] group-hover:text-[#C41E1E] transition-colors">
                {section.heading}
              </h2>
              
              <p className="font-sans text-[14px] leading-relaxed text-[#A8A094] max-w-2xl">
                {section.body}
              </p>
              
              <div className="w-8 h-[1px] bg-[#1A1A1A] mt-8 group-hover:w-16 group-hover:bg-[#C41E1E] transition-all duration-300" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
