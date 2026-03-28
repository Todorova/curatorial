import { describe, it, expect } from 'vitest'
import { transformObject, toArtworkCard, transformDepartments } from '../transform'
import type { RawObject, RawDepartmentResponse } from '../schemas'

const completeRawObject: RawObject = {
  objectID: 436535,
  isHighlight: true,
  accessionNumber: '1993.132',
  accessionYear: '1993',
  isPublicDomain: true,
  primaryImage: 'https://images.metmuseum.org/CRDImages/ep/original/DP-42549-001.jpg',
  primaryImageSmall: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg',
  additionalImages: ['https://images.metmuseum.org/additional1.jpg'],
  department: 'European Paintings',
  objectName: 'Painting',
  title: 'Wheat Field with Cypresses',
  culture: '',
  period: '',
  dynasty: '',
  reign: '',
  portfolio: '',
  artistRole: 'Artist',
  artistPrefix: '',
  artistDisplayName: 'Vincent van Gogh',
  artistDisplayBio: 'Dutch, Zundert 1853–1890 Auvers-sur-Oise',
  artistSuffix: '',
  artistAlphaSort: 'Gogh, Vincent van',
  artistNationality: 'Dutch',
  artistBeginDate: '1853',
  artistEndDate: '1890',
  artistGender: '',
  artistWikidata_URL: '',
  artistULAN_URL: '',
  objectDate: '1889',
  objectBeginDate: 1889,
  objectEndDate: 1889,
  medium: 'Oil on canvas',
  dimensions: '28 13/16 x 36 3/4 in. (73.2 x 93.4 cm)',
  creditLine: 'Purchase, The Annenberg Foundation Gift, 1993',
  classification: 'Paintings',
  objectURL: 'https://www.metmuseum.org/art/collection/search/436535',
  tags: [
    { term: 'Landscapes', AAT_URL: '', Wikidata_URL: '' },
    { term: 'Cypresses', AAT_URL: '', Wikidata_URL: '' },
  ],
  GalleryNumber: '822',
}

describe('transformObject', () => {
  it('transforms a complete API response correctly', () => {
    const result = transformObject(completeRawObject)

    expect(result.objectId).toBe(436535)
    expect(result.title).toBe('Wheat Field with Cypresses')
    expect(result.artistName).toBe('Vincent van Gogh')
    expect(result.objectDate).toBe('1889')
    expect(result.medium).toBe('Oil on canvas')
    expect(result.dimensions).toBe('28 13/16 x 36 3/4 in. (73.2 x 93.4 cm)')
    expect(result.creditLine).toBe('Purchase, The Annenberg Foundation Gift, 1993')
    expect(result.department).toBe('European Paintings')
    expect(result.classification).toBe('Paintings')
    expect(result.tags).toEqual(['Landscapes', 'Cypresses'])
    expect(result.hasImage).toBe(true)
    expect(result.galleryNumber).toBe('822')
    expect(result.isPublicDomain).toBe(true)
    expect(result.additionalImages).toHaveLength(1)
  })

  it('handles missing/null fields with sensible defaults', () => {
    const minimal: RawObject = {
      objectID: 1,
    }

    const result = transformObject(minimal)

    expect(result.objectId).toBe(1)
    expect(result.title).toBe('Untitled')
    expect(result.artistName).toBe('Unknown Artist')
    expect(result.objectDate).toBe('Date unknown')
    expect(result.hasImage).toBe(false)
    expect(result.primaryImage).toBe('')
    expect(result.primaryImageSmall).toBe('')
    expect(result.tags).toEqual([])
    expect(result.additionalImages).toEqual([])
    expect(result.medium).toBe('')
    expect(result.creditLine).toBe('')
  })

  it('handles empty string images correctly', () => {
    const raw: RawObject = {
      objectID: 2,
      primaryImage: '',
      primaryImageSmall: '',
    }

    const result = transformObject(raw)
    expect(result.hasImage).toBe(false)
  })

  it('handles whitespace-only strings as empty', () => {
    const raw: RawObject = {
      objectID: 3,
      title: '   ',
      artistDisplayName: '  ',
      primaryImage: '  ',
    }

    const result = transformObject(raw)
    expect(result.title).toBe('Untitled')
    expect(result.artistName).toBe('Unknown Artist')
    expect(result.hasImage).toBe(false)
  })

  it('handles null tags', () => {
    const raw: RawObject = {
      objectID: 4,
      tags: null,
    }

    const result = transformObject(raw)
    expect(result.tags).toEqual([])
  })
})

describe('toArtworkCard', () => {
  it('extracts the card subset from a full artwork', () => {
    const artwork = transformObject(completeRawObject)
    const card = toArtworkCard(artwork)

    expect(card.objectId).toBe(436535)
    expect(card.title).toBe('Wheat Field with Cypresses')
    expect(card.artistName).toBe('Vincent van Gogh')
    expect(card.objectDate).toBe('1889')
    expect(card.primaryImageSmall).toBe(
      'https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg',
    )
    expect(card.hasImage).toBe(true)

    // Should NOT have detail-only fields
    expect(card).not.toHaveProperty('medium')
    expect(card).not.toHaveProperty('creditLine')
  })

  it('falls back to primaryImage when primaryImageSmall is empty', () => {
    const artwork = transformObject({
      objectID: 5,
      primaryImage: 'https://example.com/full.jpg',
      primaryImageSmall: '',
    })
    const card = toArtworkCard(artwork)
    expect(card.primaryImageSmall).toBe('https://example.com/full.jpg')
  })
})

describe('transformDepartments', () => {
  it('transforms department response correctly', () => {
    const raw: RawDepartmentResponse = {
      departments: [
        { departmentId: 1, displayName: 'American Decorative Arts' },
        { departmentId: 11, displayName: 'European Paintings' },
      ],
    }

    const result = transformDepartments(raw)
    expect(result).toEqual([
      { id: 1, name: 'American Decorative Arts' },
      { id: 11, name: 'European Paintings' },
    ])
  })
})
