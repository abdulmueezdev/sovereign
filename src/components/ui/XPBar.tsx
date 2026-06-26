'use client'

import { useEffect, useState } from 'react'

interface XPBarProps {
  current: number;
  max: number;
  level: number;
  variant?: 'full' | 'compact';
}

export function XPBar({ current, max, level, variant = 'full' }: XPBarProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Animate fill on mount
    const percentage = Math.min((current / max) * 100, 100)
    
    const timeout = setTimeout(() => {
      setWidth(percentage)
    }, 50)
    
    return () => clearTimeout(timeout)
  }, [current, max])

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Labels */}
      {variant === 'full' && (
        <div className="flex justify-between items-end">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#5C5C5C] uppercase">
            Progress
          </span>
          <span className="font-mono text-[12px] text-[#5C5C5C]">
            {current.toLocaleString()} / {max.toLocaleString()} XP
          </span>
        </div>
      )}

      {/* Bar */}
      <div className="w-full h-[2px] bg-[#1A1A1A] relative">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-800"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, #C41E1E 0%, #8B0000 100%)',
            boxShadow: '0 0 6px 1px rgba(196,30,30,0.3)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>
    </div>
  )
}
