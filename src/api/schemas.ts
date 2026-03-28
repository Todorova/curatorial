import { z } from 'zod/v4'

export const DepartmentSchema = z.object({
  departmentId: z.number(),
  displayName: z.string(),
})

export const DepartmentResponseSchema = z.object({
  departments: z.array(DepartmentSchema),
})

export const SearchResponseSchema = z.object({
  total: z.number(),
  objectIDs: z.array(z.number()).nullable(),
})

const TagSchema = z.object({
  term: z.string(),
  AAT_URL: z.string().optional(),
  Wikidata_URL: z.string().optional(),
})

export const ObjectResponseSchema = z.object({
  objectID: z.number(),
  isHighlight: z.boolean().optional(),
  accessionNumber: z.string().optional(),
  accessionYear: z.string().optional(),
  isPublicDomain: z.boolean().optional(),
  primaryImage: z.string().optional(),
  primaryImageSmall: z.string().optional(),
  additionalImages: z.array(z.string()).optional(),
  department: z.string().optional(),
  objectName: z.string().optional(),
  title: z.string().optional(),
  culture: z.string().optional(),
  period: z.string().optional(),
  dynasty: z.string().optional(),
  reign: z.string().optional(),
  portfolio: z.string().optional(),
  artistRole: z.string().optional(),
  artistPrefix: z.string().optional(),
  artistDisplayName: z.string().optional(),
  artistDisplayBio: z.string().optional(),
  artistSuffix: z.string().optional(),
  artistAlphaSort: z.string().optional(),
  artistNationality: z.string().optional(),
  artistBeginDate: z.string().optional(),
  artistEndDate: z.string().optional(),
  artistGender: z.string().optional(),
  artistWikidata_URL: z.string().optional(),
  artistULAN_URL: z.string().optional(),
  objectDate: z.string().optional(),
  objectBeginDate: z.number().optional(),
  objectEndDate: z.number().optional(),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  measurements: z.array(z.unknown()).nullable().optional(),
  creditLine: z.string().optional(),
  geographyType: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  county: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  subregion: z.string().optional(),
  locale: z.string().optional(),
  locus: z.string().optional(),
  excavation: z.string().optional(),
  river: z.string().optional(),
  classification: z.string().optional(),
  rightsAndReproduction: z.string().optional(),
  linkResource: z.string().optional(),
  metadataDate: z.string().optional(),
  repository: z.string().optional(),
  objectURL: z.string().optional(),
  tags: z.array(TagSchema).nullable().optional(),
  objectWikidata_URL: z.string().optional(),
  isTimelineWork: z.boolean().optional(),
  GalleryNumber: z.string().optional(),
  constituents: z.array(z.unknown()).nullable().optional(),
})

export type RawObject = z.infer<typeof ObjectResponseSchema>
export type RawSearchResponse = z.infer<typeof SearchResponseSchema>
export type RawDepartmentResponse = z.infer<typeof DepartmentResponseSchema>
