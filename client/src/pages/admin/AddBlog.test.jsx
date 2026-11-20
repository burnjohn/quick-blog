import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Quill from 'quill'
import AddBlog from './AddBlog'

const mockGenerateContent = vi.fn()
const mockCreateBlog = vi.fn()

vi.mock('quill', () => {
  function MockQuill() {
    this.root = { innerHTML: '' }
  }
  return { default: vi.fn(MockQuill) }
})

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() }
}))

vi.mock('../../assets/assets', () => ({
  assets: { upload_area: 'upload_area.svg' }
}))

vi.mock('../../utils/helpers', () => ({
  classNames: (...classes) => classes.filter(Boolean).join(' ')
}))

vi.mock('../../hooks', () => ({
  useBlogGenerator: vi.fn(() => ({
    generateContent: mockGenerateContent,
    isGenerating: false
  })),
  useCreateBlog: vi.fn(() => ({
    createBlog: mockCreateBlog,
    isCreating: false
  }))
}))

describe('AddBlog', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  })

  it('renders all form fields', () => {
    render(<AddBlog />)

    expect(screen.getByText(/upload thumbnail/i)).toBeInTheDocument()
    expect(screen.getByText(/blog title/i)).toBeInTheDocument()
    expect(screen.getByText(/sub title/i)).toBeInTheDocument()
    expect(screen.getByText(/blog description/i)).toBeInTheDocument()
    expect(screen.getByText(/blog category/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /publish now/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add blog/i })).toBeInTheDocument()
  })

  it('renders category dropdown with options (Technology, Startup, Lifestyle, Finance - not All)', () => {
    render(<AddBlog />)

    const select = screen.getByRole('combobox')
    const options = screen.getAllByRole('option')

    expect(options.map(o => o.value)).toEqual(['Technology', 'Startup', 'Lifestyle', 'Finance'])
    expect(options.map(o => o.textContent)).toEqual(['Technology', 'Startup', 'Lifestyle', 'Finance'])
    expect(select).toHaveValue('Startup')
  })

  it('allows typing in title field', async () => {
    render(<AddBlog />)

    const textboxes = screen.getAllByRole('textbox')
    const titleInput = textboxes[0]
    await user.type(titleInput, 'My Blog Title')

    expect(titleInput).toHaveValue('My Blog Title')
  })

  it('allows typing in subtitle field', async () => {
    render(<AddBlog />)

    const textboxes = screen.getAllByRole('textbox')
    const subtitleInput = textboxes[1]
    await user.type(subtitleInput, 'My Subtitle')

    expect(subtitleInput).toHaveValue('My Subtitle')
  })

  it('allows selecting a category', async () => {
    render(<AddBlog />)

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'Technology')

    expect(select).toHaveValue('Technology')
  })

  it('allows toggling publish checkbox', async () => {
    render(<AddBlog />)

    const checkbox = screen.getByRole('checkbox', { name: /publish now/i })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('shows "Generate with AI" button', () => {
    render(<AddBlog />)

    expect(screen.getByRole('button', { name: /generate with ai/i })).toBeInTheDocument()
  })

  it('"Generate with AI" button is disabled when title is empty', () => {
    render(<AddBlog />)

    const generateBtn = screen.getByRole('button', { name: /generate with ai/i })
    expect(generateBtn).toBeDisabled()
  })

  it('shows validation error when submitting without title', async () => {
    const toast = (await import('react-hot-toast')).default

    render(<AddBlog />)

    await user.click(screen.getByRole('button', { name: /add blog/i }))

    expect(toast.error).toHaveBeenCalledWith('Please enter a blog title')
  })

  it('calls createBlog when form is valid and submitted', async () => {
    mockCreateBlog.mockResolvedValue({ success: true })

    render(<AddBlog />)

    const quillInstance = Quill.mock.results[0].value
    quillInstance.root.innerHTML = '<p>Some blog content</p>'

    const textboxes = screen.getAllByRole('textbox')
    await user.type(textboxes[0], 'Test Title')
    await user.type(textboxes[1], 'Test Subtitle')

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]')
    await user.upload(fileInput, file)

    await user.click(screen.getByRole('button', { name: /add blog/i }))

    expect(mockCreateBlog).toHaveBeenCalledWith(
      {
        title: 'Test Title',
        subTitle: 'Test Subtitle',
        description: '<p>Some blog content</p>',
        category: 'Startup',
        isPublished: false
      },
      expect.any(File)
    )
  })
})
