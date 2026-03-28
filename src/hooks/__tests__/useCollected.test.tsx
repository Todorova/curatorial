import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type ReactNode } from 'react'
import { CollectedProvider, useCollected } from '../useCollected'

function wrapper({ children }: { children: ReactNode }) {
  return <CollectedProvider>{children}</CollectedProvider>
}

describe('useCollected', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('starts with empty collection', () => {
    const { result } = renderHook(() => useCollected(), { wrapper })

    expect(result.current.count).toBe(0)
    expect(result.current.isCollected(1)).toBe(false)
  })

  it('toggles an item in and out of the collection', () => {
    const { result } = renderHook(() => useCollected(), { wrapper })

    act(() => result.current.toggle(42))
    expect(result.current.isCollected(42)).toBe(true)
    expect(result.current.count).toBe(1)

    act(() => result.current.toggle(42))
    expect(result.current.isCollected(42)).toBe(false)
    expect(result.current.count).toBe(0)
  })

  it('supports multiple items', () => {
    const { result } = renderHook(() => useCollected(), { wrapper })

    act(() => {
      result.current.toggle(1)
      result.current.toggle(2)
      result.current.toggle(3)
    })

    expect(result.current.count).toBe(3)
    expect(result.current.isCollected(1)).toBe(true)
    expect(result.current.isCollected(2)).toBe(true)
    expect(result.current.isCollected(3)).toBe(true)
  })

  it('clears all items', () => {
    const { result } = renderHook(() => useCollected(), { wrapper })

    act(() => {
      result.current.toggle(1)
      result.current.toggle(2)
    })
    expect(result.current.count).toBe(2)

    act(() => result.current.clear())
    expect(result.current.count).toBe(0)
    expect(result.current.isCollected(1)).toBe(false)
  })

  it('persists to sessionStorage', () => {
    const { result } = renderHook(() => useCollected(), { wrapper })

    act(() => result.current.toggle(99))

    const stored = JSON.parse(sessionStorage.getItem('curatorial-collected') || '[]')
    expect(stored).toContain(99)
  })

  it('restores from sessionStorage', () => {
    sessionStorage.setItem('curatorial-collected', JSON.stringify([10, 20]))

    const { result } = renderHook(() => useCollected(), { wrapper })

    expect(result.current.isCollected(10)).toBe(true)
    expect(result.current.isCollected(20)).toBe(true)
    expect(result.current.count).toBe(2)
  })

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useCollected())
    }).toThrow('useCollected must be used within a CollectedProvider')
  })
})
