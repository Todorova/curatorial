import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { z } from 'zod'
import { DATE_BEGIN_MIN, DATE_END_MAX } from '@/lib/constants'

const DateRangeSchema = z
  .object({
    from: z.coerce.number().min(DATE_BEGIN_MIN).max(DATE_END_MAX),
    to: z.coerce.number().min(DATE_BEGIN_MIN).max(DATE_END_MAX),
  })
  .refine((d) => d.from <= d.to, { message: 'From must be before To' })

function getValidationHint(from: string, to: string): string {
  const isPartial = (from !== '' && to === '') || (from === '' && to !== '')
  if (isPartial) return 'Both years required'

  if (from === '' && to === '') return ''

  const result = DateRangeSchema.safeParse({ from, to })
  if (result.success) return ''

  const firstIssue = result.error.issues[0]
  if (firstIssue.message === 'From must be before To') return firstIssue.message
  return `Range: ${DATE_BEGIN_MIN} to ${DATE_END_MAX}`
}

export function DateRangeFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [range, setRange] = useState({
    from: searchParams.get('dateBegin') ?? '',
    to: searchParams.get('dateEnd') ?? '',
  })

  const hasValues = range.from !== '' || range.to !== ''
  const hint = getValidationHint(range.from, range.to)
  const hasError = hint !== ''

  function syncToUrl() {
    if (range.from === '' && range.to === '') {
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

    const result = DateRangeSchema.safeParse(range)
    if (!result.success) return

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('dateBegin', range.from)
      next.set('dateEnd', range.to)
      next.delete('page')
      return next
    }, { replace: true })
  }

  function handleClear() {
    setRange({ from: '', to: '' })
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

  return (
    <div className="flex items-center gap-3 px-8 pb-6 max-md:px-4 max-md:pb-4">
      <span className="text-xs font-medium uppercase tracking-museum text-muted-foreground">
        Period
      </span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={range.from}
          onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
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
          value={range.to}
          onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
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
