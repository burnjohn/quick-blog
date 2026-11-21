import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MostRead from '.'

vi.mock('../../../hooks/api/queries', () => ({ usePopularBlogs: vi.fn() }))
import { usePopularBlogs } from '../../../hooks/api/queries'

const post = (n, views) => ({
  _id: `p${n}`,
  title: `Post ${n}`,
  category: 'Finance',
  excerpt: `Excerpt ${n}`,
  image: `/img-${n}.png`,
  views,
  comments: n * 10,
})

const renderMostRead = () => render(<MemoryRouter><MostRead /></MemoryRouter>)
const hookState = (overrides) => ({ blogs: [], range: null, loading: false, error: null, ...overrides })

describe('MostRead', () => {
  beforeEach(() => usePopularBlogs.mockReset())

  it('asks for six posts over 30 days', () => {
    usePopularBlogs.mockReturnValue(hookState({ loading: true }))
    renderMostRead()
    expect(usePopularBlogs).toHaveBeenCalledWith({ limit: 6, days: 30 })
  })

  it('shows a busy skeleton while loading', () => {
    usePopularBlogs.mockReturnValue(hookState({ loading: true }))
    renderMostRead()
    expect(screen.getByRole('region', { name: 'What everyone is reading' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders the feature and ranked rows with photos and stats', () => {
    usePopularBlogs.mockReturnValue(hookState({ blogs: [post(1, 100), post(2, 50), post(3, 1200)], range: 'all' }))
    renderMostRead()

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('href', '/blog/p1')
    expect(within(links[0]).getByAltText('Post 1')).toHaveAttribute('loading', 'lazy')
    expect(within(links[2]).getByText('1,200')).toBeInTheDocument()
    expect(within(links[1]).getByText('2')).toBeInTheDocument() // rank numeral
    expect(screen.getByRole('list')).toHaveAttribute('start', '2')
    expect(screen.getByText(/all time/i)).toBeInTheDocument()
  })

  it('shows an empty state when nothing has been read yet', () => {
    usePopularBlogs.mockReturnValue(hookState({ blogs: [] }))
    renderMostRead()
    expect(screen.getByText(/no reads counted yet/i)).toBeInTheDocument()
  })

  it('renders nothing on error', () => {
    usePopularBlogs.mockReturnValue(hookState({ error: 'boom' }))
    const { container } = renderMostRead()
    expect(container).toBeEmptyDOMElement()
  })
})
