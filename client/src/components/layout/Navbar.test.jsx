import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

const mockNavigate = vi.fn()

vi.mock('../../assets/assets', () => ({
  assets: {
    logo: 'logo.svg',
    arrow: 'arrow.svg',
  },
}))

vi.mock('../../context/AppContext', () => ({
  useAppContext: vi.fn(),
}))

import { useAppContext } from '../../context/AppContext'

describe('Navbar', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    useAppContext.mockReturnValue({ navigate: mockNavigate, token: null })
  })

  it('renders logo image', () => {
    render(<Navbar />)

    expect(screen.getByAltText('logo')).toBeInTheDocument()
  })

  it('shows "Login" button when token is null', () => {
    render(<Navbar />)

    expect(screen.getByRole('button', { name: /Login/ })).toBeInTheDocument()
  })

  it('shows "Dashboard" button when token is set', () => {
    useAppContext.mockReturnValue({ navigate: mockNavigate, token: 'abc123' })
    render(<Navbar />)

    expect(screen.getByRole('button', { name: /Dashboard/ })).toBeInTheDocument()
  })

  it('calls navigate with "/" when logo is clicked', async () => {
    render(<Navbar />)
    const logo = screen.getByAltText('logo')

    await user.click(logo)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('calls navigate with "/admin" when Login button is clicked', async () => {
    render(<Navbar />)
    const loginButton = screen.getByRole('button', { name: /Login/ })

    await user.click(loginButton)

    expect(mockNavigate).toHaveBeenCalledWith('/admin')
  })
})
