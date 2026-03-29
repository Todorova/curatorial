import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollectionPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export function CollectionPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: CollectionPaginationProps) {
  const [, setSearchParams] = useSearchParams()

  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const goToPage = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (page === 1) {
        next.delete('page')
      } else {
        next.set('page', String(page))
      }
      return next
    }, { replace: true })

    // Instant scroll to top — smooth scroll doesn't work reliably because
    // page height changes as artworks load progressively
    window.scrollTo(0, 0)
  }

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex flex-col items-center gap-4 px-8 pb-16 pt-12 max-md:px-4 max-md:pb-12 max-md:pt-8">
      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {startItem}&ndash;{endItem} of {totalItems.toLocaleString()} works
      </p>

      {/* Pagination controls */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
            currentPage === 1
              ? 'text-muted-foreground/30 cursor-not-allowed'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          <span className="max-sm:sr-only">Previous</span>
        </button>

        {/* Mobile: "Page X of Y" */}
        <span className="px-4 text-sm text-muted-foreground sm:hidden">
          Page {currentPage} of {totalPages}
        </span>

        {/* Desktop: page numbers */}
        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((page, i) =>
            page === '...' ? (
              <span
                key={`ellipsis-${i}`}
                className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page as number)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={cn(
                  'flex h-10 w-10 items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer',
                  currentPage === page
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:border hover:border-foreground hover:text-foreground'
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
            currentPage === totalPages
              ? 'text-muted-foreground/30 cursor-not-allowed'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span className="max-sm:sr-only">Next</span>
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </nav>
    </div>
  )
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  if (current > 3) {
    pages.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  pages.push(total)

  return pages
}
