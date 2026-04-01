import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { AppProvider, useAppContext } from '.'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

const mockBlogs = [
  { _id: '1', title: 'Test Blog', category: 'Technology', description: '<p>Content</p>', image: '/img.jpg' },
]

const server = setupServer(
  http.get('http://localhost:5001/api/blog/all', () =>
    HttpResponse.json({ success: true, blogs: mockBlogs })
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function TestConsumer() {
  const { blogs } = useAppContext()
  return (
    <div>
      {blogs.map((b) => (
        <span key={b._id}>{b.title}</span>
      ))}
    </div>
  )
}

describe('AppContext', () => {
  it('provides blogs after fetch', async () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      </MemoryRouter>
    )

    expect(await screen.findByText('Test Blog')).toBeInTheDocument()
  })

  it('throws when used outside provider', () => {
    // Suppress console.error for the expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestConsumer />)
    }).toThrow('useAppContext must be used within an AppProvider')

    spy.mockRestore()
  })
})
