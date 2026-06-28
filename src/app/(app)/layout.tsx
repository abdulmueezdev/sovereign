import { Sidebar } from '@/components/layout/Sidebar'
import { AppHeader } from '@/components/layout/AppHeader'
import { OfflineIndicator } from '@/components/ui/OfflineIndicator'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar />
      <main className="flex-1 min-h-0 overflow-y-auto pb-14 md:pb-0 md:ml-[64px] flex flex-col">
        <OfflineIndicator />
        <AppHeader />
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
