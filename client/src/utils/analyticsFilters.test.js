import { describe, it, expect } from 'vitest'
import {
  DEFAULT_FILTERS,
  parseFilters,
  serializeFilters,
  toQueryParams,
  toQueryKey,
} from './analyticsFilters'

const parse = (qs) => parseFilters(new URLSearchParams(qs))
const AUTHOR = 'a'.repeat(24)
const BOUNDS = { min: '2025-11-11', max: '2026-11-10' }

describe('parseFilters', () => {
  it('returns defaults for empty params', () => {
    expect(parse('')).toEqual(DEFAULT_FILTERS)
  })

  it('parses presets', () => {
    expect(parse('period=90d').period).toBe('90d')
    expect(parse('period=all').period).toBe('all')
  })

  it('parses a custom range', () => {
    const f = parse('period=custom&from=2026-01-01&to=2026-02-01')
    expect(f).toMatchObject({ period: 'custom', from: '2026-01-01', to: '2026-02-01' })
  })

  it('falls back to default for invalid period or range', () => {
    expect(parse('period=bogus').period).toBe('30d')
    expect(parse('period=custom&from=2026-02-01&to=2026-01-01').period).toBe('30d')
    expect(parse('period=custom&from=2026-13-01&to=2026-14-01').period).toBe('30d')
    expect(parse('period=custom&from=2026-01-01').period).toBe('30d')
  })

  it('parses multi-select lists and drops invalid values', () => {
    const f = parse(`tags=react,css,react&authors=${AUTHOR},nope&sources=search,fax,email`)
    expect(f.tags).toEqual(['react', 'css'])
    expect(f.authors).toEqual([AUTHOR])
    expect(f.sources).toEqual(['search', 'email'])
  })

  it('parses sort, dir, compare and post', () => {
    const f = parse('sort=likes&dir=asc&compare=0&post=abc123')
    expect(f).toMatchObject({ sort: 'likes', dir: 'asc', compare: false, post: 'abc123' })
  })

  it('ignores invalid sort, dir and post', () => {
    const f = parse('sort=hack&dir=up&post=a/b')
    expect(f).toMatchObject({ sort: 'views', dir: 'desc', post: null })
  })
})

describe('serializeFilters', () => {
  it('writes nothing for defaults', () => {
    expect(serializeFilters(DEFAULT_FILTERS).toString()).toBe('')
  })

  it('round-trips a full state', () => {
    const state = {
      period: 'custom', from: '2026-01-01', to: '2026-02-01', compare: false,
      tags: ['react', 'css'], authors: [AUTHOR], sources: ['search'],
      sort: 'title', dir: 'asc', post: 'abc',
    }
    expect(parseFilters(serializeFilters(state))).toEqual(state)
  })

  it('omits from/to for presets', () => {
    const qs = serializeFilters({ ...DEFAULT_FILTERS, period: '7d', from: '2026-01-01', to: '2026-01-07' })
    expect(qs.toString()).toBe('period=7d')
  })
})

describe('toQueryParams', () => {
  it('resolves presets against the latest data day', () => {
    expect(toQueryParams({ ...DEFAULT_FILTERS, period: '7d' }, BOUNDS))
      .toEqual({ from: '2026-11-04', to: '2026-11-10' })
    expect(toQueryParams(DEFAULT_FILTERS, BOUNDS))
      .toEqual({ from: '2026-10-12', to: '2026-11-10' })
    expect(toQueryParams({ ...DEFAULT_FILTERS, period: '1y' }, BOUNDS))
      .toEqual({ from: '2025-11-11', to: '2026-11-10' })
  })

  it('uses data bounds for All', () => {
    expect(toQueryParams({ ...DEFAULT_FILTERS, period: 'all' }, BOUNDS))
      .toEqual({ from: BOUNDS.min, to: BOUNDS.max })
  })

  it('passes custom ranges and joins filters', () => {
    const params = toQueryParams({
      ...DEFAULT_FILTERS, period: 'custom', from: '2026-01-01', to: '2026-01-31',
      tags: ['a', 'b'], sources: ['search'],
    }, BOUNDS)
    expect(params).toEqual({ from: '2026-01-01', to: '2026-01-31', tags: 'a,b', sources: 'search' })
  })
})

describe('toQueryKey', () => {
  it('only depends on range and filters', () => {
    const base = toQueryParams(DEFAULT_FILTERS, BOUNDS)
    const same = toQueryParams({ ...DEFAULT_FILTERS, sort: 'likes', dir: 'asc', post: 'x', compare: false }, BOUNDS)
    expect(toQueryKey(same)).toBe(toQueryKey(base))
    expect(toQueryKey(toQueryParams({ ...DEFAULT_FILTERS, tags: ['a'] }, BOUNDS))).not.toBe(toQueryKey(base))
  })
})
