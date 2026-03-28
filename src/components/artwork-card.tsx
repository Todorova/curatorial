import { Link } from 'react-router-dom'
import type { Artwork } from '@/types/artwork'
import { BlurImage } from './blur-image'
import { CollectButton } from './collect-button'

interface ArtworkCardProps {
  artwork: Artwork
  style?: React.CSSProperties
}

export function ArtworkCard({ artwork, style }: ArtworkCardProps) {
  return (
    <Link
      to={`/artwork/${artwork.objectID}`}
      className="group block no-underline"
      style={style}
    >
      {/* Image */}
      <div className="relative overflow-hidden border border-border">
        <BlurImage
          src={artwork.primaryImageSmall}
          alt={`${artwork.title}${artwork.artistDisplayName ? ` by ${artwork.artistDisplayName}` : ''}`}
          className="aspect-[4/3] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-card-hover"
        />
        <CollectButton artwork={artwork} variant="card" />
      </div>

      {/* Text content */}
      <div className="px-0 pt-3 pb-2">
        <h3 className="font-serif text-lg font-normal leading-snug text-foreground line-clamp-2">
          {artwork.title}
        </h3>
        {artwork.artistDisplayName && (
          <p className="mt-1 text-sm text-muted-foreground truncate">
            {artwork.artistDisplayName}
          </p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">
          {artwork.objectDate}
          {artwork.department && (
            <>
              {' '}
              <span className="text-border">&mdash;</span>{' '}
              {artwork.department}
            </>
          )}
        </p>
      </div>
    </Link>
  )
}
