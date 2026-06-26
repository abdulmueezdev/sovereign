'use client'

import { useEffect, useState } from 'react'

interface LevelUpGateProps {
  open: boolean;
  characterName: string;
  newLevel: number;
  newTitle: string;
  onClose: () => void;
}

export function LevelUpGate({ open, characterName, newLevel, newTitle, onClose }: LevelUpGateProps) {
  const [render, setRender] = useState(open)

  useEffect(() => {
    if (open) setRender(true)
  }, [open])

  if (!render) return null

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onTransitionEnd={() => {
        if (!open) setRender(false)
      }}
    >
      <div 
        className="flex flex-col items-center text-center max-w-4xl px-8"
        style={{
          animation: open ? 'scaleUpSpring 600ms cubic-bezier(0.34, 1.56, 0.64, 1) both' : 'none'
        }}
      >
        <h1 className="font-serif text-[80px] md:text-[120px] font-bold text-[#E8E6E0] leading-none mb-4">
          {characterName}
        </h1>
        
        <p 
          className="font-mono text-[14px] text-[#C41E1E] uppercase tracking-[0.2em] mb-4 animate-fade-in"
          style={{ animationDelay: '400ms', animationFillMode: 'both' }}
        >
          TEMPORAL FRAGMENT {toRoman(newLevel)}
        </p>
        
        <p 
          className="font-serif italic text-[24px] text-[#5C5C5C] mb-16 animate-fade-in"
          style={{ animationDelay: '600ms', animationFillMode: 'both' }}
        >
          {newTitle}
        </p>
        
        <button
          onClick={onClose}
          className="font-sans text-[11px] font-medium text-[#3A3A3A] hover:text-[#E8E6E0] tracking-[0.2em] uppercase transition-colors animate-fade-in"
          style={{ animationDelay: '900ms', animationFillMode: 'both' }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function toRoman(num: number): string {
  const roman: Record<string, number> = {
    M: 1000, CM: 900, D: 500, CD: 400,
    C: 100, XC: 90, L: 50, XL: 40,
    X: 10, IX: 9, V: 5, IV: 4, I: 1
  }
  let str = ''
  for (const i of Object.keys(roman)) {
    const q = Math.floor(num / roman[i])
    num -= q * roman[i]
    str += i.repeat(q)
  }
  return str || '0'
}
