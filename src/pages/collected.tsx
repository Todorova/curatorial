import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/page-header'
import { ArtworkGrid } from '@/components/artwork-grid'
import { useCollected } from '@/context/collected-context'

export function CollectedPage() {
  const { items } = useCollected()
  const artworks = Array.from(items.values())

  return (
    <>
      <PageHeader
        title="Collected"
        description="Your curated selection of works from this session."
      />

      {artworks.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 py-24 text-center max-md:px-4 max-md:py-16">
          <svg
            width="120"
            height="90"
            viewBox="0 0 120 90"
            fill="none"
            className="mb-8 text-border"
          >
            <rect
              x="0.5"
              y="0.5"
              width="119"
              height="89"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          <h2 className="font-serif text-2xl font-normal italic text-foreground">
            No works collected yet
          </h2>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Browse the gallery and bookmark works to build your collection.
          </p>
          <Link
            to="/"
            className="mt-6 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Explore the Gallery
          </Link>
        </div>
      ) : (
        <ArtworkGrid artworks={artworks} />
      )}
    </>
  )
}
