import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface SearchBarProps {
  onClose: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  function applySearch() {
    const trimmed = value.trim()
    if (trimmed) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('q', trimmed)
        next.delete('page')
        return next
      })
    } else {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete('q')
        next.delete('page')
        return next
      })
    }
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applySearch()
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={applySearch}
        placeholder="Search by title, artist, or keyword..."
        className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground placeholder:italic focus:border-accent focus:outline-none transition-colors"
      />
    </form>
  )
}
