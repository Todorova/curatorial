import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

export function DateRangeFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [fromYear, setFromYear] = useState(searchParams.get('dateBegin') ?? '')
  const [toYear, setToYear] = useState(searchParams.get('dateEnd') ?? '')

  const debouncedFrom = useDebounce(fromYear, 500)
  const debouncedTo = useDebounce(toYear, 500)

  const hasValues = fromYear !== '' || toYear !== ''
  const isPartial = (fromYear !== '' && toYear === '') || (fromYear === '' && toYear !== '')

  // Sync debounced values to URL
  useEffect(() => {
    if (debouncedFrom !== '' && debouncedTo !== '') {
      setSearchParams((prev) => {
        prev.set('dateBegin', debouncedFrom)
        prev.set('dateEnd', debouncedTo)
        prev.delete('page')
        return prev
      })
    } else if (debouncedFrom === '' && debouncedTo === '') {
      setSearchParams((prev) => {
        prev.delete('dateBegin')
        prev.delete('dateEnd')
        prev.delete('page')
        return prev
      })
    }
  }, [debouncedFrom, debouncedTo, setSearchParams])

  const handleClear = () => {
    setFromYear('')
    setToYear('')
  }

  return (
    <div className="flex items-center gap-3 px-8 pb-6 max-md:px-4 max-md:pb-4">
      <span className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
        Period
      </span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={fromYear}
          onChange={(e) => setFromYear(e.target.value)}
          placeholder="From year"
          aria-label="From year (negative for BCE)"
          className="h-8 w-24 border border-border bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none transition-colors"
        />
        <span className="text-xs text-muted-foreground">&mdash;</span>
        <input
          type="number"
          value={toYear}
          onChange={(e) => setToYear(e.target.value)}
          placeholder="To year"
          aria-label="To year (negative for BCE)"
          className="h-8 w-24 border border-border bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none transition-colors"
        />
        {hasValues && (
          <button
            onClick={handleClear}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Clear date filter"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
      {isPartial && (
        <span className="text-xs italic text-muted-foreground">
          Both years required
        </span>
      )}
    </div>
  )
}
