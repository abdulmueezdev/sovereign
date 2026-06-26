import { Library, Swords, Hammer, TowerControl } from 'lucide-react'
import Link from 'next/link'

interface KingdomBuilding {
  id: string;
  name: string;
  status: 'built' | 'available' | 'locked';
}

interface KingdomThumbnailProps {
  name: string;
  level: number;
  buildings: KingdomBuilding[];
}

const ICONS: Record<string, any> = {
  library: Library,
  training: Swords,
  workshop: Hammer,
  watchtower: TowerControl,
}

export function KingdomThumbnail({ name, level, buildings }: KingdomThumbnailProps) {
  const readyCount = buildings.filter(b => b.status === 'available').length

  return (
    <div className="flex flex-col gap-4">
      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2">
        {buildings.slice(0, 4).map((building) => {
          const Icon = ICONS[building.id] || Hammer
          
          let borderClass = 'border-[#1A1A1A]'
          let opacityClass = 'opacity-100'
          let iconColor = '#5C5C5C'
          let showName = true

          if (building.status === 'available') {
            borderClass = 'border-[#C41E1E]'
            iconColor = '#E8E6E0'
          } else if (building.status === 'locked') {
            opacityClass = 'opacity-30'
            iconColor = '#3A3A3A'
            showName = false
          }

          return (
            <div 
              key={building.id}
              className={`aspect-square flex flex-col items-center justify-center gap-3 border ${borderClass} ${opacityClass} p-2`}
            >
              <Icon size={24} color={iconColor} strokeWidth={1.5} />
              {showName && (
                <span className="font-mono text-[10px] text-[#5C5C5C] text-center px-1">
                  {building.name}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Labels */}
      <div>
        <h4 className="font-mono text-[10px] text-[#5C5C5C] uppercase tracking-widest mb-1">
          {name} · Level {level}
        </h4>
        {readyCount > 0 && (
          <Link href="/kingdom" className="font-serif text-[14px] italic text-[#C41E1E] hover:text-[#E8E6E0] transition-colors">
            {readyCount} {readyCount === 1 ? 'monument' : 'monuments'} ready →
          </Link>
        )}
      </div>
    </div>
  )
}
