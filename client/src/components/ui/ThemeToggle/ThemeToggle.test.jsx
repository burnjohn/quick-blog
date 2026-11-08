import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '.'

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders an accessible toggle button', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button', { name: /toggle color theme/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches the dark class on <html> when clicked', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const button = screen.getByRole('button', { name: /toggle color theme/i })

    await user.click(button)
    expect(document.documentElement).toHaveClass('dark')
    expect(button).toHaveAttribute('aria-pressed', 'true')

    await user.click(button)
    expect(document.documentElement).not.toHaveClass('dark')
  })
})
