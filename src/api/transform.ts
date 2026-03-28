import type { RawObject, RawDepartmentResponse } from './schemas'
import type { Artwork, ArtworkCard, Department } from '@/types'

function fallback(value: string | undefined | null, defaultValue: string): string {
  return value?.trim() || defaultValue
}

export function transformObject(raw: RawObject): Artwork {
  const primaryImage = raw.primaryImage?.trim() || ''
  const primaryImageSmall = raw.primaryImageSmall?.trim() || ''

  return {
    objectId: raw.objectID,
    title: fallback(raw.title, 'Untitled'),
    artistName: fallback(raw.artistDisplayName, 'Unknown Artist'),
    objectDate: fallback(raw.objectDate, 'Date unknown'),
    primaryImage,
    primaryImageSmall,
    hasImage: primaryImageSmall.length > 0 || primaryImage.length > 0,
    additionalImages: raw.additionalImages ?? [],
    accessionNumber: fallback(raw.accessionNumber, ''),
    medium: fallback(raw.medium, ''),
    dimensions: fallback(raw.dimensions, ''),
    creditLine: fallback(raw.creditLine, ''),
    department: fallback(raw.department, ''),
    departmentId: 0, // Not available in object response
    classification: fallback(raw.classification, ''),
    tags: raw.tags?.map((t) => t.term) ?? [],
    objectBeginDate: raw.objectBeginDate ?? 0,
    objectEndDate: raw.objectEndDate ?? 0,
    isPublicDomain: raw.isPublicDomain ?? false,
    objectUrl: fallback(raw.objectURL, ''),
    galleryNumber: fallback(raw.GalleryNumber, ''),
    artistBio: fallback(raw.artistDisplayBio, ''),
    artistNationality: fallback(raw.artistNationality, ''),
    culture: fallback(raw.culture, ''),
    period: fallback(raw.period, ''),
  }
}

export function toArtworkCard(artwork: Artwork): ArtworkCard {
  return {
    objectId: artwork.objectId,
    title: artwork.title,
    artistName: artwork.artistName,
    objectDate: artwork.objectDate,
    primaryImageSmall: artwork.primaryImageSmall || artwork.primaryImage,
    hasImage: artwork.hasImage,
  }
}

export function transformDepartments(raw: RawDepartmentResponse): Department[] {
  return raw.departments.map((d) => ({
    id: d.departmentId,
    name: d.displayName,
  }))
}
