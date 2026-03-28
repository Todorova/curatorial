import { describe, it, expect } from 'vitest'
import { createConcurrencyLimiter } from '../concurrency'

describe('createConcurrencyLimiter', () => {
  it('limits concurrent executions to maxConcurrent', async () => {
    const limiter = createConcurrencyLimiter(2)
    let running = 0
    let maxRunning = 0

    const task = () =>
      limiter(async () => {
        running++
        maxRunning = Math.max(maxRunning, running)
        await new Promise((r) => setTimeout(r, 50))
        running--
        return 'done'
      })

    const results = await Promise.all([task(), task(), task(), task(), task()])

    expect(maxRunning).toBeLessThanOrEqual(2)
    expect(results).toEqual(['done', 'done', 'done', 'done', 'done'])
  })

  it('resolves all promises even with high concurrency', async () => {
    const limiter = createConcurrencyLimiter(3)
    const results: number[] = []

    const tasks = Array.from({ length: 10 }, (_, i) =>
      limiter(async () => {
        await new Promise((r) => setTimeout(r, 10))
        results.push(i)
        return i
      }),
    )

    const values = await Promise.all(tasks)
    expect(values).toHaveLength(10)
    expect(results).toHaveLength(10)
  })

  it('handles errors without breaking the queue', async () => {
    const limiter = createConcurrencyLimiter(2)

    const errorTask = limiter(async () => {
      throw new Error('fail')
    })

    const successTask = limiter(async () => 'success')

    await expect(errorTask).rejects.toThrow('fail')
    await expect(successTask).resolves.toBe('success')
  })
})
