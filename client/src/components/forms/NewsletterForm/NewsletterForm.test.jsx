import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import NewsletterForm from '.'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

describe('NewsletterForm', () => {
  beforeEach(() => {
    toast.success.mockClear()
    toast.error.mockClear()
  })

  it('shows the error toast for an invalid email', async () => {
    const user = userEvent.setup()
    render(<NewsletterForm />)

    await user.type(screen.getByLabelText('Email address'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address')
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('shows the success toast and clears the field for a valid email', async () => {
    const user = userEvent.setup()
    render(<NewsletterForm />)

    const input = screen.getByLabelText('Email address')
    await user.type(input, 'reader@example.com')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Successfully subscribed to newsletter!'), { timeout: 2000 })
    expect(input).toHaveValue('')
    expect(toast.error).not.toHaveBeenCalled()
  })
})
