import { useMemo } from 'react'
import { useQuery, useQueries, keepPreviousData } from '@tanstack/react-query'
import { searchObjects, getObject } from '@/api/endpoints'
import { toArtworkCard } from '@/api/transform'
import { apiLimiter } from '@/lib/api-limiter'
import { PAGE_SIZE, STALE_TIME } from '@/lib/constants'
import type { GalleryFilters, ArtworkCard } from '@/types'

export function useGallerySearch(filters: GalleryFilters, page: number) {
  const hasQuery = filters.q.trim().length > 0

  // Step 1: Search for matching object IDs
  const searchQuery = useQuery({
    queryKey: ['search', filters],
    queryFn: ({ signal }) => searchObjects(filters, signal),
    enabled: hasQuery,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
  })

  // Step 2: Paginate the ID array client-side
  const allIds = searchQuery.data?.objectIds ?? []
  const totalResults = searchQuery.data?.total ?? 0
  const totalPages = Math.ceil(allIds.length / PAGE_SIZE)

  const pageIds = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return allIds.slice(start, start + PAGE_SIZE)
  }, [allIds, page])

  // Step 3: Fetch individual objects for the current page
  const objectQueries = useQueries({
    queries: pageIds.map((id) => ({
      queryKey: ['object', id],
      queryFn: ({ signal }: { signal: AbortSignal }) => apiLimiter(() => getObject(id, signal)),
      staleTime: STALE_TIME,
      retry: 1,
    })),
  })

  // Step 4: Collect loaded artworks as cards
  const artworks: ArtworkCard[] = useMemo(
    () => objectQueries.filter((q) => q.isSuccess && q.data).map((q) => toArtworkCard(q.data!)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [objectQueries.map((q) => q.dataUpdatedAt).join(',')],
  )

  const loadingCount = objectQueries.filter((q) => q.isLoading).length
  const isSearching = searchQuery.isLoading
  const isLoadingObjects = loadingCount > 0
  const searchError = searchQuery.error

  return {
    artworks,
    totalResults,
    totalPages,
    page,
    isSearching,
    isLoadingObjects,
    loadingCount,
    searchError,
    hasQuery,
  }
}
