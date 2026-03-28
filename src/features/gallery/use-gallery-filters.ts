import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import type { GalleryFilters } from '@/types'

export function useGalleryFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: GalleryFilters = useMemo(() => {
    return {
      q: searchParams.get('q') || '',
      departmentId: searchParams.get('departmentId')
        ? Number(searchParams.get('departmentId'))
        : null,
      dateBegin: searchParams.get('dateBegin') ? Number(searchParams.get('dateBegin')) : null,
      dateEnd: searchParams.get('dateEnd') ? Number(searchParams.get('dateEnd')) : null,
    }
  }, [searchParams])

  const setFilter = useCallback(
    (key: keyof GalleryFilters, value: string | number | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value === null || value === '') {
            next.delete(key)
          } else {
            next.set(key, String(value))
          }
          // Reset to page 1 when filters change
          next.delete('page')
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const page = Number(searchParams.get('page') || '1')

  const setPage = useCallback(
    (p: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (p <= 1) {
            next.delete('page')
          } else {
            next.set('page', String(p))
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const hasActiveFilters =
    filters.q !== '' || filters.departmentId !== null || filters.dateBegin !== null

  return { filters, setFilter, resetFilters, page, setPage, hasActiveFilters }
}
