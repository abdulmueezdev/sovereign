export default function CharacterLoading() {
  return (
    <div className="animate-pulse flex flex-col md:flex-row min-h-[calc(100vh-8rem)] animate-fade-in pb-24 md:pb-0">
      <div className="w-full md:w-[40%] flex flex-col gap-8 pr-0 md:pr-12 border-b md:border-b-0 md:border-r border-[#1A1A1A] pb-12 md:pb-0 mb-12 md:mb-0">
        <div className="w-full max-w-[280px] h-[380px] bg-[#1A1A1A] mb-8" />
        <div className="h-4 bg-[#1A1A1A] w-32 mb-2" />
        <div className="h-16 bg-[#1A1A1A] w-64 mb-4" />
        <div className="h-4 bg-[#1A1A1A] w-48" />
      </div>

      <div className="w-full md:w-[60%] pl-0 md:pl-12 flex flex-col gap-12 overflow-y-auto pr-4">
        <div>
          <div className="h-4 bg-[#1A1A1A] w-32 mb-8" />
          <div className="space-y-6">
            <div className="h-8 bg-[#1A1A1A] w-full" />
            <div className="h-8 bg-[#1A1A1A] w-full" />
            <div className="h-8 bg-[#1A1A1A] w-full" />
            <div className="h-8 bg-[#1A1A1A] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
