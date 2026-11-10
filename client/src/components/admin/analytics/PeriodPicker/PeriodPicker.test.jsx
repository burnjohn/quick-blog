import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PeriodPicker from '.'

const bounds = { min: '2025-11-11', max: '2026-11-10' }
const setup = (props = {}) => {
  const handlers = { onPeriodChange: vi.fn(), onCustomRange: vi.fn() }
  render(<PeriodPicker period='30d' from={null} to={null} dateBounds={bounds} {...handlers} {...props} />)
  return handlers
}

describe('PeriodPicker', () => {
  it('marks the active preset and calls the handler', async () => {
    const { onPeriodChange } = setup()
    expect(screen.getByRole('button', { name: '30D' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: '7D' }))
    expect(onPeriodChange).toHaveBeenCalledWith('7d')
  })

  it('blocks Apply with a message when from is after to', async () => {
    const user = userEvent.setup()
    const { onCustomRange } = setup()
    await user.click(screen.getByRole('button', { name: 'Custom' }))
    const from = screen.getByLabelText('From date')
    expect(from).toHaveAttribute('min', bounds.min)
    expect(from).toHaveAttribute('max', bounds.max)
    await user.type(from, '2026-05-10')
    await user.type(screen.getByLabelText('To date'), '2026-05-01')
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(screen.getByRole('alert')).toHaveTextContent(/on or before/i)
    expect(onCustomRange).not.toHaveBeenCalled()
  })

  it('applies a valid custom range', async () => {
    const user = userEvent.setup()
    const { onCustomRange } = setup()
    await user.click(screen.getByRole('button', { name: 'Custom' }))
    await user.type(screen.getByLabelText('From date'), '2026-05-01')
    await user.type(screen.getByLabelText('To date'), '2026-05-10')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onCustomRange).toHaveBeenCalledWith('2026-05-01', '2026-05-10')
  })
})
