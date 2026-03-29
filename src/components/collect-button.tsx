import { Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCollected } from '@/context/collected-context'
import type { CollectedArtwork } from '@/types/artwork'
import { Button } from '@/components/ui/button'

interface CollectButtonProps {
  artwork: CollectedArtwork
  variant?: 'card' | 'detail'
}

export function CollectButton({ artwork, variant = 'card' }: CollectButtonProps) {
  const { toggle, isCollected } = useCollected()
  const collected = isCollected(artwork.objectID)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(artwork)
  }

  if (variant === 'detail') {
    return (
      <Button
        variant={collected ? 'default' : 'outline'}
        onClick={handleClick}
        className="gap-2 cursor-pointer"
      >
        <Bookmark
          size={16}
          strokeWidth={1.5}
          className={collected ? 'fill-current' : ''}
        />
        {collected ? 'Collected' : 'Collect'}
      </Button>
    )
  }

  // Card variant — small overlay icon
  return (
    <button
      onClick={handleClick}
      className={cn(
        'absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-sm bg-background/80 backdrop-blur-sm transition-all duration-200 cursor-pointer',
        collected
          ? 'text-accent'
          : 'text-muted-foreground opacity-0 group-hover:opacity-100'
      )}
      aria-label={collected ? 'Remove from collection' : 'Add to collection'}
    >
      <Bookmark
        size={16}
        strokeWidth={1.5}
        className={collected ? 'fill-current' : ''}
      />
    </button>
  )
}
