import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { formatDate } from '../../utils/formatters'
import BlogHeader from './BlogHeader'

vi.mock('../../utils/formatters', () => ({
  formatDate: vi.fn((date) => `Formatted: ${date}`)
}))

describe('BlogHeader', () => {
  const defaultBlog = {
    title: 'My First Post',
    createdAt: '2025-01-15T10:00:00.000Z',
    subTitle: null
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders blog title as h1 heading', () => {
    render(<BlogHeader blog={defaultBlog} />)

    const heading = screen.getByRole('heading', { level: 1, name: 'My First Post' })
    expect(heading).toBeInTheDocument()
  })

  it('renders formatted publish date', () => {
    render(<BlogHeader blog={defaultBlog} />)

    expect(formatDate).toHaveBeenCalledWith(defaultBlog.createdAt)
    expect(screen.getByText(/Published on Formatted: 2025-01-15T10:00:00.000Z/)).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    const blogWithSubtitle = { ...defaultBlog, subTitle: 'A catchy tagline' }
    render(<BlogHeader blog={blogWithSubtitle} />)

    expect(screen.getByRole('heading', { level: 2, name: 'A catchy tagline' })).toBeInTheDocument()
  })

  it('does not render subtitle when blog.subTitle is falsy', () => {
    render(<BlogHeader blog={defaultBlog} />)

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })

  it('renders default author name "Michael Brown" in badge', () => {
    render(<BlogHeader blog={defaultBlog} />)

    expect(screen.getByText('Michael Brown')).toBeInTheDocument()
  })

  it('renders custom author name when passed', () => {
    render(<BlogHeader blog={defaultBlog} author="Jane Doe" />)

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.queryByText('Michael Brown')).not.toBeInTheDocument()
  })
})
