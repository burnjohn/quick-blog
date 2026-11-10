import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { useAnalyticsFilters } from '.'

const BOUNDS = { min: '2025-11-11', max: '2026-11-10' }

const setup = (initial = '/admin/analytics') => {
  const wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>
  )
  return renderHook(
    () => ({ api: useAnalyticsFilters(BOUNDS), location: useLocation() }),
    { wrapper }
  )
}

describe('useAnalyticsFilters', () => {
  it('restores filters from the URL', () => {
    const { result } = setup('/admin/analytics?period=7d&tags=react&sort=likes&dir=asc&compare=0')
    const { filters } = result.current.api
    expect(filters).toMatchObject({
      period: '7d', tags: ['react'], sort: 'likes', dir: 'asc', compare: false,
    })
    expect(result.current.api.params).toEqual({ from: '2026-11-04', to: '2026-11-10', tags: 'react' })
  })

  it('keeps the query key when sort, post and compare change', () => {
    const { result } = setup()
    const key = result.current.api.queryKey

    act(() => result.current.api.setSort('likes', 'asc'))
    act(() => result.current.api.setPost('64b7f0c2a1b2c3d4e5f60718'))
    act(() => result.current.api.setCompare(false))

    expect(result.current.api.filters).toMatchObject({ sort: 'likes', post: '64b7f0c2a1b2c3d4e5f60718', compare: false })
    expect(result.current.api.queryKey).toBe(key)
  })

  it('changes the query key for period and filters and writes the URL', () => {
    const { result } = setup()
    const key = result.current.api.queryKey

    act(() => result.current.api.setPeriod('90d'))
    expect(result.current.location.search).toBe('?period=90d')
    expect(result.current.api.queryKey).not.toBe(key)

    const periodKey = result.current.api.queryKey
    act(() => result.current.api.setSources(['search', 'email']))
    expect(result.current.location.search).toContain('sources=search%2Cemail')
    expect(result.current.api.queryKey).not.toBe(periodKey)
  })

  it('sets a custom range', () => {
    const { result } = setup()
    act(() => result.current.api.setCustomRange('2026-01-01', '2026-01-31'))
    expect(result.current.api.params).toEqual({ from: '2026-01-01', to: '2026-01-31' })
  })

  it('resets filters but keeps the period', () => {
    const { result } = setup('/admin/analytics?period=7d&tags=a&authors=' + 'b'.repeat(24))
    act(() => result.current.api.resetFilters())
    expect(result.current.api.filters).toMatchObject({ period: '7d', tags: [], authors: [] })
    expect(result.current.api.hasActiveFilters).toBe(false)
  })

  it('removes post from the URL when closed', () => {
    const { result } = setup('/admin/analytics?post=64b7f0c2a1b2c3d4e5f60718')
    act(() => result.current.api.setPost(null))
    expect(result.current.location.search).toBe('')
  })
})
