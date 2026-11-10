import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import KpiCard from '.'

let reduced = true
vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => reduced,
}))

const spark = [{ date: '2026-10-01', value: 1 }, { date: '2026-10-02', value: 3 }]
const kpi = (delta) => ({ key: 'views', value: 12345, previous: 11000, delta, sparkline: spark })

describe('KpiCard', () => {
  beforeEach(() => { reduced = true })

  it('renders the final value immediately with reduced motion', () => {
    render(<KpiCard kpi={kpi({ direction: 'up', percent: 12.2 })} label='Views' format='number' compare />)
    expect(screen.getByTestId('kpi-value')).toHaveTextContent('12,345')
    expect(screen.getByText('+12.2% vs previous period')).toBeInTheDocument()
    expect(screen.getByTestId('sparkline')).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows down and new deltas', () => {
    const { rerender } = render(<KpiCard kpi={kpi({ direction: 'down', percent: -3.4 })} label='Views' compare />)
    expect(screen.getByText('-3.4% vs previous period')).toBeInTheDocument()
    rerender(<KpiCard kpi={kpi({ direction: 'new', percent: null })} label='Views' compare />)
    expect(screen.getByText('New vs previous period')).toBeInTheDocument()
  })

  it('hides the delta when compare is off', () => {
    render(<KpiCard kpi={kpi({ direction: 'up', percent: 12.2 })} label='Views' compare={false} />)
    expect(screen.queryByText(/vs previous period/)).not.toBeInTheDocument()
  })

  it('formats by type', () => {
    render(<KpiCard kpi={{ ...kpi(null), value: 210 }} label='Read' format='duration' />)
    expect(screen.getByTestId('kpi-value')).toHaveTextContent('3m 30s')
  })

  it('counts up to the value without reduced motion', async () => {
    reduced = false
    render(<KpiCard kpi={kpi(null)} label='Views' />)
    expect(screen.getByTestId('kpi-value')).not.toHaveTextContent('12,345')
    await waitFor(() => expect(screen.getByTestId('kpi-value')).toHaveTextContent('12,345'), { timeout: 3000 })
  })
})
