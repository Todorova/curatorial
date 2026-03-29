import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useArtworkDetail } from '@/hooks/use-artwork-detail'
import { ProgressiveImage } from '@/components/blur-image'
import { CollectButton } from '@/components/collect-button'
import { RelatedWorks } from '@/components/related-works'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const objectID = Number(id)

  const { artwork, isLoading, isError, relatedWorks, relatedLoading } =
    useArtworkDetail(objectID)

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <h2 className="font-serif text-2xl font-normal italic text-foreground">
          Artwork not found
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          This work may have been removed or the ID is invalid.
        </p>
        <Link
          to="/"
          className="mt-6 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          Return to Gallery
        </Link>
      </div>
    )
  }

  return (
    <div className="px-8 py-8 max-md:px-4 max-md:py-6">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer max-md:mb-6"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Back to Gallery
      </button>

      {isLoading ? (
        <DetailSkeleton />
      ) : artwork ? (
        <>
          {/* Two-column layout */}
          <div className="grid gap-12 lg:grid-cols-2 max-md:gap-8">
            {/* Left: Image */}
            <div>
              <ProgressiveImage
                src={artwork.primaryImage || artwork.primaryImageSmall}
                alt={`${artwork.title}${artwork.artistDisplayName ? ` by ${artwork.artistDisplayName}` : ''}`}
                className="w-full border border-border"
                contain
              />
            </div>

            {/* Right: Metadata */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-serif text-3xl font-normal leading-tight text-foreground max-md:text-2xl">
                  {artwork.title}
                </h1>
                {artwork.artistDisplayName && (
                  <p className="mt-2 text-base text-foreground">
                    {artwork.artistDisplayName}
                  </p>
                )}
                {artwork.artistDisplayBio && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {artwork.artistDisplayBio}
                  </p>
                )}
              </div>

              {artwork.objectDate && (
                <p className="text-sm text-muted-foreground">
                  {artwork.objectDate}
                </p>
              )}

              {/* Metadata grid */}
              <dl className="grid grid-cols-[auto,1fr] gap-x-6 gap-y-3 text-sm">
                {artwork.accessionNumber && (
                  <>
                    <dt className="text-muted-foreground">Accession</dt>
                    <dd className="text-foreground">{artwork.accessionNumber}</dd>
                  </>
                )}
                {artwork.medium && (
                  <>
                    <dt className="text-muted-foreground">Medium</dt>
                    <dd className="text-foreground">{artwork.medium}</dd>
                  </>
                )}
                {artwork.dimensions && (
                  <>
                    <dt className="text-muted-foreground">Dimensions</dt>
                    <dd className="text-foreground">{artwork.dimensions}</dd>
                  </>
                )}
                {artwork.department && (
                  <>
                    <dt className="text-muted-foreground">Department</dt>
                    <dd className="text-foreground">{artwork.department}</dd>
                  </>
                )}
                {artwork.creditLine && (
                  <>
                    <dt className="text-muted-foreground">Credit Line</dt>
                    <dd className="text-foreground">{artwork.creditLine}</dd>
                  </>
                )}
              </dl>

              {/* Tags */}
              {artwork.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {artwork.tags.map((tag) => (
                    <Badge
                      key={tag.term}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {tag.term}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <CollectButton artwork={artwork} variant="detail" />
                {artwork.objectURL && (
                  <a
                    href={artwork.objectURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View on Met Museum
                    <ExternalLink size={14} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Related works */}
          <RelatedWorks works={relatedWorks} isLoading={relatedLoading} />
        </>
      ) : null}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-2 max-md:gap-8">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-9 w-3/4 rounded-sm" />
          <Skeleton className="mt-3 h-5 w-1/2 rounded-sm" />
          <Skeleton className="mt-2 h-4 w-2/3 rounded-sm" />
        </div>
        <Skeleton className="h-4 w-1/4 rounded-sm" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-3/4 rounded-sm" />
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-2/3 rounded-sm" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-sm" />
          <Skeleton className="h-6 w-16 rounded-sm" />
          <Skeleton className="h-6 w-16 rounded-sm" />
        </div>
      </div>
    </div>
  )
}
