import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { DATE_BEGIN_MIN, DATE_END_MAX } from '@/lib/constants'

export function DateRangeFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [fromYear, setFromYear] = useState(searchParams.get('dateBegin') ?? '')
  const [toYear, setToYear] = useState(searchParams.get('dateEnd') ?? '')

  const hasValues = fromYear !== '' || toYear !== ''

  // Validation
  const fromNum = fromYear !== '' ? Number(fromYear) : null
  const toNum = toYear !== '' ? Number(toYear) : null
  const isPartial = (fromYear !== '' && toYear === '') || (fromYear === '' && toYear !== '')
  const isInvalidRange = fromNum !== null && toNum !== null && fromNum > toNum
  const isOutOfBounds =
    (fromNum !== null && (fromNum < DATE_BEGIN_MIN || fromNum > DATE_END_MAX)) ||
    (toNum !== null && (toNum < DATE_BEGIN_MIN || toNum > DATE_END_MAX))

  function syncToUrl() {
    if (fromYear === '' && toYear === '') {
      setSearchParams((prev) => {
        if (!prev.has('dateBegin') && !prev.has('dateEnd')) return prev
        const next = new URLSearchParams(prev)
        next.delete('dateBegin')
        next.delete('dateEnd')
        next.delete('page')
        return next
      }, { replace: true })
      return
    }

    if (isPartial || isInvalidRange || isOutOfBounds) return

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('dateBegin', fromYear)
      next.set('dateEnd', toYear)
      next.delete('page')
      return next
    }, { replace: true })
  }

  function handleClear() {
    setFromYear('')
    setToYear('')
    setSearchParams((prev) => {
      if (!prev.has('dateBegin') && !prev.has('dateEnd')) return prev
      const next = new URLSearchParams(prev)
      next.delete('dateBegin')
      next.delete('dateEnd')
      next.delete('page')
      return next
    }, { replace: true })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') syncToUrl()
  }

  // Validation message
  let hint = ''
  if (isPartial) hint = 'Both years required'
  else if (isInvalidRange) hint = 'From must be before To'
  else if (isOutOfBounds) hint = `Range: ${DATE_BEGIN_MIN} to ${DATE_END_MAX}`

  const hasError = isPartial || isInvalidRange || isOutOfBounds

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
          onBlur={syncToUrl}
          onKeyDown={handleKeyDown}
          placeholder={String(DATE_BEGIN_MIN)}
          min={DATE_BEGIN_MIN}
          max={DATE_END_MAX}
          aria-label="From year (negative for BCE)"
          aria-invalid={hasError || undefined}
          className="h-8 w-24 border border-border bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none transition-colors"
        />
        <span className="text-xs text-muted-foreground">&mdash;</span>
        <input
          type="number"
          value={toYear}
          onChange={(e) => setToYear(e.target.value)}
          onBlur={syncToUrl}
          onKeyDown={handleKeyDown}
          placeholder={String(DATE_END_MAX)}
          min={DATE_BEGIN_MIN}
          max={DATE_END_MAX}
          aria-label="To year (negative for BCE)"
          aria-invalid={hasError || undefined}
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
        <span className={`text-xs italic ${hasError ? 'text-destructive' : 'text-muted-foreground'}`}>
          {hint}
        </span>
      )}
    </div>
  )
}
