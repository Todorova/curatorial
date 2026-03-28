import { cn } from '@/lib/cn'

interface BadgeProps extends React.ComponentProps<'span'> {
  variant?: 'default' | 'secondary' | 'accent'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'bg-accent/10 text-accent': variant === 'accent',
        },
        className,
      )}
      {...props}
    />
  )
}
