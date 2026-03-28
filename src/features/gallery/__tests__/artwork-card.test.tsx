import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArtworkCard } from '../artwork-card'
import { renderWithProviders } from '@/test/utils'
import type { ArtworkCard as ArtworkCardType } from '@/types'

const mockArtwork: ArtworkCardType = {
  objectId: 436535,
  title: 'Wheat Field with Cypresses',
  artistName: 'Vincent van Gogh',
  objectDate: '1889',
  primaryImageSmall: 'https://example.com/image.jpg',
  hasImage: true,
}

const mockArtworkNoImage: ArtworkCardType = {
  objectId: 1,
  title: 'Untitled',
  artistName: 'Unknown Artist',
  objectDate: 'Date unknown',
  primaryImageSmall: '',
  hasImage: false,
}

describe('ArtworkCard', () => {
  it('renders title, artist name, and date', () => {
    renderWithProviders(<ArtworkCard artwork={mockArtwork} />)

    expect(screen.getByText('Wheat Field with Cypresses')).toBeInTheDocument()
    expect(screen.getByText('Vincent van Gogh')).toBeInTheDocument()
    expect(screen.getByText('1889')).toBeInTheDocument()
  })

  it('renders a link to the detail page', () => {
    renderWithProviders(<ArtworkCard artwork={mockArtwork} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/artifact/436535')
  })

  it('shows fallback when image is missing', () => {
    renderWithProviders(<ArtworkCard artwork={mockArtworkNoImage} />)

    // Fallback uses artwork title as aria-label
    expect(screen.getByRole('img', { name: 'Untitled' })).toBeInTheDocument()
  })

  it('toggles collected state on bookmark click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ArtworkCard artwork={mockArtwork} />)

    const collectButton = screen.getByRole('button', { name: /add to collection/i })
    expect(collectButton).toBeInTheDocument()

    await user.click(collectButton)
    expect(screen.getByRole('button', { name: /remove from collection/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /remove from collection/i }))
    expect(screen.getByRole('button', { name: /add to collection/i })).toBeInTheDocument()
  })

  it('renders gracefully with fallback values', () => {
    renderWithProviders(<ArtworkCard artwork={mockArtworkNoImage} />)

    expect(screen.getByText('Untitled')).toBeInTheDocument()
    expect(screen.getByText('Unknown Artist')).toBeInTheDocument()
    expect(screen.getByText('Date unknown')).toBeInTheDocument()
  })
})
