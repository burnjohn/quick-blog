import { vi } from 'vitest'

// Mock useBlogGenerator hook
export const createMockBlogGenerator = (overrides = {}) => ({
  generateContent: vi.fn(() => Promise.resolve({ 
    success: true, 
    content: '<p>Generated content</p>' 
  })),
  clearContent: vi.fn(),
  generatedContent: null,
  isGenerating: false,
  inProgress: false,
  error: null,
  ...overrides,
})

// Mock useCreateBlog hook
export const createMockCreateBlog = (overrides = {}) => ({
  createBlog: vi.fn(() => Promise.resolve({ success: true })),
  isCreating: false,
  inProgress: false,
  error: null,
  ...overrides,
})

// Mock useAppContext hook
export const createMockAppContext = (overrides = {}) => ({
  axios: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
  },
  navigate: vi.fn(),
  token: null,
  setToken: vi.fn(),
  blogs: [],
  setBlogs: vi.fn(),
  input: '',
  setInput: vi.fn(),
  fetchBlogs: vi.fn(),
  ...overrides,
})

// Helper to setup all hook mocks at once
export const setupAllMocks = (config = {}) => {
  const {
    blogGenerator = {},
    createBlog = {},
    appContext = {},
  } = config

  return {
    mockBlogGenerator: createMockBlogGenerator(blogGenerator),
    mockCreateBlog: createMockCreateBlog(createBlog),
    mockAppContext: createMockAppContext(appContext),
  }
}
