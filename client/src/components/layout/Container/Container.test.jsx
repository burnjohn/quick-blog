import { render, screen } from '@testing-library/react'
import Container from './Container'

describe('Container', () => {
  it('renders its children', () => {
    render(<Container>hello</Container>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('applies the default width', () => {
    render(<Container>body</Container>)
    expect(screen.getByText('body')).toHaveClass('max-w-5xl')
  })

  it('applies the large width', () => {
    render(<Container size="lg">wide</Container>)
    expect(screen.getByText('wide')).toHaveClass('max-w-7xl')
  })
})
