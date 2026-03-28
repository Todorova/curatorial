import { cn } from '@/lib/cn'

interface PaginationProps {
  page: number
  totalPages: number
  totalResults: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, totalResults, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-6">
      <p className="text-xs text-muted-foreground">{totalResults.toLocaleString()} results</p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            'rounded-full border border-border/60 px-3.5 py-1.5 text-sm font-medium transition-colors',
            page <= 1
              ? 'cursor-not-allowed text-muted-foreground/40'
              : 'text-foreground hover:bg-secondary',
          )}
        >
          Previous
        </button>

        <span className="px-3 text-sm tabular-nums text-muted-foreground">
          {page} / {totalPages.toLocaleString()}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            'rounded-full border border-border/60 px-3.5 py-1.5 text-sm font-medium transition-colors',
            page >= totalPages
              ? 'cursor-not-allowed text-muted-foreground/40'
              : 'text-foreground hover:bg-secondary',
          )}
        >
          Next
        </button>
      </div>
    </div>
  )
}
