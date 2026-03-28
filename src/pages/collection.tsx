import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/page-header'
import { DepartmentFilter } from '@/components/department-filter'
import { DateRangeFilter } from '@/components/date-range-filter'
import { ArtworkGrid } from '@/components/artwork-grid'
import { ArtworkGridSkeleton } from '@/components/artwork-skeleton'
import { EmptyState } from '@/components/empty-state'
import { CollectionPagination } from '@/components/collection-pagination'
import { useCollection } from '@/hooks/use-collection'

export function CollectionPage() {
  const [, setSearchParams] = useSearchParams()
  const {
    artworks,
    isLoading,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  } = useCollection()

  const handleReset = () => {
    setSearchParams({})
  }

  return (
    <>
      <PageHeader
        title="Collection"
        description="Explore highlighted works from The Metropolitan Museum of Art's open-access collection."
      />

      <DepartmentFilter />
      <DateRangeFilter />

      <div id="artwork-grid">
        {isLoading ? (
          <ArtworkGridSkeleton />
        ) : artworks.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <>
            <ArtworkGrid artworks={artworks} />
            <CollectionPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
    </>
  )
}
