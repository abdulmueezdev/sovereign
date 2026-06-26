export default function CompanionLoading() {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] bg-[#080808] animate-pulse pb-24 md:pb-0">
      <div className="w-full md:w-[65%] flex flex-col p-8 border-b md:border-b-0 md:border-r border-[#1A1A1A]">
        <div className="h-4 bg-[#1A1A1A] w-32 mb-12" />
        <div className="flex-1 flex flex-col justify-end gap-8 mb-8">
          <div className="h-6 bg-[#1A1A1A] w-64 self-end" />
          <div className="h-12 bg-[#1A1A1A] w-96" />
          <div className="h-6 bg-[#1A1A1A] w-48 self-end" />
        </div>
        <div className="h-16 bg-[#1A1A1A] w-full" />
      </div>

      <div className="w-full md:w-[35%] bg-[#F5F0E8] p-8 flex flex-col gap-8">
        <div className="w-[160px] h-[160px] bg-[#E8E6E0]" />
        <div className="h-8 bg-[#E8E6E0] w-32" />
        <div className="h-4 bg-[#E8E6E0] w-48" />
        <div className="flex gap-2">
          <div className="h-10 bg-[#E8E6E0] flex-1" />
          <div className="h-10 bg-[#E8E6E0] flex-1" />
        </div>
      </div>
    </div>
  )
}
