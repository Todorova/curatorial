import { z } from 'zod'
import type { Artwork, SearchResult } from '@/types/artwork'

/** Accepts string or null, returns string (null → fallback) */
function nullableString(fallback = '') {
  return z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? fallback)
}

/** Accepts number or null, returns number (null → fallback) */
function nullableNumber(fallback = 0) {
  return z
    .number()
    .nullable()
    .optional()
    .transform((v) => v ?? fallback)
}

const TagSchema = z
  .object({ term: z.string() })
  .passthrough()

const ConstituentSchema = z
  .object({
    name: nullableString(),
    role: nullableString(),
  })
  .passthrough()

const ArtworkSchema = z
  .object({
    objectID: z.number(),
    title: nullableString('Untitled'),
    artistDisplayName: nullableString(),
    artistDisplayBio: nullableString(),
    objectDate: nullableString(),
    objectBeginDate: nullableNumber(),
    objectEndDate: nullableNumber(),
    medium: nullableString(),
    department: nullableString(),
    primaryImageSmall: nullableString(),
    primaryImage: nullableString(),
    isHighlight: z.boolean().optional().default(false),
    accessionNumber: nullableString(),
    dimensions: nullableString(),
    creditLine: nullableString(),
    objectURL: nullableString(),
    tags: z
      .array(TagSchema)
      .nullable()
      .optional()
      .transform((v) => v ?? []),
    constituents: z.array(ConstituentSchema).nullable().optional().default(null),
    isPublicDomain: z.boolean().optional().default(false),
  })
  .passthrough()

const SearchResultSchema = z.object({
  total: z.number().optional().default(0),
  objectIDs: z
    .array(z.number())
    .nullable()
    .optional()
    .transform((v) => v ?? []),
})

export function parseArtwork(raw: unknown): Artwork {
  return ArtworkSchema.parse(raw)
}

export function parseSearchResult(raw: unknown): SearchResult {
  return SearchResultSchema.parse(raw)
}
