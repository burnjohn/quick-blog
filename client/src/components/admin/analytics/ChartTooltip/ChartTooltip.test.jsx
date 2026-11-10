import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ChartTooltip from '.'

const payload = [{ name: 'Views', value: 12345, color: '#8b8cff', dataKey: 'views' }]

describe('ChartTooltip', () => {
  it('formats the value (en-US) and the date', () => {
    render(<ChartTooltip active payload={payload} label='2026-10-12' isDate />)
    expect(screen.getByText('Oct 12, 2026')).toBeInTheDocument()
    expect(screen.getByText('12,345')).toBeInTheDocument()
  })

  it('prefixes week buckets', () => {
    render(<ChartTooltip active payload={payload} label='2026-10-12' isDate bucket='week' />)
    expect(screen.getByText('Week of Oct 12, 2026')).toBeInTheDocument()
  })

  it('renders nothing when inactive', () => {
    const { container } = render(<ChartTooltip active={false} payload={payload} />)
    expect(container).toBeEmptyDOMElement()
  })
})
