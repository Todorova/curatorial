import { ArtworkCard } from './artwork-card'
import { ArtworkCardSkeleton } from './artwork-card-skeleton'
import type { ArtworkCard as ArtworkCardType } from '@/types'

interface GalleryGridProps {
  artworks: ArtworkCardType[]
  loadingCount: number
  isSearching: boolean
}

export function GalleryGrid({ artworks, loadingCount, isSearching }: GalleryGridProps) {
  if (isSearching) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ArtworkCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.objectId} artwork={artwork} />
      ))}
      {loadingCount > 0 &&
        Array.from({ length: loadingCount }).map((_, i) => (
          <ArtworkCardSkeleton key={`skeleton-${i}`} />
        ))}
    </div>
  )
}
