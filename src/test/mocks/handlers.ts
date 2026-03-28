import { http, HttpResponse } from 'msw'
import { MET_API_BASE } from '@/lib/constants'

// Complete artwork for testing
export const mockArtworkFull = {
  objectID: 45734,
  title: 'Wheat Field with Cypresses',
  artistDisplayName: 'Vincent van Gogh',
  artistDisplayBio: 'Dutch, Zundert 1853–1890 Auvers-sur-Oise',
  objectDate: '1889',
  objectBeginDate: 1889,
  objectEndDate: 1889,
  medium: 'Oil on canvas',
  department: 'European Paintings',
  primaryImageSmall: 'https://images.metmuseum.org/small/45734.jpg',
  primaryImage: 'https://images.metmuseum.org/large/45734.jpg',
  isHighlight: true,
  accessionNumber: '1993.132',
  dimensions: '28 3/4 x 36 3/4 in.',
  creditLine: 'Purchase, The Annenberg Foundation Gift, 1993',
  objectURL: 'https://www.metmuseum.org/art/collection/search/45734',
  tags: [{ term: 'Landscapes' }, { term: 'Cypresses' }],
  constituents: [{ name: 'Vincent van Gogh', role: 'Artist' }],
  isPublicDomain: true,
}

// Artwork with many null/missing fields
export const mockArtworkPartial = {
  objectID: 99999,
  title: null,
  artistDisplayName: null,
  artistDisplayBio: null,
  objectDate: '',
  objectBeginDate: -500,
  objectEndDate: -450,
  medium: 'Terracotta',
  department: 'Greek and Roman Art',
  primaryImageSmall: 'https://images.metmuseum.org/small/99999.jpg',
  primaryImage: '',
  isHighlight: false,
  accessionNumber: '06.1021.26',
  dimensions: null,
  creditLine: null,
  objectURL: '',
  tags: null,
  constituents: null,
  isPublicDomain: true,
}

// Artwork with no image
export const mockArtworkNoImage = {
  objectID: 88888,
  title: 'Fragment',
  artistDisplayName: '',
  artistDisplayBio: '',
  objectDate: 'ca. 300 B.C.',
  objectBeginDate: -300,
  objectEndDate: -300,
  medium: 'Bronze',
  department: 'Greek and Roman Art',
  primaryImageSmall: '',
  primaryImage: '',
  isHighlight: false,
  accessionNumber: '99.9.9',
  dimensions: '',
  creditLine: 'Gift, 1899',
  objectURL: '',
  tags: [],
  constituents: null,
  isPublicDomain: false,
}

export const mockSearchResult = {
  total: 3,
  objectIDs: [45734, 99999, 88888],
}

export const mockSearchEmpty = {
  total: 0,
  objectIDs: null,
}

export const handlers = [
  http.get(`${MET_API_BASE}/search`, ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    if (q === 'nonexistent') {
      return HttpResponse.json(mockSearchEmpty)
    }

    return HttpResponse.json(mockSearchResult)
  }),

  http.get(`${MET_API_BASE}/objects/:id`, ({ params }) => {
    const id = Number(params.id)

    if (id === 45734) return HttpResponse.json(mockArtworkFull)
    if (id === 99999) return HttpResponse.json(mockArtworkPartial)
    if (id === 88888) return HttpResponse.json(mockArtworkNoImage)

    return new HttpResponse(null, { status: 404 })
  }),
]
