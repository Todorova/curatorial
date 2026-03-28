export const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1'

export const ITEMS_PER_PAGE = 12

export const MAX_CONCURRENT_REQUESTS = 6

export const STALE_TIME = 1000 * 60 * 10 // 10 minutes

export const GC_TIME = 1000 * 60 * 30 // 30 minutes

export const DATE_BEGIN_MIN = -4000 // Earliest BCE date in the Met collection

export const DATE_END_MAX = new Date().getFullYear() // Current year

export const RELATED_WORKS_YEAR_RANGE = 50

export const RELATED_WORKS_COUNT = 8
