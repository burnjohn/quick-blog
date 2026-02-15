import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Analytics from './Analytics'

// Mock all hooks used by Analytics
vi.mock('../../hooks', () => ({
  useAnalyticsFilters: vi.fn(),
  useAnalyticsSummary: vi.fn(),
  useViewsOverTime: vi.fn(),
  usePublicationsOverTime: vi.fn(),
  useCategoryDistribution: vi.fn(),
  useCommentActivity: vi.fn(),
  useViewsByCategory: vi.fn(),
  useTopPosts: vi.fn(),
  useRecentComments: vi.fn(),
  useExportCsv: vi.fn()
}))

// Mock all analytics chart/table components
vi.mock('../../components/admin/analytics', () => ({
  FilterBar: ({ onExport, isExporting }) => (
    <div data-testid="filter-bar">
      <button onClick={onExport} disabled={isExporting}>
        {isExporting ? 'Exporting...' : 'Export'}
      </button>
    </div>
  ),
  KpiCards: ({ loading, error }) => (
    <div data-testid="kpi-cards">
      {loading && <span>Loading KPIs...</span>}
      {error && <span>KPI Error</span>}
      {!loading && !error && <span>KPI Data</span>}
    </div>
  ),
  ViewsOverTimeChart: ({ loading }) => (
    <div data-testid="views-chart">{loading ? 'Loading...' : 'Views Chart'}</div>
  ),
  PublicationsChart: ({ loading }) => (
    <div data-testid="publications-chart">{loading ? 'Loading...' : 'Publications Chart'}</div>
  ),
  CategoryDonutChart: ({ onCategoryClick }) => (
    <div data-testid="category-donut" onClick={() => onCategoryClick('Technology')}>
      Category Donut
    </div>
  ),
  CommentActivityChart: () => <div data-testid="comment-activity">Comment Activity</div>,
  ViewsByCategoryChart: () => <div data-testid="views-by-category">Views by Category</div>,
  TopPostsTable: () => <div data-testid="top-posts">Top Posts</div>,
  RecentCommentsList: () => <div data-testid="recent-comments">Recent Comments</div>
}))

import {
  useAnalyticsFilters,
  useAnalyticsSummary,
  useViewsOverTime,
  usePublicationsOverTime,
  useCategoryDistribution,
  useCommentActivity,
  useViewsByCategory,
  useTopPosts,
  useRecentComments,
  useExportCsv
} from '../../hooks'

const defaultHookReturn = { data: [], loading: false, error: null, refetch: vi.fn() }

const mockFilters = {
  period: '30d',
  setPeriod: vi.fn(),
  customStartDate: '',
  customEndDate: '',
  setCustomDateRange: vi.fn(),
  category: 'All',
  setCategory: vi.fn(),
  filterParams: {}
}

const setupMocks = (overrides = {}) => {
  useAnalyticsFilters.mockReturnValue({ ...mockFilters, ...overrides.filters })
  useAnalyticsSummary.mockReturnValue({
    summary: {},
    loading: false,
    error: null,
    refetch: vi.fn(),
    ...overrides.summary
  })
  useViewsOverTime.mockReturnValue({ ...defaultHookReturn, ...overrides.viewsOverTime })
  usePublicationsOverTime.mockReturnValue({ ...defaultHookReturn, ...overrides.publications })
  useCategoryDistribution.mockReturnValue({ ...defaultHookReturn, ...overrides.categoryDist })
  useCommentActivity.mockReturnValue({ ...defaultHookReturn, ...overrides.commentActivity })
  useViewsByCategory.mockReturnValue({ ...defaultHookReturn, ...overrides.viewsByCategory })
  useTopPosts.mockReturnValue({
    topByViews: [],
    topByComments: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
    ...overrides.topPosts
  })
  useRecentComments.mockReturnValue({
    comments: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
    ...overrides.recentComments
  })
  useExportCsv.mockReturnValue({
    exportCsv: vi.fn(),
    isExporting: false,
    ...overrides.exportCsv
  })
}

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page heading', () => {
    setupMocks()
    render(<Analytics />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Analytics')
  })

  it('renders all dashboard sections', () => {
    setupMocks()
    render(<Analytics />)

    expect(screen.getByTestId('filter-bar')).toBeInTheDocument()
    expect(screen.getByTestId('kpi-cards')).toBeInTheDocument()
    expect(screen.getByTestId('views-chart')).toBeInTheDocument()
    expect(screen.getByTestId('publications-chart')).toBeInTheDocument()
    expect(screen.getByTestId('category-donut')).toBeInTheDocument()
    expect(screen.getByTestId('comment-activity')).toBeInTheDocument()
    expect(screen.getByTestId('views-by-category')).toBeInTheDocument()
    expect(screen.getByTestId('top-posts')).toBeInTheDocument()
    expect(screen.getByTestId('recent-comments')).toBeInTheDocument()
  })

  it('shows loading state in KPI cards', () => {
    setupMocks({ summary: { loading: true } })
    render(<Analytics />)

    expect(screen.getByText('Loading KPIs...')).toBeInTheDocument()
  })

  it('shows error state in KPI cards', () => {
    setupMocks({ summary: { error: 'Failed to load' } })
    render(<Analytics />)

    expect(screen.getByText('KPI Error')).toBeInTheDocument()
  })

  it('calls exportCsv with filter params on export click', async () => {
    const exportCsv = vi.fn()
    const filterParams = { startDate: '2026-01-01', endDate: '2026-02-01' }
    setupMocks({
      filters: { filterParams },
      exportCsv: { exportCsv }
    })

    const user = userEvent.setup()
    render(<Analytics />)

    await user.click(screen.getByRole('button', { name: /export/i }))

    expect(exportCsv).toHaveBeenCalledWith(filterParams)
  })

  it('sets category filter when a donut slice is clicked', async () => {
    const setCategory = vi.fn()
    setupMocks({ filters: { setCategory } })

    const user = userEvent.setup()
    render(<Analytics />)

    await user.click(screen.getByTestId('category-donut'))

    expect(setCategory).toHaveBeenCalledWith('Technology')
  })
})
