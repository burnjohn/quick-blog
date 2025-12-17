import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock react-hot-toast globally
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    custom: vi.fn(),
  },
  Toaster: () => null,
}))

// Mock Quill editor
vi.mock('quill', () => {
  class MockQuill {
    constructor(element) {
      // Create a mock root object with innerHTML
      this.root = {
        innerHTML: '<p>Mock blog content</p>',
      }
      
      // If element is provided, set its innerHTML as well
      if (element) {
        element.innerHTML = '<p>Mock blog content</p>'
        this.root = element
      }
      
      this.on = vi.fn()
      this.off = vi.fn()
      this.getText = vi.fn(() => 'Mock blog content')
      this.getContents = vi.fn()
      this.setContents = vi.fn()
      this.enable = vi.fn()
      this.disable = vi.fn()
    }
  }
  
  return {
    default: MockQuill,
  }
})

// Mock URL.createObjectURL for file preview
global.URL.createObjectURL = vi.fn(() => 'mock-object-url')
global.URL.revokeObjectURL = vi.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
