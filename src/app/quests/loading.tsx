export default function QuestsLoading() {
  return (
    <div className="animate-pulse flex flex-col gap-8 md:gap-12 animate-fade-in pr-0 md:pr-12 pb-24 md:pb-0">
      <div>
        <div className="h-3 bg-[#1A1A1A] w-32 mb-4" />
        <div className="h-12 bg-[#1A1A1A] w-64 mb-4" />
        <div className="h-6 bg-[#1A1A1A] w-96 mb-8" />
        <div className="h-10 bg-[#1A1A1A] w-full max-w-md mb-8" />
      </div>

      <div className="space-y-6">
        <div className="h-4 bg-[#1A1A1A] w-48 mb-6" />
        <div className="h-32 bg-[#1A1A1A] w-full" />
        <div className="h-32 bg-[#1A1A1A] w-full" />
        <div className="h-32 bg-[#1A1A1A] w-full" />
      </div>
    </div>
  )
}
