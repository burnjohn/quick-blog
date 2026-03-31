import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { AppProvider } from '../../context/AppContext'
import Home from './Home'

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
  it('renders page structure with blog cards after loading', async () => {
    renderHome()

    // Navbar should be present (logo images in navbar and footer)
    const logos = screen.getAllByAltText('logo')
    expect(logos.length).toBeGreaterThanOrEqual(1)

    // Wait for blog data to load and render
    expect(await screen.findByText('Test Blog Post')).toBeInTheDocument()
  })
})
