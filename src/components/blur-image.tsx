import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  contain?: boolean
}

export function ProgressiveImage({ src, alt, className, contain }: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="opacity-30"
        >
          <rect
            x="8"
            y="12"
            width="32"
            height="24"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          'w-full transition-opacity duration-400',
          contain ? 'object-contain' : 'h-full object-cover',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}
