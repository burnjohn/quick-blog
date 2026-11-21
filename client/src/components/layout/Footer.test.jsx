import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

vi.mock('../../assets/assets', () => ({
  assets: { logo: 'logo.svg' },
  footer_data: [
    { title: 'Quick Links', links: ['Home', 'Best Sellers', 'Contact Us'] },
    { title: 'Need Help?', links: ['Delivery Information', 'Payment Methods'] },
    { title: 'Follow Us', links: ['Instagram', 'Twitter'] },
  ],
}))

describe('Footer', () => {
  it('renders the about blurb', () => {
    render(<Footer />)
    expect(screen.getByText(/independent journal of essays/i)).toBeInTheDocument()
  })

  it('renders all section titles as headings', () => {
    render(<Footer />)
    expect(screen.getByRole('heading', { name: /quick links/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /need help\?/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /follow us/i })).toBeInTheDocument()
  })

  it('renders footer links as link elements', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /best sellers/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /delivery information/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
  })

  it('renders copyright text', () => {
    render(<Footer />)
    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()} QuickBlog\\. All rights reserved\\.`, 'i'))
    ).toBeInTheDocument()
  })
})
