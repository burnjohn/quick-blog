import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from './Login'

const mockSetToken = vi.fn()
vi.mock('../../../../context/AppContext', () => ({
  useAppContext: () => ({ setToken: mockSetToken })
}))

const mockLogin = vi.fn()
vi.mock('../../../../api', () => ({
  adminApi: { login: (...args) => mockLogin(...args) }
}))

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('../../../../constants/messages', () => ({
  MESSAGES: {
    SUCCESS_LOGIN: 'Login successful',
    ERROR_LOGIN: 'Login failed'
  }
}))

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email and password inputs', () => {
    render(<Login />)
    expect(screen.getByPlaceholderText('your email id')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your password')).toBeInTheDocument()
  })

  it('renders login button', () => {
    render(<Login />)
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('submits form with email and password', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValue({ data: { success: true, token: 'abc123' } })

    render(<Login />)

    await user.type(screen.getByPlaceholderText('your email id'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('your password'), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith('abc123')
    })
  })

  it('shows error toast on failed login', async () => {
    const user = userEvent.setup()
    const toast = (await import('react-hot-toast')).default
    mockLogin.mockRejectedValue({ response: { data: { message: 'Bad creds' } } })

    render(<Login />)

    await user.type(screen.getByPlaceholderText('your email id'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('your password'), 'wrong')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Bad creds')
    })
  })
})
