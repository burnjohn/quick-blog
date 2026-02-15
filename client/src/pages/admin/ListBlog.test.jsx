import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ListBlog from './ListBlog'

vi.mock('../../hooks', () => ({
  useAdminBlogs: vi.fn()
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

import { useAdminBlogs } from '../../hooks'

const mockBlogs = [
  { _id: '1', title: 'Blog One', createdAt: '2026-01-01', isPublished: true },
  { _id: '2', title: 'Blog Two', createdAt: '2026-01-02', isPublished: false },
  { _id: '3', title: 'Blog Three', createdAt: '2026-01-03', isPublished: true }
]

const renderListBlog = () =>
  render(
    <MemoryRouter>
      <ListBlog />
    </MemoryRouter>
  )

describe('ListBlog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loader while loading', () => {
    useAdminBlogs.mockReturnValue({ blogs: [], loading: true, refetch: vi.fn() })

    renderListBlog()

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('renders the page heading', () => {
    useAdminBlogs.mockReturnValue({ blogs: mockBlogs, loading: false, refetch: vi.fn() })

    renderListBlog()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('All Blogs')
  })

  it('renders all blog table items', () => {
    useAdminBlogs.mockReturnValue({ blogs: mockBlogs, loading: false, refetch: vi.fn() })

    renderListBlog()

    const items = screen.getAllByTestId('blog-table-item')
    expect(items).toHaveLength(3)
  })

  it('shows empty state when no blogs exist', () => {
    useAdminBlogs.mockReturnValue({ blogs: [], loading: false, refetch: vi.fn() })

    renderListBlog()

    expect(screen.getByText('No blogs found')).toBeInTheDocument()
    expect(screen.queryByTestId('blog-table-item')).not.toBeInTheDocument()
  })
})
