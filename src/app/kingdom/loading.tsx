export default function KingdomLoading() {
  return (
    <div className="animate-pulse flex flex-col md:flex-row h-[calc(100vh-8rem)] relative overflow-hidden animate-fade-in pb-24 md:pb-0">
      <div className="w-full md:w-[55%] flex flex-col gap-12 pr-0 md:pr-12 overflow-y-auto">
        <div>
          <div className="h-3 bg-[#1A1A1A] w-24 mb-4" />
          <div className="h-12 bg-[#1A1A1A] w-64 mb-4" />
          <div className="h-6 bg-[#1A1A1A] w-96 mb-8" />
          <div className="flex gap-6">
            <div className="h-8 bg-[#1A1A1A] w-24" />
            <div className="h-8 bg-[#1A1A1A] w-24" />
          </div>
        </div>

        <div>
          <div className="h-4 bg-[#1A1A1A] w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-16 bg-[#1A1A1A] w-full" />
            <div className="h-16 bg-[#1A1A1A] w-full" />
          </div>
        </div>

        <div>
          <div className="h-4 bg-[#1A1A1A] w-48 mb-6" />
          <div className="flex flex-col gap-3">
            <div className="h-16 bg-[#1A1A1A] w-full" />
            <div className="h-16 bg-[#1A1A1A] w-full" />
            <div className="h-16 bg-[#1A1A1A] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
