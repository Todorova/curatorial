import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { useCollected } from '@/hooks/useCollected'
import { getObject } from '@/api/endpoints'
import { cn } from '@/lib/cn'
import type { ArtworkCard as ArtworkCardType } from '@/types'

interface ArtworkCardProps {
  artwork: ArtworkCardType
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const { isCollected, toggle } = useCollected()
  const queryClient = useQueryClient()
  const collected = isCollected(artwork.objectId)

  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['object', artwork.objectId],
      queryFn: () => getObject(artwork.objectId),
    })
  }

  return (
    <div className="group relative animate-[fadeIn_0.3s_ease-out] overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-foreground/5">
      <Link
        to={`/artifact/${artwork.objectId}`}
        className="block"
        onMouseEnter={handlePrefetch}
        onFocus={handlePrefetch}
      >
        <div className="aspect-[4/5] overflow-hidden bg-secondary">
          <ImageWithFallback
            src={artwork.primaryImageSmall}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            fallbackClassName="h-full w-full"
          />
        </div>
        <div className="p-3.5">
          <h3 className="font-heading text-sm font-semibold leading-snug text-card-foreground line-clamp-2">
            {artwork.title}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">{artwork.artistName}</p>
          <p className="mt-0.5 text-[11px] italic text-muted-foreground/60">{artwork.objectDate}</p>
        </div>
      </Link>

      {/* Collect button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          toggle(artwork.objectId)
        }}
        className={cn(
          'absolute right-2.5 top-2.5 rounded-full p-1.5 transition-all duration-200',
          collected
            ? 'bg-accent text-accent-foreground shadow-sm'
            : 'bg-background/60 text-muted-foreground opacity-0 backdrop-blur-md hover:bg-background/80 hover:text-accent group-hover:opacity-100',
        )}
        aria-label={collected ? 'Remove from collection' : 'Add to collection'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={collected ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  )
}
