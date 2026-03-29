import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/page-header'
import { DepartmentFilter } from '@/components/department-filter'
import { DateRangeFilter } from '@/components/date-range-filter'
import { ArtworkGrid } from '@/components/artwork-grid'
import { ArtworkGridSkeleton } from '@/components/artwork-skeleton'
import { EmptyState } from '@/components/empty-state'
import { CollectionPagination } from '@/components/collection-pagination'
import { useCollection } from '@/hooks/use-collection'

function CollectionContent() {
  const [, setSearchParams] = useSearchParams()
  const {
    artworks,
    isLoading,
    isLoadingObjects,
    loadingCount,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasQuery,
  } = useCollection()

  if (!hasQuery) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted-foreground">
          Search for artworks using the search bar above.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <ArtworkGridSkeleton />
  }

  if (artworks.length === 0 && !isLoadingObjects) {
    return <EmptyState onReset={() => setSearchParams({})} />
  }

  return (
    <>
      <ArtworkGrid artworks={artworks} skeletonCount={loadingCount} />
      <CollectionPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </>
  )
}

export function CollectionPage() {
  return (
    <>
      <PageHeader
        title="Collection"
        description="Explore over 400,000 works from The Metropolitan Museum of Art's open-access collection."
      />
      <DepartmentFilter />
      <DateRangeFilter />
      <div id="artwork-grid">
        <CollectionContent />
      </div>
    </>
  )
}
