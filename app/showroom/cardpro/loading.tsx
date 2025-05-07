import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <Skeleton className="h-10 w-64 mx-auto mb-2" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <Skeleton className="h-12 w-full mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
