import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DonutChart from '.'

vi.mock('recharts', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => React.cloneElement(children, { width: 800, height: 300 })
  }
})

const data = [{ key: 'search', views: 600, share: 0.6 }, { key: 'direct', views: 400, share: 0.4 }]
const labels = { search: 'Search', direct: 'Direct' }

describe('DonutChart', () => {
  it('shows total, legend shares and a table', () => {
    render(<DonutChart title='Devices' description='d' data={data} labels={labels} />)
    expect(screen.getByText('1,000')).toBeInTheDocument()
    const legend = screen.getByTestId('donut-legend')
    expect(within(legend).getByText('60%')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Devices' })).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onSelect from the keyboard buttons', async () => {
    const onSelect = vi.fn()
    render(<DonutChart title='Sources' description='d' data={data} labels={labels} onSelect={onSelect} selected={['search']} />)
    expect(screen.getByRole('button', { name: /Search/ })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: /Direct/ }))
    expect(onSelect).toHaveBeenCalledWith('direct')
  })
})
