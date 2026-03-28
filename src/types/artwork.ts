export interface ArtworkTag {
  term: string
}

export interface ArtworkConstituent {
  name: string
  role: string
}

export interface Artwork {
  objectID: number
  title: string
  artistDisplayName: string
  artistDisplayBio: string
  objectDate: string
  objectBeginDate: number
  objectEndDate: number
  medium: string
  department: string
  primaryImageSmall: string
  primaryImage: string
  isHighlight: boolean
  accessionNumber: string
  dimensions: string
  creditLine: string
  objectURL: string
  tags: ArtworkTag[]
  constituents: ArtworkConstituent[] | null
  isPublicDomain: boolean
}

/** Minimal artwork data stored in the "Collected" session state */
export interface CollectedArtwork {
  objectID: number
  title: string
  artistDisplayName: string
  objectDate: string
  primaryImageSmall: string
  department: string
}

export interface SearchResult {
  total: number
  objectIDs: number[]
}

export interface Department {
  departmentId: number
  displayName: string
}

export interface DepartmentsResponse {
  departments: Department[]
}
