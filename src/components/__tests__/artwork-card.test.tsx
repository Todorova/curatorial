import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CollectedProvider } from '@/context/collected-context'
import { ArtworkCard } from '../artwork-card'
import type { Artwork } from '@/types/artwork'

function renderCard(artwork: Partial<Artwork>) {
  const defaultArtwork: Artwork = {
    objectID: 1,
    title: 'Test Artwork',
    artistDisplayName: 'Test Artist',
    artistDisplayBio: '',
    objectDate: '1900',
    objectBeginDate: 1900,
    objectEndDate: 1900,
    medium: 'Oil on canvas',
    department: 'European Paintings',
    primaryImageSmall: 'https://example.com/small.jpg',
    primaryImage: 'https://example.com/large.jpg',
    isHighlight: false,
    accessionNumber: '',
    dimensions: '',
    creditLine: '',
    objectURL: '',
    tags: [],
    constituents: null,
    isPublicDomain: false,
    ...artwork,
  }

  return render(
    <MemoryRouter>
      <CollectedProvider>
        <ArtworkCard artwork={defaultArtwork} />
      </CollectedProvider>
    </MemoryRouter>
  )
}

describe('ArtworkCard', () => {
  it('renders title, artist, and date', () => {
    renderCard({
      title: 'Starry Night',
      artistDisplayName: 'Vincent van Gogh',
      objectDate: '1889',
    })

    expect(screen.getByText('Starry Night')).toBeInTheDocument()
    expect(screen.getByText('Vincent van Gogh')).toBeInTheDocument()
    expect(screen.getByText(/1889/)).toBeInTheDocument()
  })

  it('links to internal detail page', () => {
    renderCard({ objectID: 45734 })

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/artwork/45734')
  })

  it('handles missing artist name gracefully', () => {
    const { container } = renderCard({ artistDisplayName: '' })

    // Should not render an artist paragraph when name is empty
    const artistParagraphs = container.querySelectorAll('p.truncate')
    expect(artistParagraphs).toHaveLength(0)
    // Title should still be there
    expect(screen.getByText('Test Artwork')).toBeInTheDocument()
  })

  it('shows department when present', () => {
    renderCard({ department: 'Asian Art', objectDate: '1800' })

    expect(screen.getByText(/Asian Art/)).toBeInTheDocument()
  })

  it('renders collect button', () => {
    renderCard({})

    expect(
      screen.getByRole('button', { name: /add to collection/i })
    ).toBeInTheDocument()
  })
})
