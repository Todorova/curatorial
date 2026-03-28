import { Skeleton } from '@/components/ui/skeleton'

export function ArtworkCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-2 p-3.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2.5 w-1/4" />
      </div>
    </div>
  )
}
