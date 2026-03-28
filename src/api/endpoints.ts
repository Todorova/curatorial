import { fetchJson } from './client'
import {
  DepartmentResponseSchema,
  SearchResponseSchema,
  ObjectResponseSchema,
  type RawObject,
  type RawSearchResponse,
  type RawDepartmentResponse,
} from './schemas'
import { transformObject, transformDepartments } from './transform'
import type { Artwork, Department, GalleryFilters, SearchResult } from '@/types'

export async function getDepartments(): Promise<Department[]> {
  const raw = await fetchJson<RawDepartmentResponse>('/departments')
  const parsed = DepartmentResponseSchema.safeParse(raw)

  if (!parsed.success) {
    console.warn('Department response validation failed:', parsed.error)
    return transformDepartments(raw)
  }

  return transformDepartments(parsed.data)
}

export async function searchObjects(
  filters: GalleryFilters,
  signal?: AbortSignal,
): Promise<SearchResult> {
  if (!filters.q.trim()) {
    return { total: 0, objectIds: [] }
  }

  const params = new URLSearchParams({
    q: filters.q.trim(),
    hasImages: 'true',
  })

  if (filters.departmentId !== null) {
    params.set('departmentId', String(filters.departmentId))
  }

  if (filters.dateBegin !== null && filters.dateEnd !== null) {
    params.set('dateBegin', String(filters.dateBegin))
    params.set('dateEnd', String(filters.dateEnd))
  }

  const raw = await fetchJson<RawSearchResponse>(`/search?${params.toString()}`, signal)
  const parsed = SearchResponseSchema.safeParse(raw)

  if (!parsed.success) {
    console.warn('Search response validation failed:', parsed.error)
  }

  const data = parsed.success ? parsed.data : raw
  return {
    total: data.total,
    objectIds: data.objectIDs ?? [],
  }
}

export async function getObject(id: number, signal?: AbortSignal): Promise<Artwork> {
  const raw = await fetchJson<RawObject>(`/objects/${id}`, signal)
  const parsed = ObjectResponseSchema.safeParse(raw)

  if (!parsed.success) {
    console.warn(`Object ${id} validation failed:`, parsed.error)
    return transformObject(raw)
  }

  return transformObject(parsed.data)
}
