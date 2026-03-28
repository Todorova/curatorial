export interface Department {
  id: number
  name: string
}

export interface ArtworkCard {
  objectId: number
  title: string
  artistName: string
  objectDate: string
  primaryImageSmall: string
  hasImage: boolean
}

export interface Artwork extends ArtworkCard {
  primaryImage: string
  additionalImages: string[]
  accessionNumber: string
  medium: string
  dimensions: string
  creditLine: string
  department: string
  departmentId: number
  classification: string
  tags: string[]
  objectBeginDate: number
  objectEndDate: number
  isPublicDomain: boolean
  objectUrl: string
  galleryNumber: string
  artistBio: string
  artistNationality: string
  culture: string
  period: string
}

export interface GalleryFilters {
  q: string
  departmentId: number | null
  dateBegin: number | null
  dateEnd: number | null
}

export interface SearchResult {
  total: number
  objectIds: number[]
}
