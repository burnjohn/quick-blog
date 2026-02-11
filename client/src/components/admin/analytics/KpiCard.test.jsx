import { render } from '@testing-library/react'
import KpiCard from './KpiCard'

describe('KpiCard', () => {
  it('renders', () => {
    const { container } = render(
      <KpiCard label="Total Views" value={1234} trend={{ direction: 'up', percentChange: 12 }} />
    )
    expect(container).toBeTruthy()
  })

  it.skip('shows up arrow when trend is positive', () => {})

  it.skip('hides trend for all-time period', () => {})
})
