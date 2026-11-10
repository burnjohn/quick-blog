import { describe, it, expect } from 'vitest'
import {
  parseDay, buildRange, previousRange, listBuckets, weekStart, bucketKey, splitRows, defaultRange, listDays
} from '../src/utils/analytics/dateRange.js'

describe('parseDay', () => {
  it('accepts valid days and rejects invalid ones', () => {
    expect(parseDay('2026-02-28').toISOString()).toBe('2026-02-28T00:00:00.000Z')
    expect(parseDay('2026-02-30')).toBeNull()
    expect(parseDay('2026-2-3')).toBeNull()
    expect(parseDay('nope')).toBeNull()
    expect(parseDay(undefined)).toBeNull()
  })
})

describe('ranges', () => {
  it('counts days inclusively and picks the bucket size', () => {
    expect(buildRange('2026-01-01', '2026-01-30')).toEqual({ from: '2026-01-01', to: '2026-01-30', days: 30, bucket: 'day' })
    expect(buildRange('2026-01-01', '2026-04-02').bucket).toBe('day') // 92 days
    expect(buildRange('2026-01-01', '2026-04-03').bucket).toBe('week') // 93 days
  })

  it('builds the previous period of equal length', () => {
    expect(previousRange(buildRange('2026-03-11', '2026-03-20'))).toMatchObject({ from: '2026-03-01', to: '2026-03-10', days: 10 })
  })

  it('builds a default range ending at the latest day', () => {
    expect(defaultRange('2026-11-10')).toMatchObject({ from: '2026-10-12', to: '2026-11-10', days: 30 })
  })
})

describe('bucketing', () => {
  it('uses Monday as week start (UTC)', () => {
    expect(weekStart('2026-11-10')).toBe('2026-11-09') // Tuesday
    expect(weekStart('2026-11-09')).toBe('2026-11-09')
    expect(weekStart('2026-11-15')).toBe('2026-11-09') // Sunday
    expect(bucketKey('2026-11-12', 'day')).toBe('2026-11-12')
  })

  it('lists day buckets and week buckets', () => {
    expect(listBuckets(buildRange('2026-11-01', '2026-11-03'))).toEqual(['2026-11-01', '2026-11-02', '2026-11-03'])
    const weeks = listBuckets({ ...buildRange('2026-01-01', '2026-06-30') })
    expect(weeks[0]).toBe('2025-12-29')
    expect(weeks.every(w => weekStart(w) === w)).toBe(true)
    expect(listDays(buildRange('2026-01-30', '2026-02-02'))).toEqual(['2026-01-30', '2026-01-31', '2026-02-01', '2026-02-02'])
  })
})

describe('splitRows', () => {
  it('splits rows into current and previous periods', () => {
    const range = buildRange('2026-03-11', '2026-03-12')
    const rows = ['2026-03-09', '2026-03-10', '2026-03-11', '2026-03-12', '2026-03-13'].map(d => ({ date: new Date(`${d}T00:00:00Z`) }))
    const { current, previous } = splitRows(rows, range, previousRange(range))
    expect(current).toHaveLength(2)
    expect(previous).toHaveLength(2)
  })
})
