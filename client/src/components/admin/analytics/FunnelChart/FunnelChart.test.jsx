import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FunnelChart from '.'

const funnel = [
  { key: 'views', label: 'Views', value: 1000 },
  { key: 'engagedReads', label: 'Engaged reads', value: 500 },
  { key: 'interactions', label: 'Interactions', value: 50 }
]

describe('FunnelChart', () => {
  it('shows stage values, conversion and a table', () => {
    render(<FunnelChart funnel={funnel} />)
    expect(screen.getByRole('table', { name: 'Engagement funnel' })).toBeInTheDocument()
    expect(screen.getByText('↓ 50%')).toBeInTheDocument()
    expect(screen.getByText('↓ 10%')).toBeInTheDocument()
    expect(screen.getAllByText('1,000').length).toBeGreaterThan(0)
  })
})
