import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommentForm from './CommentForm'

vi.mock('../../utils/helpers', () => ({
  classNames: (...classes) => classes.filter(Boolean).join(' '),
}))

describe('CommentForm', () => {
  const user = userEvent.setup()

  let onSubmit

  beforeEach(() => {
    onSubmit = vi.fn()
  })

  it('renders form heading "Add your comment"', () => {
    render(<CommentForm onSubmit={onSubmit} />)

    expect(screen.getByText('Add your comment')).toBeInTheDocument()
  })

  it('renders name input, comment textarea, and submit button', () => {
    render(<CommentForm onSubmit={onSubmit} />)

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Comment')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('allows user to type in name and comment fields', async () => {
    render(<CommentForm onSubmit={onSubmit} />)

    const nameInput = screen.getByPlaceholderText('Name')
    const commentInput = screen.getByPlaceholderText('Comment')

    await user.type(nameInput, 'Jane Doe')
    await user.type(commentInput, 'Great post!')

    expect(nameInput).toHaveValue('Jane Doe')
    expect(commentInput).toHaveValue('Great post!')
  })

  it('calls onSubmit with name and content when form is submitted', async () => {
    onSubmit.mockResolvedValue({ success: true })
    render(<CommentForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText('Name'), 'Bob')
    await user.type(screen.getByPlaceholderText('Comment'), 'Nice read.')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Bob', content: 'Nice read.' })
    })
  })

  it('clears form fields after successful submission', async () => {
    onSubmit.mockResolvedValue({ success: true })
    render(<CommentForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText('Name'), 'Alice')
    await user.type(screen.getByPlaceholderText('Comment'), 'Thanks for sharing.')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toHaveValue('')
      expect(screen.getByPlaceholderText('Comment')).toHaveValue('')
    })
  })

  it('does NOT clear form fields when submission fails', async () => {
    onSubmit.mockResolvedValue({ success: false })
    render(<CommentForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText('Name'), 'Charlie')
    await user.type(screen.getByPlaceholderText('Comment'), 'My comment')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })

    expect(screen.getByPlaceholderText('Name')).toHaveValue('Charlie')
    expect(screen.getByPlaceholderText('Comment')).toHaveValue('My comment')
  })
})
