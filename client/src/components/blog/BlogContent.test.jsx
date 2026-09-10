import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlogContent from './BlogContent'

describe('BlogContent', () => {
  it('renders HTML content via dangerouslySetInnerHTML', () => {
    render(<BlogContent content='<p>Hello World</p>' />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders image when image prop is provided', () => {
    render(
      <BlogContent image='/path/to/image.jpg' content='<p>Content</p>' />
    )
    // img with alt="" is exposed as role="presentation" (decorative)
    const img = screen.getByRole('presentation')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/path/to/image.jpg')
  })

  it('does not render image when image prop is falsy', () => {
    render(<BlogContent content='<p>Content</p>' />)
    // No img element, so no presentation role from decorative image
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
  })

  it('renders rich HTML with headings and paragraphs correctly', () => {
    const html = '<h2>My Title</h2><p>First paragraph.</p><p>Second paragraph.</p>'
    render(<BlogContent content={html} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('My Title')
    expect(screen.getByText('First paragraph.')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
  })
})
