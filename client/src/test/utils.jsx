import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import { vi } from 'vitest'

// Custom render function that wraps components with necessary providers
export function renderWithProviders(ui, options = {}) {
  const {
    route = '/',
    mockAxios = createMockAxios(),
    ...renderOptions
  } = options

  // Set initial route
  window.history.pushState({}, 'Test page', route)

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AppProvider>
          {children}
        </AppProvider>
      </BrowserRouter>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    mockAxios,
  }
}

// Create a mock axios instance for testing
export function createMockAxios() {
  return {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
  }
}

// Mock file helper for file upload tests
export function createMockFile(name = 'test.png', size = 1024, type = 'image/png') {
  const file = new File(['test'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

// Wait for async updates (useful for testing loading states)
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

// Mock blog data factory
export function createMockBlog(overrides = {}) {
  return {
    _id: '123',
    title: 'Test Blog',
    subTitle: 'Test Subtitle',
    description: '<p>Test description</p>',
    category: 'Startup',
    isPublished: false,
    date: Date.now(),
    authorImg: '/author.png',
    image: '/blog.png',
    ...overrides,
  }
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
