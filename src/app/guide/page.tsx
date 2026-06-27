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
    body: 'Sovereign turns real-world discipline into a kingdom-building game. Every action you complete — training, studying, building — becomes a Quest. Quests yield XP. XP levels your character. Your character builds your realm.',
  },
  {
    id: '02',
    heading: 'Your Character',
    lines: [
      'Choose a Class on first entry: Scholar, Warrior, Builder, or Commander',
      'Each Class belongs to a House: Zenith, Ash, Forge, or Crown',
      'Your level is displayed as a Roman numeral — a mark of earned ascent',
      'Nine attributes grow as you conquer domain-specific quests',
    ],
  },
  {
    id: '03',
    heading: 'The Quest Board',
    lines: [
      'MANIFEST — quests you have activated and are currently pursuing',
      'DORMANT — available quests waiting to be claimed',
      'FULFILLED — completed quests and the power they granted',
      'Open any quest to see its objectives. Check each off as you complete it in the real world. Mark complete to claim XP.',
    ],
  },
  {
    id: '04',
    heading: 'Your Kingdom',
    lines: [
      'Buildings unlock when your attributes cross specific thresholds',
      'Manifest available structures to add them to your realm',
      'Each building contributes passive bonuses and reflects your domain mastery',
    ],
  },
  {
    id: '05',
    heading: 'Aegis — Your Companion',
    lines: [
      'Aegis is your AI advisor — strategist, analyst, voice of your realm',
      'Ask for quest suggestions, progress analysis, or tactical guidance',
      'Try: "Give me a quest", "Analyze my week", "I am struggling"',
      'Aegis remembers your last ten exchanges',
    ],
  },
  {
    id: '06',
    heading: 'Settings',
    lines: [
      'Change character name, kingdom name, and companion name at any time',
      'Switch your House — permitted once every seven days',
      'Logout lives in the Danger Zone at the bottom of Settings',
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#E8E6E0]">

      {/* Nav bar */}
      <div className="sticky top-0 z-10 border-b border-[#1A1A1A] bg-[#080808]">
        <div className="flex items-center justify-between h-12 px-6 max-w-3xl mx-auto">
          <Link
            href="/"
            className="font-grotesk text-[10px] tracking-[0.3em] uppercase text-[#3A3A3A] hover:text-[#E8E6E0] transition-colors duration-150"
          >
            ← Sovereign
          </Link>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#3A3A3A]">
            The Codex
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#C41E1E] mb-8">
          Field Guide
        </p>
        <h1 className="font-cormorant text-[52px] md:text-[68px] font-bold leading-[0.92] mb-10">
          How to Rule<br />
          <em className="not-italic text-[#5C5C5C]">Your Kingdom</em>
        </h1>
        <div className="w-8 h-[1px] bg-[#C41E1E] mb-10" />
        <p className="font-grotesk text-[14px] text-[#5C5C5C] leading-relaxed max-w-sm">
          Six principles. Read once. Apply every day.
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-6 pb-32">
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            className="border-t border-[#1A1A1A] py-14"
          >
            <div className="grid grid-cols-[48px_1fr] gap-8 md:gap-12">
              {/* Number */}
              <div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#2A2A2A] uppercase block pt-[6px]">
                  {s.id}
                </span>
              </div>
              {/* Content */}
              <div>
                <h2 className="font-cormorant text-[28px] md:text-[32px] font-bold mb-6 leading-tight">
                  {s.heading}
                </h2>
                {s.body && (
                  <p className="font-grotesk text-[14px] text-[#5C5C5C] leading-[1.75]">
                    {s.body}
                  </p>
                )}
                {s.lines && (
                  <div className="space-y-4">
                    {s.lines.map((line, j) => (
                      <div key={j} className="flex items-start gap-4">
                        <span className="block w-[1px] min-h-[16px] bg-[#C41E1E] mt-[4px] shrink-0" />
                        <p className="font-grotesk text-[14px] text-[#5C5C5C] leading-[1.75]">
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="border-t border-[#1A1A1A] pt-20 flex flex-col items-start gap-8">
          <p className="font-cormorant text-[22px] italic text-[#3A3A3A]">
            The void is ready for your command.
          </p>
          <Link
            href="/login"
            className="
              inline-block bg-[#C41E1E] text-white
              font-grotesk text-[11px] tracking-[0.2em] uppercase
              px-10 py-4
              hover:bg-[#E8282B]
              active:scale-[0.97]
              transition-all duration-150
            "
          >
            Enter the Void
          </Link>
        </div>
      </div>
    </div>
  );
}
