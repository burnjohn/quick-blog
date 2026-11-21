import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { AppProvider } from '../../../context/AppContext'
import Home from '.'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

const mockBlog = {
  _id: '1',
  title: 'Test Blog Post',
  category: 'Technology',
  description: '<p>Test content</p>',
  image: '/test-image.jpg',
  createdAt: '2026-03-01T00:00:00Z',
  isPublished: true,
}

const server = setupServer(
  http.get('http://localhost:5001/api/blog/all', () =>
    HttpResponse.json({ success: true, blogs: [mockBlog] })
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderHome = () =>
  render(
    <MemoryRouter>
      <AppProvider>
        <Home />
      </AppProvider>
    </MemoryRouter>
  )

describe('Home', () => {
  it('leads with the cover story and renders the latest grid', async () => {
    renderHome()

    // Navbar should be present (logo images in navbar and footer)
    const logos = screen.getAllByAltText('logo')
    expect(logos.length).toBeGreaterThanOrEqual(1)

    // Tagline survives only as the small masthead kicker
    expect(screen.getByRole('heading', { level: 1, name: /the quickblog journal/i })).toBeInTheDocument()

    // Cover story headline + photo (alt = title)
    expect(await screen.findByRole('heading', { level: 2, name: 'Test Blog Post' }, { timeout: 2000 })).toBeInTheDocument()
    expect(screen.getAllByAltText('Test Blog Post').length).toBeGreaterThanOrEqual(2)

    // A single post is also in "Latest" (fewer than a row would remain without it)
    expect(screen.getByRole('link', { name: 'Test Blog Post' })).toBeInTheDocument()
  })
})
