import { cn } from '@/lib/utils'

interface DepartmentTagProps {
  label: string
  isActive: boolean
  onClick: () => void
}

export function DepartmentTag({ label, isActive, onClick }: DepartmentTagProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'inline-flex shrink-0 items-center rounded-sm border px-3.5 py-1.5 text-xs font-medium uppercase tracking-museum transition-all duration-200 cursor-pointer',
        isActive
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  )
}
