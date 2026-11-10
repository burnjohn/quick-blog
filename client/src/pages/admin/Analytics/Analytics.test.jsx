import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Analytics from './Analytics'

const mocks = vi.hoisted(() => ({
  meta: vi.fn(),
  overview: vi.fn(),
}))

vi.mock('../../../hooks/api/queries', () => ({
  useAnalyticsMeta: mocks.meta,
  useAnalyticsOverview: mocks.overview,
}))

const META = {
  tags: [], categories: [], authors: [], sources: [],
  dateBounds: { min: '2025-11-11', max: '2026-11-10' },
}

const overviewWith = (views) => ({
  range: { from: '2026-10-12', to: '2026-11-10', days: 30, bucket: 'day' },
  kpis: [{ key: 'views', value: views, previous: 0, delta: { direction: 'flat', percent: 0 }, sparkline: [] }],
})

const renderPage = (url = '/admin/analytics') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Analytics />
    </MemoryRouter>
  )

const state = (overrides = {}) => ({
  overview: null, loading: false, error: null, refetch: vi.fn(), ...overrides,
})

describe('Analytics page', () => {
  beforeEach(() => {
    mocks.meta.mockReturnValue({ meta: META, loading: false, error: null, refetch: vi.fn() })
    mocks.overview.mockReturnValue(state({ loading: true }))
  })

  it('shows the skeleton on first load', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: /loading analytics/i })).toBeInTheDocument()
  })

  it('shows the empty state with a reset action', async () => {
    mocks.overview.mockReturnValue(state({ overview: overviewWith(0) }))
    renderPage('/admin/analytics?tags=react')
    expect(screen.getByRole('heading', { name: /no data for the selected filters/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /reset filters/i }))
    expect(screen.getByRole('button', { name: /reset period/i })).toBeInTheDocument()
  })

  it('shows the error state and retries', async () => {
    const refetch = vi.fn()
    mocks.overview.mockReturnValue(state({ error: 'Boom', refetch }))
    renderPage()
    expect(screen.getByRole('alert')).toHaveTextContent('Boom')
    await userEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(refetch).toHaveBeenCalledTimes(1)
  })

  it('keeps data and marks busy on refetch', () => {
    mocks.overview.mockReturnValue(state({ overview: overviewWith(10), loading: true }))
    const { container } = renderPage()
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: /loading analytics/i })).not.toBeInTheDocument()
    expect(screen.getByText(/Oct 12, 2026/)).toBeInTheDocument()
  })
})
