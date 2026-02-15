import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BlogDetail from './BlogDetail'

// Mock hooks
vi.mock('../../hooks', () => ({
  useBlog: vi.fn(),
  useComments: vi.fn(),
  useTrackView: vi.fn()
}))

// Mock child components
vi.mock('../../components/layout', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
  Footer: () => <footer data-testid="footer">Footer</footer>
}))

vi.mock('../../components/blog', () => ({
  BlogHeader: ({ blog }) => <div data-testid="blog-header">{blog.title}</div>,
  BlogContent: ({ content }) => <div data-testid="blog-content">{content}</div>,
  SocialShare: () => <div data-testid="social-share">Share</div>
}))

vi.mock('../../components/comment', () => ({
  CommentList: ({ comments }) => (
    <div data-testid="comment-list">{comments.length} comments</div>
  ),
  CommentForm: () => <div data-testid="comment-form">CommentForm</div>
}))

vi.mock('../../components/ui', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>
}))

vi.mock('../../assets/assets', () => ({
  assets: { gradientBackground: '/gradient.png' }
}))

import { useBlog, useComments, useTrackView } from '../../hooks'

const mockBlog = {
  _id: '123',
  title: 'Test Blog Post',
  subTitle: 'A subtitle',
  description: '<p>Blog content here</p>',
  category: 'Technology',
  image: '/uploads/test.jpg',
  authorName: 'Author'
}

const renderBlogDetail = (id = '123') =>
  render(
    <MemoryRouter initialEntries={[`/blog/${id}`]}>
      <Routes>
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
    </MemoryRouter>
  )

describe('BlogDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useTrackView.mockImplementation(() => {})
  })

  it('shows loader while blog is loading', () => {
    useBlog.mockReturnValue({ blog: null, loading: true })
    useComments.mockReturnValue({ comments: [], addComment: vi.fn() })

    renderBlogDetail()

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.queryByTestId('blog-header')).not.toBeInTheDocument()
  })

  it('renders blog content when loaded', () => {
    useBlog.mockReturnValue({ blog: mockBlog, loading: false })
    useComments.mockReturnValue({ comments: [], addComment: vi.fn() })

    renderBlogDetail()

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    expect(screen.getByTestId('blog-header')).toHaveTextContent('Test Blog Post')
    expect(screen.getByTestId('blog-content')).toBeInTheDocument()
    expect(screen.getByTestId('comment-list')).toBeInTheDocument()
    expect(screen.getByTestId('comment-form')).toBeInTheDocument()
    expect(screen.getByTestId('social-share')).toBeInTheDocument()
  })

  it('passes comments to CommentList', () => {
    const comments = [
      { _id: 'c1', name: 'User', content: 'Great!' },
      { _id: 'c2', name: 'User2', content: 'Nice!' }
    ]
    useBlog.mockReturnValue({ blog: mockBlog, loading: false })
    useComments.mockReturnValue({ comments, addComment: vi.fn() })

    renderBlogDetail()

    expect(screen.getByTestId('comment-list')).toHaveTextContent('2 comments')
  })

  it('tracks the view for the blog', () => {
    useBlog.mockReturnValue({ blog: mockBlog, loading: false })
    useComments.mockReturnValue({ comments: [], addComment: vi.fn() })

    renderBlogDetail('abc')

    expect(useTrackView).toHaveBeenCalledWith('abc')
  })
})
