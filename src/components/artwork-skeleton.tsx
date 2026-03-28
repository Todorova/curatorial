import { Skeleton } from '@/components/ui/skeleton'

export function ArtworkSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="pt-3">
        <Skeleton className="h-5 w-3/5 rounded-sm" />
        <Skeleton className="mt-2 h-3.5 w-2/5 rounded-sm" />
        <Skeleton className="mt-1.5 h-3 w-[30%] rounded-sm" />
      </div>
    </div>
  )
}

export function ArtworkGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 px-8 pb-12 sm:grid-cols-2 lg:grid-cols-3 max-md:px-4 max-md:gap-4"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} aria-hidden="true">
          <ArtworkSkeleton />
        </div>
      ))}
    </div>
  )
}
