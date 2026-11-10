import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ChartCard from '.'

describe('ChartCard', () => {
  it('renders a figure named by its caption and described by a summary', () => {
    render(
      <ChartCard title='Views trend' description='Views rose 12% over 30 days.' alternative={<table aria-label='data' />}>
        <svg data-testid='chart' />
      </ChartCard>
    )
    const figure = screen.getByRole('figure', { name: 'Views trend' })
    expect(figure).toHaveAccessibleDescription('Views rose 12% over 30 days.')
    expect(figure.querySelector('figcaption')).toHaveTextContent('Views trend')
    expect(screen.getByTestId('chart')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'data' })).toBeInTheDocument()
  })

  it('omits aria-describedby without a description', () => {
    render(<ChartCard title='Plain'>x</ChartCard>)
    expect(screen.getByRole('figure')).not.toHaveAttribute('aria-describedby')
  })
})
