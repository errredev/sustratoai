export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
      <div className="grid gap-6">
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}
