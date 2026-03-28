import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

interface SearchBarProps {
  onClose: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      setSearchParams((prev) => {
        prev.set('q', trimmed)
        prev.delete('page')
        return prev
      })
    } else {
      setSearchParams((prev) => {
        prev.delete('q')
        prev.delete('page')
        return prev
      })
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by title, artist, or keyword..."
        className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground placeholder:italic focus:border-accent focus:outline-none transition-colors"
      />
    </form>
  )
}
