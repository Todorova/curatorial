export const API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export const PAGE_SIZE = 20

export const MAX_CONCURRENT_REQUESTS = 8

export const STALE_TIME = 1000 * 60 * 10 // 10 minutes

export const GC_TIME = 1000 * 60 * 30 // 30 minutes

export const RELATED_WORKS_YEAR_RANGE = 50

export const RELATED_WORKS_COUNT = 8

export const SEARCH_SUGGESTIONS = [
  'Impressionism',
  'Egyptian',
  'Armor',
  'Monet',
  'Ceramics',
  'Renaissance',
  'Japanese',
  'Photography',
  'Van Gogh',
  'Sculpture',
] as const
