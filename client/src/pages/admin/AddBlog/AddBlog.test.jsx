import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AddBlog from './AddBlog'

const mockCreateBlog = vi.fn()
const mockGenerateContent = vi.fn()

vi.mock('../../../hooks', () => ({
  useBlogGenerator: () => ({
    generateContent: mockGenerateContent,
    isGenerating: false
  }),
  useCreateBlog: () => ({
    createBlog: mockCreateBlog,
    isCreating: false
  })
}))

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('../../../assets/assets', () => ({
  assets: { upload_area: 'placeholder.png' }
}))

vi.mock('../../../constants/categories', () => ({
  BLOG_CATEGORIES: ['All', 'Technology', 'Startup', 'Lifestyle']
}))

// Mock Quill
vi.mock('quill', () => {
  return {
    default: class MockQuill {
      constructor(el) {
        this.root = el
        el.innerHTML = ''
      }
    }
  }
})

describe('AddBlog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<AddBlog />)
    expect(screen.getAllByPlaceholderText('Type here')).toHaveLength(2)
    expect(screen.getByText('Upload Thumbnail')).toBeInTheDocument()
    expect(screen.getByText('Blog Category')).toBeInTheDocument()
    expect(screen.getByText('Publish Now')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add blog/i })).toBeInTheDocument()
  })

  it('renders category select with options', () => {
    render(<AddBlog />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Startup')).toBeInTheDocument()
    expect(screen.getByText('Lifestyle')).toBeInTheDocument()
  })

  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup()
    const toast = (await import('react-hot-toast')).default

    render(<AddBlog />)
    await user.click(screen.getByRole('button', { name: /add blog/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('renders generate with AI button', () => {
    render(<AddBlog />)
    expect(screen.getByRole('button', { name: /generate with ai/i })).toBeInTheDocument()
  })
})
