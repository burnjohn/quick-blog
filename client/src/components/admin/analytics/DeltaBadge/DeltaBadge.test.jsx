import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DeltaBadge from '.'

describe('DeltaBadge', () => {
  it.each([
    [{ direction: 'up', percent: 12.2 }, '+12.2% vs previous period'],
    [{ direction: 'down', percent: -5 }, '-5% vs previous period'],
    [{ direction: 'new', percent: null }, 'New vs previous period'],
    [{ direction: 'flat', percent: 0 }, 'No change'],
  ])('renders %o', (delta, text) => {
    render(<DeltaBadge delta={delta} />)
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders nothing without a delta', () => {
    const { container } = render(<DeltaBadge />)
    expect(container).toBeEmptyDOMElement()
  })
})
