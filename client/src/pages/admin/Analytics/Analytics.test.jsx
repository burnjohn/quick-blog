import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import Analytics from './Analytics'
import { analyticsApi } from '../../../api/analyticsApi'
import { downloadFile } from '../../../utils/downloadFile'

const mocks = vi.hoisted(() => ({
  meta: vi.fn(),
  overview: vi.fn(),
  post: vi.fn(),
}))

vi.mock('../../../hooks/api/queries/useAnalyticsPost', () => ({ useAnalyticsPost: mocks.post }))
vi.mock('../../../api/analyticsApi', () => ({ analyticsApi: { exportCsv: vi.fn() } }))
vi.mock('../../../utils/downloadFile', async (importOriginal) => ({
  ...(await importOriginal()),
  downloadFile: vi.fn(),
}))
vi.mock('react-hot-toast', () => ({ default: { error: vi.fn() } }))

vi.mock('../../../hooks/api/queries', () => ({
  useAnalyticsMeta: mocks.meta,
  useAnalyticsOverview: mocks.overview,
}))

const META = {
  tags: ['react', 'node'], categories: [],
  authors: [{ id: 'a1', name: 'Sarah' }], sources: ['search', 'direct'],
  dateBounds: { min: '2025-11-11', max: '2026-11-10' },
}

const overviewWith = (views) => ({
  range: { from: '2026-10-12', to: '2026-11-10', days: 30, bucket: 'day' },
  kpis: [{ key: 'views', value: views, previous: 0, delta: { direction: 'flat', percent: 0 }, sparkline: [] }],
})

const FULL = {
  ...overviewWith(100),
  series: [{ date: '2026-10-12', views: 5, uniqueVisitors: 3, previousViews: 4, previousUniqueVisitors: 2 }],
  sources: [{ key: 'search', views: 60, share: 0.6 }, { key: 'direct', views: 40, share: 0.4 }],
  devices: [{ key: 'mobile', views: 70, share: 0.7 }, { key: 'desktop', views: 30, share: 0.3 }],
  countries: [{ code: 'US', views: 50, share: 0.5 }],
  tags: [{ key: 'react', views: 50, posts: 2 }, { key: 'node', views: 20, posts: 1 }],
  heatmap: { max: 3, cells: Array.from({ length: 7 }, () => Array(24).fill(1)) },
  funnel: [
    { key: 'views', label: 'Views', value: 100 },
    { key: 'engagedReads', label: 'Engaged reads', value: 50 },
  ],
  posts: [{
    id: 'p1', title: 'Hello World', category: 'Tech', tags: ['react'], author: { id: 'a1', name: 'Sarah' },
    publishedAt: '2026-03-01', views: 100, uniqueVisitors: 80, avgReadTimeSec: 60, avgScrollDepth: 50,
    likes: 1, comments: 1, shares: 1, subscriptions: 1, engagementRate: 3,
  }],
}

function LocationProbe() {
  const { search } = useLocation()
  return <output data-testid='search'>{search}</output>
}

const renderPage = (url = '/admin/analytics') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Analytics />
      <LocationProbe />
    </MemoryRouter>
  )

const state = (overrides = {}) => ({
  overview: null, loading: false, error: null, refetch: vi.fn(), ...overrides,
})

const POST_ID = '64b7f0c2a1b2c3d4e5f60718'

describe('Analytics page', () => {
  beforeEach(() => {
    mocks.meta.mockReturnValue({ meta: META, loading: false, error: null, refetch: vi.fn() })
    mocks.overview.mockReturnValue(state({ loading: true }))
    mocks.post.mockReturnValue({ post: null, loading: true, error: null, notFound: false, refetch: vi.fn() })
    analyticsApi.exportCsv.mockReset()
    downloadFile.mockReset()
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
    await userEvent.click(screen.getAllByRole('button', { name: /reset filters/i }).at(-1))
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

  it('keeps the filter bar visible in the empty state', () => {
    mocks.overview.mockReturnValue(state({ overview: overviewWith(0) }))
    renderPage()
    expect(screen.getByRole('search', { name: /analytics filters/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /no data for the selected filters/i })).toBeInTheDocument()
  })

  describe('with data', () => {
    beforeEach(() => mocks.overview.mockReturnValue(state({ overview: FULL })))

    it('renders all widgets', () => {
      renderPage()
      ;['Traffic trend', 'Views by tag', 'Traffic sources', 'Devices', 'Engagement funnel',
        'Top countries', 'Activity by hour', 'Top posts'].forEach((title) => {
        expect(screen.getAllByText(title).length).toBeGreaterThan(0)
      })
      expect(screen.getByRole('heading', { name: 'Top posts' })).toHaveAttribute('id', 'top-posts-heading')
      expect(screen.getByRole('button', { name: 'Hello World' })).toBeInTheDocument()
    })

    it('restores controls from the URL', () => {
      renderPage('/admin/analytics?period=90d&compare=0&tags=react,node')
      expect(screen.getByRole('button', { name: '90D' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('switch', { name: /compare to previous/i })).toHaveAttribute('aria-checked', 'false')
      expect(screen.getByRole('button', { name: /tags/i })).toHaveTextContent('2')
      const [params, key] = mocks.overview.mock.calls.at(-1)
      expect(params.tags).toBe('react,node')
      expect(key).toContain('react,node')
    })

    it('updates the URL and query key when a preset is clicked', async () => {
      renderPage()
      await userEvent.click(screen.getByRole('button', { name: '7D' }))
      expect(screen.getByTestId('search')).toHaveTextContent('period=7d')
      const [params, key] = mocks.overview.mock.calls.at(-1)
      expect(params.from).toBe('2026-11-04')
      expect(key).toContain('2026-11-04')
    })

    it('adds a tag to the URL from the tag chart actions', async () => {
      renderPage()
      const group = screen.getByRole('group', { name: /filter by tag/i })
      await userEvent.click(within(group).getByRole('button', { name: /^react/ }))
      expect(screen.getByTestId('search')).toHaveTextContent('tags=react')
    })

    it('toggles a source from the sources donut', async () => {
      renderPage('/admin/analytics?sources=search')
      const group = screen.getByRole('group', { name: /filter by traffic sources/i })
      await userEvent.click(within(group).getByRole('button', { name: /^Search/ }))
      expect(screen.getByTestId('search')).not.toHaveTextContent('sources=')
    })

    it('opens the post dialog from the post param', () => {
      mocks.post.mockReturnValue({
        post: {
          id: POST_ID, title: 'Deep Dive', category: 'Tech', tags: [], author: { id: 'a1', name: 'Sarah' },
          publishedAt: '2026-03-01', kpis: [], series: [], sources: [], devices: [],
        },
        loading: false, error: null, notFound: false, refetch: vi.fn(),
      })
      renderPage(`/admin/analytics?post=${POST_ID}`)
      expect(mocks.post).toHaveBeenCalledWith(POST_ID, expect.any(Object))
      expect(screen.getByRole('heading', { name: 'Deep Dive' })).toBeInTheDocument()
    })

    it('exports CSV with the current params', async () => {
      analyticsApi.exportCsv.mockResolvedValue({
        data: new Blob(['a']),
        headers: { 'content-disposition': 'attachment; filename="analytics-x.csv"' },
      })
      renderPage()
      const [params] = mocks.overview.mock.calls.at(-1)
      await userEvent.click(screen.getByRole('button', { name: /export csv/i }))
      expect(analyticsApi.exportCsv).toHaveBeenCalledWith(params)
      expect(downloadFile).toHaveBeenCalledWith(expect.any(Blob), 'analytics-x.csv')
    })

    it('shows an error toast when export fails', async () => {
      const toast = (await import('react-hot-toast')).default
      analyticsApi.exportCsv.mockRejectedValue(new Error('x'))
      renderPage()
      await userEvent.click(screen.getByRole('button', { name: /export csv/i }))
      expect(toast.error).toHaveBeenCalledWith('Failed to export CSV.')
    })
  })
})
