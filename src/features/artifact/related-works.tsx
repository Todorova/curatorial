import { Link } from 'react-router-dom'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { Skeleton } from '@/components/ui/skeleton'
import type { ArtworkCard } from '@/types'

interface RelatedWorksProps {
  works: ArtworkCard[]
  isLoading: boolean
}

export function RelatedWorks({ works, isLoading }: RelatedWorksProps) {
  if (!isLoading && works.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="font-heading text-xl font-semibold text-foreground">Related Works</h2>
      <p className="mt-1 text-sm text-muted-foreground">From the same period and department</p>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-44 flex-shrink-0">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="mt-2 h-3 w-3/4" />
              <Skeleton className="mt-1 h-3 w-1/2" />
            </div>
          ))}

        {works.map((work) => (
          <Link
            key={work.objectId}
            to={`/artifact/${work.objectId}`}
            className="group w-44 flex-shrink-0 no-underline"
          >
            <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
              <ImageWithFallback
                src={work.primaryImageSmall}
                alt={work.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                fallbackClassName="h-full w-full"
              />
            </div>
            <h3 className="mt-2 text-xs font-medium text-card-foreground line-clamp-2">
              {work.title}
            </h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
              {work.artistName}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
