import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BlogDetail from '.'

vi.mock('../../../assets/assets', () => ({
  assets: {},
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

const relatedBlog = {
  _id: '2',
  title: 'Related Tech Story',
  category: 'Technology',
  description: '<p>More tech</p>',
  image: '/related.jpg',
  createdAt: '2026-02-01T00:00:00Z',
}

vi.mock('../../../context/AppContext', () => ({
  useAppContext: () => ({ blogs: [mockBlog, relatedBlog] }),
}))

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

  it('suggests related posts but never the current one', () => {
    mockUseBlog.mockReturnValue({ blog: mockBlog, loading: false })
    mockUseComments.mockReturnValue({ comments: [], addComment: vi.fn() })

    renderBlogDetail()

    expect(screen.getByRole('heading', { name: 'Read next' })).toBeInTheDocument()
    expect(screen.getByText('Related Tech Story')).toBeInTheDocument()
    expect(screen.getAllByText('Test Blog Title')).toHaveLength(1)
  })

  it('builds in-article contents from h2 headings', () => {
    const withSections = { ...mockBlog, description: '<h2>First part</h2><p>a</p><h2>Second part</h2><p>b</p>' }
    mockUseBlog.mockReturnValue({ blog: withSections, loading: false })
    mockUseComments.mockReturnValue({ comments: [], addComment: vi.fn() })

    renderBlogDetail()

    const contents = screen.getByRole('navigation', { name: /in this story/i })
    const link = within(contents).getByRole('link', { name: /second part/i })
    expect(link).toHaveAttribute('href', '#section-second-part')
    expect(document.getElementById('section-second-part')).toHaveTextContent('Second part')
  })

  it('shows a not-found page instead of spinning forever when the blog fails to load', () => {
    mockUseBlog.mockReturnValue({ blog: null, loading: false, error: 'Blog not found' })
    mockUseComments.mockReturnValue({ comments: [], addComment: vi.fn() })

    renderBlogDetail()

    expect(document.querySelector('.animate-spin')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /isn’t on the press/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to the front page/i })).toHaveAttribute('href', '/')
  })
})
