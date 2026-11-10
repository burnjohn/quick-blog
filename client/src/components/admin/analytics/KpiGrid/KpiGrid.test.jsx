import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import KpiGrid from '.'
import { KPI_META } from '../../../../constants/analytics'

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => true,
}))

const kpis = KPI_META.map((meta, i) => ({
  key: meta.key,
  value: (i + 1) * 100,
  previous: 50,
  delta: { direction: 'up', percent: 10 },
  sparkline: [{ date: '2026-10-01', value: 1 }, { date: '2026-10-02', value: 2 }],
}))

describe('KpiGrid', () => {
  it('renders one card per KPI in contract order', () => {
    render(<KpiGrid kpis={kpis} compare />)
    const cards = screen.getAllByRole('article')
    expect(cards.map((c) => c.getAttribute('aria-label'))).toEqual(KPI_META.map((m) => m.label))
    expect(screen.getAllByText('+10% vs previous period')).toHaveLength(6)
  })

  it('hides deltas when compare is off', () => {
    render(<KpiGrid kpis={kpis} compare={false} />)
    expect(screen.queryByText(/vs previous period/)).not.toBeInTheDocument()
  })
})
