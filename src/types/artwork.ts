import type { z } from 'zod'
import type {
  ArtworkSchema,
  TagSchema,
  ConstituentSchema,
  SearchResultSchema,
  DepartmentSchema,
} from '@/lib/schemas'

export type ArtworkTag = z.infer<typeof TagSchema>

export type ArtworkConstituent = z.infer<typeof ConstituentSchema>

export type Artwork = z.infer<typeof ArtworkSchema>

export type SearchResult = z.infer<typeof SearchResultSchema>

export type Department = z.infer<typeof DepartmentSchema>

/** Minimal artwork data stored in the "Collected" session state */
export type CollectedArtwork = Pick<
  Artwork,
  'objectID' | 'title' | 'artistDisplayName' | 'objectDate' | 'primaryImageSmall' | 'department'
>
