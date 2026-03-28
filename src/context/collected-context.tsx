import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import type { CollectedArtwork } from '@/types/artwork'

const STORAGE_KEY = 'curatorial-collected'

interface CollectedState {
  items: Map<number, CollectedArtwork>
}

type Action =
  | { type: 'TOGGLE'; artwork: CollectedArtwork }

function reducer(state: CollectedState, action: Action): CollectedState {
  switch (action.type) {
    case 'TOGGLE': {
      const next = new Map(state.items)
      if (next.has(action.artwork.objectID)) {
        next.delete(action.artwork.objectID)
      } else {
        next.set(action.artwork.objectID, action.artwork)
      }
      return { items: next }
    }
  }
}

function loadFromSession(): CollectedState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      const entries = JSON.parse(stored) as [number, CollectedArtwork][]
      return { items: new Map(entries) }
    }
  } catch {
    // Ignore parse errors
  }
  return { items: new Map() }
}

interface CollectedContextValue {
  items: Map<number, CollectedArtwork>
  toggle: (artwork: CollectedArtwork) => void
  isCollected: (objectID: number) => boolean
  count: number
}

const CollectedContext = createContext<CollectedContextValue | null>(null)

export function CollectedProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadFromSession)

  // Persist to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...state.items.entries()]))
  }, [state.items])

  const toggle = useCallback(
    (artwork: CollectedArtwork) => dispatch({ type: 'TOGGLE', artwork }),
    []
  )

  const isCollected = useCallback(
    (objectID: number) => state.items.has(objectID),
    [state.items]
  )

  return (
    <CollectedContext value={{
      items: state.items,
      toggle,
      isCollected,
      count: state.items.size,
    }}>
      {children}
    </CollectedContext>
  )
}

export function useCollected() {
  const ctx = useContext(CollectedContext)
  if (!ctx) throw new Error('useCollected must be used within CollectedProvider')
  return ctx
}
