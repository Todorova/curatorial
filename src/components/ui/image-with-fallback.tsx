import { useState } from 'react'
import { cn } from '@/lib/cn'

interface ImageWithFallbackProps extends React.ComponentProps<'img'> {
  fallbackClassName?: string
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-secondary text-muted-foreground',
          fallbackClassName || className,
        )}
        role="img"
        aria-label={alt || 'No image available'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-40"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
      onError={() => setError(true)}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  )
}
