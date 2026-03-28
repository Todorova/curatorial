import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  getArtwork,
  searchRelatedWorks,
  getArtworksBatch,
  getDepartments,
} from '@/lib/api'
import { RELATED_WORKS_COUNT } from '@/lib/constants'

export function useArtworkDetail(objectID: number) {
  const artworkQuery = useQuery({
    queryKey: ['artwork', objectID],
    queryFn: ({ signal }) => getArtwork(objectID, signal),
    retry: 2,
    retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 5000),
  })

  const departmentsQuery = useQuery({
    queryKey: ['departments'],
    queryFn: ({ signal }) => getDepartments(signal),
    staleTime: Infinity,
  })

  const artwork = artworkQuery.data
  const departments = departmentsQuery.data ?? []

  // Find department ID from name using the live API data
  const deptId =
    departments.find((d) => d.displayName === artwork?.department)
      ?.departmentId ?? 0

  // Search for related works: same department, ±50 years
  const relatedSearchQuery = useQuery({
    queryKey: ['related-search', objectID, deptId],
    queryFn: ({ signal }) => {
      if (!artwork) throw new Error('artwork not available')
      return searchRelatedWorks(
        deptId,
        artwork.objectBeginDate,
        artwork.objectEndDate,
        signal,
      )
    },
    enabled: !!artwork && deptId > 0,
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  // Fetch related works (excluding current), limited to RELATED_WORKS_COUNT
  const relatedIDs = (relatedSearchQuery.data?.objectIDs ?? [])
    .filter((id) => id !== objectID)
    .slice(0, RELATED_WORKS_COUNT)

  const relatedWorksQuery = useQuery({
    queryKey: ['related-works', relatedIDs],
    queryFn: ({ signal }) => getArtworksBatch(relatedIDs, signal),
    enabled: relatedIDs.length > 0,
    staleTime: 10 * 60 * 1000,
  })

  return {
    artwork: artworkQuery.data,
    // Show loading while fetching OR retrying (isFetching covers retries)
    isLoading: artworkQuery.isLoading || (artworkQuery.isFetching && !artworkQuery.data),
    // Only show error when all retries are exhausted and we have no data
    isError: artworkQuery.isError && !artworkQuery.isFetching,
    relatedWorks: relatedWorksQuery.data ?? [],
    relatedLoading:
      relatedSearchQuery.isLoading || relatedWorksQuery.isLoading,
  }
}
