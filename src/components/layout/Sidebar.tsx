'use client'

import { Home, Sword, User, Grid, MessageCircle, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => {
      if (!data.error) setProfile(data)
    })
  }, [])

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Quests', icon: Sword, href: '/quests' },
    { name: 'Character', icon: User, href: '/character' },
    { name: 'Kingdom', icon: Grid, href: '/kingdom' },
    { name: 'Companion', icon: MessageCircle, href: '/companion' },
  ]

  const avatarUrl = profile ? `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${profile.characterName}&backgroundColor=080808` : "https://api.dicebear.com/7.x/shapes/svg?seed=Aeon"
  const displayName = profile ? profile.characterName : 'Aeon'
  const displayLevel = profile ? profile.level : 1

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[64px] bg-[#080808] flex-col items-center py-6 z-50 hidden md:flex border-r border-[#1A1A1A]">
        {/* Top Label */}
        <div className="flex-none h-32 flex items-start justify-center">
          <div className="origin-top-left -rotate-90 translate-y-24 translate-x-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#3A3A3A] uppercase whitespace-nowrap">
              THE VOID
            </span>
          </div>
        </div>

        {/* Nav Icons */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-10">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex flex-col items-center gap-1 transition-colors duration-150 ${
                  active ? 'text-[#E8E6E0]' : 'text-[#3A3A3A] hover:text-[#E8E6E0]'
                }`}
                title={item.name}
              >
                <Icon size={20} color="currentColor" strokeWidth={1.5} />
              </Link>
            )
          })}
        </nav>

        {/* Bottom Profile / Settings */}
        <div className="flex-none flex flex-col items-center gap-6">
          <Link href="/settings" className={`transition-colors ${pathname === '/settings' ? 'text-[#E8E6E0]' : 'text-[#3A3A3A] hover:text-[#E8E6E0]'}`}>
            <Settings size={20} strokeWidth={1.5} />
          </Link>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 relative rounded-none overflow-hidden grayscale border border-[#1A1A1A]">
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-[10px] text-[#5C5C5C] max-w-[60px] truncate text-center">{displayName}</span>
              <span className="font-mono text-[10px] text-[#5C5C5C]">Lv. {displayLevel}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[56px] bg-[#080808] border-t border-[#1A1A1A] z-50 flex md:hidden items-center justify-around pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
                active ? 'text-[#E8E6E0]' : 'text-[#3A3A3A] hover:text-[#E8E6E0]'
              }`}
            >
              <Icon size={20} color="currentColor" strokeWidth={1.5} />
            </Link>
          )
        })}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            pathname === '/settings' ? 'text-[#E8E6E0]' : 'text-[#3A3A3A] hover:text-[#E8E6E0]'
          }`}
        >
          <Settings size={20} color="currentColor" strokeWidth={1.5} />
        </Link>
      </nav>
    </>
  )
}
