/**
 * Parses display date strings from the Met API into approximate numeric years.
 * Used for display enrichment; for filtering, use objectBeginDate/objectEndDate.
 *
 * Handles patterns like:
 * - "1889" → 1889
 * - "ca. 1500" → 1500
 * - "1500-1510" or "1500–1510" → 1505
 * - "1st century B.C." → -50
 * - "3rd century A.D." → 250
 * - "mid-15th century" → 1450
 * - "early 19th century" → 1810
 * - "late 19th century" → 1880
 */

const ORDINAL_MAP: Record<string, number> = {
  '1st': 1,
  '2nd': 2,
  '3rd': 3,
  '4th': 4,
  '5th': 5,
  '6th': 6,
  '7th': 7,
  '8th': 8,
  '9th': 9,
  '10th': 10,
  '11th': 11,
  '12th': 12,
  '13th': 13,
  '14th': 14,
  '15th': 15,
  '16th': 16,
  '17th': 17,
  '18th': 18,
  '19th': 19,
  '20th': 20,
  '21st': 21,
}

export function parseDateString(dateStr: string): number | null {
  if (!dateStr || !dateStr.trim()) return null

  const cleaned = dateStr.trim().toLowerCase()

  // "1st century B.C." or "3rd century A.D." with optional early/mid/late
  const centuryMatch = cleaned.match(
    /(?:(early|mid|late)[- ])?(\d+(?:st|nd|rd|th))\s+century\s*(b\.?c\.?e?\.?|a\.?d\.?|c\.?e\.?)?/i,
  )
  if (centuryMatch) {
    const modifier = centuryMatch[1]
    const ordinal = centuryMatch[2]
    const era = centuryMatch[3] || ''

    const centuryNum = ORDINAL_MAP[ordinal]
    if (centuryNum === undefined) return null

    // Century N means years (N-1)*100 to N*100
    const baseYear = (centuryNum - 1) * 100

    let midpoint: number
    if (modifier === 'early') {
      midpoint = baseYear + 10
    } else if (modifier === 'late') {
      midpoint = baseYear + 80
    } else if (modifier === 'mid') {
      midpoint = baseYear + 50
    } else {
      midpoint = baseYear + 50
    }

    const isBce = /b\.?c|bce/i.test(era)
    return isBce ? -midpoint : midpoint
  }

  // "mid-15th century" pattern (numeric ordinal)
  const midCenturyMatch = cleaned.match(/(?:(early|mid|late)[- ])?(\d+)(?:st|nd|rd|th)\s+century/i)
  if (midCenturyMatch) {
    const modifier = midCenturyMatch[1]
    const centuryNum = parseInt(midCenturyMatch[2], 10)
    const baseYear = (centuryNum - 1) * 100

    if (modifier === 'early') return baseYear + 10
    if (modifier === 'late') return baseYear + 80
    if (modifier === 'mid') return baseYear + 50
    return baseYear + 50
  }

  // Range: "1500-1510" or "1500–1510" or "1500 - 1510"
  const rangeMatch = cleaned.match(/(-?\d{1,4})\s*[–—-]\s*(-?\d{1,4})/)
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10)
    const end = parseInt(rangeMatch[2], 10)
    return Math.round((start + end) / 2)
  }

  // "ca. 1500" or "c. 1500" or "circa 1500" or "about 1500"
  const approxMatch = cleaned.match(/(?:ca\.?|c\.|circa|about|approx\.?)\s*(-?\d{1,4})/)
  if (approxMatch) {
    return parseInt(approxMatch[1], 10)
  }

  // Plain year: "1889" or "-500"
  const plainMatch = cleaned.match(/^-?\d{1,4}$/)
  if (plainMatch) {
    return parseInt(cleaned, 10)
  }

  // Year at the start or end: "1889 or later", "before 1500"
  const yearInStr = cleaned.match(/(-?\d{3,4})/)
  if (yearInStr) {
    return parseInt(yearInStr[1], 10)
  }

  return null
}
