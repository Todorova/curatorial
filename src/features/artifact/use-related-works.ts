import { useQuery, useQueries } from '@tanstack/react-query'
import { searchObjects, getObject } from '@/api/endpoints'
import { toArtworkCard } from '@/api/transform'
import { apiLimiter } from '@/lib/api-limiter'
import { RELATED_WORKS_YEAR_RANGE, RELATED_WORKS_COUNT, STALE_TIME } from '@/lib/constants'
import type { Artwork, ArtworkCard } from '@/types'

export function useRelatedWorks(artwork: Artwork | undefined) {
  const enabled = !!artwork && !!artwork.department

  // Search for works in the same period and department
  const searchQuery = useQuery({
    queryKey: ['related-search', artwork?.objectId],
    queryFn: async () => {
      if (!artwork?.department) return { total: 0, objectIds: [] }

      const dateBegin = artwork.objectBeginDate - RELATED_WORKS_YEAR_RANGE
      const dateEnd = artwork.objectEndDate + RELATED_WORKS_YEAR_RANGE

      const result = await searchObjects({
        q: artwork.department,
        departmentId: null,
        dateBegin,
        dateEnd,
      })

      // Remove current artwork and shuffle, take a subset
      const filtered = result.objectIds.filter((id) => id !== artwork.objectId)
      const shuffled = filtered.sort(() => Math.random() - 0.5)
      return {
        total: result.total,
        objectIds: shuffled.slice(0, RELATED_WORKS_COUNT),
      }
    },
    enabled,
    staleTime: STALE_TIME,
  })

  const relatedIds = searchQuery.data?.objectIds ?? []

  // Fetch each related object
  const objectQueries = useQueries({
    queries: relatedIds.map((id) => ({
      queryKey: ['object', id],
      queryFn: () => apiLimiter(() => getObject(id)),
      staleTime: STALE_TIME,
      retry: 1,
    })),
  })

  const relatedWorks: ArtworkCard[] = objectQueries
    .filter((q) => q.isSuccess && q.data)
    .map((q) => toArtworkCard(q.data!))

  const isLoading = searchQuery.isLoading || objectQueries.some((q) => q.isLoading)

  return { relatedWorks, isLoading }
}
