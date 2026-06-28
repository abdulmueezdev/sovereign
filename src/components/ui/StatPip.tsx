import { Brain, Swords, Hammer, Crown, LucideIcon } from 'lucide-react'

interface StatPipProps {
  attribute: string;
  value: number;
  delta?: number;
  icon?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  intelligence: Brain,
  discipline: Swords,
  focus: Brain,
  strength: Swords,
  charisma: Crown,
  craft: Hammer,
}

export function StatPip({ attribute, value, delta, icon }: StatPipProps) {
  const IconComponent = icon ? ICON_MAP[icon.toLowerCase()] || Brain : ICON_MAP[attribute.toLowerCase()] || Brain

  return (
    <div className="flex items-center gap-4 py-2 border-b border-[#1A1A1A] last:border-0">
      <div className="text-[#767676]">
        <IconComponent size={16} strokeWidth={1.5} />
      </div>
      <div className="flex-1 flex items-baseline justify-between">
        <span className="font-sans text-[11px] tracking-[0.2em] text-[#767676] uppercase">
          {attribute}
        </span>
        <div className="flex items-center gap-3">
          <span className="font-serif text-[22px] font-bold text-[#E8E6E0]">
            {value}
          </span>
          {delta !== undefined && delta > 0 && (
            <span className="font-mono text-[10px] text-[#C41E1E]">
              +{delta}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
