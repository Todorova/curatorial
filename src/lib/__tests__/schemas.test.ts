import { describe, it, expect } from 'vitest'
import { parseArtwork, parseSearchResult } from '../schemas'
import {
  mockArtworkFull,
  mockArtworkPartial,
  mockArtworkNoImage,
  mockSearchResult,
  mockSearchEmpty,
} from '../../test/mocks/handlers'

describe('parseArtwork', () => {
  it('parses a complete artwork correctly', () => {
    const result = parseArtwork(mockArtworkFull)
    expect(result.objectID).toBe(45734)
    expect(result.title).toBe('Wheat Field with Cypresses')
    expect(result.artistDisplayName).toBe('Vincent van Gogh')
    expect(result.tags).toHaveLength(2)
    expect(result.tags[0].term).toBe('Landscapes')
    expect(result.objectBeginDate).toBe(1889)
    expect(result.objectEndDate).toBe(1889)
  })

  it('provides defaults for null fields', () => {
    const result = parseArtwork(mockArtworkPartial)
    expect(result.objectID).toBe(99999)
    expect(result.title).toBe('Untitled') // null defaults to 'Untitled'
    expect(result.artistDisplayName).toBe('') // null defaults to empty string
    expect(result.dimensions).toBe('') // null defaults to empty
    expect(result.creditLine).toBe('') // null defaults to empty
    expect(result.tags).toEqual([]) // null tags normalized to empty array
  })

  it('handles BCE dates (negative years)', () => {
    const result = parseArtwork(mockArtworkPartial)
    expect(result.objectBeginDate).toBe(-500)
    expect(result.objectEndDate).toBe(-450)
  })

  it('handles artwork with no image', () => {
    const result = parseArtwork(mockArtworkNoImage)
    expect(result.primaryImageSmall).toBe('')
    expect(result.primaryImage).toBe('')
  })

  it('handles empty tags array', () => {
    const result = parseArtwork(mockArtworkNoImage)
    expect(result.tags).toEqual([])
  })

  it('preserves constituents when present', () => {
    const result = parseArtwork(mockArtworkFull)
    expect(result.constituents).toHaveLength(1)
    expect(result.constituents![0].name).toBe('Vincent van Gogh')
  })

  it('sets constituents to null when absent', () => {
    const result = parseArtwork(mockArtworkPartial)
    expect(result.constituents).toBeNull()
  })
})

describe('parseSearchResult', () => {
  it('parses a valid search result', () => {
    const result = parseSearchResult(mockSearchResult)
    expect(result.total).toBe(3)
    expect(result.objectIDs).toEqual([45734, 99999, 88888])
  })

  it('normalizes null objectIDs to empty array', () => {
    const result = parseSearchResult(mockSearchEmpty)
    expect(result.total).toBe(0)
    expect(result.objectIDs).toEqual([])
  })

  it('handles missing objectIDs field', () => {
    const result = parseSearchResult({ total: 0 })
    expect(result.objectIDs).toEqual([])
  })
})
