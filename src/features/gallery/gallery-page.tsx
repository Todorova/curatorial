import { FilterBar } from './filter-bar'
import { GalleryGrid } from './gallery-grid'
import { Pagination } from './pagination'
import { useGalleryFilters } from './use-gallery-filters'
import { useGallerySearch } from './use-gallery-search'

export function GalleryPage() {
  const { filters, setFilter, resetFilters, page, setPage, hasActiveFilters } = useGalleryFilters()
  const {
    artworks,
    totalResults,
    totalPages,
    isSearching,
    isLoadingObjects,
    loadingCount,
    searchError,
    hasQuery,
  } = useGallerySearch(filters, page)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Research Gallery
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Explore over 400,000 artworks from The Metropolitan Museum of Art
        </p>
      </header>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Error */}
      {searchError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-center">
          <p className="text-sm text-destructive">
            Unable to reach the collection. Please try again.
          </p>
        </div>
      )}

      {/* Empty — no search yet */}
      {!hasQuery && !searchError && (
        <div className="flex flex-col items-center py-16 text-center sm:py-24">
          <h2 className="font-heading text-xl font-medium text-foreground">Begin Your Research</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Enter a keyword and press Enter to discover artworks. Select a department above to
            narrow your search.
          </p>
        </div>
      )}

      {/* Results */}
      {hasQuery && !searchError && (
        <>
          {/* Results count */}
          {!isSearching && totalResults > 0 && (
            <div className="flex items-baseline gap-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground">
                  {totalResults.toLocaleString()}
                </span>{' '}
                {totalResults === 1 ? 'result' : 'results'}
              </p>
              {isLoadingObjects && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-primary/50" />
                  Loading
                </span>
              )}
            </div>
          )}

          {/* No results */}
          {!isSearching && totalResults === 0 && (
            <div className="flex flex-col items-center py-16 text-center sm:py-24">
              <h2 className="font-heading text-lg font-medium text-foreground">
                No artworks found
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                No results for &ldquo;{filters.q}&rdquo;. Try a broader keyword or remove some
                filters.
              </p>
            </div>
          )}

          {/* Grid */}
          {(isSearching || totalResults > 0) && (
            <GalleryGrid
              artworks={artworks}
              loadingCount={loadingCount}
              isSearching={isSearching}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalResults={totalResults}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
