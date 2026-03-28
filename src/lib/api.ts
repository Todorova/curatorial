import { MET_API_BASE } from './constants'
import { parseArtwork, parseSearchResult } from './schemas'
import type { Artwork, Department, SearchResult } from '@/types/artwork'

// Concurrency limiter — max 6 simultaneous requests
function pLimit(concurrency: number) {
  let active = 0
  const queue: Array<() => void> = []
  return <T>(fn: () => Promise<T>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const run = () => {
        active++
        fn()
          .then(resolve, reject)
          .finally(() => {
            active--
            if (queue.length > 0) queue.shift()!()
          })
      }
      if (active < concurrency) run()
      else queue.push(run)
    })
}

const limit = pLimit(6)

export async function searchArtworks(
  departmentId?: number,
  query?: string,
  dateBegin?: number,
  dateEnd?: number
): Promise<SearchResult> {
  const params = new URLSearchParams()
  params.set('hasImages', 'true')
  params.set('isHighlight', 'true')
  params.set('q', query || '*')

  if (departmentId && departmentId > 0) {
    params.set('departmentIds', String(departmentId))
  }

  // Met API requires both dateBegin and dateEnd together
  if (dateBegin != null && dateEnd != null) {
    params.set('dateBegin', String(dateBegin))
    params.set('dateEnd', String(dateEnd))
  }

  const res = await fetch(`${MET_API_BASE}/search?${params}`)
  if (!res.ok) throw new Error('Failed to search artworks')
  return parseSearchResult(await res.json())
}

export async function getArtwork(objectID: number): Promise<Artwork> {
  const res = await fetch(`${MET_API_BASE}/objects/${objectID}`)
  if (!res.ok) throw new Error(`Failed to fetch artwork ${objectID}`)
  return parseArtwork(await res.json())
}

export async function getArtworksBatch(objectIDs: number[]): Promise<Artwork[]> {
  const results = await Promise.allSettled(
    objectIDs.map((id) => limit(() => getArtwork(id)))
  )

  return results
    .filter(
      (r): r is PromiseFulfilledResult<Artwork> => r.status === 'fulfilled'
    )
    .map((r) => r.value)
    .filter((a) => a.primaryImageSmall)
}

export async function getDepartments(): Promise<Department[]> {
  const res = await fetch(`${MET_API_BASE}/departments`)
  if (!res.ok) throw new Error('Failed to fetch departments')
  const data = await res.json()
  return data.departments ?? []
}

export async function searchRelatedWorks(
  departmentId: number,
  beginDate: number,
  endDate: number
): Promise<SearchResult> {
  const params = new URLSearchParams()
  params.set('hasImages', 'true')
  params.set('q', '*')
  params.set('departmentIds', String(departmentId))
  params.set('dateBegin', String(beginDate - 50))
  params.set('dateEnd', String(endDate + 50))

  const res = await fetch(`${MET_API_BASE}/search?${params}`)
  if (!res.ok) throw new Error('Failed to search related works')
  return parseSearchResult(await res.json())
}
