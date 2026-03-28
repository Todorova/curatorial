import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { searchArtworks, getArtworksBatch } from '@/lib/api'
import { ITEMS_PER_PAGE } from '@/lib/constants'

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

  // Step 1: Search for object IDs
  const searchQuery = useQuery({
    queryKey: ['search', departmentId, query, dateBegin, dateEnd],
    queryFn: () =>
      searchArtworks(departmentId || undefined, query, dateBegin, dateEnd),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  const objectIDs = searchQuery.data?.objectIDs ?? []
  const totalItems = objectIDs.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Step 2: Get the page slice of IDs
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const pageIDs = objectIDs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Step 3: Fetch artwork details for this page
  const artworksQuery = useQuery({
    queryKey: ['artworks', pageIDs],
    queryFn: () => getArtworksBatch(pageIDs),
    enabled: pageIDs.length > 0,
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  return {
    artworks: artworksQuery.data ?? [],
    isLoading:
      searchQuery.isLoading ||
      (pageIDs.length > 0 && artworksQuery.isLoading),
    isError: searchQuery.isError || artworksQuery.isError,
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
  }
}
