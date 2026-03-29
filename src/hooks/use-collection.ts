import { useMemo } from 'react'
import { useQuery, useQueries, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { searchArtworks, getArtwork } from '@/lib/api'
import { apiLimiter } from '@/lib/api-limiter'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import type { Artwork } from '@/types/artwork'

export function useCollection() {
  const [searchParams] = useSearchParams()
  const departmentId = Number(searchParams.get('dept') ?? 0)
  const query = searchParams.get('q') ?? undefined
  const page = Number(searchParams.get('page') ?? 1)
  const dateBegin = searchParams.get('dateBegin')
    ? Number(searchParams.get('dateBegin'))
    : undefined
  const dateEnd = searchParams.get('dateEnd')
    ? Number(searchParams.get('dateEnd'))
    : undefined

  const hasQuery = !!query?.trim()

  // Step 1: Search for object IDs
  const searchQuery = useQuery({
    queryKey: ['search', departmentId, query, dateBegin, dateEnd],
    queryFn: ({ signal }) =>
      searchArtworks(departmentId || undefined, query, dateBegin, dateEnd, signal),
    enabled: hasQuery,
    placeholderData: keepPreviousData,
  })

  const objectIDs = searchQuery.data?.objectIDs ?? []
  const totalItems = objectIDs.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Step 2: Get the page slice of IDs
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const pageIDs = useMemo(
    () => objectIDs.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [objectIDs, startIndex],
  )

  // Step 3: Fetch each artwork individually — progressive loading, individual caching
  const objectQueries = useQueries({
    queries: pageIDs.map((id) => ({
      queryKey: ['object', id],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        apiLimiter(() => getArtwork(id, signal)),
    })),
  })

  // Step 4: Collect loaded artworks progressively as they arrive
  // Use settled count (success + error) as a stable dependency
  const settledCount = objectQueries.filter((q) => q.isSuccess || q.isError).length
  const pageIDsKey = useMemo(() => pageIDs.join(','), [pageIDs])
  const artworks: Artwork[] = useMemo(
    () =>
      objectQueries
        .filter((q) => q.isSuccess && q.data)
        .map((q) => q.data!),
    // settledCount triggers re-computation as queries resolve;
    // pageIDsKey resets when the page slice changes
    [settledCount, pageIDsKey],
  )

  const loadingCount = objectQueries.filter((q) => q.isLoading || q.isFetching).length
  const isSearching = searchQuery.isLoading || searchQuery.isFetching
  const isWaitingForFirstObject = pageIDs.length > 0 && artworks.length === 0 && !searchQuery.isError

  return {
    artworks,
    isLoading: isSearching || isWaitingForFirstObject,
    isLoadingObjects: loadingCount > 0,
    loadingCount,
    isError: searchQuery.isError,
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
    hasQuery,
  }
}
