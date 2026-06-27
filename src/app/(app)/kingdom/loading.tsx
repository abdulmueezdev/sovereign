export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-[#1A1A1A] w-1/3 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-[#1A1A1A]" />
        <div className="h-48 bg-[#1A1A1A]" />
        <div className="h-48 bg-[#1A1A1A]" />
      </div>
    </div>
  )
}
