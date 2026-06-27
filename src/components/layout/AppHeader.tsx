'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { useUser } from '@/contexts/UserContext';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'COMMAND',
  '/quests': 'QUEST BOARD',
  '/kingdom': 'KINGDOM',
  '/companion': 'AEGIS',
  '/character': 'CHARACTER',
  '/settings': 'SETTINGS',
  '/guide': 'THE CODEX',
};

export function AppHeader() {
  const { profile } = useUser();
  const xp = profile?.xp || 0;
  const maxXp = profile?.xp_to_next || 300;
  
  const router = useRouter();
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'SOVEREIGN';
  const percent = Math.min(100, Math.round((xp / maxXp) * 100));

  return (
    <header className="sticky top-0 z-50 bg-[#080808]">
      <div className="flex items-center justify-between h-12 px-4 md:px-6">
        {/* Back — mobile only */}
        <button
          onClick={() => router.back()}
          className="md:hidden flex items-center gap-2 text-[#5C5C5C] hover:text-[#E8E6E0] transition-colors duration-150"
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
          </svg>
          <span className="font-grotesk text-[10px] tracking-[0.2em] uppercase">Back</span>
        </button>

        {/* Page title — center */}
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#3A3A3A] absolute left-1/2 -translate-x-1/2">
          {title}
        </span>

        {/* Guide link — right */}
        <Link
          href="/guide"
          className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#3A3A3A] hover:text-[#5C5C5C] transition-colors duration-150 hidden md:block"
        >
          Codex
        </Link>
        {/* Spacer for mobile (keeps title centered) */}
        <div className="md:hidden w-12" />
      </div>

      {/* XP bar — 2px, full width, crimson gradient, glow */}
      <div className="h-[2px] w-full bg-[#1A1A1A]">
        <div
          className="h-[2px] bg-gradient-to-r from-[#C41E1E] to-[#8B0000] transition-[width] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: `${percent}%`,
            boxShadow: '0 0 6px 1px rgba(196,30,30,0.3)',
          }}
        />
      </div>

      {/* Bottom border */}
      <div className="h-[1px] w-full bg-[#1A1A1A]" />
    </header>
  );
}
