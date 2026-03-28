import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { DATE_BEGIN_MIN, DATE_END_MAX } from '@/lib/constants'

export function DateRangeFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [fromYear, setFromYear] = useState(searchParams.get('dateBegin') ?? '')
  const [toYear, setToYear] = useState(searchParams.get('dateEnd') ?? '')

  const debouncedFrom = useDebounce(fromYear, 500)
  const debouncedTo = useDebounce(toYear, 500)

  const hasValues = fromYear !== '' || toYear !== ''
  const isPartial = (fromYear !== '' && toYear === '') || (fromYear === '' && toYear !== '')

  // Validation
  const fromNum = fromYear !== '' ? Number(fromYear) : null
  const toNum = toYear !== '' ? Number(toYear) : null
  const isInvalidRange = fromNum !== null && toNum !== null && fromNum > toNum
  const isOutOfBounds =
    (fromNum !== null && (fromNum < DATE_BEGIN_MIN || fromNum > DATE_END_MAX)) ||
    (toNum !== null && (toNum < DATE_BEGIN_MIN || toNum > DATE_END_MAX))
  const isValid = !isPartial && !isInvalidRange && !isOutOfBounds

  // Sync debounced values to URL only when valid
  useEffect(() => {
    if (debouncedFrom !== '' && debouncedTo !== '') {
      const from = Number(debouncedFrom)
      const to = Number(debouncedTo)
      // Only apply if valid range within bounds
      if (from <= to && from >= DATE_BEGIN_MIN && to <= DATE_END_MAX) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          next.set('dateBegin', debouncedFrom)
          next.set('dateEnd', debouncedTo)
          next.delete('page')
          return next
        }, { replace: true })
      }
    } else if (debouncedFrom === '' && debouncedTo === '') {
      // Only update URL if date params actually exist — avoids
      // clearing the page param on unrelated URL changes
      setSearchParams((prev) => {
        if (!prev.has('dateBegin') && !prev.has('dateEnd')) return prev
        const next = new URLSearchParams(prev)
        next.delete('dateBegin')
        next.delete('dateEnd')
        next.delete('page')
        return next
      }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFrom, debouncedTo])

  const handleClear = () => {
    setFromYear('')
    setToYear('')
  }

  // Validation message
  let hint = ''
  if (isPartial) hint = 'Both years required'
  else if (isInvalidRange) hint = 'From must be before To'
  else if (isOutOfBounds) hint = `Range: ${DATE_BEGIN_MIN} to ${DATE_END_MAX}`

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
          placeholder={String(DATE_BEGIN_MIN)}
          min={DATE_BEGIN_MIN}
          max={DATE_END_MAX}
          aria-label="From year (negative for BCE)"
          aria-invalid={isInvalidRange || isOutOfBounds || undefined}
          className="h-8 w-24 border border-border bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none transition-colors"
        />
        <span className="text-xs text-muted-foreground">&mdash;</span>
        <input
          type="number"
          value={toYear}
          onChange={(e) => setToYear(e.target.value)}
          placeholder={String(DATE_END_MAX)}
          min={DATE_BEGIN_MIN}
          max={DATE_END_MAX}
          aria-label="To year (negative for BCE)"
          aria-invalid={isInvalidRange || isOutOfBounds || undefined}
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
      {hint && (
        <span className={`text-xs italic ${isValid ? 'text-muted-foreground' : 'text-destructive'}`}>
          {hint}
        </span>
      )}
    </div>
  )
}
