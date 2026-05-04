import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CommentForm from './CommentForm'

describe('CommentForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders name and comment fields', () => {
    render(<CommentForm onSubmit={mockOnSubmit} />)
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Comment')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<CommentForm onSubmit={mockOnSubmit} />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue({ success: true })

    render(<CommentForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByPlaceholderText('Name'), 'John')
    await user.type(screen.getByPlaceholderText('Comment'), 'Great post!')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'John', content: 'Great post!' })
    })
  })

  it('resets fields after successful submit', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue({ success: true })

    render(<CommentForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByPlaceholderText('Name'), 'John')
    await user.type(screen.getByPlaceholderText('Comment'), 'Great post!')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toHaveValue('')
      expect(screen.getByPlaceholderText('Comment')).toHaveValue('')
    })
  })

  it('does not reset on failed submit', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue({ success: false })

    render(<CommentForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByPlaceholderText('Name'), 'John')
    await user.type(screen.getByPlaceholderText('Comment'), 'Great post!')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toHaveValue('John')
    })
  })
})
