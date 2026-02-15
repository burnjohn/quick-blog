import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from './Dashboard'

vi.mock('../../hooks', () => ({
  useAdminDashboard: vi.fn()
}))

vi.mock('../../components/ui', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>
}))

vi.mock('../../components/admin', () => ({
  BlogTableItem: ({ blog, index }) => (
    <tr data-testid="blog-table-item">
      <td>{index}</td>
      <td>{blog.title}</td>
    </tr>
  )
}))

vi.mock('../../assets/assets', () => ({
  assets: {
    dashboard_icon_1: '/icon1.png',
    dashboard_icon_2: '/icon2.png',
    dashboard_icon_3: '/icon3.png',
    dashboard_icon_4: '/icon4.png'
  }
}))

import { useAdminDashboard } from '../../hooks'

const mockDashboardData = {
  blogs: 12,
  comments: 45,
  drafts: 3,
  recentBlogs: [
    { _id: '1', title: 'First Blog', createdAt: '2026-01-01', isPublished: true },
    { _id: '2', title: 'Second Blog', createdAt: '2026-01-02', isPublished: false }
  ]
}

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loader while loading', () => {
    useAdminDashboard.mockReturnValue({
      dashboardData: { blogs: 0, comments: 0, drafts: 0, recentBlogs: [] },
      loading: true,
      refetch: vi.fn()
    })

    renderDashboard()

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('displays stats cards with correct counts', () => {
    useAdminDashboard.mockReturnValue({
      dashboardData: mockDashboardData,
      loading: false,
      refetch: vi.fn()
    })

    renderDashboard()

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Blogs')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('Comments')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Drafts')).toBeInTheDocument()
  })

  it('renders the latest blogs heading', () => {
    useAdminDashboard.mockReturnValue({
      dashboardData: mockDashboardData,
      loading: false,
      refetch: vi.fn()
    })

    renderDashboard()

    expect(screen.getByText('Latest Blogs')).toBeInTheDocument()
  })

  it('renders blog table items when blogs exist', () => {
    useAdminDashboard.mockReturnValue({
      dashboardData: mockDashboardData,
      loading: false,
      refetch: vi.fn()
    })

    renderDashboard()

    const items = screen.getAllByTestId('blog-table-item')
    expect(items).toHaveLength(2)
  })

  it('shows empty state when no blogs exist', () => {
    useAdminDashboard.mockReturnValue({
      dashboardData: { blogs: 0, comments: 0, drafts: 0, recentBlogs: [] },
      loading: false,
      refetch: vi.fn()
    })

    renderDashboard()

    expect(screen.getByText('No blogs found')).toBeInTheDocument()
  })
})
