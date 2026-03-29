import { describe, it, expect } from 'vitest'
import { createConcurrencyLimiter } from '../concurrency'

describe('createConcurrencyLimiter', () => {
  it('runs tasks up to the concurrency limit in parallel', async () => {
    const limiter = createConcurrencyLimiter(2)
    const order: string[] = []

    const task = (name: string, ms: number) =>
      limiter(
        () =>
          new Promise<string>((resolve) => {
            order.push(`start:${name}`)
            setTimeout(() => {
              order.push(`end:${name}`)
              resolve(name)
            }, ms)
          }),
      )

    const results = await Promise.all([
      task('a', 50),
      task('b', 30),
      task('c', 10),
    ])

    expect(results).toEqual(['a', 'b', 'c'])
    // a and b start immediately (limit=2), c waits
    expect(order[0]).toBe('start:a')
    expect(order[1]).toBe('start:b')
    // c should start only after b finishes (b is faster)
    expect(order.indexOf('start:c')).toBeGreaterThan(order.indexOf('end:b'))
  })

  it('handles rejected promises without blocking the queue', async () => {
    const limiter = createConcurrencyLimiter(1)

    const failingTask = limiter(() => Promise.reject(new Error('fail')))
    await expect(failingTask).rejects.toThrow('fail')

    // Queue should still process after rejection
    const result = await limiter(() => Promise.resolve('ok'))
    expect(result).toBe('ok')
  })

  it('returns the value from the wrapped function', async () => {
    const limiter = createConcurrencyLimiter(3)
    const result = await limiter(() => Promise.resolve(42))
    expect(result).toBe(42)
  })
})
