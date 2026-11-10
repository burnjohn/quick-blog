import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActivityHeatmap from '.'

const cells = Array.from({ length: 7 }, (_, d) => Array.from({ length: 24 }, (_, h) => (d === 1 && h === 14 ? 1234 : d + h)))
const heatmap = { max: 1234, cells }

describe('ActivityHeatmap', () => {
  it('renders 7x24 named cells and a UTC label', () => {
    render(<ActivityHeatmap heatmap={heatmap} />)
    expect(screen.getAllByRole('gridcell')).toHaveLength(168)
    expect(screen.getByRole('gridcell', { name: 'Tuesday 14:00 UTC — 1,234 views' })).toBeInTheDocument()
    expect(screen.getByText('Times in UTC')).toBeInTheDocument()
  })

  it('uses roving tabindex and arrow keys, showing the tooltip on focus', async () => {
    render(<ActivityHeatmap heatmap={heatmap} />)
    const cellsEls = screen.getAllByRole('gridcell')
    expect(cellsEls.filter((c) => c.tabIndex === 0)).toHaveLength(1)
    act(() => cellsEls[0].focus())
    expect(screen.getByRole('status')).toHaveTextContent('Monday 00:00 UTC')
    await userEvent.keyboard('{ArrowRight}{ArrowDown}')
    const target = screen.getByRole('gridcell', { name: /^Tuesday 01:00 UTC/ })
    expect(target).toHaveFocus()
    expect(target.tabIndex).toBe(0)
    expect(screen.getByRole('status')).toHaveTextContent('Tuesday 01:00 UTC')
  })

  it('shows the tooltip on hover and an intensity legend', async () => {
    render(<ActivityHeatmap heatmap={heatmap} />)
    await userEvent.hover(screen.getByRole('gridcell', { name: /^Tuesday 14:00/ }))
    expect(screen.getByRole('status')).toHaveTextContent('1,234 views')
    const legend = screen.getByTestId('heatmap-legend')
    expect(within(legend).getAllByRole('listitem')).toHaveLength(6)
  })
})
