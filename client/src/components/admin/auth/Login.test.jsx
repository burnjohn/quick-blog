import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import toast from 'react-hot-toast'
import Login from './Login'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

const mockSetToken = vi.fn()

vi.mock('../../../context/AppContext', () => ({
  useAppContext: () => ({
    setToken: mockSetToken,
  }),
}))

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
  localStorage.clear()
})
afterAll(() => server.close())

describe('Login', () => {
  it('successful login sets token and shows success toast', async () => {
    server.use(
      http.post('http://localhost:5001/api/admin/login', () =>
        HttpResponse.json({ success: true, token: 'jwt123' })
      )
    )

    const user = userEvent.setup()
    render(<Login />)

    await user.type(screen.getByPlaceholderText('your email id'), 'admin@quickblog.com')
    await user.type(screen.getByPlaceholderText('your password'), 'admin123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith('jwt123')
    })

    expect(localStorage.getItem('token')).toBe('jwt123')
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toast on invalid credentials', async () => {
    server.use(
      http.post('http://localhost:5001/api/admin/login', () =>
        HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
      )
    )

    const user = userEvent.setup()
    render(<Login />)

    await user.type(screen.getByPlaceholderText('your email id'), 'wrong@email.com')
    await user.type(screen.getByPlaceholderText('your password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })

    expect(mockSetToken).not.toHaveBeenCalled()
  })

  it('disables submit button while loading', async () => {
    server.use(
      http.post('http://localhost:5001/api/admin/login', async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return HttpResponse.json({ success: true, token: 'jwt123' })
      })
    )

    const user = userEvent.setup()
    render(<Login />)

    await user.type(screen.getByPlaceholderText('your email id'), 'admin@quickblog.com')
    await user.type(screen.getByPlaceholderText('your password'), 'admin123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled()
    })
  })
})
