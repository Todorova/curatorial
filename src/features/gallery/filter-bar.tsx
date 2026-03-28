import { useState, useCallback, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDepartments } from '@/api/endpoints'
import { cn } from '@/lib/cn'
import type { GalleryFilters } from '@/types'

interface FilterBarProps {
  filters: GalleryFilters
  onFilterChange: (key: keyof GalleryFilters, value: string | number | null) => void
  onReset: () => void
  hasActiveFilters: boolean
}

function useLocalInput(urlValue: string) {
  const [state, setState] = useState({ key: urlValue, value: urlValue })
  if (state.key !== urlValue) setState({ key: urlValue, value: urlValue })
  return [state.value, (v: string) => setState((s) => ({ ...s, value: v }))] as const
}

export function FilterBar({ filters, onFilterChange, onReset, hasActiveFilters }: FilterBarProps) {
  const [keyword, setKeyword] = useLocalInput(filters.q)
  const [dateBegin, setDateBegin] = useLocalInput(filters.dateBegin?.toString() ?? '')
  const [dateEnd, setDateEnd] = useLocalInput(filters.dateEnd?.toString() ?? '')

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    staleTime: Infinity,
  })

  const submitSearch = useCallback(
    (overrideKeyword?: string) => {
      const q = overrideKeyword ?? keyword
      onFilterChange('q', q)
      const db = dateBegin ? Number(dateBegin) : null
      const de = dateEnd ? Number(dateEnd) : null
      if (db !== filters.dateBegin) onFilterChange('dateBegin', db)
      if (de !== filters.dateEnd) onFilterChange('dateEnd', de)
    },
    [keyword, dateBegin, dateEnd, filters.dateBegin, filters.dateEnd, onFilterChange],
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitSearch()
  }

  const handleClear = useCallback(() => {
    setKeyword('')
    setDateBegin('')
    setDateEnd('')
    onReset()
  }, [setKeyword, setDateBegin, setDateEnd, onReset])

  return (
    <div className="space-y-3">
      {/* Search form: keyword + dates + submit */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Search input */}
          <div className="relative flex-1">
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search artworks, artists, periods..."
              className="h-10 w-full rounded-lg border border-border bg-card px-3.5 pr-9 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            {keyword ? (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground/40 transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            ) : (
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/25">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            )}
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={dateBegin}
              onChange={(e) => setDateBegin(e.target.value)}
              placeholder="From year"
              aria-label="Date from"
              className="h-10 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 sm:w-[7.5rem]"
            />
            <span className="shrink-0 text-xs text-muted-foreground/25">—</span>
            <input
              type="number"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              placeholder="To year"
              aria-label="Date to"
              className="h-10 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 sm:w-[7.5rem]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="sm:hidden">Search</span>
          </button>
        </div>
      </form>

      {/* Department tags — always visible */}
      {departments && departments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onFilterChange('departmentId', null)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors',
              filters.departmentId === null
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:text-foreground',
            )}
          >
            All
          </button>
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() =>
                onFilterChange('departmentId', filters.departmentId === dept.id ? null : dept.id)
              }
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                filters.departmentId === dept.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:text-foreground',
              )}
            >
              {dept.name}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="ml-auto shrink-0 text-xs text-muted-foreground/40 transition-colors hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  )
}
