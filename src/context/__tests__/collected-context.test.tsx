import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { CollectedProvider, useCollected } from '../collected-context'
import type { CollectedArtwork } from '@/types/artwork'

const mockArtwork: CollectedArtwork = {
  objectID: 1,
  title: 'Test Artwork',
  artistDisplayName: 'Test Artist',
  objectDate: '1900',
  primaryImageSmall: 'https://example.com/img.jpg',
  department: 'Paintings',
}

const mockArtwork2: CollectedArtwork = {
  objectID: 2,
  title: 'Second Artwork',
  artistDisplayName: 'Another Artist',
  objectDate: '1800',
  primaryImageSmall: '',
  department: 'Sculpture',
}

function TestConsumer() {
  const { items, toggle, isCollected, count } = useCollected()
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="is-collected-1">{String(isCollected(1))}</span>
      <span data-testid="is-collected-2">{String(isCollected(2))}</span>
      <button onClick={() => toggle(mockArtwork)}>Toggle 1</button>
      <button onClick={() => toggle(mockArtwork2)}>Toggle 2</button>
      <ul>
        {[...items.values()].map((a) => (
          <li key={a.objectID}>{a.title}</li>
        ))}
      </ul>
    </div>
  )
}

describe('CollectedProvider', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('starts with empty collection', () => {
    render(
      <CollectedProvider>
        <TestConsumer />
      </CollectedProvider>,
    )

    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('is-collected-1')).toHaveTextContent('false')
  })

  it('toggles an artwork into the collection', async () => {
    const user = userEvent.setup()
    render(
      <CollectedProvider>
        <TestConsumer />
      </CollectedProvider>,
    )

    await user.click(screen.getByText('Toggle 1'))

    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('is-collected-1')).toHaveTextContent('true')
    expect(screen.getByText('Test Artwork')).toBeInTheDocument()
  })

  it('toggles an artwork out of the collection', async () => {
    const user = userEvent.setup()
    render(
      <CollectedProvider>
        <TestConsumer />
      </CollectedProvider>,
    )

    await user.click(screen.getByText('Toggle 1'))
    expect(screen.getByTestId('count')).toHaveTextContent('1')

    await user.click(screen.getByText('Toggle 1'))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('is-collected-1')).toHaveTextContent('false')
  })

  it('tracks multiple artworks independently', async () => {
    const user = userEvent.setup()
    render(
      <CollectedProvider>
        <TestConsumer />
      </CollectedProvider>,
    )

    await user.click(screen.getByText('Toggle 1'))
    await user.click(screen.getByText('Toggle 2'))

    expect(screen.getByTestId('count')).toHaveTextContent('2')
    expect(screen.getByTestId('is-collected-1')).toHaveTextContent('true')
    expect(screen.getByTestId('is-collected-2')).toHaveTextContent('true')
  })

  it('persists to sessionStorage', async () => {
    const user = userEvent.setup()
    render(
      <CollectedProvider>
        <TestConsumer />
      </CollectedProvider>,
    )

    await user.click(screen.getByText('Toggle 1'))

    const stored = sessionStorage.getItem('curatorial-collected')
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored!) as [number, CollectedArtwork][]
    expect(parsed).toHaveLength(1)
    expect(parsed[0][0]).toBe(1)
    expect(parsed[0][1].title).toBe('Test Artwork')
  })

  it('restores from sessionStorage on mount', () => {
    const entries: [number, CollectedArtwork][] = [[1, mockArtwork]]
    sessionStorage.setItem('curatorial-collected', JSON.stringify(entries))

    render(
      <CollectedProvider>
        <TestConsumer />
      </CollectedProvider>,
    )

    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('is-collected-1')).toHaveTextContent('true')
    expect(screen.getByText('Test Artwork')).toBeInTheDocument()
  })

  it('handles corrupted sessionStorage gracefully', () => {
    sessionStorage.setItem('curatorial-collected', 'not-valid-json')

    render(
      <CollectedProvider>
        <TestConsumer />
      </CollectedProvider>,
    )

    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('throws when useCollected is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(
      'useCollected must be used within CollectedProvider',
    )
    consoleError.mockRestore()
  })
})
