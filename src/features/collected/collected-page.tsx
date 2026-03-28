import { useQueries } from '@tanstack/react-query'
import { getObject } from '@/api/endpoints'
import { toArtworkCard } from '@/api/transform'
import { useCollected } from '@/hooks/useCollected'
import { apiLimiter } from '@/lib/api-limiter'
import { STALE_TIME } from '@/lib/constants'
import { ArtworkCard } from '@/features/gallery/artwork-card'
import { ArtworkCardSkeleton } from '@/features/gallery/artwork-card-skeleton'
import { Link } from 'react-router-dom'

export function CollectedPage() {
  const { collected, clear, count } = useCollected()
  const ids = [...collected]

  const objectQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['object', id],
      queryFn: () => apiLimiter(() => getObject(id)),
      staleTime: STALE_TIME,
      retry: 1,
    })),
  })

  const artworks = objectQueries
    .filter((q) => q.isSuccess && q.data)
    .map((q) => toArtworkCard(q.data!))

  const loadingCount = objectQueries.filter((q) => q.isLoading).length

  if (count === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-medium text-foreground">
          Your Collection is Empty
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Bookmark artworks from the gallery to build your research collection
        </p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explore the Gallery
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            My Collection
          </h1>
          <p className="mt-1 text-muted-foreground">
            {count} {count === 1 ? 'artwork' : 'artworks'} collected this session
          </p>
        </div>
        <button
          onClick={clear}
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.objectId} artwork={artwork} />
        ))}
        {loadingCount > 0 &&
          Array.from({ length: loadingCount }).map((_, i) => (
            <ArtworkCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>
    </div>
  )
}
