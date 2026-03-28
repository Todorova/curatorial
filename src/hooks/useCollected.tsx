/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface CollectedContextValue {
  collected: Set<number>
  toggle: (id: number) => void
  isCollected: (id: number) => boolean
  count: number
  clear: () => void
}

const CollectedContext = createContext<CollectedContextValue | null>(null)

const STORAGE_KEY = 'curatorial-collected'

function loadFromSession(): Set<number> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      return new Set(JSON.parse(stored) as number[])
    }
  } catch {
    // Ignore parse errors
  }
  return new Set()
}

function saveToSession(ids: Set<number>) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function CollectedProvider({ children }: { children: ReactNode }) {
  const [collected, setCollected] = useState<Set<number>>(() => loadFromSession())

  useEffect(() => {
    saveToSession(collected)
  }, [collected])

  const toggle = useCallback((id: number) => {
    setCollected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const isCollected = useCallback((id: number) => collected.has(id), [collected])

  const clear = useCallback(() => setCollected(new Set()), [])

  return (
    <CollectedContext.Provider
      value={{ collected, toggle, isCollected, count: collected.size, clear }}
    >
      {children}
    </CollectedContext.Provider>
  )
}

export function useCollected() {
  const context = useContext(CollectedContext)
  if (!context) {
    throw new Error('useCollected must be used within a CollectedProvider')
  }
  return context
}
