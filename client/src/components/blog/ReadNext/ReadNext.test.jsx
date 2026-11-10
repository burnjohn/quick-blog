import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ReadNext from '.'

vi.mock('../../../hooks', () => ({
  useRelatedBlogs: vi.fn(),
}))

// Reduced motion makes slides jump instantly, so button effects are synchronous
vi.mock('motion/react', async () => {
  const actual = await vi.importActual('motion/react')
  return { ...actual, useReducedMotion: () => true }
})

import { useRelatedBlogs } from '../../../hooks'

const makeBlogs = (count) =>
  Array.from({ length: count }, (_, i) => ({
    _id: `id-${i}`,
    title: `Post ${i}`,
    category: 'Technology',
    image: `/img-${i}.jpg`,
  }))

const renderReadNext = () =>
  render(
    <MemoryRouter>
      <ReadNext blogId='current' />
    </MemoryRouter>
  )

// jsdom has no IntersectionObserver; motion's whileInView needs one
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('ReadNext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows skeleton cards while loading', () => {
    useRelatedBlogs.mockReturnValue({ blogs: [], loading: true, error: null })

    renderReadNext()

    expect(screen.getByRole('heading', { name: 'Read next' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(useRelatedBlogs).toHaveBeenCalledWith('current')
  })

  it('renders nothing when there are no related posts', () => {
    useRelatedBlogs.mockReturnValue({ blogs: [], loading: false, error: null })

    const { container } = renderReadNext()

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the request failed', () => {
    useRelatedBlogs.mockReturnValue({ blogs: [], loading: false, error: 'Network down' })

    const { container } = renderReadNext()

    expect(container).toBeEmptyDOMElement()
  })

  it('renders at most 6 cards linking to their posts', () => {
    useRelatedBlogs.mockReturnValue({ blogs: makeBlogs(7), loading: false, error: null })

    renderReadNext()

    const section = screen.getByRole('region', { name: 'Read next' })
    expect(section).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(6)
    expect(links[0]).toHaveAttribute('href', '/blog/id-0')
    expect(screen.queryByText('Post 6')).not.toBeInTheDocument()
  })

  describe('navigation buttons', () => {
    const originals = {}
    const define = (prop, value) => {
      originals[prop] = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop)
      Object.defineProperty(HTMLElement.prototype, prop, { configurable: true, get: () => value })
    }

    beforeEach(() => {
      // viewport 600px, track 1200px, card 300px + 16px gap -> maxScroll 600, step 316
      define('clientWidth', 600)
      define('scrollWidth', 1200)
      define('offsetWidth', 300)
    })

    afterEach(() => {
      Object.entries(originals).forEach(([prop, descriptor]) => {
        if (descriptor) Object.defineProperty(HTMLElement.prototype, prop, descriptor)
        else delete HTMLElement.prototype[prop]
      })
    })

    it('disables previous at the start and next at the end', async () => {
      const user = userEvent.setup()
      useRelatedBlogs.mockReturnValue({ blogs: makeBlogs(4), loading: false, error: null })

      renderReadNext()

      const prev = screen.getByRole('button', { name: 'Previous posts' })
      const next = screen.getByRole('button', { name: 'Next posts' })
      expect(prev).toBeDisabled()
      expect(next).toBeEnabled()

      await user.click(next)
      expect(prev).toBeEnabled()
      expect(next).toBeEnabled()

      await user.click(next)
      expect(next).toBeDisabled()

      await user.click(prev)
      await user.click(prev)
      expect(prev).toBeDisabled()
      expect(next).toBeEnabled()
    })

    it('disables both buttons when all cards fit', () => {
      define('scrollWidth', 600)
      useRelatedBlogs.mockReturnValue({ blogs: makeBlogs(2), loading: false, error: null })

      renderReadNext()

      expect(screen.getByRole('button', { name: 'Previous posts' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Next posts' })).toBeDisabled()
    })
  })
})
