interface EmptyStateProps {
  onReset: () => void
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-24 text-center max-md:px-4 max-md:py-16">
      {/* Empty frame SVG */}
      <svg
        width="120"
        height="90"
        viewBox="0 0 120 90"
        fill="none"
        className="mb-8 text-border"
      >
        <rect
          x="0.5"
          y="0.5"
          width="119"
          height="89"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <h2 className="font-serif text-2xl font-normal italic text-foreground">
        No works found
      </h2>
      <p className="mt-3 max-w-xs text-sm text-muted-foreground">
        Try selecting a different department or broadening your search.
      </p>
      <button
        onClick={onReset}
        className="mt-6 text-sm font-medium text-accent underline-offset-4 hover:underline transition-colors cursor-pointer"
      >
        View all works
      </button>
    </div>
  )
}
