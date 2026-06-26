export default function DashboardLoading() {
  return (
    <div className="animate-pulse flex flex-col gap-8 md:gap-12 animate-fade-in pr-0 md:pr-12 pb-24 md:pb-0">
      <div className="mb-8">
        <div className="h-3 bg-[#1A1A1A] w-32 mb-4" />
        <div className="h-12 bg-[#1A1A1A] w-64 mb-4" />
        <div className="h-6 bg-[#1A1A1A] w-96 mb-8" />
        <div className="h-[2px] bg-[#1A1A1A] w-full mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="h-4 bg-[#1A1A1A] w-48 mb-6" />
          <div className="h-32 bg-[#1A1A1A] w-full" />
          <div className="h-32 bg-[#1A1A1A] w-full" />
          <div className="h-32 bg-[#1A1A1A] w-full" />
        </div>
        
        <div className="space-y-6">
          <div className="h-4 bg-[#1A1A1A] w-48 mb-6" />
          <div className="h-64 bg-[#1A1A1A] w-full" />
        </div>
      </div>
    </div>
  )
}
