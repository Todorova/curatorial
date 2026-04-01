import { MET_API_BASE, RELATED_WORKS_YEAR_RANGE } from './constants'
import { parseArtwork, parseSearchResult, parseDepartments } from './schemas'
import { apiLimiter } from './api-limiter'
import type { Artwork, Department, SearchResult } from '@/types/artwork'

export async function searchArtworks(
  departmentId?: number,
  query?: string,
  dateBegin?: number,
  dateEnd?: number,
  signal?: AbortSignal,
): Promise<SearchResult> {
  if (!query?.trim()) {
    return { total: 0, objectIDs: [] }
  }

  const params = new URLSearchParams()
  params.set('hasImages', 'true')
  params.set('q', query.trim())

  if (departmentId && departmentId > 0) {
    params.set('departmentId', String(departmentId))
  }

  if (dateBegin != null && dateEnd != null) {
    params.set('dateBegin', String(dateBegin))
    params.set('dateEnd', String(dateEnd))
  }

  const res = await fetch(`${MET_API_BASE}/search?${params}`, { signal })
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return parseSearchResult(await res.json())
}

export async function getArtwork(
  objectID: number,
  signal?: AbortSignal,
): Promise<Artwork> {
  const res = await fetch(`${MET_API_BASE}/objects/${objectID}`, { signal })
  if (!res.ok) throw new Error(`Failed to fetch artwork ${objectID}: ${res.status}`)
  return parseArtwork(await res.json())
}

export async function getArtworksBatch(
  objectIDs: number[],
  signal?: AbortSignal,
): Promise<Artwork[]> {
  const results = await Promise.allSettled(
    objectIDs.map((id) => apiLimiter(() => getArtwork(id, signal)))
  )
  return results
    .filter((r): r is PromiseFulfilledResult<Artwork> => r.status === 'fulfilled')
    .map((r) => r.value)
}

export async function getDepartments(signal?: AbortSignal): Promise<Department[]> {
  const res = await fetch(`${MET_API_BASE}/departments`, { signal })
  if (!res.ok) throw new Error('Failed to fetch departments')
  return parseDepartments(await res.json())
}

export async function searchRelatedWorks(
  departmentId: number,
  beginDate: number,
  endDate: number,
  signal?: AbortSignal,
): Promise<SearchResult> {
  const params = new URLSearchParams()
  params.set('hasImages', 'true')
  params.set('departmentId', String(departmentId))
  params.set('dateBegin', String(beginDate - RELATED_WORKS_YEAR_RANGE))
  params.set('dateEnd', String(endDate + RELATED_WORKS_YEAR_RANGE))
  params.set('q', '*')

  const res = await fetch(`${MET_API_BASE}/search?${params}`, { signal })
  if (!res.ok) throw new Error('Failed to search related works')
  return parseSearchResult(await res.json())
}
