import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BlogDetail from '.'

vi.mock('../../../assets/assets', () => ({
  assets: { gradientBackground: '/gradient.png' },
}))

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

// Mock the layout components that depend on AppContext
vi.mock('../../../components/layout', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))

const mockBlog = {
  _id: '1',
  title: 'Test Blog Title',
  subTitle: 'Test Subtitle',
  category: 'Technology',
  description: '<p>Blog content here</p>',
  image: '/test-image.jpg',
  createdAt: '2026-03-01T00:00:00Z',
  isPublished: true,
}

const mockComments = [
  { _id: 'c1', name: 'Alice', content: 'Great post!', createdAt: '2026-03-15T10:00:00Z', isApproved: true },
]

const mockUseBlog = vi.fn()
const mockUseComments = vi.fn()

vi.mock('../../../hooks', () => ({
  useBlog: (...args) => mockUseBlog(...args),
  useComments: (...args) => mockUseComments(...args),
}))

const renderBlogDetail = () =>
  render(
    <MemoryRouter initialEntries={['/blog/1']}>
      <Routes>
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
    </MemoryRouter>
  )

describe('BlogDetail', () => {
  it('shows loader while fetching', () => {
    mockUseBlog.mockReturnValue({ blog: null, loading: true })
    mockUseComments.mockReturnValue({ comments: [], addComment: vi.fn() })

    renderBlogDetail()

    // When loading, Loader is shown (a spinning div), not the blog content
    expect(screen.queryByText('Test Blog Title')).not.toBeInTheDocument()
    // The Loader renders a div with animate-spin class
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('loads and displays blog with comments', () => {
    mockUseBlog.mockReturnValue({ blog: mockBlog, loading: false })
    mockUseComments.mockReturnValue({ comments: mockComments, addComment: vi.fn() })

    renderBlogDetail()

    expect(screen.getByText('Test Blog Title')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Great post!')).toBeInTheDocument()
  })
})
