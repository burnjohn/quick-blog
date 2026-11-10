import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TrendChart from '.'

vi.mock('recharts', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => React.cloneElement(children, { width: 800, height: 300 })
  }
})

const series = [
  { date: '2026-10-12', views: 400, uniqueVisitors: 300, previousViews: 380, previousUniqueVisitors: 290 },
  { date: '2026-10-13', views: 1234, uniqueVisitors: 500, previousViews: 100, previousUniqueVisitors: 90 }
]

describe('TrendChart', () => {
  it('hides previous period without compare', () => {
    render(<TrendChart series={series} bucket='day' />)
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Previous views' })).not.toBeInTheDocument()
  })

  it('shows previous period with compare', () => {
    render(<TrendChart series={series} bucket='day' compare />)
    expect(screen.getByRole('button', { name: 'Views (previous)' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Previous views' })).toBeInTheDocument()
  })

  it('has an sr-only data table with formatted values and toggles series', async () => {
    render(<TrendChart series={series} />)
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByRole('cell', { name: '1,234' })).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: 'Views' })
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })
})
