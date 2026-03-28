import type { Artwork } from '@/types/artwork'
import { ArtworkCard } from './artwork-card'
import { ArtworkSkeleton } from './artwork-skeleton'

interface RelatedWorksProps {
  works: Artwork[]
  isLoading: boolean
}

export function RelatedWorks({ works, isLoading }: RelatedWorksProps) {
  if (!isLoading && works.length === 0) return null

  return (
    <section className="mt-16 border-t border-border pt-12 max-md:mt-10 max-md:pt-8">
      <h2 className="font-serif text-2xl font-normal text-foreground mb-6 max-md:text-xl">
        Related Works
      </h2>
      <div className="flex gap-6 overflow-x-auto scrollbar-none pb-4 max-md:gap-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-64 shrink-0 max-md:w-56" aria-hidden="true">
                <ArtworkSkeleton />
              </div>
            ))
          : works.map((artwork) => (
              <div key={artwork.objectID} className="w-64 shrink-0 max-md:w-56">
                <ArtworkCard artwork={artwork} />
              </div>
            ))}
      </div>
    </section>
  )
}
