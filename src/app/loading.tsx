export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#080808] flex items-center justify-center">
      <div className="animate-pulse">
        <div className="h-4 bg-[#1A1A1A] w-32 mb-4" />
        <div className="h-4 bg-[#1A1A1A] w-24" />
      </div>
    </div>
  )
}
