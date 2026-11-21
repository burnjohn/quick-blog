import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CategoryTicker from '.'
import { BLOG_CATEGORIES } from '../../../constants/categories'

describe('CategoryTicker', () => {
  it('announces every category except "All" once for screen readers', () => {
    render(<CategoryTicker />)

    const topics = BLOG_CATEGORIES.filter((c) => c !== 'All').join(', ')
    expect(screen.getByText(`Topics: ${topics}`)).toBeInTheDocument()
  })

  it('renders the moving track as decorative text, never as buttons', () => {
    const { container } = render(<CategoryTicker />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(container.querySelector('.marquee-track')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.marquee-track').textContent).not.toContain('All')
  })
})
