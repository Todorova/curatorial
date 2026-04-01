import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ArtworkGrid } from '@/components/artwork-grid'
import { useCollected } from '@/context/collected-context'

export function CollectedPage() {
  const { items } = useCollected()
  const artworks = Array.from(items.values())
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    const term = filter.trim().toLowerCase()
    if (!term) return artworks
    return artworks.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.artistDisplayName.toLowerCase().includes(term),
    )
  }, [artworks, filter])

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
        <>
          {/* Filter input */}
          <div className="px-8 pb-6 max-md:px-4">
            <div className="relative">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by title or artist..."
                className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground placeholder:italic focus:border-accent focus:outline-none transition-colors"
              />
              {filter && (
                <button
                  onClick={() => setFilter('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Clear filter"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No works match "{filter}"
              </p>
            </div>
          ) : (
            <ArtworkGrid artworks={filtered} />
          )}
        </>
      )}
    </>
  )
}
