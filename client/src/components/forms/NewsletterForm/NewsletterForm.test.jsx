import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import NewsletterForm from './NewsletterForm'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email input and subscribe button', () => {
    render(<NewsletterForm />)
    expect(screen.getByPlaceholderText('Enter your email id')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('shows error toast for invalid email', async () => {
    const user = userEvent.setup()
    const toast = (await import('react-hot-toast')).default

    render(<NewsletterForm />)

    await user.type(screen.getByPlaceholderText('Enter your email id'), 'notanemail')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address')
    })
  })

  it('submits valid email and shows success toast', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const toast = (await import('react-hot-toast')).default

    render(<NewsletterForm />)

    await user.type(screen.getByPlaceholderText('Enter your email id'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Successfully subscribed to newsletter!')
    })

    vi.useRealTimers()
  })

  it('resets email field after success', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    render(<NewsletterForm />)

    await user.type(screen.getByPlaceholderText('Enter your email id'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your email id')).toHaveValue('')
    })

    vi.useRealTimers()
  })
})
