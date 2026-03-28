import type { Artwork } from '@/types/artwork'
import { ArtworkCard } from './artwork-card'

interface ArtworkGridProps {
  artworks: Artwork[]
}

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 px-8 pb-12 sm:grid-cols-2 lg:grid-cols-3 max-md:px-4 max-md:gap-4">
      {artworks.map((artwork, index) => (
        <ArtworkCard
          key={artwork.objectID}
          artwork={artwork}
          style={{
            animation: `slide-up 300ms ease-out ${index * 50}ms both`,
          }}
        />
      ))}
    </div>
  )
}
