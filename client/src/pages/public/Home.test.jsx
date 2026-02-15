import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

// Mock child components — we only verify Home composes them correctly
vi.mock('../../components/layout', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
  Footer: () => <footer data-testid="footer">Footer</footer>
}))

vi.mock('../../components/forms', () => ({
  Header: () => <header data-testid="header">Header</header>,
  NewsletterForm: () => <div data-testid="newsletter">Newsletter</div>
}))

vi.mock('../../components/blog', () => ({
  BlogList: () => <div data-testid="blog-list">BlogList</div>
}))

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

describe('Home', () => {
  it('renders all page sections', () => {
    renderHome()

    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('blog-list')).toBeInTheDocument()
    expect(screen.getByTestId('newsletter')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders sections in correct order', () => {
    const { container } = renderHome()
    const sections = container.querySelectorAll('[data-testid]')
    const order = Array.from(sections).map((el) => el.dataset.testid)

    expect(order).toEqual(['navbar', 'header', 'blog-list', 'newsletter', 'footer'])
  })
})
