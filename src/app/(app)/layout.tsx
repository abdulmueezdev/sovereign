import { Sidebar } from '@/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar />
      <main className="flex-1 pb-[56px] md:pb-0 md:ml-[64px] p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
