import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  getArtwork,
  searchRelatedWorks,
  getArtworksBatch,
  getDepartments,
} from '@/lib/api'

export function useArtworkDetail(objectID: number) {
  const artworkQuery = useQuery({
    queryKey: ['artwork', objectID],
    queryFn: () => getArtwork(objectID),
    staleTime: 10 * 60 * 1000,
  })

  const departmentsQuery = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    staleTime: 60 * 60 * 1000, // 1 hour
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
    queryFn: () =>
      searchRelatedWorks(
        deptId,
        artwork!.objectBeginDate,
        artwork!.objectEndDate
      ),
    enabled: !!artwork && deptId > 0,
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  // Fetch first 6 related works (excluding current)
  const relatedIDs = (relatedSearchQuery.data?.objectIDs ?? [])
    .filter((id) => id !== objectID)
    .slice(0, 6)

  const relatedWorksQuery = useQuery({
    queryKey: ['related-works', relatedIDs],
    queryFn: () => getArtworksBatch(relatedIDs),
    enabled: relatedIDs.length > 0,
    staleTime: 10 * 60 * 1000,
  })

  return {
    artwork: artworkQuery.data,
    isLoading: artworkQuery.isLoading,
    isError: artworkQuery.isError,
    relatedWorks: relatedWorksQuery.data ?? [],
    relatedLoading:
      relatedSearchQuery.isLoading || relatedWorksQuery.isLoading,
  }
}
