export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-[#1A1A1A] w-1/3 mb-4" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5 h-[400px] bg-[#1A1A1A]" />
        <div className="col-span-7 h-[400px] bg-[#1A1A1A]" />
      </div>
    </div>
  )
}
