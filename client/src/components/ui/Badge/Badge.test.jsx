import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('uses the primary variant by default', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('bg-signal')
  })

  it('applies the danger variant', () => {
    render(<Badge variant="danger">Oops</Badge>)
    expect(screen.getByText('Oops')).toHaveClass('text-danger')
  })
})
