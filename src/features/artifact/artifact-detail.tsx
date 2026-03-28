import { useState } from 'react'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { Badge } from '@/components/ui/badge'
import { useCollected } from '@/hooks/useCollected'
import { cn } from '@/lib/cn'
import type { Artwork } from '@/types'

interface ArtifactDetailProps {
  artwork: Artwork
}

interface MetadataRowProps {
  label: string
  value: string
}

function MetadataRow({ label, value }: MetadataRowProps) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-foreground">{value}</dd>
    </div>
  )
}

export function ArtifactDetail({ artwork }: ArtifactDetailProps) {
  const { isCollected, toggle } = useCollected()
  const collected = isCollected(artwork.objectId)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        {/* Image Column */}
        <div>
          <div
            className="cursor-zoom-in overflow-hidden rounded-xl bg-secondary"
            onClick={() => artwork.hasImage && setLightboxOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && artwork.hasImage && setLightboxOpen(true)}
            aria-label="View full size image"
          >
            <ImageWithFallback
              src={artwork.primaryImage || artwork.primaryImageSmall}
              alt={artwork.title}
              className="w-full object-contain"
              fallbackClassName="aspect-[4/3] w-full"
            />
          </div>

          {/* Additional Images */}
          {artwork.additionalImages.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {artwork.additionalImages.slice(0, 6).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${artwork.title} - view ${i + 2}`}
                  className="h-16 w-16 flex-shrink-0 rounded-lg border border-border/60 object-cover transition-opacity hover:opacity-80"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        {/* Metadata Column */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-semibold leading-tight sm:text-3xl">
                {artwork.title}
              </h1>
              <p className="mt-2 text-base text-muted-foreground">{artwork.artistName}</p>
              {artwork.artistBio && (
                <p className="mt-0.5 text-sm text-muted-foreground/70">{artwork.artistBio}</p>
              )}
            </div>

            {/* Collect button */}
            <button
              onClick={() => toggle(artwork.objectId)}
              className={cn(
                'flex-shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200',
                collected
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-muted-foreground hover:border-accent hover:text-accent',
              )}
            >
              {collected ? 'Collected' : 'Collect'}
            </button>
          </div>

          <p className="mt-4 font-heading text-lg italic text-foreground/70">
            {artwork.objectDate}
          </p>

          {/* Tags */}
          {artwork.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {artwork.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Metadata grid */}
          <div className="mt-8 divide-y divide-border/60 border-t border-border/60">
            <MetadataRow label="Accession Number" value={artwork.accessionNumber} />
            <MetadataRow label="Medium" value={artwork.medium} />
            <MetadataRow label="Dimensions" value={artwork.dimensions} />
            <MetadataRow label="Classification" value={artwork.classification} />
            <MetadataRow label="Department" value={artwork.department} />
            <MetadataRow label="Credit Line" value={artwork.creditLine} />
            <MetadataRow label="Culture" value={artwork.culture} />
            <MetadataRow label="Period" value={artwork.period} />
            {artwork.galleryNumber && (
              <MetadataRow label="Gallery" value={`Gallery ${artwork.galleryNumber}`} />
            )}
          </div>

          {/* External link */}
          {artwork.objectUrl && (
            <a
              href={artwork.objectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View on The Met website
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && artwork.hasImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setLightboxOpen(false)}
          role="dialog"
          aria-label="Image lightbox"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-card p-2.5 text-foreground shadow-lg hover:bg-secondary"
            aria-label="Close lightbox"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={artwork.primaryImage}
            alt={artwork.title}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
