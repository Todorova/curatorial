import { describe, it, expect } from 'vitest'
import { parseDateString } from '../date-parser'

describe('parseDateString', () => {
  it('returns null for empty or falsy input', () => {
    expect(parseDateString('')).toBeNull()
    expect(parseDateString('   ')).toBeNull()
  })

  it('parses plain years', () => {
    expect(parseDateString('1889')).toBe(1889)
    expect(parseDateString('500')).toBe(500)
    expect(parseDateString('-500')).toBe(-500)
  })

  it('parses "ca." approximate dates', () => {
    expect(parseDateString('ca. 1500')).toBe(1500)
    expect(parseDateString('ca.1500')).toBe(1500)
    expect(parseDateString('c. 1200')).toBe(1200)
    expect(parseDateString('circa 1800')).toBe(1800)
    expect(parseDateString('about 1700')).toBe(1700)
  })

  it('parses date ranges to midpoint', () => {
    expect(parseDateString('1500-1510')).toBe(1505)
    expect(parseDateString('1500–1510')).toBe(1505)
    expect(parseDateString('1500 - 1510')).toBe(1505)
  })

  it('parses century ordinals', () => {
    expect(parseDateString('1st century')).toBe(50)
    expect(parseDateString('3rd century A.D.')).toBe(250)
    expect(parseDateString('5th century')).toBe(450)
    expect(parseDateString('19th century')).toBe(1850)
  })

  it('parses BCE centuries with negative values', () => {
    expect(parseDateString('1st century B.C.')).toBe(-50)
    expect(parseDateString('3rd century BC')).toBe(-250)
    expect(parseDateString('5th century BCE')).toBe(-450)
  })

  it('handles early/mid/late century modifiers', () => {
    expect(parseDateString('early 19th century')).toBe(1810)
    expect(parseDateString('mid-15th century')).toBe(1450)
    expect(parseDateString('late 19th century')).toBe(1880)
  })

  it('extracts years from longer strings', () => {
    expect(parseDateString('1889 or later')).toBe(1889)
    expect(parseDateString('before 1500')).toBe(1500)
  })

  it('returns null for unparseable strings', () => {
    expect(parseDateString('n.d.')).toBeNull()
    expect(parseDateString('unknown')).toBeNull()
  })
})
