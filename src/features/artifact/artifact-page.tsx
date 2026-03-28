import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getObject } from '@/api/endpoints'
import { STALE_TIME } from '@/lib/constants'
import { Skeleton } from '@/components/ui/skeleton'
import { ArtifactDetail } from './artifact-detail'
import { RelatedWorks } from './related-works'
import { useRelatedWorks } from './use-related-works'

export function ArtifactPage() {
  const { objectId } = useParams<{ objectId: string }>()
  const id = Number(objectId)

  const {
    data: artwork,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['object', id],
    queryFn: () => getObject(id),
    enabled: !isNaN(id),
    staleTime: STALE_TIME,
  })

  const { relatedWorks, isLoading: relatedLoading } = useRelatedWorks(artwork)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <div className="space-y-3 pt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !artwork) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">
          {error ? 'Failed to load artwork. Please try again.' : 'Artwork not found.'}
        </p>
        <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to Gallery
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Gallery
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{artwork.title}</span>
      </nav>

      <ArtifactDetail artwork={artwork} />
      <RelatedWorks works={relatedWorks} isLoading={relatedLoading} />
    </div>
  )
}
