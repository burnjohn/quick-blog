import { describe, it, expect } from 'vitest'
import { escapeCsvField, buildCsv, exportFilename, CSV_HEADER } from '../src/utils/analytics/csv.js'

const post = (overrides = {}) => ({
  title: 'Plain', category: 'Technology', tags: ['a', 'b'], author: { id: '1', name: 'Ann' }, publishedAt: '2026-01-01',
  views: 10, uniqueVisitors: 8, avgReadTimeSec: 120.5, avgScrollDepth: 60, likes: 1, comments: 2, shares: 3,
  subscriptions: 0, engagementRate: 60, ...overrides
})

describe('escapeCsvField', () => {
  it('leaves plain values and escapes special ones per RFC 4180', () => {
    expect(escapeCsvField('plain')).toBe('plain')
    expect(escapeCsvField(5)).toBe('5')
    expect(escapeCsvField(null)).toBe('')
    expect(escapeCsvField('a,b')).toBe('"a,b"')
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""')
    expect(escapeCsvField('line1\nline2')).toBe('"line1\nline2"')
    expect(escapeCsvField('a\r\nb')).toBe('"a\r\nb"')
  })
})

describe('buildCsv', () => {
  it('has a header and one CRLF-separated row per post', () => {
    const lines = buildCsv([post(), post({ title: 'Hello, "World"' })]).split('\r\n')
    expect(lines).toHaveLength(3)
    expect(lines[0]).toBe(CSV_HEADER.join(','))
    expect(lines[1]).toBe('Plain,Technology,a; b,Ann,2026-01-01,10,8,120.5,60,1,2,3,0,60')
    expect(lines[2].startsWith('"Hello, ""World""",')).toBe(true)
  })

  it('returns only the header for no posts', () => {
    expect(buildCsv([])).toBe(CSV_HEADER.join(','))
  })

  it('names the file with the range', () => {
    expect(exportFilename('2026-01-01', '2026-01-31')).toBe('analytics-2026-01-01-2026-01-31.csv')
  })
})
