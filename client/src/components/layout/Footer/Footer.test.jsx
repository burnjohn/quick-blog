import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the about blurb', () => {
    render(<Footer />)
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders the footer navigation', () => {
    render(<Footer />)
    expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument()
  })

  it('shows the current year in the copyright line', () => {
    render(<Footer />)
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} QuickBlog`))).toBeInTheDocument()
  })
})
