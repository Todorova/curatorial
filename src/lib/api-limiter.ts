import { createConcurrencyLimiter } from './concurrency'
import { MAX_CONCURRENT_REQUESTS } from './constants'

/**
 * Single shared limiter for ALL Met API requests.
 * This ensures we never exceed the 80 req/s rate limit,
 * even when search, department counts, and object fetches fire simultaneously.
 */
export const apiLimiter = createConcurrencyLimiter(MAX_CONCURRENT_REQUESTS)
