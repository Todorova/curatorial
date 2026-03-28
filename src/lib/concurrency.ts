/**
 * Creates a concurrency limiter that ensures at most `maxConcurrent`
 * async operations run simultaneously. Tasks beyond the limit are queued.
 *
 * This is a custom implementation (similar to p-limit) to demonstrate
 * understanding of promise-based concurrency control.
 */
export function createConcurrencyLimiter(maxConcurrent: number) {
  let activeCount = 0
  const queue: Array<() => void> = []

  function next() {
    if (queue.length > 0 && activeCount < maxConcurrent) {
      activeCount++
      const resolve = queue.shift()!
      resolve()
    }
  }

  return async function limit<T>(fn: () => Promise<T>): Promise<T> {
    // Wait for a slot to open
    if (activeCount >= maxConcurrent) {
      await new Promise<void>((resolve) => {
        queue.push(resolve)
      })
    } else {
      activeCount++
    }

    try {
      return await fn()
    } finally {
      activeCount--
      next()
    }
  }
}
